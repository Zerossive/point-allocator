import React from "react";

export default function Button(props) {
    const {
        background,
        color,
        height,
        width,
        onClick,
        hoverBackground,
        hoverColor,
    } = props;

    return (
        <button
            className='rounded-md px-2 py-1 flex justify-evenly items-center transition-all duration-300 transform hover:scale-110 text-white bg-gray-800 dark:bg-gray-600'
            aria-label={`${background} button`}
            style={{
                background: `${background}`,
                color: `${color}`,
                height: `${height ? height : "auto"}`,
                width: `${width ? width : "auto"}`,
            }}
            onMouseEnter={(ele) => {
                ele.target.style.background = `${hoverBackground}`;
                ele.target.style.color = `${hoverColor}`;
            }}
            onMouseLeave={(ele) => {
                ele.target.style.background = `${background || ""}`;
                ele.target.style.color = `${color || ""}`;
            }}
            onClick={onClick}
        >
            {props.children}
        </button>
    );
}
