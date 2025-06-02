"use client"

import { faEnvelope, faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";


export default function Contact() {
    return (
        <div>
            <div className="flex flex-col items-center justify-center p-4 md:p-6">
                <div className="bg-white rounded-2xl p-4 md:p-6 w-8/10 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 mb-6 md:mb-0">
                        <Image
                            src="/hero-image.jpg"
                            alt="Cô gái và hoa"
                            width={400}
                            height={300}
                            className="rounded-lg shadow-lg w-full  object-cover"
                        />
                    </div>
                    <div className="w-full md:w-2/3">
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="order-1 md:order-none">
                                <label className="block text-gray-700 font-semibold mb-2">Họ *</label>
                                <input
                                    type="text"
                                    placeholder="Nhập họ..."
                                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-purple-500 focus:outline-purple-500"
                                />
                            </div>
                            <div className="order-2 md:order-none">
                                <label className="block text-gray-700 font-semibold mb-2">Tên *</label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên..."
                                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-purple-500 focus:outline-purple-500"
                                />
                            </div>
                            <div className="order-3 md:order-none">
                                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                                <input
                                    type="email"
                                    placeholder="Nhập email..."
                                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-purple-500 focus:outline-purple-500"
                                />
                            </div>
                            <div className="order-4 md:order-none">
                                <label className="block text-gray-700 font-semibold mb-2">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    placeholder="Nhập số điện thoại..."
                                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-purple-500 focus:outline-purple-500"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 order-5 md:order-none">
                                <label className="block text-gray-700 font-semibold mb-2">Chủ đề *</label>
                                <input
                                    type="text"
                                    placeholder="Nhập chủ đề..."
                                    className="w-full p-3 border border-gray-300 rounded-full focus:ring-purple-500 focus:outline-purple-500"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 order-6 md:order-none">
                                <label className="block text-gray-700 font-semibold mb-2">Nội dung tin nhắn *</label>
                                <textarea
                                    placeholder="Nhập nội dung..."
                                    className="w-full p-3 border border-gray-300 rounded-2xl h-20 md:h-28 focus:ring-purple-500 focus:outline-purple-500"
                                ></textarea>
                            </div>
                            <div className="order-6 md:order-none">
                                <button className="w-52 py-3.5 bg-purple-600 text-white rounded-full">
                                    Gửi tin nhắn
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="flex w-8/10 justify-center">
                    <div className="flex flex-wrap gap-8 justify-center w-full md:p-6 p-4 ">
                        <div className=" flex w-[250px] h-[200px] md:w-[350px] md:h-[280px] border-2 border-gray-200 rounded-3xl justify-center items-center">
                            <div className="flex-col text-center">
                                <div className=" flex w-14 h-14 md:w-18 md:h-18 bg-purple-500 rounded-full items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faLocationDot}
                                        className="md:text-4xl text-3xl text-white" />
                                </div>
                                <p className="font-semibold text-center text-2xl my-2">Địa chỉ</p>
                                <p className="px-8 text-center">Trường Đại học Công nghệ Thông tin</p>
                            </div>
                        </div>
                        <div className=" flex w-[250px] h-[200px] md:w-[350px] md:h-[280px] border-2 border-gray-200 rounded-3xl justify-center items-center">
                            <div className="flex-col text-center">
                                <div className=" flex w-14 h-14 md:w-18 md:h-18 bg-purple-500 rounded-full items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faPhone}
                                        className="md:text-4xl text-3xl text-white" />
                                </div>
                                <p className="font-semibold text-center text-2xl my-2">Điện thoại</p>
                                <p className="px-8 text-center">0987654321</p>
                            </div>
                        </div>
                        <div className=" flex w-[250px] h-[200px] md:w-[350px] md:h-[280px] border-2 border-gray-200 rounded-3xl justify-center items-center">
                            <div className="flex-col text-center">
                                <div className=" flex w-14 h-14 md:w-18 md:h-18 bg-purple-500 rounded-full items-center justify-center mx-auto mb-6">
                                    <FontAwesomeIcon icon={faEnvelope}
                                        className="md:text-4xl text-3xl text-white" />
                                </div>
                                <p className="font-semibold text-center text-2xl my-2">Email</p>
                                <p className="px-8 text-center">@gm.uit.edu.vn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#f7f7f7] py-16 px-4 md:px-20">
                <div className="px-4 md:px-20">
                    <p className="text-center text-2xl">Nhận Thông Báo</p>
                    <p className="font-semibold text-4xl text-center">Đăng Ký Nhận Bản Tin</p>
                    <p className="font-semibold text-4xl text-center">Để Cập Nhật  <span className="text-purple-500">Ưu Đãi Mới Nhất</span></p>
                </div>
                <p className="text-center text-gray-500 py-5">Giảm ngay 20% cho đơn hàng đầu tiên khi đăng ký bản tin</p>
                <div className="flex justify-center gap-5" >
                    <input type="text" placeholder="Nhập địa chỉ email"
                        className="bg-white pr-10 md:pr-30 pl-2 md:pl-5 py-3 md:py-4 rounded-full focus:ring-purple-500 focus:outline-purple-500" />
                    <button className="px-4 md:px-9 py-1 md:py-2 bg-purple-700 text-white rounded-full cursor-pointer">
                        Đăng ký
                    </button>
                </div>
            </div>
        </div>
    )
}
