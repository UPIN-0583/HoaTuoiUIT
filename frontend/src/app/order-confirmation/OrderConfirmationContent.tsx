"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    toast.error("Không tìm thấy mã đơn hàng!");
    return <div className="text-center text-red-500">Không tìm thấy mã đơn hàng!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg text-black mt-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">Đặt hàng thành công!</h2>
      <p className="text-gray-600 mb-4">
        Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là <strong>#{orderId}</strong>.
      </p>
      <p className="text-gray-600 mb-4">Chúng tôi sẽ xử lý đơn hàng và gửi thông báo sớm nhất.</p>
      <Link
        href="/"
        className="inline-block px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
      >
        Về trang chủ
      </Link>
    </div>
  );
}