// components/MyOrders.tsx
"use client";

import { useState, useEffect, useCallback } from "react";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  discountApplied: number;
  priceAfterDiscount: number;
}

interface Order {
  id: number;
  customerId: number;
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  totalAmount: number;
  status: string;
  paymentId: number;
  note: string;
  customerName: string;
  paymentMethodName: string;
  items: OrderItem[];
}

interface ReviewForm {
  rating: number;
  comment: string;
  productId: number;
  customerId: number;
  isVerified?: boolean; // Thêm trường isVerified
}

interface DeliveredItem extends OrderItem {
  orderId: number;
  orderDate: string;
  customerId: number;
}

interface MyOrdersProps {
  orders: Order[];
  orderFilter: string;
  setOrderFilter: (value: string) => void;
}

export default function MyOrders({ orders, orderFilter, setOrderFilter }: MyOrdersProps) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

  const statusMap = {
    all: "Tất cả",
    pending: "Đang chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy"
  };

  // Lọc đơn hàng theo trạng thái
  const filteredOrders: Order[] = orderFilter === "all"
    ? orders
    : orders.filter((order) => order.status && order.status.toLowerCase() === orderFilter);

  // Lấy danh sách sản phẩm từ các đơn hàng đã giao
  const deliveredItems = orders
    .filter(order => order.status?.toLowerCase() === 'delivered')
    .flatMap(order => order.items?.map(item => ({
      ...item,
      orderId: order.id,
      orderDate: order.orderDate,
      customerId: order.customerId
    })) || []);

  // State để quản lý modal và form đánh giá
  const [showDeliveredItems, setShowDeliveredItems] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DeliveredItem | null>(null);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 0,
    comment: '',
    productId: 0,
    customerId: 0,
    isVerified: true // Đặt mặc định true
  });
  const [reviewedProducts, setReviewedProducts] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize checkIfReviewed
  const checkIfReviewed = useCallback(async (productId: number, customerId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews?productId=${productId}&customerId=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        cache: 'no-store'
      });
      const reviews = await response.json();
      return reviews.length > 0;
    } catch (error) {
      console.error('Lỗi khi kiểm tra đánh giá:', error);
      return false;
    }
  }, [API_BASE_URL]);

  // Kiểm tra các sản phẩm đã được đánh giá
  useEffect(() => {
    const fetchReviewedProducts = async () => {
      const reviewed = await Promise.all(
        deliveredItems.map(item => checkIfReviewed(item.productId, item.customerId))
      );
      const reviewedIds = deliveredItems
        .filter((_, index) => reviewed[index])
        .map(item => item.productId);
      setReviewedProducts(reviewedIds);
    };
    if (deliveredItems.length > 0) {
      fetchReviewedProducts();
    }
  }, [deliveredItems, checkIfReviewed]);

  // Xử lý khi click vào button đánh giá
  const handleReviewClick = async (item: DeliveredItem) => {
    const isReviewed = await checkIfReviewed(item.productId, item.customerId);
    if (isReviewed) {
      alert('Bạn đã đánh giá sản phẩm này rồi!');
      return;
    }
    setSelectedItem(item);
    setReviewForm({
      rating: 0,
      comment: '',
      productId: item.productId,
      customerId: item.customerId,
      isVerified: true // Đặt isVerified: true khi khởi tạo form
    });
    setShowReviewModal(true);
  };

  // Xử lý thay đổi rating
  const handleRatingChange = (rating: number) => {
    setReviewForm({ ...reviewForm, rating });
  };

  // Xử lý submit form
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...reviewForm,
          isVerified: true // Đảm bảo gửi isVerified: true
        })
      });
      if (response.ok) {
        alert('Đánh giá đã được gửi thành công!');
        setReviewedProducts([...reviewedProducts, reviewForm.productId]);
        setShowReviewModal(false);
        setReviewForm({
          rating: 0,
          comment: '',
          productId: 0,
          customerId: 0,
          isVerified: true
        });

        // Phát sự kiện để thông báo
        window.dispatchEvent(new CustomEvent('reviewSubmitted', {
          detail: { productId: reviewForm.productId }
        }));
      } else {
        const errorData = await response.json();
        alert(`Có lỗi xảy ra: ${errorData.message || 'Vui lòng thử lại.'}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi đánh giá:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Validation cho form
  const isFormValid = reviewForm.rating > 0 && reviewForm.comment.length >= 10;

  return (
    <div className="w-full px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Đơn Hàng ({filteredOrders.length})</h2>
        <div className="relative">
          <select
            className="appearance-none border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none shadow-sm"
            value={orderFilter}
            onChange={e => setOrderFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Đang chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">▼</span>
        </div>
      </div>

      <div className="mb-6">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition duration-300"
          onClick={() => setShowDeliveredItems(!showDeliveredItems)}
        >
          {showDeliveredItems ? "Ẩn Danh Sách Sản Phẩm Đã Giao" : "Thêm Đánh Giá"}
        </button>
      </div>

      {showDeliveredItems && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-h-[500px] overflow-y-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Danh Sách Sản Phẩm Đã Giao</h3>
          {deliveredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Không có sản phẩm nào đã giao.</div>
          ) : (
            <div className="space-y-4">
              {deliveredItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-4 last:border-b-0">
                  <div>
                    <p className="font-bold text-gray-700">{item.productName}</p>
                    <p className="text-sm text-gray-600">Đơn hàng #{item.orderId}</p>
                    <p className="text-sm text-gray-600">Ngày đặt: {item.orderDate?.slice(0, 10)}</p>
                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Giá: {formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-sm text-gray-600">Giảm giá: {formatCurrency(item.discountApplied * item.quantity)}</p>
                    <p className="text-sm text-gray-600">Giá sau giảm: {formatCurrency(item.priceAfterDiscount * item.quantity)}</p>
                  </div>
                  <button
                    className={`px-3 py-1 rounded-lg transition duration-300 ${
                      reviewedProducts.includes(item.productId)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                    onClick={() => handleReviewClick(item)}
                    disabled={reviewedProducts.includes(item.productId)}
                  >
                    {reviewedProducts.includes(item.productId) ? 'Đã Đánh Giá' : 'Đánh Giá'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Đánh Giá Sản Phẩm: {selectedItem?.productName}</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="rating">
                  Điểm đánh giá
                </label>
                <div className="flex space-x-1" role="radiogroup" aria-labelledby="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${reviewForm.rating >= star ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none focus:ring-2 focus:ring-purple-600`}
                      onClick={() => handleRatingChange(star)}
                      aria-label={`Đánh giá ${star} sao`}
                      role="radio"
                      aria-checked={reviewForm.rating >= star}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="comment">
                  Bình luận
                </label>
                <textarea
                  id="comment"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Nhập bình luận của bạn (tối thiểu 10 ký tự)..."
                  aria-required="true"
                />
                {reviewForm.comment.length > 0 && reviewForm.comment.length < 10 && (
                  <p className="text-sm text-red-500 mt-1">Bình luận phải có ít nhất 10 ký tự.</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  onClick={() => setShowReviewModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 max-h-[500px] overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Không có đơn hàng nào.</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="mb-8 border-b last:border-b-0 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700 bg-gradient-to-tr from-pink-200 to-purple-100 rounded-t-2xl p-3 mb-2">
                <div>
                  <p className="font-bold">Mã Đơn Hàng</p>
                  <p>#{order.id}</p>
                </div>
                <div>
                  <p className="font-bold">Tổng Thanh Toán</p>
                  <p>{formatCurrency(order.totalAmount)}</p>
                </div>
                <div>
                  <p className="font-bold">Phương Thức</p>
                  <p>{order.paymentMethodName}</p>
                </div>
                <div>
                  <p className="font-bold">Trạng Thái</p>
                  <p>{statusMap[order.status?.toLowerCase() as keyof typeof statusMap] || order.status}</p>
                </div>
              </div>
              <div className="mb-2 text-gray-600 text-sm">Ngày đặt: {order.orderDate?.slice(0, 10)} | Dự kiến giao: {order.deliveryDate?.slice(0, 10)}</div>
              <div className="mb-2 text-gray-600 text-sm">Địa chỉ: {order.deliveryAddress}</div>
              <div className="mb-2 text-gray-600 text-sm">Ghi chú: {order.note}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left border">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="px-2 py-1">Tên sản phẩm</th>
                      <th className="px-2 py-1">Số lượng</th>
                      <th className="px-2 py-1">Giá</th>
                      <th className="px-2 py-1">Giảm giá</th>
                      <th className="px-2 py-1">Giá sau giảm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">{item.productName}</td>
                        <td className="px-2 py-1">{item.quantity}</td>
                        <td className="px-2 py-1">{formatCurrency(item.price * item.quantity)}</td>
                        <td className="px-2 py-1">{formatCurrency(item.discountApplied * item.quantity)}</td>
                        <td className="px-2 py-1">{formatCurrency(item.priceAfterDiscount * item.quantity)}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-2">Không có sản phẩm</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}