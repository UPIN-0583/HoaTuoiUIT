"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CartItem, { CartItemType } from "../components/CartItems";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type CartResponse = {
  id: number;
  customerId: number;
  items: CartItemType[];
};

export default function ShoppingCart() {
  const [user_id, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

  // Lấy user_id và token từ localStorage trên client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("id"));
      setToken(localStorage.getItem("token"));
    }
  }, []);

  // Lấy giỏ hàng từ API
  useEffect(() => {
    const fetchCart = async () => {
      if (!user_id || !token) {
        setError("Vui lòng đăng nhập để xem giỏ hàng!");
        toast.error("Vui lòng đăng nhập để xem giỏ hàng!");
        router.push("/login");
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/carts/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(`Lấy giỏ hàng thất bại: ${errorData}`);
        }

        const data: CartResponse = await res.json();
        setCartItems(data.items);
        setCartId(data.id);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setError("Không thể lấy thông tin giỏ hàng!");
        toast.error("Không thể lấy thông tin giỏ hàng!");
      } finally {
        setIsLoading(false);
      }
    };

    if (user_id && token) {
      fetchCart();
    }
  }, [user_id, token, router, API_BASE_URL]);

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (itemId: number, amount: number) => {
    const prevItems = [...cartItems];
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCartItems(updatedItems);
    setIsUpdating(true);

    try {
      const item = updatedItems.find((item) => item.id === itemId);
      if (!item) throw new Error("Sản phẩm không tồn tại trong giỏ hàng!");

      const res = await fetch(
        `${API_BASE_URL}/api/carts/items/${itemId}/quantity?quantity=${item.quantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": " personallyapplication/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Cập nhật số lượng thất bại: ${errorData}`);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Cập nhật số lượng thất bại!");
      setCartItems(prevItems);
    } finally {
      setIsUpdating(false);
    }
  };

  // Xóa sản phẩm
  const removeItem = async (itemId: number) => {
    const prevItems = [...cartItems];
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== itemId));

    try {
      const res = await fetch(`${API_BASE_URL}/api/carts/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Xóa sản phẩm thất bại: ${errorData}`);
      }
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Xóa sản phẩm thất bại!");
      setCartItems(prevItems);
    }
  };

  // Xử lý thanh toán
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể thanh toán!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/create-from-cart/${user_id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Tạo đơn hàng thất bại: ${errorData}`);
      }

      const data = await res.json();
      const orderId = data.id;
      router.push(`/checkout/address?orderId=${orderId}`);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      toast.error("Tạo đơn hàng thất bại!");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceAfterDiscount * item.quantity, 0);
  const total = subtotal;

  if (isLoading) {
    return <div className="text-center text-black p-6">Đang tải giỏ hàng...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="bg-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Cart Items */}
        <div className="md:w-2/3 bg-white shadow-md rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-black text-center mb-6">
            Giỏ hàng
          </h3>

          {cartItems.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-md text-left border">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-2 py-1">Sản phẩm</th>
                      <th className="px-2 py-1">Số lượng</th>
                      <th className="px-2 py-1">Thành tiền</th>
                      <th className="px-2 py-1">Xóa</th> {/* Cột mới cho nút xóa */}
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-2 py-1 flex items-center gap-2">
                          <Image
                            src={`${API_BASE_URL}${item.imageUrl}`}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/64x64.png?text=No+Image";
                            }}
                          />
                          <div>
                            <p className="text-md font-semibold ml-2">{item.productName}</p>
                            <p className="text-sm text-gray-500 ml-2">
                              Giá: {formatCurrency(item.priceAfterDiscount)}
                              {item.discountApplied > 0 && (
                                <span className="text-gray-400 line-through ml-4">
                                  {formatCurrency(item.price)}
                                </span>
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className={`bg-purple-500 text-white px-3 py-1 mr-2 rounded-md hover:bg-purple-600 ${
                              isUpdating ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isUpdating}
                          >
                            -
                          </button>
                          {item.quantity}
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className={`bg-purple-500 text-white px-3 py-1 ml-2 rounded-md hover:bg-purple-600 ${
                              isUpdating ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isUpdating}
                          >
                            +
                          </button>
                        </td>
                        <td className="px-2 py-1">
                          {formatCurrency(item.priceAfterDiscount * item.quantity)}
                        </td>
                        <td className="px-2 py-1">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa "${item.productName}" khỏi giỏ hàng?`)) {
                                removeItem(item.id);
                              }
                            }}
                            className={`text-red-500 hover:text-red-700 ml-2 ${
                              isUpdating ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isUpdating}
                            title="Xóa sản phẩm"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-4">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    removeItem={removeItem}
                    updateQuantity={updateQuantity}
                    isMobile={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng trống.</p>
          )}
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3 bg-white shadow-md p-8 rounded-lg h-80">
          <h3 className="text-2xl font-semibold text-black text-center">
            Đặt hàng
          </h3>
          <div className="flex justify-between mt-6 text-black">
            <span>Sản phẩm</span>
            <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between mt-2 text-black">
            <span>Tạm tính</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mt-6 font-bold text-lg text-black">
            <span>Tổng cộng</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-purple-600 text-white py-2 rounded-2xl mt-6"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}
