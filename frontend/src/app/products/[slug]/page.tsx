import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Metadata } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import ProductActions from "./ProductActions";
import { createSlug } from "../../utils/slug";
import ProductCarousel from "../../components/ProductCarousel";
import ProductDetail from "../../components/ProductDetail";

// Fallback UI cho section chi tiết sản phẩm
const LoadingFallback = () => (
  <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg text-black">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/3">
        <div className="w-full h-[200px] bg-gray-200 rounded-xl animate-pulse" />
      </div>
      <div className="md:w-2/3">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
      </div>
    </div>
  </div>
);

// Fallback UI cho section sản phẩm liên quan
const RelatedProductsLoadingFallback = () => (
  <div className="mt-8 mx-4 md:mx-12 lg:mx-32">
    <h3 className="text-2xl font-semibold mb-4 text-black">Sản phẩm liên quan</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center items-center">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white p-5 rounded-2xl shadow-md w-45 md:w-60">
          <div className="w-full h-[200px] bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mt-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Fallback UI cho section bình luận
const ReviewsLoadingFallback = () => (
  <div className="mt-8 mx-4 md:mx-12 lg:mx-32">
    <h3 className="text-2xl font-semibold mb-4 text-black">Bình luận sản phẩm</h3>
    <div className="space-y-4">
      {[...Array(2)].map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Interface cho Review từ API
interface ReviewDTO {
  id: number;
  customerId: number;
  productId: number;
  rating: number;
  comment: string;
  isVerified: boolean;
  customerName: string;
  productName: string;
  createdAt: string;
}

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

// Base URL cho API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

// Hàm sửa URL hình ảnh
const fixImageUrl = (url: string) => {
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};


// Hàm tìm sản phẩm theo slug
async function findProductBySlug(slug: string): Promise<ProductDTO | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/view-all`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const products: ProductDTO[] = await res.json();
    if (!products || products.length === 0) {
      console.error("No products found in API response");
      return null;
    }
    const matchingProducts = products.filter((p) => createSlug(p.name) === slug);
    if (matchingProducts.length === 0) {
      console.error("Product not found for slug:", slug);
      return null;
    }
    return matchingProducts[0];
  } catch (error) {
    console.error("Lỗi khi tìm sản phẩm bằng slug:", error);
    return null;
  }
}

// Hàm lấy sản phẩm liên quan
async function fetchRelatedProducts(productId: number): Promise<ProductDTO[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${productId}/related`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      throw new Error("Failed to fetch related products");
    }
    const relatedProducts: ProductDTO[] = await res.json();
    // console.log("Related products from API:", relatedProducts);
    return relatedProducts.slice(0, 4) || [];
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
    return [];
  }
}

// Hàm lấy bình luận sản phẩm
async function fetchProductReviews(productId: number): Promise<ReviewDTO[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`, {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      throw new Error("Failed to fetch product reviews");
    }
    const reviews: ReviewDTO[] = await res.json();
    // console.log("Product reviews from API:", reviews);
    return reviews || [];
  } catch (error) {
    console.error("Lỗi khi lấy bình luận sản phẩm:", error);
    return [];
  }
}

// Hàm tạo metadata động cho SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await findProductBySlug(slug);
  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm | Hoa Tươi UIT",
      description: "Sản phẩm yêu cầu không tồn tại.",
    };
  }

  const getMetaDescription = (description: string) => {
    const plainText = description.replace(/<[^>]+>/g, "");
    return plainText.length > 160 ? plainText.substring(0, 160) + "..." : plainText;
  };

  const imageUrl = fixImageUrl(product.imageUrl) || "https://hoatuoiuit.id.vn/default-image.jpg";
  console.log("Product Image URL:", imageUrl); // Debug URL hình ảnh

  const keywords = [
    "hoa tươi",
    product.name.toLowerCase(), // Thêm tên sản phẩm vào từ khóa
    product.categoryName.toLowerCase(),
    ...product.occasionNames.map((o) => o.toLowerCase()),
    ...product.flowerNames.map((f) => f.toLowerCase()),
    "Hoa Tươi UIT",
    "Hoa Tươi Làng Đại Học",
    "Hoa Tươi Giao Nhanh Tận Nơi",
    "Mua Hoa Tươi UIT",
    `mua ${product.name.toLowerCase()}`, // Thêm biến thể "mua + tên sản phẩm"
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: getMetaDescription(product.description),
    offers: {
      "@type": "Offer",
      price: product.finalPrice,
      priceCurrency: "VND",
      availability: product.isActive ? "InStock" : "OutOfStock",
    },
    image: imageUrl,
    category: product.categoryName,
    keywords: keywords.join(", "), // Sử dụng danh sách từ khóa đã bao gồm tên sản phẩm
  };

  return {
    title: `${product.name} - Hoa Tươi Đẹp | Hoa Tươi UIT`, // Tối ưu tiêu đề với từ khóa bổ sung
    description: getMetaDescription(product.description),
    keywords: keywords, // Danh sách từ khóa đã bao gồm tên sản phẩm
    openGraph: {
      title: `Mua ${product.name} - Hoa Tươi UIT`, // Đã tối ưu, giữ nguyên
      description: `Khám phá ${product.name} tại Hoa Tươi UIT - ${getMetaDescription(product.description)}`, // Đã tối ưu, giữ nguyên
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Hoa Tươi ${product.name} - Hoa Tươi UIT`, // Đã tối ưu, giữ nguyên
        },
      ],
      type: "website", // Sửa thành "product" để phù hợp với schema.org
      url: `https://hoatuoiuit.id.vn/products/${slug}`,
      siteName: "Hoa Tươi UIT",
    },
    twitter: {
      card: "summary_large_image",
      site: "@HoaTuoiUIT",
      creator: "@HoaTuoiUIT",
      title: `Mua ${product.name} - Hoa Tươi UIT`, // Đã tối ưu, giữ nguyên
      description: `Khám phá ${product.name} tại Hoa Tươi UIT - ${getMetaDescription(product.description)}`,
      images: [imageUrl],
    },
    other: {
      "structured-data": JSON.stringify(structuredData),
    },
  };
}


