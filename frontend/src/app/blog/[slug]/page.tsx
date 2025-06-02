import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Interface ánh xạ BlogPostDTO từ API
interface BlogPostDTO {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
}

// Base URL cho API và hình ảnh
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

// Hàm tạo slug từ tiêu đề
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Hàm tìm ID bài viết từ slug
async function findBlogIdBySlug(slug: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const blogs: BlogPostDTO[] = await res.json(); // Định nghĩa kiểu cho blogs
    const blog = blogs.find((b) => createSlug(b.title) === slug); // Loại bỏ : any
    return blog ? blog.id : null;
  } catch (error) {
    console.error("Lỗi khi tìm bài viết bằng slug:", error);
    return null;
  }
}

// Hàm tạo metadata động cho SEO
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const id = await findBlogIdBySlug(slug);

  if (!id) {
    return {
      title: "Không tìm thấy bài viết | Hoa Tươi UIT",
      description: "Bài viết yêu cầu không tồn tại.",
    };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Blog not found");
    const blog: BlogPostDTO = await res.json();

    const getMetaDescription = (content: string) => {
      const plainText = content.replace(/<[^>]+>/g, "");
      const baseDesc = plainText.length > 120 ? plainText.substring(0, 120) + "..." : plainText;
      return `Khám phá ${blog.title} tại Hoa Tươi UIT - ${baseDesc}`.substring(0, 160); // Tích hợp từ khóa và giới hạn 160 ký tự
    };

    const imageUrl = blog.thumbnailUrl ? `${API_BASE_URL}${blog.thumbnailUrl}` : "https://hoatuoiuit.id.vn/default-image.jpg";
    const keywords = [
      "hoa tươi",
      "mua hoa tươi uit",
      "blog hoa đẹp",
      "hoa tươi giao nhanh làng đại học",
      blog.title.toLowerCase(), // Tên blog
      `bài viết về ${blog.title.toLowerCase()}`, // Biến thể từ khóa dài
      "hoa tươi uit blog",
      "mẹo chọn hoa tươi",
      "ý nghĩa hoa tươi",
    ];

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title.substring(0, 110), // Giới hạn headline theo schema.org
      description: getMetaDescription(blog.content),
      author: { "@type": "Person", name: blog.author },
      publisher: {
        "@type": "Organization",
        name: "Hoa Tươi UIT",
        logo: {
          "@type": "ImageObject",
          url: "https://hoatuoiuit.id.vn/logo.jpg", // Thêm logo của trang
        },
      },
      datePublished: blog.createdAt,
      image: imageUrl,
      keywords: keywords.join(", "),
    };

    return {
      title: `${blog.title.substring(0, 50)} - Blog Hoa Tươi | Hoa Tươi UIT`, // Giới hạn tiêu đề 60-70 ký tự
      description: getMetaDescription(blog.content),
      keywords: keywords,
      authors: [{ name: blog.author }],
      openGraph: {
        title: `${blog.title.substring(0, 60)} - Hoa Tươi UIT`, // Giới hạn để tối ưu hiển thị
        description: `Khám phá ${blog.title} tại Hoa Tươi UIT. Đọc ngay để biết thêm!`, // Ngắn gọn, có CTA
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Hoa Tươi Đẹp - ${blog.title}`,
          },
        ],
        type: "article",
        url: `https://hoatuoiuit.id.vn/blog/${slug}`,
        siteName: "Hoa Tươi UIT",
      },
      twitter: {
        card: "summary_large_image",
        site: "@HoaTuoiUIT",
        creator: blog.author ? `@${blog.author.replace(/\s+/g, '')}` : "@HoaTuoiUIT",
        title: `${blog.title.substring(0, 60)} - Hoa Tươi UIT`,
        description: `Đọc ${blog.title} tại Hoa Tươi UIT! Mua hoa đẹp, giá tốt.`, // Ngắn gọn, có CTA
        images: [imageUrl],
      },
      other: {
        "structured-data": JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error("Lỗi khi tạo metadata:", error);
    return {
      title: "Không tìm thấy bài viết | Hoa Tươi UIT",
      description: "Bài viết yêu cầu không tồn tại.",
    };
  }
}


export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const id = await findBlogIdBySlug(slug);

  if (!id) {
    notFound();
  }

  let blog: BlogPostDTO;
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Blog not found");
    blog = await res.json();
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bài viết:", error);
    notFound();
  }

  if (!blog) {
    notFound();
  }

  const sanitizedContent = blog.content
    .replaceAll("http://localhost:8080",`${API_BASE_URL}`);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.content.replace(/<[^>]+>/g, "").substring(0, 160) + "...",
    author: { "@type": "Person", name: blog.author },
    datePublished: blog.createdAt,
    image: `${API_BASE_URL}${blog.thumbnailUrl}`,
  };

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {blog.title}
        </h1>
        <div className="flex items-center text-gray-600 mb-6">
          <span>Tác giả: {blog.author}</span>
          <span className="mx-2">•</span>
          <span>
            Ngày đăng: {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        {blog.thumbnailUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={`${API_BASE_URL}${blog.thumbnailUrl}`}
              alt={blog.title}
              width={600}
              height={300}
              className="w-full object-cover"
            />
          </div>
        )}
        <article className="prose max-w-none prose-img:rounded prose-img:shadow prose-img:mx-auto prose-h1:text-3xl prose-h2:text-2xl prose-p:leading-relaxed prose-a:text-blue-600">
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </article>
      </div>
    </>
  );
}