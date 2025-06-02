"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCartPlus } from "@fortawesome/free-solid-svg-icons";

// Define the interface for a wishlist item
interface WishItemType {
  id: number;
  productId: number;
  productName: string;
  price: number;
  finalPrice?: number;
  discountValue?: number;
  imageUrl: string;
  addedDate: string;
}

// Define the props interface for the WishItem component
interface WishItemProps {
  item: WishItemType;
  removeItem: (id: number) => void;
  addToCart: (id: number, quantity?: number) => void;
  isMobile: boolean;
}

const WishItem = ({ item, removeItem, addToCart, isMobile }: WishItemProps) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Hàm định dạng tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <div className={`flex ${isMobile ? "flex-col gap-3" : "items-center gap-4 md:gap-6 md:justify-between"}`}>
        {/* Product Info */}
        <div className="flex items-center gap-4 flex-1">
          <Image
            src={`${API_BASE_URL}${item.imageUrl}`}
            alt={item.productName}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/64x64.png?text=No+Image";
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{item.productName}</h3>
            {isMobile && (
              <p className="text-sm text-gray-500">
                Giá: {formatCurrency(item.finalPrice || item.price)}
                {item.discountValue > 0 && (
                  <span className="text-gray-400 line-through ml-2">
                    {formatCurrency(item.price)}
                  </span>
                )}
              </p>
            )}
          </div>
          {isMobile && (
            <button
              onClick={() => {
                if (confirm(`Bạn có chắc muốn xóa "${item.productName}" khỏi wishlist?`)) {
                  removeItem(item.id);
                }
              }}
              className="text-red-500 hover:text-red-700"
              title="Xóa sản phẩm"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>

        {/* Desktop View */}
        {!isMobile && (
          <div className="flex gap-12 items-center">
            <p className="text-lg font-semibold">
              {formatCurrency(item.finalPrice || item.price)}
              {item.discountValue > 0 && (
                <span className="text-gray-400 line-through ml-2">
                  {formatCurrency(item.price)}
                </span>
              )}
            </p>
            <p className="text-lg">{item.addedDate.slice(0, 10)}</p>
            <p className="text-lg font-semibold">Còn hàng</p>
            <div className="flex items-center gap-5">
              <button
                onClick={() => addToCart(item.productId, 1)}
                className="bg-gradient-to-tr from-purple-600 to-pink-400 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-1 rounded cursor-pointer"
              >
                <FontAwesomeIcon icon={faCartPlus} className="pr-2" />
                Thêm vào giỏ
              </button>
              <button
                onClick={() => {
                  if (confirm(`Bạn có chắc muốn xóa "${item.productName}" khỏi wishlist?`)) {
                    removeItem(item.id);
                  }
                }}
                className="text-red-500 hover:text-red-700"
                title="Xóa sản phẩm"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      {isMobile && (
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(item.productId, 1)}
              className="bg-gradient-to-tr from-purple-600 to-pink-400 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-1 rounded cursor-pointer"
            >
              <FontAwesomeIcon icon={faCartPlus} className="pr-2" />
              Thêm vào giỏ
            </button>
            <p className="text-sm font-semibold text-gray-700">Còn hàng</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishItem;