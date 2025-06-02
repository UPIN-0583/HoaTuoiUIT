"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import ProductCard from "./ProductCard"; // Giả sử ProductCard nằm trong cùng thư mục hoặc điều chỉnh đường dẫn
import Link from "next/link";

// Interface ánh xạ dữ liệu từ ProductsPage
interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  discountValue: number;
  finalPrice: number;
  averageRating: number;
  imageUrl: string;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  flowerNames: string[];
  occasionNames: string[];
  isFavorited: boolean;
}

interface ProductListWrapperProps {
  products: ProductDTO[];
  sortOption: string;
  currentPage: number;
  totalProducts: number;
  pageSize: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

// Hàm tạo slug
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Hàm prefetch chi tiết sản phẩm
const prefetchProduct = async (id: number) => {
  try {
    await fetch(`${API_BASE_URL}/api/products/${id}/detail`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
  } catch (error) {
    console.error("Lỗi khi prefetch dữ liệu sản phẩm:", error);
  }
};

export default function ProductListWrapper({
  products,
  sortOption,
  currentPage,
  totalProducts,
  pageSize,
}: ProductListWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  // Xử lý thay đổi sortOption
  const onSortChange = useCallback(
    (value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("sort", value);
      newSearchParams.set("page", "1"); // Reset về trang 1 khi thay đổi sort
      router.push(`/products?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  // Hàm sửa URL hình ảnh
  const fixImageUrl = (url: string) => {
    return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  };

  // // Xử lý khi nhấp vào "Xem chi tiết"
  // const handleProductClick = (slug: string) => {
  //   router.push(`/products/${slug}`);
  // };

  return (
    <div>
      {/* Hiển thị số lượng sản phẩm */}
      <div className="flex justify-between mb-4 text-black">
        <p>
          Đang hiển thị {startIndex + 1}-{Math.min(startIndex + pageSize, totalProducts)} của {totalProducts} sản phẩm
        </p>
        <select
          className="border p-2 md:p-2 max-[480px]:p-1 rounded text-base md:text-base max-[480px]:text-xs"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Sắp xếp mặc định</option>
          <option value="price-low-high">Giá: Thấp đến Cao</option>
          <option value="price-high-low">Giá: Cao đến Thấp</option>
          <option value="rating-high-low">Đánh giá: Cao đến Thấp</option>
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center">
        {products.length > 0 ? (
          products.map((product) => {
            const slug = createSlug(product.name);
            return (
              <Link
                key={product.id}
                href={`/products/${slug}`}
                className="group rounded-3xl shadow-md transition-all duration-300 hover:shadow-lg hover:bg-gray-50"
                onMouseEnter={() => prefetchProduct(product.id)} // Giữ prefetch nếu cần
              >
                <div>
                  <ProductCard
                    id={product.id}
                    title={product.name}
                    price={product.finalPrice}
                    category={product.occasionNames.join(", ") || product.categoryName}
                    oldPrice={product.discountValue > 0 ? product.price : undefined}
                    discount={
                      product.discountValue > 0 && product.price > 0
                        ? `-${((product.discountValue / product.price) * 100).toFixed(0)}%`
                        : undefined
                    }
                    rating={product.averageRating > 0 ? product.averageRating : 4.9}
                    img={fixImageUrl(product.imageUrl)}
                  />
                </div>
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500 text-center col-span-3">Không có sản phẩm nào.</p>
        )}
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Link
            href={`/products?page=${currentPage - 1}&sort=${sortOption}`}
            className={`px-4 py-2 bg-gray-200 rounded ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""}`}
          >
            Trước
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/products?page=${page}&sort=${sortOption}`}
              className={`px-4 py-2 rounded ${currentPage === page ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              {page}
            </Link>
          ))}
          <Link
            href={`/products?page=${currentPage + 1}&sort=${sortOption}`}
            className={`px-4 py-2 bg-gray-200 rounded ${
              currentPage === totalPages ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Sau
          </Link>
        </div>
      )}
    </div>
  );
}
