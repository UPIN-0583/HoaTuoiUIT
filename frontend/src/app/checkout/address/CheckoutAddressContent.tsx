"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";

export default function CheckoutAddressContent() {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<Map<number, { imageUrl: string; name: string }>>(new Map());

  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

  // Hàm chuẩn hóa URL hình ảnh
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/40x40.png?text=No+Image";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `${API_BASE_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  // Lấy thông tin đơn hàng
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId || !token || !API_BASE_URL) {
        setError("Thông tin không hợp lệ!");
        router.push("/");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Lấy thông tin đơn hàng thất bại: ${errorData}`);
        }

        const data = await response.json();
        setOrderDetails(data);
        console.log("Order details fetched:", data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        setError("Không thể lấy thông tin đơn hàng!");
        toast.error("Không thể lấy thông tin đơn hàng!");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, token, API_BASE_URL, router]);

  // Lấy thông tin sản phẩm nếu thiếu imageUrl
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0 || !token || !API_BASE_URL) return;

      const missingItems = orderDetails.items.filter((item) => !item.imageUrl && !productDetails.has(item.productId));
      if (missingItems.length === 0) return;

      try {
        const productPromises = missingItems.map(async (item) => {
          const response = await fetch(`${API_BASE_URL}/api/products/${item.productId}/detail`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.warn(`Không thể lấy thông tin sản phẩm ${item.productId}`);
            return null;
          }

          const productData = await response.json();
          return { productId: item.productId, imageUrl: productData.imageUrl, name: productData.name };
        });

        const results = await Promise.all(productPromises);
        const newProductDetails = new Map(productDetails);
        results.forEach((result) => {
          if (result) {
            newProductDetails.set(result.productId, { imageUrl: result.imageUrl, name: result.name });
          }
        });
        setProductDetails(newProductDetails);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        setError("Không thể lấy thông tin sản phẩm!");
        toast.error("Không thể lấy thông tin sản phẩm!");
      }
    };

    fetchProductDetails();
  }, [orderDetails, token, API_BASE_URL, productDetails]);

  // Kiểm tra đăng nhập và orderId
  useEffect(() => {
    if (!token) {
      toast.info("Vui lòng đăng nhập để tiếp tục thanh toán!");
      router.push("/login");
      return;
    }
    if (!orderId) {
      setError("Không tìm thấy đơn hàng!");
      toast.error("Không tìm thấy đơn hàng!");
      router.push("/");
    }
    if (!API_BASE_URL) {
      setError("Lỗi cấu hình hệ thống!");
      toast.error("Lỗi cấu hình hệ thống!");
      router.push("/");
    }
  }, [orderId, router, token, API_BASE_URL]);

  const handleUpdateAddress = async () => {
    if (!address.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng!");
      toast.error("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/delivery-address?address=${encodeURIComponent(address)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Xác nhận địa chỉ thất bại: ${errorData}`);
      }

      console.log("Address updated for order:", orderId);
      toast.success("Đã xác nhận địa chỉ giao hàng!");
      setError(null);
    } catch (error) {
      console.error("Lỗi khi xác nhận địa chỉ:", error);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
      toast.error("Đã có lỗi xảy ra khi xác nhận địa chỉ!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán!");
      toast.error("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/payment-method?paymentId=${paymentMethod}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Xác nhận phương thức thanh toán thất bại: ${errorData}`);
      }

      console.log("Payment method updated for order:", orderId);
      toast.success("Đã xác nhận phương thức thanh toán!");
      setError(null);
    } catch (error) {
      console.error("Lỗi khi xác nhận phương thức thanh toán:", error);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
      toast.error("Đã có lỗi xảy ra khi xác nhận phương thức thanh toán!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!address || !paymentMethod) {
      setError("Vui lòng hoàn thành địa chỉ và phương thức thanh toán!");
      toast.error("Vui lòng hoàn thành địa chỉ và phương thức thanh toán!");
      return;
    }

    setIsLoading(true);
    try {
      // Nếu chọn thanh toán MoMo
      if (paymentMethod === "3") {
        const response = await fetch(`${API_BASE_URL}/api/payment-momo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            order_total: calculateTotalPrice(),
            order_details: orderDetails.items.map(item => ({
              product_id: item.productId,
              order_detail_quantity: item.quantity
            })),
            customer_id: orderDetails.customerId,
            order_name: orderDetails.customerName,
            order_phone: "0945936724",
            order_delivery_address: address
          })
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.log("MoMo payment request data:", {
            order_id: orderId,
            order_total: calculateTotalPrice(),
            order_details: orderDetails.items,
            customer_id: orderDetails.customerId,
            order_name: orderDetails.customerName,
            order_phone: "0945936724",
            order_delivery_address: address
          });
          throw new Error(`Tạo thanh toán MoMo thất bại: ${errorData}`);
        }

        const data = await response.json();
        if (!data.payUrl) {
          throw new Error("Không nhận được URL thanh toán từ MoMo");
        }

        // Lưu thông tin đơn hàng vào localStorage
        localStorage.setItem('originalOrderId', orderId);
        localStorage.setItem('orderDetails', JSON.stringify({
          total: calculateTotalPrice(),
          items: orderDetails.items,
          customerId: orderDetails.customerId,
          customerName: orderDetails.customerName,
          phone: "0945936724",
          address: address
        }));

        // Chuyển hướng đến trang thanh toán MoMo
        window.location.href = data.payUrl;
        return;
      }

      // Nếu không phải MoMo thì xác nhận đơn hàng như bình thường
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Xác nhận đơn hàng thất bại: ${errorData}`);
      }

      console.log("Order confirmed:", orderId);
      toast.success("Đã xác nhận đơn hàng!");
      router.push(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại!");
      toast.error("Đã có lỗi xảy ra khi xác nhận đơn hàng!");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateTotalPrice = () => {
    if (!orderDetails || !orderDetails.items || orderDetails.items.length === 0) {
      return 0;
    }
    return orderDetails.items.reduce(
      (total: number, item: any) => total + item.quantity * item.priceAfterDiscount,
      0
    );
  };

  const getItemDisplay = (item) => {
    const productInfo = productDetails.get(item.productId);
    return {
      imageUrl: item.imageUrl || (productInfo?.imageUrl ?? null),
      name: item.productName || productInfo?.name || "Không xác định",
    };
  };

  if (!orderId || !API_BASE_URL) {
    return <div className="text-center text-red-500">Lỗi hệ thống hoặc không tìm thấy đơn hàng!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg text-black mt-6">
      <h2 className="text-2xl font-semibold mb-6">Thanh toán</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 w-full">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h3>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Nhập địa chỉ giao hàng (VD: 123 Đường ABC, Quận 1, TP.HCM)"
              className="w-full p-2 border rounded-md"
              disabled={isLoading}
            />
            <button
              onClick={handleUpdateAddress}
              disabled={isLoading}
              className={`mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận địa chỉ"}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Phương thức thanh toán</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isLoading}
            >
              <option value="">Chọn phương thức thanh toán</option>
              <option value="1">Thanh toán khi nhận hàng (COD)</option>
              <option value="2">Thẻ tín dụng</option>
              <option value="3">Thanh toán qua MoMo</option>
            </select>
            <button
              onClick={handleUpdatePaymentMethod}
              disabled={isLoading}
              className={`mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận phương thức"}
            </button>
          </div>

          <div>
            <button
              onClick={handleConfirmOrder}
              disabled={isLoading || !address || !paymentMethod}
              className={`w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${isLoading || !address || !paymentMethod ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận đơn hàng"}
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>
          {orderDetails ? (
            <div className="border rounded-lg p-4">
              {orderDetails.items && orderDetails.items.length > 0 ? (
                <>
                  {orderDetails.items.map((item: any) => {
                    const { imageUrl, name } = getItemDisplay(item);
                    return (
                      <div key={item.productId} className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {imageUrl ? (
                            <Image
                              src={getImageUrl(imageUrl)}
                              alt={name}
                              width={40}
                              height={40}
                              className="object-cover rounded-md"
                              placeholder="blur"
                              blurDataURL="https://via.placeholder.com/40x40.png?text=No+Image"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/40x40.png?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{name}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{formatCurrency(item.priceAfterDiscount * item.quantity)}</p>
                          {item.discountApplied > 0 && (
                            <span className="text-gray-400 line-through">
                              {formatCurrency(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="text-gray-500">Không có sản phẩm trong đơn hàng.</p>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <p className="font-semibold">Tổng cộng:</p>
                  <p className="font-semibold">{formatCurrency(calculateTotalPrice())}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Đang tải thông tin đơn hàng...</p>
          )}
        </div>
      </div>
    </div>
  );
}