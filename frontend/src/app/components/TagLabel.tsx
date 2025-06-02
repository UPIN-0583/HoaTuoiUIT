import React from "react";

interface TagLabelProps {
    text: string;
}

const TagLabel: React.FC<TagLabelProps> = ({ text }) => {
    return (
        <div className="relative inline-block">
            <div className="absolute -top-4 left-0 w-4 h-4 bg-purple-800 clip-triangle rotate-180" />
            <div className="bg-purple-700 text-white px-4 py-1 rounded-b-md rounded-r-md font-medium shadow-md">
                {text}
            </div>
        </div>
    );
};

export default TagLabel;
