"use client";
import BlogCard from "./BlogCard";

export default function BlogSection() {
  const blogPosts = [
    {
      image: "/blog-image.jpg",
      category: "Wedding Bouquet",
      author: "Jenny Alexander",
      date: "13 Dec 2024",
      title: "Choosing the Perfect Wedding Bouquet for Your Big Day",
      excerpt:
        "Khám phá cách chọn hoa cưới hoàn hảo cho ngày trọng đại của bạn, từ màu sắc đến phong cách...",
      link: "#",
    },
    {
      image: "/blog-image.jpg",
      category: "Anniversary Flowers",
      author: "Jenny Alexander",
      date: "12 Dec 2024",
      title: "Celebrating Love: The Best Flowers for Every Anniversary",
      excerpt:
        "Gợi ý những loài hoa ý nghĩa cho từng dịp kỷ niệm, giúp bạn thể hiện tình yêu trọn vẹn...",
      link: "#",
    },
    {
      image: "/blog-image.jpg",
      category: "Bouquet Tips",
      author: "Jenny Alexander",
      date: "11 Dec 2024",
      title: "Top Tips for Designing Your Floral Bouquets for Maximum Impact",
      excerpt:
        "Những mẹo quan trọng để thiết kế bó hoa đẹp mắt, thu hút mọi ánh nhìn trong mọi dịp lễ...",
      link: "#",
    },
  ];

  return (
    <section className="py-12 bg-white">
      {/* Tiêu đề chính */}
      <div className="flex items-center justify-between text-center mx-4 md:mx-12 lg:mx-32">
        <div className="text-left">
          <h3 className="text-gray-500 uppercase font-semibold">
            News & Blogs
          </h3>
          <h2 className="text-4xl font-bold text-black">
            Our Latest <span className="text-purple-600">News & Blogs</span>
          </h2>
        </div>
        <button className="px-6 py-2 bg-purple-600 text-white rounded-full cursor-pointer">
          View All Blogs
        </button>
      </div>

      {/* Danh sách bài viết */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 mx-4 md:mx-12 lg:mx-32">
        {/* Danh sách bài viết (chỉ hiển thị 3 blog) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-5">
          {blogPosts.slice(0, 3).map((post, index) => (
            <BlogCard
              key={index}
              imageSrc={post.image}
              tag={post.category}
              author={post.author}
              date={post.date}
              title={post.title}
              excerpt={post.excerpt}
              href={post.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

