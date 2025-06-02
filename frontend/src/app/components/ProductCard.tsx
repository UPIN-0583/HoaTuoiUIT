"use client";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faHeart, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createSlug } from "../utils/slug"; // đảm bảo đường dẫn đúng

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  category: string;
  oldPrice?: number;
  discount?: string;
  rating: number;
  img: string;
}

export default function ProductCard({ id, title, price, category, oldPrice, discount, rating, img }: ProductCardProps) {
  const router = useRouter();
  const user_id = typeof window !== 'undefined' ? localStorage.getItem("id") : null;
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  const slug = createSlug(title);

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!user_id) {
      toast.info("Vui lòng đăng nhập để sử dụng wishlist!");
      router.push("/login");
      return;
    }
    try {
      const res = await fetch(`https://backendhoatuoiuit.onrender.com/api/wishlists/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: user_id, productId: id }),
      });
      if (!res.ok) {
        const data = await res.text();
        if (data.includes("already exists")) {
          toast.error("Sản phẩm đã có trong wishlist!");
          //router.push("/wishlist");
        }
        return;
      }
      toast.success("Đã thêm vào wishlist!");
      //router.push("/wishlist");
    } catch {
      toast.error("Có lỗi xảy ra khi thêm vào wishlist!");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!user_id) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      router.push("/login");
      return;
    }
    try {
      const resCart = await fetch(`https://backendhoatuoiuit.onrender.com/api/carts/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartData = await resCart.json();
      const currentCartId = cartData.id;

      const res = await fetch(`https://backendhoatuoiuit.onrender.com/api/carts/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId: currentCartId, productId: id, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Thêm vào giỏ hàng thất bại");
      toast.success("Đã thêm vào giỏ hàng!");
      //router.push("/cart");
    } catch {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  return (
    <Link href={`/products/${slug}`} className="block">
      <div className="group bg-white p-4 md:p-5 rounded-2xl shadow-md w-[180px] md:w-[240px] min-h-[280px] md:min-h-[320px] relative overflow-hidden hover:bg-gray-100 transition-colors duration-300">
        <div className="relative">
          {discount && (
            <span className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 text-xs rounded-full z-10">
              {discount} off
            </span>
          )}
          <div className="relative w-[200px] h-[200px]">
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 200px"
              className="object-contain rounded-xl"
            />
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
              onClick={handleAddToWishlist}
            >
              <FontAwesomeIcon icon={faHeart} className="text-black w-4 h-4" />
            </button>
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 cursor-pointer"
              onClick={handleAddToCart}
            >
              <FontAwesomeIcon icon={faCartShopping} className="text-black w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 text-left">
          <div className="flex justify-between">
            <p className="text-gray-500 text-sm mt-1">{category}</p>
            <div className="flex items-center gap-1 text-yellow-500">
              <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
              <span className="text-black">{rating}</span>
            </div>
          </div>
          <h4 className="font-semibold text-black text-sm md:text-lg truncate">{title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-black">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
            </span>
            {oldPrice && (
              <span className="text-gray-400 line-through">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(oldPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
