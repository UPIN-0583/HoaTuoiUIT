import { Suspense } from "react";
import CheckoutAddressContent from "./CheckoutAddressContent";

export default function CheckoutAddressPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-500">Đang tải...</div>}>
      <CheckoutAddressContent />
    </Suspense>
  );
}