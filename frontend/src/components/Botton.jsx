import React from "react";

export  function Button({
    children,
    type = "button",
    bgColor = "bg-purple-400",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}