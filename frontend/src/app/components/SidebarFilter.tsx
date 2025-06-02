// import { Range } from "react-range";

import Link from "next/link";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backendhoatuoiuit.onrender.com";


async function getOccasions() {
  const res = await fetch(`${API_BASE_URL}/api/occasions`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function getFlowers() {
  const res = await fetch(`${API_BASE_URL}/api/flowers`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

const flowers = await getFlowers();
const occasions = await getOccasions();


interface SidebarFilterProps {
  selectedFlowers: string[];
  selectedOccasions: string[];
  priceRange: number[];
}

export default function SidebarFilter({
  selectedFlowers,
  selectedOccasions,
  priceRange,
}: SidebarFilterProps) {
  return (
    <form
      className="w-full p-4 md:p-6 max-[480px]:p-2 h-fit bg-white shadow rounded-lg text-black"
      method="get"
    >
      <h2 className="font-semibold text-2xl md:text-2xl max-[480px]:text-xl my-4">Bộ lọc</h2>

      <h3 className="font-semibold mt-6 mb-2">Theo loại hoa</h3>
      {flowers.map((c) => (
        <label key={c.id} className="block">
          <input
            type="checkbox"
            className="mr-2 w-4 h-4 max-[480px]:w-3 max-[480px]:h-3"
            name="flowerType"
            value={c.name}
            defaultChecked={selectedFlowers.includes(c.name)}
            aria-label={`Filter by ${c.name}`}
          />
          {c.name}
        </label>
      ))}

      <h3 className="font-semibold mt-6 mb-2">Theo sự kiện</h3>
      {occasions.map((o) => (
        <label key={o.id} className="block">
          <input
            type="checkbox"
            className="mr-2 w-4 h-4 max-[480px]:w-3 max-[480px]:h-3"
            name="occasion"
            value={o.name}
            defaultChecked={selectedOccasions.includes(o.name)}
            aria-label={`Filter by ${o.name}`}
          />
          {o.name}
        </label>
      ))}

      <h3 className="font-semibold mt-6 mb-2">Theo giá</h3>
      <div className="mb-4 flex gap-2 items-center">
        <label className="flex-1">
          <span className="text-sm block">Tối thiểu</span>
          <input
            type="number"
            name="priceMin"
            min={0}
            max={priceRange[1]}
            defaultValue={priceRange[0]}
            className="w-full border rounded p-1"
          />
        </label>
        <label className="flex-1">
          <span className="text-sm block">Tối đa</span>
          <input
            type="number"
            name="priceMax"
            min={priceRange[0]}
            max={10000000}
            defaultValue={priceRange[1]}
            className="w-full border rounded p-1"
          />
        </label>
      </div>
      <div className="flex gap-4 justify-center mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Lọc
        </button>

        <Link
          href="/products"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Xóa lọc
        </Link>
      </div>
    </form>
  );
}