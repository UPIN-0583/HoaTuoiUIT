import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShippingFast, faWallet, faHeadset, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function Features() {
    return (
        <div className="py-10 bg-white">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
                {/* Free Shipping */}
                <div className="flex items-center gap-3 justify-center md:justify-center">
                    <FontAwesomeIcon icon={faShippingFast} className="text-purple-500 text-3xl" />
                    <div>
                        <h4 className="font-semibold text-lg text-black">Miễn phí vận chuyển</h4>
                        <p className="text-gray-500 text-sm">Miễn phí vận chuyển toàn quốc</p>
                    </div>
                </div>

                {/* Flexible Payment */}
                <div className="flex items-center gap-3 justify-center md:justify-center">
                    <FontAwesomeIcon icon={faWallet} className="text-purple-500 text-3xl" />
                    <div>
                        <h4 className="font-semibold text-lg text-black">Thanh toán đa dạng</h4>
                        <p className="text-gray-500 text-sm">Nhiều phương thức thanh toán</p>
                    </div>
                </div>

                {/* High quality */}
                <div className="flex items-center gap-3 justify-center md:justify-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-purple-500 text-3xl" />
                    <div>
                        <h4 className="font-semibold text-lg text-black">Chất lượng tin cậy</h4>
                        <p className="text-gray-500 text-sm">Sản phẩm an toàn & chính hãng</p>
                    </div>
                </div>

                {/* 24x7 Support */}
                <div className="flex items-center gap-3 justify-center md:justify-center">
                    <FontAwesomeIcon icon={faHeadset} className="text-purple-500 text-3xl" />
                    <div>
                        <h4 className="font-semibold text-lg text-black">Hỗ trợ 24×7</h4>
                        <p className="text-gray-500 text-sm">Luôn luôn sẵn sàng phục vụ</p>
                    </div>
                </div>
            </div>
        </div>
    );
}