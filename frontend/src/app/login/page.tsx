'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/Logo.png";
import { CiUser, CiLock } from "react-icons/ci";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleClick = () => {
        if (!email) {
            toast.warning('Vui lòng nhập email!');
            return;
        }
        if (!password) {
            toast.warning('Vui lòng nhập mật khẩu!');
            return;
        }

        axios.post(`${API_BASE_URL}/api/customers/login`, {
            email: email,
            password: password
        }).then((res) => {
            if (!res.data.token) {
                localStorage.clear();
                toast.error('Sai email hoặc mật khẩu!');
            } else {
                toast.success('Đăng nhập thành công!');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('id', JSON.stringify(res.data.id));
                localStorage.setItem('role', JSON.stringify(res.data.role));

                window.dispatchEvent(new Event('storage'));

                window.location.href = '/';
            }
        }).catch((err) => {
            console.error(err);
            toast.error('Đã xảy ra lỗi trong quá trình đăng nhập.');
        });
    };


    return (
        <div>
            <div className="mx-10 my-10  rounded-sm border border-stroke shadow-default">
                <div className="flex md:flex-row items-center">
                    <div className="hidden w-full md:block xl:w-1/2">
                        <div className="px-10 py-10 text-center">
                            <Link href="/" className="mb-5.5 inline-block">
                                <Image src={logo} alt="Logo" width={300} />
                            </Link>
                            <h1 className="text-purple-600 text-4xl font-bold">Hoa Tươi UIT</h1>
                            <p className="text-2xl font-medium">
                                Hoa của sự tinh túy
                            </p>
                        </div>
                    </div>

                    <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
                                Đăng nhập ngay
                            </h2>

                            <div>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black">Email</label>
                                    <div className="relative">
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="text"
                                            placeholder="Nhập email"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-16 pr-10 text-black outline-none focus:border-primary"
                                        />
                                        <span className="absolute left-4 top-3">
                                            <CiUser size={32} />
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block font-medium text-black">Mật khẩu</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Nhập mật khẩu"
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-16 pr-10 text-black outline-none focus:border-primary"
                                        />
                                        <span className="absolute left-4 top-3">
                                            <CiLock size={32} />
                                        </span>
                                        {password && (
                                            <span
                                                className="absolute right-4 top-3 cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <FaRegEye size={24} /> : <FaRegEyeSlash size={24} />}
                                            </span>
                                        )}
                                        <div className="mt-4 text-right mr-4">
                                            <p>
                                                Quên mật khẩu?{" "}
                                                <Link href="/forgetpassword" className="text-purple-600 hover:text-purple-800">
                                                    Lấy lại mật khẩu
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <button
                                        onClick={handleClick}
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-purple-500 p-4 text-white transition hover:bg-purple-600"
                                    >
                                        Đăng nhập
                                    </button>
                                </div>

                                <div className="mt-6 text-center">
                                    <p>
                                        Chưa có tài khoản?{" "}
                                        <Link href="/signup" className="text-purple-600 hover:text-purple-800">
                                            Đăng ký ngay
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

export default Login;
