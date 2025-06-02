"use client";
import Image from 'next/image';
import TagLabel from './TagLabel';
import Link from 'next/link';

interface BlogCardProps {
  imageSrc: string;
  tag: string;
  author: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
}

export default function BlogCard({
  imageSrc,
  tag,
  author,
  date,
  title,
  excerpt,
  href,
}: BlogCardProps) {
  return (
    <Link href={href} className="block">
    <div className="rounded-3xl relative shadow-md ">
      <div className="relative">
          <Image
              src={imageSrc}
              alt={title}
              width={800}
              height={600}
              className="object-cover w-full h-[230px] sm:h-[250px] md:h-[300px] rounded-3xl"
          />
          <div className="absolute bottom-3 -left-4 z-10">
              <TagLabel text={tag} />
          </div>
      </div>
      <div className="p-4 sm:p-6">
          <p className="text-xl md:text-sm text-gray-500">
            {author} &nbsp;<span className="text-purple-400 text-xl">●</span>&nbsp; 
            {new Date(date).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <h3 className="text-lg sm:text-xl font-semibold mt-2 mb-3">
              {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
              {excerpt}
          </p>
          <p className="text-purple-600 font-medium hover:underline text-sm">
              Xem thêm
          </p>
      </div>
    </div>
   </Link>
  );
}