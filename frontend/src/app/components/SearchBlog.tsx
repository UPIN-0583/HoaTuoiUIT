"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      <h4 className="text-xl font-semibold mb-2 border-l-3 border-l-purple-400 px-2">Tìm Kiếm</h4>
      <form onSubmit={handleSearch} className="relative flex justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-9/10 border border-gray-400 rounded-md py-2 px-4 pr-10 text-sm focus:ring-purple-500 focus:outline-purple-500"
        />
        <button type="submit">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute text-gray-700 hover:text-purple-500 duration-200 cursor-pointer right-13 top-1/2 z-10 -translate-y-2.5"
          />
        </button>
      </form>
    </div>
  );
}