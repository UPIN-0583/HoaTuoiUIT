"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

export default function PaymentCallback() {
    const [isProcessing, setIsProcessing] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const originalOrderId = typeof window !== "undefined" ? localStorage.getItem("originalOrderId") : null;
    const orderDetails = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("orderDetails") || "{}") : {};

    useEffect(() => {
        const verifyPayment = async () => {
            if (!originalOrderId || !token) {
                toast.error("Không tìm thấy thông tin đơn hàng!");
                router.push("/");
                return;
            }

            const params = new URLSearchParams(window.location.search);
            const resultCode = params.get("resultCode");
            const message = params.get("message");
            const extraData = params.get("extraData");
            let data;

            try {
                data = extraData ? JSON.parse(decodeURIComponent(extraData)) : undefined;
            } catch (error) {
                console.error("Invalid extraData:", error);
                toast.error("Dữ liệu thanh toán không hợp lệ!");
                router.push("/");
                return;
            }

            // Xóa query params khỏi URL
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState(null, "", cleanUrl);

            // Kiểm tra kết quả thanh toán
            if (resultCode === "0") {
                try {
                    // Xác nhận đơn hàng
                    const response = await fetch(`${API_BASE_URL}/api/orders/${originalOrderId}/confirm`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Xác nhận đơn hàng thất bại");
                    }

                    toast.success("Thanh toán thành công!");
                    // Xóa thông tin đơn hàng khỏi localStorage
                    localStorage.removeItem('originalOrderId');
                    localStorage.removeItem('orderDetails');
                    router.push(`/order-confirmation?orderId=${originalOrderId}`);
                } catch (error) {
                    console.error("Lỗi khi xác nhận đơn hàng:", error);
                    toast.error("Có lỗi xảy ra khi xác nhận đơn hàng!");
                    router.push("/");
                }
            } else {
                console.error("Payment failed:", message);
                toast.error("Thanh toán thất bại!");
                router.push("/");
            }
        };

        verifyPayment();
    }, [originalOrderId, token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-800">Đang xử lý thanh toán...</h2>
                        <p className="text-gray-600 mt-2">Vui lòng đợi trong giây lát</p>
                    </>
                ) : (
                    <p className="text-gray-600">Đang chuyển hướng...</p>
                )}
            </div>
        </div>
    );
} 