"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHeart,
  faShoppingBag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faXTwitter,
  faPinterest,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { useEffect, useState } from "react";


const LogNavbar = () => {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 ">
      {/* Top Bar */}
      <div className="bg-purple-700  text-white text-sm text-center py-2 flex flex-col md:flex-row justify-between px-4 md:px-20">
        <span>Hotline: +123-456-789</span>
        <span className="mt-2 md:mt-0">
          <a href="#" className="underline">
            Đăng ký ngay
          </a>
          &nbsp;và nhận <strong>giảm giá 20%</strong> cho đơn hàng đầu tiên.
        </span>
        <div className="flex space-x-3 mt-2 md:mt-0 text-center justify-center">
          <a href="https://www.facebook.com/profile.php?id=61576797658604" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className="text-white" />
          </a>
          <a href="https://x.com/HoaTuoiUIT" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className="text-white" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faPinterest} className="text-white" />
          </a>
          <a
            href="https://www.instagram.com/hoatuoiuit/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-white" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto flex flex-row justify-between items-center py-4 px-4 md:px-20">
        <h1 className="text-xl font-bold text-purple-600">🌸Hoa Tươi UIT</h1>
        <nav className="hidden md:block">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-gray-700">
            <li>
              <Link href="/" className="hover:text-purple-500">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-purple-500">
                Sản phẩm
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-purple-500">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-purple-500">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-purple-500">
                Blogs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-row sm:flex-row  space-x-4 text-gray-700">
          {/* <div className="relative group hidden sm:block">
            <input type="text" placeholder="Search"
              className="absolute right-0 w-0 group-hover:w-[300px] transition-all duration-300 rounded-full group-hover:border group-hover:border-gray-500 px-3 focus:outline-none bg-white "
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-700 hover:text-purple-500 relative top-1/2 z-10 -translate-y-2.5 right-3 duration-200 cursor-pointer"
            />
          </div> */}
          <Link href="/search">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-700 hover:text-purple-500 text-xl"
            />
          </Link>
          <Link href="/wishlist">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-gray-700 hover:text-purple-500 text-xl"
            />
          </Link>
          <Link href="/cart">
            <FontAwesomeIcon
              icon={faShoppingBag}
              className="text-gray-700 hover:text-purple-500 text-xl"
            />
          </Link>
          <Link href="/myaccount">
            <FontAwesomeIcon
              icon={faUser}
              className="text-gray-700 hover:text-purple-500 text-xl"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

const GuestNavbar = () => {
  return (
    <header className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-purple-700 text-white text-sm text-center py-2 flex flex-col md:flex-row justify-between px-4 md:px-20">
        <span>Hotline: +123-456-789</span>
        <span className="mt-2 md:mt-0">
          <a href="#" className="underline">
            Đăng ký ngay
          </a>
          &nbsp;và nhận <strong>giảm giá 20%</strong> cho đơn hàng đầu tiên.
        </span>
        <div className="flex space-x-3 mt-2 md:mt-0 text-center justify-center">
          <a href="https://www.facebook.com/profile.php?id=61576797658604" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} className="text-white" />
          </a>
          <a href="https://x.com/HoaTuoiUIT" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className="text-white" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faPinterest} className="text-white" />
          </a>
          <a
            href="https://www.instagram.com/hoatuoiuit/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-white" />
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto flex flex-row justify-between items-center py-4 px-4 md:px-20">
        <h1 className="text-xl font-bold text-purple-600">🌸Hoa Tươi UIT</h1>
        <nav className="hidden md:block">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-gray-700">
            <li>
              <Link href="/" className="hover:text-purple-500">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-purple-500">
                Sản phẩm
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-purple-500 ">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-purple-500 ">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-purple-500 ">
                Blogs
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-row sm:flex-row  space-x-4 text-gray-700">
          <button className="px-3 py-2 bg-white text-purple-500 rounded-md cursor-pointer text-sm font-semibold border border-purple-500 hover:bg-purple-50">
            <Link href="/login">Đăng nhập</Link>
          </button>
          <button className="px-3 py-2 bg-purple-600 text-white rounded-md cursor-pointer text-sm font-semibold hover:bg-purple-700">
            <Link href="/signup">Đăng ký</Link>
          </button>
        </div>
      </div>
    </header>
  );
}

const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);

  const checkAndSetRole = () => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      try {
        const parsedRole = JSON.parse(storedRole);
        setRole(parsedRole);
      } catch (error) {
        console.error("Failed to parse permission", error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  };

  useEffect(() => {
    checkAndSetRole();

    const handleStorageChange = () => {
      checkAndSetRole();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (role === "USER") return <LogNavbar />;
  return <GuestNavbar />;
};

export default Navbar;
