"use client";

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();

  // Logic hiển thị các trang (giữ nguyên từ code của bạn)
  const visiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`/blog?page=${page}`); // Cập nhật URL với page mới
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-gray-500 hover:text-black disabled:opacity-40"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      {visiblePages().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => handlePageChange(Number(page))}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              currentPage === page ? "bg-purple-700 text-white" : "hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-gray-500 hover:text-black disabled:opacity-40"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>
  );
};

export default Pagination;