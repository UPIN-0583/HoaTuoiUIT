import Image from "next/image";
import React from "react";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface FeedbackCardProps {
    rating: number;
    title: string;
    content: string;
    name: string;
    role: string;
    image: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ rating, title, content, name, role, image }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
            <div className="flex items-center mb-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                        key={i}
                        icon={faStar}
                        className={i < rating ? "text-yellow-500" : "text-gray-300"}
                    />
                ))}
                <span className="text-black ml-2">{rating.toFixed(1)}</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-gray-600 text-sm mb-4">{content}</p>
            <div className="flex items-center">
                <Image
                    src={image}
                    alt={name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                    width={100}
                    height={100}
                />
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-gray-500 text-sm">{role}</p>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCard;
