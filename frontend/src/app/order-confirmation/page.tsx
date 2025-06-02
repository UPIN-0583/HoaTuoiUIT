import { Suspense } from "react";
import OrderConfirmationContent from "./OrderConfirmationContent";

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Đang tải...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}