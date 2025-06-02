'use client'
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import logo from "../../../public/Logo.png";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

const ForgotPassowrd = () => {
    const router = useRouter();

    const [email, setEmail] = useState("")
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";

    const handleClick = () => {
        if (!email) {
            toast.error("Vui lòng nhập email");
            return;
        }
        if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            toast.error("Email không hợp lệ");
            return;
        }
        console.log('data', email);


        axios.post(`${API_BASE_URL}/api/forgotpass`,
            {
                user_email: email
            },
        )
            .then((res) => {
                if (res.data.success === false) {
                    toast.error("Email chưa đăng ký");
                }
                else {
                    toast.success("Xác nhận yêu cầu lấy lại mật khẩu thành công. Xin hãy kiểm tra mail gửi về!");
                    router.push("/confirmpassword")
                }
            })
            .catch(err => {
                console.log(err)
                console.log(email)
            })

    }


    return (
        <div>

            <div className="mt-5 mb-10 rounded-sm border border-strokeshadow-default ">
                <div className="flex  md:flex-row items-center">
                    <div className="hidden w-full md:block xl:w-1/2">
                        <div className="px-26 py-17.5 text-center">
                            <Link href="/" className="mb-5.5 inline-block">
                                <Image src={logo} alt="Logo" width={300} />
                            </Link>
                            <h1 className="text-purple-600 text-4xl font-bold">Hoa Tươi UIT</h1>
                            <p className="text-2xl font-medium">
                                Hoa của sự tinh túy
                            </p>
                        </div>
                    </div>

                    <div className="w-full border-stroke  xl:w-1/2 xl:border-l-2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <h2 className="mb-9 text-2xl font-bold text-black  sm:text-title-xl2">
                                Lấy lại mật khẩu
                            </h2>

                            <div>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black ">
                                        Email
                                    </label>
                                    <div className="relative">
                                        {/* <CiUser size={40} /> */}
                                        <input
                                            type="text"
                                            placeholder="Nhập email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-16 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none "
                                        />
                                        <span className="absolute left-4 top-3">
                                            <CiMail size={32} />
                                        </span>
                                    </div>
                                </div>



                                <div className="mb-5">
                                    <button
                                        onClick={handleClick}
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-purple-500 p-4 text-white transition hover:bg-purple-600">
                                        Lấy lại mật khẩu
                                    </button>

                                </div>

                                <div className="mt-6 text-center">
                                    <p>
                                        Hoặc{" "}
                                        <Link
                                            href={"/login"}
                                            className="text-purple-500 hover:text-purple-800"
                                        >
                                            Đăng nhập ngay
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassowrd;
