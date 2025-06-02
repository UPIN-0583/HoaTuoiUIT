import Image from "next/image";
import Link from "next/link"; // Thêm Link để thay <a>
import Search from "../components/SearchBlog";
import Pagination from "../components/Pagination";
import { Metadata } from "next";
import TagLabel from "../components/TagLabel";

// Đánh dấu route là dynamic
export const dynamic = "force-dynamic";

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
  tags: string;
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
// SEO metadata
export const metadata: Metadata = {
  title: "Blog hoa tươi | Hoa Tươi UIT - Làng Đại Học",
  description:
    "Khám phá bài viết, mẹo chăm sóc hoa và ý tưởng tặng hoa tại Hoa Tươi UIT. Đọc ngay để chọn hoa đẹp tại Làng Đại Học!",
  keywords: [
    "blog hoa tươi",
    "mẹo chăm sóc hoa",
    "ý tưởng tặng hoa",
    "hoa sinh nhật",
    "hoa chúc mừng",
    "hoa khai trương",
    "hoa chia buồn",
    "hoa tốt nghiệp",
    "hoa cảm ơn",
    "Hoa Tươi UIT",
    "Hoa Tươi Làng Đại Học",
    "Hoa Tươi Giao Nhanh Tận Nơi",
    "Mua Hoa Tươi UIT",
  ],
  alternates: {
    canonical: "https://hoatuoiuit.id.vn/blog",
  },
  openGraph: {
    title: "Blog hoa tươi | Hoa Tươi UIT - Làng Đại Học",
    description:
      "Khám phá bài viết, mẹo chăm sóc hoa và ý tưởng tặng hoa tại Hoa Tươi UIT. Đọc ngay để chọn hoa đẹp!",
    url: "https://hoatuoiuit.id.vn/blog",
    type: "website",
    images: [
      {
        url: "https://hoatuoiuit.id.vn/hero-image.jpg", // Thay bằng URL hình ảnh thực tế
        width: 1200,
        height: 630,
        alt: "Hoa Tươi UIT - Blog về hoa tươi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@HoaTuoiUIT",
    creator: "@HoaTuoiUIT",
    title: "Blog hoa tươi - Hoa Tươi UIT Làng Đại Học",
    description:
      "Đọc bài viết về hoa tươi, mẹo chăm sóc tại Hoa Tươi UIT! Giao nhanh Làng Đại Học. #HoaTuoiUIT", // 93 ký tự, dưới 200
    images: [
      "https://hoatuoiuit.id.vn/hero-image.jpg", // Thay bằng URL hình ảnh thực tế
    ],
  },
};

// Hàm fetch danh sách blog từ API
async function getBlogs(page: number = 1, limit: number = 3): Promise<{ blogs: BlogPostDTO[]; totalPages: number }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/blog?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) throw new Error("Failed to fetch blogs");

    const blogs = await response.json();
    // Giả định API trả về danh sách blog trực tiếp
    const totalBlogs = blogs.length;
    const totalPages = Math.ceil(totalBlogs / limit) || 1;

    return {
      blogs: blogs.filter((blog: BlogPostDTO) => blog.isActive),
      totalPages,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết:", error);
    return { blogs: [], totalPages: 1 };
  }
}

// Server Component
export default async function Blog({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1") || 1;
  const { blogs, totalPages } = await getBlogs(page);

  // Hàm sửa URL hình ảnh
  const fixImageUrl = (url: string) => {
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        {/* Section Title */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-2xl">Tin Tức & Blog</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Tin Tức & Blog <span className="text-purple-600">Mới Nhất</span>
          </h2>
        </div>

        {/* Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2 space-y-10">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog.id} className="rounded-3xl relative shadow-md">
                  <div className="relative">
                    <Image
                      src={fixImageUrl(blog.thumbnailUrl)}
                      alt={blog.title}
                      width={1000}
                      height={600}
                      className="object-cover w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-3xl"
                    />
                    <div className="absolute bottom-3 -left-4 z-10">
                        <TagLabel text={blog.tags} />
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-xl md:text-sm text-gray-500">
                      {blog.author} <span className="text-purple-400 text-xl">●</span>{" "}
                      {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-lg sm:text-xl font-semibold mt-2 mb-3">{blog.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {blog.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."}
                    </p>
                    <Link
                      href={`/blog/${createSlug(blog.title)}`}
                      className="text-purple-600 font-medium hover:underline text-sm"
                    >
                      Đọc Thêm
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Không có bài viết nào.</p>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Search />
            <div>
              <h4 className="text-xl font-semibold mb-2 border-l-3 border-l-purple-400 px-2">Danh Mục Phổ Biến</h4>
              <div className="space-y-2">
                {["Hoa Cưới", "Sinh Nhật", "Kỷ Niệm", "Cảm Ơn", "Tốt Nghiệp"].map((item) => (
                  <a
                    key={item}
                    href={`/blog?category=${item.toLowerCase()}`}
                    className="block w-9/10 border-gray-400 text-left text-gray-700 border rounded-md px-4 py-2 hover:bg-purple-500 hover:text-white text-sm cursor-pointer"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2 border-l-3 border-l-purple-400 px-2">Bài Viết Gần Đây</h4>
              <div className="space-y-4">
                {blogs.slice(0, 3).map((post) => (
                  <div key={post.id} className="flex items-center gap-3">
                    <Image
                      src={fixImageUrl(post.thumbnailUrl)}
                      alt={post.title}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium leading-snug">{post.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src="/hero-image.jpg"
                alt="Floral Deals"
                width={400}
                height={300}
                className="rounded-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-end items-center p-5 text-white bg-gradient-to-t from-black/60 to-transparent rounded-2xl">
                <p className="text-sm mb-1">Ưu Đãi Hoa</p>
                <h4 className="text-lg font-semibold leading-tight mb-3 text-center">
                  Giảm 20% Cho Các Bó Hoa Bán Chạy Nhất!
                </h4>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1.5 text-sm rounded-full w-fit cursor-pointer">
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>

      <div className="bg-[#f7f7f7] py-16 px-4 md:px-20">
        <div className="px-4 md:px-20">
          <p className="text-center text-2xl">Bản Tin Của Chúng Tôi</p>
          <p className="font-semibold text-4xl text-center">Đăng Ký Nhận Bản Tin Để</p>
          <p className="font-semibold text-4xl text-center">
            Cập Nhật <span className="font-semibold text-4xl text-center text-purple-500">Ưu Đãi Mới Nhất</span>
          </p>
        </div>
        <p className="text-center text-gray-500 py-5">
          Nhận ngay 20% giảm giá cho đơn hàng đầu tiên khi đăng ký nhận bản tin
        </p>
        <div className="flex justify-center gap-5">
          <input
            type="text"
            placeholder="Nhập địa chỉ email"
            className="bg-white pr-10 md:pr-30 pl-2 md:pl-5 py-3 md:py-4 rounded-full focus:ring-purple-500 focus:outline-purple-500"
          />
          <button className="px-4 md:px-9 py-1 md:py-2 bg-purple-700 text-white rounded-full cursor-pointer">
            Đăng Ký
          </button>
        </div>
      </div>
    </div>
  );
}