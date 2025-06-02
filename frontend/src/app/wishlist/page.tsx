"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import WishItem from "../components/WishItem";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCartPlus } from "@fortawesome/free-solid-svg-icons";

export default function Wishlist() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<{ id: number; customerId: number; items: any[] } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  // Lấy userId và token từ localStorage sau khi component đã mount (client-side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("id");
      const tk = localStorage.getItem("token");
      setUserId(id);
      setToken(tk);
    }
  }, []);

  useEffect(() => {
    if (!userId || !token) {
      return;
    }

    // Lấy wishlist
    fetch(`${API_BASE_URL}/api/wishlists/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi mạng");
        return res.json();
      })
      .then(async (data) => {
        const updatedItems = await Promise.all(
          data.items.map(async (item: any) => {
            try {
              const productRes = await fetch(`${API_BASE_URL}/api/products/${item.productId}/detail`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              if (!productRes.ok) throw new Error("Lỗi chi tiết sản phẩm");
              const productData = await productRes.json();
              return {
                ...item,
                finalPrice: productData.finalPrice,
                discountValue: productData.discountValue,
              };
            } catch (err) {
              console.error(`Lỗi lấy sản phẩm ${item.productId}:`, err);
              return item;
            }
          })
        );
        setWishlist({ ...data, items: updatedItems });
      })
      .catch(() => {
        toast.error("Có lỗi khi tải wishlist!");
      });

    // Lấy cartId
    fetch(`${API_BASE_URL}/api/carts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCartId(data.id))
      .catch(() => toast.error("Có lỗi khi tải thông tin giỏ hàng!"));
  }, [userId, token, API_BASE_URL]);

  const removeItem = async (itemId: number) => {
    if (!token) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlists/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      setWishlist((prev) => (prev ? { ...prev, items: prev.items.filter((item: any) => item.id !== itemId) } : prev));
      toast.success("Đã xóa sản phẩm khỏi wishlist!");
    } catch {
      toast.error("Có lỗi khi xóa sản phẩm!");
    } finally {
      setIsUpdating(false);
    }
  };

  const addToCart = async (itemId: number, quantity: number = 1) => {
    if (!token || !cartId) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/carts/items`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: itemId, cartId: cartId, quantity }),
      });
      if (!res.ok) throw new Error("Thêm vào giỏ hàng thất bại");
      setWishlist((prev) => (prev ? { ...prev, items: prev.items.filter((item: any) => item.id !== itemId) } : prev));
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch {
      toast.error("Có lỗi khi thêm vào giỏ hàng!");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-3xl font-semibold text-black justify-center mb-6 text-center mt-3">Wishlist</h3>
          {wishlist && wishlist.items.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-md text-left border">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-2 py-1">Sản phẩm</th>
                      <th className="px-2 py-1">Ngày thêm</th>
                      <th className="px-2 py-1">Trạng thái</th>
                      <th className="px-2 py-1 text-center">Thêm vào giỏ hàng</th>
                      <th className="px-2 py-1 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-2 py-1 flex items-center gap-2">
                          <Image
                            src={`${API_BASE_URL}${item.imageUrl}`}
                            alt={item.productName}
                            width={64}
                            height={64}
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/64x64.png?text=No+Image";
                            }}
                          />
                          <div>
                            <p className="text-md font-semibold ml-2">{item.productName}</p>
                            <p className="text-sm text-gray-500 ml-2">
                              Giá: {formatCurrency(item.finalPrice || item.price)}
                              {item.discountValue > 0 && (
                                <span className="text-gray-400 line-through ml-4">
                                  {formatCurrency(item.price)}
                                </span>
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-2 py-1">{item.addedDate.slice(0, 10)}</td>
                        <td className="px-2 py-1">Còn hàng</td>
                        <td className="px-2 py-1 text-center">
                          <button
                            onClick={() => addToCart(item.productId)}
                            className={`bg-purple-500 text-white px-3 py-1 mr-2 rounded-md hover:bg-purple-600 ${
                              isUpdating ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={isUpdating}
                          >
                            <FontAwesomeIcon icon={faCartPlus} />
                          </button>
                        </td>
                        <td className="px-2 py-1 text-center">
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa "${item.productName}" khỏi wishlist?`)) {
                                removeItem(item.id);
                              }
                            }}
                            className={`text-red-500 hover:text-red-700 ${
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
                {wishlist.items.map((item) => (
                  <WishItem
                    key={item.id}
                    item={item}
                    removeItem={removeItem}
                    addToCart={addToCart}
                    isMobile={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Không có sản phẩm yêu thích.</p>
          )}
        </div>
      </div>
    </div>
  );
}
