"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faShoppingCart, faCreditCard, faHeart, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  productId: number;
  isFavorited: boolean;
}

export default function ProductActions({ productId, isFavorited }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const user_id = typeof window !== "undefined" ? localStorage.getItem("id") : null;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Base URL cho API
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

  // Thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!user_id || !token) {
      toast.info("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      router.push("/login");
      return;
    }
    try {
      setIsLoading(true);
      const resCart = await fetch(`${API_BASE_URL}/api/carts/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resCart.ok) throw new Error("Không thể lấy thông tin giỏ hàng");
      const cartData = await resCart.json();
      const currentCartId = cartData.id;

      const res = await fetch(`${API_BASE_URL}/api/carts/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: currentCartId,
          productId,
          quantity,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        if (errorData.includes("Item already exists")) {
          toast.info("Sản phẩm đã có trong giỏ hàng, số lượng được cập nhật!");
        } else {
          throw new Error(`Thêm vào giỏ hàng thất bại: ${errorData}`);
        }
      } else {
        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  // Mua ngay
  const handleBuyNow = async () => {
    if (!user_id || !token) {
      toast.info("Vui lòng đăng nhập để mua hàng!");
      router.push("/login");
      return;
    }
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined");
      toast.error("Lỗi cấu hình hệ thống!");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orders/create-direct?customerId=${user_id}&productId=${productId}&quantity=${quantity}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Tạo đơn hàng thất bại: ${errorData}`);
      }
      const orderData = await res.json();
      const orderId = orderData.id || orderData.orderId; // Xử lý response linh hoạt

      if (!orderId) {
        throw new Error("Không nhận được orderId từ API");
      }

      console.log("Order created:", { orderId });
      toast.success("Đã tạo đơn hàng, chuyển đến nhập địa chỉ...");
      router.push(`/checkout/address?orderId=${orderId}`);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm vào wishlist
  const handleAddToWishlist = async () => {
    if (!user_id || !token) {
      toast.info("Vui lòng đăng nhập để sử dụng wishlist!");
      router.push("/login");
      return;
    }
    if (!API_BASE_URL) {
      console.error("API_BASE_URL is not defined");
      toast.error("Lỗi cấu hình hệ thống!");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/wishlists/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: user_id,
          productId,
        }),
      });
      if (!res.ok) {
        const data = await res.text();
        if (data.includes("Item already exists in wishlist")) {
          toast.error("Sản phẩm đã có trong wishlist!");
        } else {
          throw new Error(`Thêm vào wishlist thất bại: ${data}`);
        }
      } else {
        toast.success("Đã thêm vào wishlist!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào wishlist:", error);
      toast.error("Có lỗi xảy ra khi thêm vào wishlist!");
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    toast.success("Đã đăng xuất thành công!");
    router.push("/login");
  };

  return (
    <>
      {/* Quantity Selector */}
      <div className="flex flex-row mt-4 justify-between lg:justify-normal lg:gap-10">
        <div className="flex items-center">
          <button
            className="p-2 border rounded-lg"
            onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <span className="mx-4">{quantity}</span>
          <button
            className="p-2 border rounded-lg"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          className={`flex-4 bg-purple-600 text-white p-3 rounded-lg flex sm:flex-row flex-col items-center justify-center gap-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          Thêm vào giỏ hàng
        </button>
        <button
          className={`flex-4 bg-pink-500 text-white p-3 rounded-lg flex sm:flex-row flex-col items-center justify-center gap-2 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faCreditCard} />
          {isLoading ? "Đang xử lý..." : "Mua Ngay"}
        </button>
        <div className="flex-1 items-center">
          <button
            className="p-2 border rounded-lg"
            onClick={handleAddToWishlist}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faHeart} className={isFavorited ? "text-red-500" : ""} />
          </button>
        </div>
        {/* {user_id && (
          <button
            className="flex-1 bg-red-500 text-white p-3 rounded-lg flex items-center justify-center gap-2"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Đăng xuất
          </button>
        )} */}
      </div>
    </>
  );
}