// Server Component
export default async function ProductDetails({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Lấy danh sách sản phẩm liên quan
  const relatedProducts = await fetchRelatedProducts(product.id);

  // Lấy danh sách bình luận sản phẩm
  const reviews = await fetchProductReviews(product.id);

  // Ánh xạ ProductDTO sang Product cho ProductCarousel
  const formattedProducts = relatedProducts.map((item) => ({
    id: item.id,
    title: item.name,
    category: item.occasionNames.join(", ") || item.categoryName,
    price: item.finalPrice,
    rating: item.averageRating || 4.9,
    img: fixImageUrl(item.imageUrl),
    oldPrice: item.discountValue > 0 ? item.price : undefined,
    discount:
      item.discountValue > 0
        ? `-${((item.discountValue / item.price) * 100).toFixed(0)}%`
        : undefined,
  }));


  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.replace(/<[^>]+>/g, "").substring(0, 160) + "...",
    offers: {
      "@type": "Offer",
      price: product.finalPrice,
      priceCurrency: "VND",
      availability: product.isActive ? "InStock" : "OutOfStock",
    },
    image: fixImageUrl(product.imageUrl),
    category: product.categoryName,
  };

  // Giả lập rating và số lượng đánh giá
  const rating = product.averageRating > 0 ? product.averageRating : 4.9;
  const reviewsCount = reviews.length > 0 ? reviews.length : 245;

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg text-black mt-6">
        {/* Product Display */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section - Hình ảnh chiếm 1/3 */}
          <div className="w-full max-w-[280px] mx-auto md:w-1/3 flex justify-center">
            <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-[280px] md:w-[240px] relative overflow-hidden">
              {product.discountValue > 0 && (
                <span className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 text-xs rounded-full">
                  -{((product.discountValue / product.price) * 100).toFixed(0)}% off
                </span>
              )}
              <Image
                src={fixImageUrl(product.imageUrl)}
                alt={product.name}
                className="rounded-xl"
                width={300}
                height={200}
              />
            </div>
          </div>

          {/* Right Section - Chi tiết chiếm 2/3 */}
          <div className="md:w-2/3">
            <h3 className="text-gray-500">{product.occasionNames.join(", ")}</h3>
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <div className="flex items-center mt-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < rating ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {rating} ({reviewsCount} Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-lg font-bold mt-2">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.finalPrice)}{" "}
              {product.discountValue > 0 && (
                <span className="text-gray-500 line-through ml-2">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                </span>
              )}
            </div>

            <div className="mt-4">{product.description.replace(/<[^>]+>/g, "")}</div>

            {/* Tùy chọn kích thước, số lượng, nút hành động */}
            <ProductActions productId={product.id} isFavorited={product.isFavorited} />
          </div>
        </div>
      </div>

      {/* Section sản phẩm liên quan */}

      {formattedProducts.length > 0 ? (
        <ProductCarousel products={formattedProducts} />
      ) : (
        <p className="text-gray-500 text-center">Không có sản phẩm liên quan.</p>
      )}



      {/* Section bình luận sản phẩm */}
      <Suspense fallback={<ReviewsLoadingFallback />}>
        <div className="mx-4 md:mx-12 lg:mx-32 mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-black">Bình luận sản phẩm</h3>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-800">{review.customerName}</span>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                          key={i}
                          icon={faStar}
                          className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                        />
                      ))}
                      <span className="text-black ml-2">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">Chưa có bình luận nào cho sản phẩm này.</p>
          )}
        </div>
      </Suspense>

    </>
  );
}