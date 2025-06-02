import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface CartItemType {
  id: number;
  name: string;
  occasion: string;
  image: string;
}

interface CartItemProps {
  item: CartItemType;
  removeItem: (id: number) => void;
  isMobile: boolean;
}

const OderItem = ({ item, removeItem, isMobile }: CartItemProps) => {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <div className={`flex ${isMobile ? "items-center gap-4" : "items-center gap-4 md:gap-6 md:justify-between"}`}>
        {/* Product Info */}
        <div className="flex items-center gap-4 flex-1">
          <Image
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            className="w-16 h-16 object-cover"
          />
          <div className={isMobile ? "flex-1" : ""}>
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-gray-600">{item.occasion}</p>
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
      </div>
    </div>
  );
};

export default OderItem;