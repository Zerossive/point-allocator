import { React, useState } from "react";
import Button from "./Button";
import { FaPlus, FaMinus, FaTimes, FaCog, FaTrash } from "react-icons/fa";
import { useGlobalContext } from "../context";
import { HslStringColorPicker } from "react-colorful";

export default function Stat({ data }) {
    const { stats, setStats } = useGlobalContext();

    const {
        title,
        category,
        description,
        allocatedPoints,
        maxPoints,
        minPoints,
        color,
        imageUrl,
        numberColor,
        id,
    } = data;
    const progress =
        ((allocatedPoints - minPoints) / (maxPoints - minPoints)) * 100;

    const [showExtras, setShowExtras] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handlePrimaryColor = (color) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], color: color },
        }));
    };
    const handleNumberColor = (color) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], numberColor: color },
        }));
    };
    const handleTitle = (text) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], title: text.target.value },
        }));
    };
    const handleDescription = (text) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], description: text.target.value },
        }));
    };
    const handleCategory = (event) => {
        if (event.key === "Enter") {
            let newCategory = event.target.value;
            newCategory === "" && (newCategory = category);

            setStats((prevState) => ({
                ...prevState,
                [id]: { ...prevState[id], category: newCategory },
            }));
        }
    };
    const handleBackground = (event) => {
        if (event.key === "Enter") {
            setStats((prevState) => ({
                ...prevState,
                [id]: { ...prevState[id], imageUrl: event.target.value },
            }));
            setIsEditing(false);
        }
    };
    const handleMin = (text) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], minPoints: text.target.value },
        }));
    };
    const handleMax = (text) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], maxPoints: text.target.value },
        }));
    };
    const handleCurrent = (text) => {
        setStats((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], allocatedPoints: text.target.value },
        }));
    };

    const handleDelete = () => {
        let tempStatList = { ...stats };
        delete tempStatList[id];
        setStats(tempStatList);
    };
    const handleAdd = () => {
        if (maxPoints - allocatedPoints >= 1) {
            setStats((prevState) => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    allocatedPoints: parseInt(allocatedPoints) + 1,
                },
            }));
            console.log("+1 to", title, "with id:", id);
        } else {
            console.log(title, "is already at the maximum");
        }
    };

    const handleSubtract = () => {
        if (allocatedPoints - minPoints >= 1) {
            setStats((prevState) => ({
                ...prevState,
                [id]: {
                    ...prevState[id],
                    allocatedPoints: parseInt(allocatedPoints) - 1,
                },
            }));
            console.log("-1 to", title, "with id:", id);
        } else {
            console.log(title, "is already at the minimum");
        }
    };

    return (
        <>
            <article className='md:hidden'>
                <h2 className='text-xl text-center font-bold'>{title}</h2>
            </article>
            <div
                className='w-full my-5 flex'
                onMouseEnter={() => setShowExtras(true)}
                onMouseLeave={() => setShowExtras(false)}
            >
                {/* Left */}
                <div
                    className='flex-none bg-gray-800 dark:bg-gray-600 h-20 w-20 rounded-2xl rounded-tr-none text-white text-center flex flex-col justify-center bg-center bg-contain bg-no-repeat'
                    style={{
                        backgroundColor: color,
                        backgroundImage: `url(${imageUrl})`,
                        border: `5px solid ${color}`,
                    }}
                >
                    <span
                        className='text-4xl font-bold filter drop-shadow'
                        style={{ color: numberColor }}
                    >
                        {allocatedPoints}
                    </span>
                    <span className='font-bold' style={{ color: numberColor }}>
                        / {maxPoints}
                    </span>
                </div>
                {/* Right */}
                <div className='flex-grow h-auto flex flex-col relative'>
                    {/* Progress Bar */}
                    <div className='w-full top-0 bg-gray-300 dark:bg-gray-800 h-3 rounded-2xl rounded-l-none'></div>
                    <div
                        className='absolute top-0 h-3 rounded-2xl rounded-l-none transition-all duration-500'
                        style={{
                            background: color,
                            width: progress + "%",
                            maxWidth: "100%",
                        }}
                    ></div>
                    {/* Content */}
                    <div className='w-full flex flex-grow items-center justify-end relative'>
                        {/* Corner Curve */}
                        <svg
                            style={{
                                width: `20px`,
                                position: "absolute",
                                top: "0",
                                left: `0`,
                            }}
                            viewBox='0 0 100 100'
                        >
                            <path
                                d='M 100 0 Q 0 0,0 100 T 0 0,100 0'
                                className={`transition-all duration-500 transform ${
                                    progress > 5 ? "scale-x-100" : "scale-x-0"
                                }`}
                                style={{
                                    fill: color,
                                }}
                            />
                        </svg>
                        {/* Content */}
                        <span className='font-bold p-2 px-5 text-xl hidden md:inline'>
                            {title}
                        </span>
                        <span className='hidden lg:inline flex-grow p-2 px-5'>
                            {description}
                        </span>
                        <span className='p-2 flex justify-end'>
                            {/* Delete point btn */}
                            <div
                                className={`px-1 ${
                                    !showExtras
                                        ? "visible md:invisible scale-100 md:scale-0"
                                        : "scale-100"
                                } transition-all transform duration-500`}
                            >
                                <Button
                                    width='40px'
                                    height='40px'
                                    hoverBackground='hsl(0,80%,70%)'
                                    hoverColor='hsl(0,100%,100%)'
                                    onClick={handleDelete}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                            {/* Edit point btn */}
                            <div
                                className={`px-1 ${
                                    !showExtras
                                        ? "visible md:invisible scale-100 md:scale-0"
                                        : "scale-100"
                                } transition-all transform duration-500`}
                            >
                                <Button
                                    width='40px'
                                    height='40px'
                                    onClick={() => setIsEditing(true)}
                                >
                                    <FaCog />
                                </Button>
                            </div>
                            {/* Subtract point btn */}
                            <div className='px-1'>
                                <Button
                                    width='40px'
                                    height='40px'
                                    onClick={handleSubtract}
                                >
                                    <FaMinus />
                                </Button>
                            </div>
                            {/* Add point btn */}
                            <div className='px-1'>
                                <Button
                                    background={color}
                                    color={numberColor}
                                    width='40px'
                                    height='40px'
                                    onClick={handleAdd}
                                >
                                    <FaPlus />
                                </Button>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
            <article className='lg:hidden'>
                <p className='pb-5'>{description}</p>
            </article>
            {isEditing && (
                <div className='w-full h-full fixed top-0 left-0 z-50 backdrop-filter backdrop-blur-2xl overflow-y-scroll bg-gray-200 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50'>
                    <div className='fixed top-24 left-1/2 bg-white shadow-xl border dark:bg-gray-900 transform -translate-x-1/2 rounded-2xl flex flex-wrap justify-center w-10/12 md:w-auto'>
                        {/* Primary Color */}
                        <div className='flex flex-col items-center p-5 w-48'>
                            <span className='pb-2 font-bold'>
                                Primary Color
                            </span>
                            <HslStringColorPicker
                                color={color}
                                onChange={handlePrimaryColor}
                                style={{ width: "100%" }}
                            />
                        </div>
                        {/* Text Color */}
                        <div className='flex flex-col items-center p-5 w-48'>
                            <span className='pb-2 font-bold'>Number Color</span>
                            <HslStringColorPicker
                                color={numberColor}
                                onChange={handleNumberColor}
                                style={{ width: "100%" }}
                            />
                        </div>
                        {/* Details */}
                        <div className='flex flex-col items-center p-5'>
                            <span className='pb-2 font-bold'>Details</span>
                            {/* Title */}
                            <input
                                className='text-black border w-full p-1 rounded-md mb-5'
                                type='text'
                                placeholder='Title'
                                value={title}
                                onChange={handleTitle}
                                autoFocus
                            />
                            {/* Description */}
                            <input
                                className='text-black border w-full p-1 rounded-md mb-5'
                                type='text'
                                value={description}
                                onChange={handleDescription}
                                placeholder='Description (optional)'
                            />
                            {/* Description */}
                            <input
                                className='text-black border w-full p-1 rounded-md mb-5'
                                type='text'
                                onKeyDown={handleCategory}
                                placeholder={`${category} (press ENTER to apply changes)`}
                            />
                            {/* Image */}
                            <input
                                className='text-black border w-full p-1 rounded-md'
                                type='text'
                                onKeyDown={handleBackground}
                                placeholder={`Image URL (press ENTER to apply changes)`}
                            />
                            {/* Stat Ranges */}
                            <div className='w-full text-black mt-5 flex'>
                                {/* Min */}
                                <div className='w-1/2 pr-2 flex flex-col items-center'>
                                    <span className='text-white'>Min</span>
                                    <input
                                        className='text-black border w-full p-1 rounded-md text-center'
                                        type='number'
                                        value={minPoints}
                                        onChange={handleMin}
                                        placeholder='0'
                                    />
                                </div>
                                {/* Max */}
                                <div className='w-1/2 pl-2 flex flex-col items-center'>
                                    <span className='text-white'>Max</span>
                                    <input
                                        className='text-black border w-full p-1 rounded-md text-center'
                                        type='number'
                                        value={maxPoints}
                                        onChange={handleMax}
                                        placeholder='10'
                                    />
                                </div>
                            </div>
                            {/* Current */}
                            <div className='w-full flex flex-col items-center'>
                                <span className='text-white pt-2'>Current</span>
                                <input
                                    className='text-black border w-full p-1 rounded-md text-center'
                                    type='number'
                                    value={allocatedPoints}
                                    onChange={handleCurrent}
                                    placeholder='5'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='p-5 fixed top-0 right-0'>
                        <Button
                            background='hsl(0,50%,50%)'
                            height='50px'
                            width='50px'
                            onClick={() => setIsEditing(false)}
                        >
                            <FaTimes className='h-full w-full p-1' />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
