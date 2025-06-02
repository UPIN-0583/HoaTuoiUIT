"use client"
import { faEye, faRocket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Image from "next/image"
import FeedbackCarousel from "../components/FeedbackCarousel"
import { faStar } from "@fortawesome/free-solid-svg-icons";

// Định nghĩa interface cho dữ liệu từ API
interface ApiFeedback {
  id: number;
  customerId: number;
  productId: number;
  rating: number;
  comment: string;
  isVerified: boolean;
  customerName: string;
  productName: string;
  createdAt: string;
}

// Định nghĩa interface cho FeedbackCard
interface Feedback {
  rating: number;
  title: string;
  content: string;
  name: string;
  role: string;
  image: string;
}

const flowerImages = [
    {
        id: 1,
        src: '/images/blogs/b1.jpg',
        alt: 'Person arranging flowers in shop',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 2,
        src: '/images/blogs/b2.jpg',
        alt: 'Woman holding white flower bouquet',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 3,
        src: '/images/blogs/b3.jpg',
        alt: 'Woman in denim with flower arrangement',
        width: 800,
        height: 600,
        className: 'rounded-lg'
    },
    {
        id: 4,
        src: '/images/blogs/b4.jpg',
        alt: 'Woman with curly hair holding flowers',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 5,
        src: '/images/blogs/b5.jpg',
        alt: 'Woman in blue shirt with flowers',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 6,
        src: '/images/blogs/b6.jpg',
        alt: 'Woman with pink roses',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 7,
        src: '/images/blogs/b7.jpg',
        alt: 'Woman with pink flowers and veil',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 8,
        src: '/images/blogs/b8.jpg',
        alt: 'Woman with hat holding blue flowers',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    },
    {
        id: 9,
        src: '/images/blogs/b9.jpg',
        alt: 'Woman with white flowers',
        width: 400,
        height: 300,
        className: 'rounded-lg'
    }
]

export default function About() {
  const [selectedImage, setSelectedImage] = useState<FlowerImage | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); // State để lưu dữ liệu feedback từ API
  const [loading, setLoading] = useState(true); // State để xử lý trạng thái loading
  const [error, setError] = useState<string | null>(null); // State để xử lý lỗi

  interface FlowerImage {
    id: number;
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
  }

  // Hàm gọi API
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch(
          "https://backendhoatuoiuit.onrender.com/api/reviews"
        );
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu từ API");
        }
        const data: ApiFeedback[] = await response.json();

        // Chuyển đổi dữ liệu API sang định dạng của FeedbackCard
        const mappedFeedbacks: Feedback[] = data.map((item) => ({
          rating: item.rating,
          title: `Đánh giá cho ${item.productName}`, // Tạo tiêu đề từ productName
          content: item.comment,
          name: item.customerName,
          role: item.isVerified ? "Khách hàng đã xác minh" : "Khách hàng", // Gán role dựa trên isVerified
          image: item.customerId % 2 === 0 
            ? "/avatars/avatar1.jpg" 
            : "/avatars/avatar2.jpg",
        }));

        setFeedbacks(mappedFeedbacks);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

        fetchFeedbacks();
    }, []);

    const handleImageClick = (image: FlowerImage) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-16 bg-white">
                <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden border-[6px] border-white shadow-xl">
                    <Image
                        src="/blog1.jpg"
                        alt="Florist"
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="mt-10 md:mt-0 md:ml-12 max-w-xl text-center md:text-left">
                    <h4 className="text-gray-600 text-2xl">Về Chúng Tôi</h4>
                    <h2 className="text-4xl font-semibold mt-2">
                        <p className="text-purple-600 font-bold">Mang Vẻ Đẹp</p>
                        <p className="text-gray-500 font-bold">Thiên Nhiên Đến Nhà Bạn</p>
                    </h2>
                    <p className="text-gray-500 mt-4 text-2xl">
                        Chúng tôi tự hào là địa chỉ tin cậy mang đến những bó hoa tươi thắm nhất,
                        được chọn lọc kỹ lưỡng và sắp xếp tỉ mỉ, để gửi gắm những thông điệp yêu thương
                        đến người thân của bạn.
                    </p>

                    <div className="mt-8 bg-purple-800 text-white rounded-xl flex flex-col sm:flex-row justify-around py-6 px-4">
                        <div className="mb-4 sm:mb-0 text-center">
                            <p className="text-3xl font-bold text-pink-400">20+</p>
                            <p className="text-sm text-purple-200 ">Danh Mục</p>
                        </div>
                        <div className="border-r-1 border-purple-400  "></div>
                        <div className="mb-4 sm:mb-0 text-center ">
                            <p className="text-3xl font-bold text-pink-400">1000+</p>
                            <p className="text-sm text-purple-200 ">Sản Phẩm</p>
                        </div>
                        <div className="border-r-1 border-purple-400"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-pink-400">99%</p>
                            <p className="text-sm text-purple-200">Khách Hàng Hài Lòng</p>
                        </div>
                    </div>

                    <p className="mt-6 italic text-gray-700 font-signature text-lg">
                    </p>
                </div>
            </div>
            <div className="bg-[#f7f7f7] py-16 px-4 md:px-20">
                {/* Top image section */}
                <div className="relative w-full max-w-4xl mx-auto">
                    <div className="relative rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src="/about2.jpg"
                            alt="Florist at work"
                            width={1000}
                            height={500}
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    <div className="absolute -bottom-6 left-6 bg-purple-600 text-white rounded-full px-4 py-2 flex items-center gap-3 shadow-lg">
                        {/* Avatars */}
                        <div className="flex items-center -space-x-2">
                            <Image
                                src="/avatars/avatar1.jpg"
                                alt="user1"
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white"
                            />
                            <Image
                                src="/avatars/avatar2.jpg"
                                alt="user2"
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white"
                            />
                            <Image
                                src="/avatars/avatar3.jpg"
                                alt="user3"
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white"
                            />
                            <Image
                                src="/avatars/avatar1.jpg"
                                alt="user4"
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white"
                            />
                            <div className="w-8 h-8 rounded-full bg-pink-500 text-white text-center text-sm flex items-center justify-center border-2 border-white">
                                +
                            </div>
                        </div>

                        {/* Text */}
                        <div className="text-sm">
                            <p className="font-semibold leading-4 ">4.9+ <span className="text-yellow-500"><FontAwesomeIcon icon={faStar} /></span> </p>
                            <p className="text-xs">Đánh giá</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20 text-center px-20 md:px-30">
                    {/* Vision */}
                    <div className="flex flex-col items-center">
                        <div className="w-15 h-15 rounded-full bg-purple-700 text-white flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faEye} className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Tầm Nhìn</h3>
                        <p className="text-gray-600 text-sm">
                            Trở thành địa chỉ tin cậy hàng đầu trong việc mang đến những bó hoa tươi thắm nhất,
                            góp phần tô điểm cho cuộc sống và lan tỏa những thông điệp yêu thương đến mọi người.
                        </p>
                    </div>

                    {/* Mission */}
                    <div className="flex flex-col items-center">
                        <div className="w-15 h-15 rounded-full bg-purple-700 text-white flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faRocket} className="text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Sứ Mệnh</h3>
                        <p className="text-gray-600 text-sm">
                            Mang đến cho khách hàng những trải nghiệm tuyệt vời với dịch vụ chuyên nghiệp,
                            sản phẩm chất lượng và sự tận tâm trong từng chi tiết nhỏ nhất.
                        </p>
                    </div>
                </div>
            </div>
            <div className="bg-white py-16 px-4 md:px-20">
                <div className="px-4 md:px-20">
                    <p className="text-center text-2xl">Đội Ngũ Của Chúng Tôi</p>
                    <p className="font-semibold text-4xl text-center">Gặp Gỡ Những Con Người</p>
                    <p className="font-semibold text-4xl text-center text-purple-500">Đầy Đam Mê Đằng Sau Thành Công</p>
                </div>
                <div className="flex flex-wrap gap-5 py-16 px-4 md:px-16 justify-center">
                    <div>
                        <Image
                            src="/avatars/avatar1.jpg"
                            alt="team"
                            width={220}
                            height={700}
                            className="rounded-md object-cover " />
                        <p className="font-semibold text-center">Võ Tấn Thời</p>
                    </div>
                    <div>
                        <Image
                            src="/avatars/avatar1.jpg"
                            alt="team"
                            width={220}
                            height={700}
                            className="rounded-md object-cover " />
                        <p className="font-semibold text-center">Trương Quốc Huy</p>
                    </div>
                    <div>
                        <Image
                            src="/avatars/avatar1.jpg"
                            alt="team"
                            width={220}
                            height={700}
                            className="rounded-md object-cover " />
                        <p className="font-semibold text-center">Mai Hoàng Vinh</p>
                    </div>
                    <div>
                        <Image
                            src="/avatars/avatar1.jpg"
                            alt="team"
                            width={220}
                            height={700}
                            className="rounded-md object-cover " />
                        <p className="font-semibold text-center">Phạm Minh Tiến</p>
                    </div>
                    <div>
                        <Image
                            src="/avatars/avatar1.jpg"
                            alt="team"
                            width={220}
                            height={700}
                            className="rounded-md object-cover " />
                        <p className="font-semibold text-center">Chí Nhịt Phú</p>
                    </div>
                </div>
            </div>
            
            {/* Phần Feedback */}
            <div className="bg-[#f7f7f7] py-16 px-4 md:px-20">
                <div className="px-4 md:px-20">
                <p className="text-center text-2xl">Đánh Giá Từ Khách Hàng</p>
                <p className="font-semibold text-4xl text-center">
                    Trải Nghiệm{" "}
                    <span className="font-semibold text-4xl text-center text-purple-500">
                    Từ Khách Hàng
                    </span>
                </p>
                </div>
                {loading ? (
                <p className="text-center">Đang tải đánh giá...</p>
                ) : error ? (
                <p className="text-center text-red-500">{error}</p>
                ) : (
                <FeedbackCarousel feedbacks={feedbacks} />
                )}
            </div>
            <div>
                <div className="min-h-screen bg-gray-50">
                    <Head>
                        <title>Flower Gallery</title>
                        <meta name="description" content="Beautiful flower arrangements gallery" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="icon" href="/favicon.ico" />
                    </Head>

                    <main className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
                        {/* Instagram Follow Section */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-normal text-gray-600 mb-2">Theo Dõi Chúng Tôi</h2>
                            <h1 className="text-4xl sm:text-3xl md:text-4xl font-bold">
                                Đồng Hành <span className="text-purple-700"> Cùng Chúng Tôi Trên Instagram</span>
                            </h1>
                        </div>

                        <div className="flex justify-center">
                            <div className="max-w-7xl w-full">
                                {/* Mobile Layout (1 column) */}
                                <div className="block sm:hidden">
                                    <div className="grid grid-cols-1 gap-3">
                                        {flowerImages.map((image) => (
                                            <div
                                                key={image.id}
                                                className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() => handleImageClick(image)}
                                            >
                                                <div className="relative h-[250px]">
                                                    <Image
                                                        src={image.src}
                                                        alt={image.alt}
                                                        fill
                                                        sizes="100vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Small Tablet Layout (2 columns) */}
                                <div className="hidden sm:block md:hidden">
                                    <div className="grid grid-cols-2 gap-3">
                                        {flowerImages.map((image, index) => (
                                            <div
                                                key={image.id}
                                                className={`overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${index === 2 ? 'col-span-2' : 'col-span-1'
                                                    }`}
                                                onClick={() => handleImageClick(image)}
                                            >
                                                <div className={`relative ${index === 2 ? 'h-[400px]' : 'h-[200px]'}`}>
                                                    <Image
                                                        src={image.src}
                                                        alt={image.alt}
                                                        fill
                                                        sizes={index === 2 ? "100vw" : "50vw"}
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Layout for medium screens and larger - matches the image */}
                                <div className="hidden md:block">
                                    <div className="grid grid-cols-11 gap-4">
                                        {/* First row, 5 columns */}
                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[0].src}
                                                        alt={flowerImages[0].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[1].src}
                                                        alt={flowerImages[1].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-3 row-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity h-full">
                                                <div className="relative h-full rounded-lg">
                                                    <Image
                                                        src={flowerImages[2].src}
                                                        alt={flowerImages[2].alt}
                                                        fill
                                                        sizes="30vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[3].src}
                                                        alt={flowerImages[3].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[4].src}
                                                        alt={flowerImages[4].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Second row, 4 columns */}
                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[5].src}
                                                        alt={flowerImages[5].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[6].src}
                                                        alt={flowerImages[6].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[7].src}
                                                        alt={flowerImages[7].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-2">
                                            <div className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                                <div className="relative aspect-square rounded-lg">
                                                    <Image
                                                        src={flowerImages[8].src}
                                                        alt={flowerImages[8].alt}
                                                        fill
                                                        sizes="20vw"
                                                        className="object-cover rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Image modal - Optimized for all screen sizes */}
                    {selectedImage && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4"
                            onClick={closeModal}
                        >
                            <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-10"
                                    onClick={closeModal}
                                    aria-label="Close"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="relative h-[70vh] sm:h-[80vh]">
                                    <Image
                                        src={selectedImage.src}
                                        alt={selectedImage.alt}
                                        fill
                                        sizes="100vw"
                                        className="object-contain rounded-lg"
                                        priority
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 sm:p-4 text-center truncate">
                                    {selectedImage.alt}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-[#f7f7f7] py-16 px-4 md:px-20">
                <div className="px-4 md:px-20">
                    <p className="text-center text-2xl">Nhận Thông Báo</p>
                    <p className="font-semibold text-4xl text-center">Đăng Ký Nhận Bản Tin Để</p>
                    <p className="font-semibold text-4xl text-center">Cập Nhật <span className="font-semibold text-4xl text-center text-purple-500">Ưu Đãi Mới Nhất</span> </p>
                </div>
                <p className="text-center text-gray-500 py-5">Nhận ngay 20% giảm giá cho đơn hàng đầu tiên khi đăng ký nhận bản tin</p>
                <div className="flex justify-center gap-5" >
                    <input type="text" name="" id="" placeholder="Nhập địa chỉ email của bạn"
                        className="bg-white pr-10 md:pr-30 pl-2 md:pl-5 py-3 md:py-4 rounded-full focus:ring-purple-500 focus:outline-purple-500" />
                    <button className="px-4 md:px-9 py-1 md:py-2 bg-purple-700 text-white rounded-full cursor-pointer">
                        Đăng Ký
                    </button>
                </div>
            </div>

        </div>


    )
}