import { Metadata } from "next";
import SidebarFilter from "../components/SidebarFilter";
import ProductListWrapper from "../components/ProductListWrapper";

// Interface ánh xạ ProductDTO từ API
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

// Base URL cho API và hình ảnh
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

// SEO metadata
export const metadata: Metadata = {
  title: "Sản phẩm hoa tươi | Hoa Tươi UIT - Làng Đại Học",
  description:
    "Khám phá các sản phẩm hoa tươi đa dạng, chất lượng cao tại Hoa Tươi UIT. Đặt hoa online giao nhanh tận nơi tại Làng Đại Học và khu vực lân cận.",
  keywords: [
    "hoa tươi",
    "shop hoa",
    "đặt hoa online",
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
    canonical: "https://hoatuoiuit.id.vn/products",
  },
  openGraph: {
    title: "Sản phẩm hoa tươi | Hoa Tươi UIT - Làng Đại Học",
    description:
      "Khám phá các sản phẩm hoa tươi đa dạng, chất lượng cao tại Hoa Tươi UIT. Mua hoa tươi UIT giao nhanh tận nơi tại Làng Đại Học.",
    url: "https://hoatuoiuit.id.vn/products",
    type: "website",
    images: [
      {
        url: "https://hoatuoiuit.id.vn/hero-image.jpg", // Thay bằng URL hình ảnh thực tế
        width: 1200,
        height: 630,
        alt: "Hoa Tươi UIT - Sản phẩm hoa tươi chất lượng",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@HoaTuoiUIT",
    creator: "@HoaTuoiUIT",
    title: "Sản phẩm hoa tươi - Hoa Tươi UIT Làng Đại Học",
    description:
      "Khám phá hoa tươi chất lượng tại Hoa Tươi UIT! Đặt hoa online, giao nhanh tận nơi Làng Đại Học.", // 104 ký tự, dưới 200
    images: [
      "https://hoatuoiuit.id.vn/hero-image.jpg", // Thay bằng URL hình ảnh thực tế
    ],
  },
};

// Hàm fetch danh sách sản phẩm
async function getProducts(): Promise<ProductDTO[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/view-all`, { cache: "no-store" });
    if (!res.ok) return [];
    const data: ProductDTO[] = await res.json();
    return data.map((item) => ({
      ...item,
      flowerNames: item.flowerNames || [],
      occasionNames: item.occasionNames || [],
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  // Lấy filter/sort từ query string
  function parseMulti(raw?: string | string[]): string[] {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map(s => decodeURIComponent(s.trim()))
        .filter(s => s !== "");
    }
    return raw
      .split(",")
      .map(s => decodeURIComponent(s.trim()))
      .filter(s => s !== "");
  }


  const selectedFlowers = parseMulti(resolvedSearchParams?.flowerType);
  const selectedOccasions = parseMulti(resolvedSearchParams?.occasion);
  const priceMin = resolvedSearchParams?.priceMin ? Number(resolvedSearchParams.priceMin) : undefined;
  const priceMax = resolvedSearchParams?.priceMax ? Number(resolvedSearchParams.priceMax) : undefined;
  const sortOption = Array.isArray(resolvedSearchParams?.sort)
    ? resolvedSearchParams.sort[0] || "default"
    : resolvedSearchParams?.sort || "default";
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const products = await getProducts();

  // Lọc sản phẩm phía server
  const filteredProducts = products.filter((product: ProductDTO) => {
    const matchesFlower =
      selectedFlowers.length === 0 ||
      selectedFlowers.some((selected: string) => product.flowerNames.includes(selected));

    const matchesOccasion =
      selectedOccasions.length === 0 ||
      selectedOccasions.some((selected: string) => product.occasionNames.includes(selected));

    const priceMatch =
      (priceMin === undefined || product.finalPrice >= priceMin) &&
      (priceMax === undefined || product.finalPrice <= priceMax);

    return matchesFlower && matchesOccasion && priceMatch;
  });


  // Sắp xếp sản phẩm
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low-high") return a.finalPrice - b.finalPrice;
    if (sortOption === "price-high-low") return b.finalPrice - a.finalPrice;
    if (sortOption === "rating-high-low") return b.averageRating - a.averageRating;
    return 0;
  });

  const pageSize = 8;
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white">
      <div className="flex max-w-7xl mx-auto p-6 gap-6">
        <div className="flex-1 hidden md:block">
          <SidebarFilter
            selectedFlowers={selectedFlowers}
            selectedOccasions={selectedOccasions}
            priceRange={[priceMin ?? 0, priceMax ?? 10000000]}
          />
        </div>
        <div className="flex-4">
          <ProductListWrapper
            products={paginatedProducts}
            sortOption={sortOption}
            currentPage={currentPage}
            totalProducts={sortedProducts.length}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}