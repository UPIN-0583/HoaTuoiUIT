import ProductCard from "./ProductCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

const fixImageUrl = (url: string) => {
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};

interface ProductListProps {
  products: {
    id: number;
    title: string;
    category: string;
    price: number;
    oldPrice?: number;
    discount?: string;
    rating: number;
    img: string;
    flowerType: string;
    occasion: string;
  }[];
  sortOption: string;
  currentPage: number;
  totalProducts: number;
  pageSize: number;
  onSortChange: (value: string) => void;
}

export default function ProductList({ products, sortOption, currentPage, totalProducts, pageSize, onSortChange }: ProductListProps) {
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4 text-black">
        <p>
          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, totalProducts)} of {totalProducts} results
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
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded ${currentPage === page ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              disabled={currentPage === page}
            >
              {page}
            </button>
          ))}
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}