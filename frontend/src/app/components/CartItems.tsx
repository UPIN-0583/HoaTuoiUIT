import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export interface CartItemType {
  id: number;
  productName: string;
  discountApplied: number;
  priceAfterDiscount: number; // Đổi từ price thành finalPrice
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartItemProps {
  item: CartItemType;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, amount: number) => void;
  isMobile: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const CartItem = ({ item, removeItem, updateQuantity, isMobile }: CartItemProps) => {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <div className={`flex ${isMobile ? "items-center gap-4" : "items-center gap-4 md:gap-6 md:justify-between"}`}>
        {/* Product Info */}
        <div className="flex items-center gap-4 flex-1">
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
          <div className={isMobile ? "flex-1" : ""}>
            <h3 className="font-semibold text-lg">{item.productName}</h3>
            <p className="text-gray-600">{formatCurrency(item.priceAfterDiscount)}</p> {/* Sử dụng finalPrice */}
          </div>
          {/* Remove Button for Mobile */}
          {isMobile && (
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>

        {/* Quantity and Total for Desktop */}
        {!isMobile && (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(item.priceAfterDiscount * item.quantity)} {/* Sử dụng finalPrice */}
            </p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </>
        )}
      </div>

      {/* Quantity and Total for Mobile */}
      {isMobile && (
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, -1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>
          <p className="text-lg font-bold">
            {formatCurrency(item.priceAfterDiscount * item.quantity)} {/* Sử dụng finalPrice */}
          </p>
        </div>
      )}
    </div>
  );
};

export default CartItem;