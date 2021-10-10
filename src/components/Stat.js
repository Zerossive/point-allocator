import { React, useState, useEffect } from "react";
import Button from "./Button";
import {
    FaPlus,
    FaMinus,
    FaTimes,
    FaCog,
    FaTrash,
    FaCheck,
} from "react-icons/fa";
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

    // Primary editing
    const [showExtras, setShowExtras] = useState(false);
    const [editTitle, setEditTitle] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editCurrent, setEditCurrent] = useState(false);
    const [editMax, setEditMax] = useState(false);
    // Secondary editing
    const [isEditing, setIsEditing] = useState(false);
    const [tempPrimaryColor, setTempPrimaryColor] = useState("");
    const [tempNumberColor, setTempNumberColor] = useState("");
    const [tempCategory, setTempCategory] = useState("");
    const [tempImage, setTempImage] = useState("");
    const [tempMin, setTempMin] = useState("");

    // Primary stat handlers
    const handleEditTitle = (event) => {
        const key = event.key;
        if (key === "Enter") {
            let text = event.target.value;
            if (!text) text = "---";
            setStats((prevState) => ({
                ...prevState,
                [id]: { ...prevState[id], title: text },
            }));
            setEditTitle(false);
        }
    };
    const handleEditDescription = (event) => {
        const key = event.key;
        if (key === "Enter") {
            let text = event.target.value;
            if (!text) text = "---";
            setStats((prevState) => ({
                ...prevState,
                [id]: { ...prevState[id], description: text },
            }));
            setEditDescription(false);
        }
    };
    const handleEditCurrent = (event) => {
        const key = event.key;
        if (key === "Enter") {
            let text = event.target.value;
            if (text < minPoints) text = minPoints;
            if (text > maxPoints) text = maxPoints;
            setStats((prevState) => ({
                ...prevState,
                [id]: { ...prevState[id], allocatedPoints: text },
            }));
            setEditCurrent(false);
        }
    };
    const handleEditMax = (event) => {
        const key = event.key;
        if (key === "Enter") {
            let text = event.target.value;
            if (text < minPoints) text = minPoints;
            setStats((prevState) => ({
                ...prevState,
                [id]: { ...prevState[id], maxPoints: text },
            }));
            if (allocatedPoints > text) {
                setStats((prevState) => ({
                    ...prevState,
                    [id]: { ...prevState[id], allocatedPoints: text },
                }));
            }
            setEditMax(false);
        }
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
    // Secondary stat handlers
    const handlePrimaryColor = (newColor) => {
        newColor === "" && (newColor = color);
        setTempPrimaryColor(newColor);
    };
    const handleNumberColor = (newColor) => {
        newColor === "" && (newColor = numberColor);
        setTempNumberColor(newColor);
    };
    const handleCategory = (event) => {
        let text = event.target.value;
        text === "" && (text = category);
        setTempCategory(text);
    };
    const handleBackground = (event) => {
        let text = event.target.value;
        text === "" && (text = imageUrl);
        setTempImage(text);
    };
    const handleMin = (event) => {
        let text = event.target.value;
        text === "" && (text = minPoints);
        text > allocatedPoints && (text = allocatedPoints);
        setTempMin(text);
    };
    const handleSubmitEdit = () => {
        setStats((prevState) => ({
            ...prevState,
            [id]: {
                ...prevState[id],
                color: tempPrimaryColor,
                numberColor: tempNumberColor,
                category: tempCategory,
                imageUrl: tempImage,
                minPoints: tempMin,
            },
        }));
        setIsEditing(false);
        console.log("Submitted Changes");
    };
    // Reset temp values on closing the edit menu
    useEffect(() => {
        if (!isEditing) {
            setTempPrimaryColor(color);
            setTempNumberColor(numberColor);
            setTempCategory(category);
            setTempImage(imageUrl);
            setTempMin(minPoints);
        }
    }, [isEditing, color, numberColor, category, imageUrl, minPoints]);

    return (
        <>
            {/* Title (mobile) */}
            <article className='md:hidden'>
                {!editTitle && (
                    <h2
                        className='text-xl text-center font-bold cursor-pointer'
                        onClick={() => setEditTitle(true)}
                    >
                        {title}
                    </h2>
                )}
                {editTitle && (
                    <input
                        type='text'
                        className='text-xl text-center font-bold w-full rounded-lg bg-transparent'
                        placeholder={title}
                        autoFocus
                        onKeyUp={handleEditTitle}
                        onBlur={() => setEditTitle(false)}
                    />
                )}
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
                    {!editCurrent && (
                        <span
                            className='text-4xl font-bold filter drop-shadow cursor-pointer'
                            style={{ color: numberColor }}
                            onClick={() => setEditCurrent(true)}
                        >
                            {allocatedPoints}
                        </span>
                    )}
                    {editCurrent && (
                        <input
                            type='number'
                            className='text-4xl text-center font-bold filter drop-shadow rounded-lg bg-transparent'
                            placeholder={allocatedPoints}
                            autoFocus
                            onKeyUp={handleEditCurrent}
                            onBlur={() => setEditCurrent(false)}
                        />
                    )}
                    {!editMax && (
                        <span
                            className='font-bold cursor-pointer'
                            style={{ color: numberColor }}
                            onClick={() => setEditMax(true)}
                        >
                            / {maxPoints}
                        </span>
                    )}
                    {editMax && (
                        <input
                            type='number'
                            className='text-center font-bold rounded-lg bg-transparent'
                            placeholder={maxPoints}
                            autoFocus
                            onKeyUp={handleEditMax}
                            onBlur={() => setEditMax(false)}
                        />
                    )}
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
                        {/* Title */}
                        {!editTitle && (
                            <span
                                className='font-bold p-2 px-5 text-xl hidden md:inline cursor-pointer flex-grow'
                                onClick={() => setEditTitle(true)}
                            >
                                {title}
                            </span>
                        )}
                        {editTitle && (
                            <input
                                type='text'
                                className='font-bold p-1 ml-5 text-xl hidden md:inline rounded-lg bg-transparent flex-grow'
                                placeholder={title}
                                autoFocus
                                onKeyUp={handleEditTitle}
                                onBlur={() => setEditTitle(false)}
                            />
                        )}
                        {/* Description */}
                        {!editDescription && (
                            <span
                                className='hidden lg:inline flex-grow p-2 px-5 cursor-pointer'
                                onClick={() => setEditDescription(true)}
                            >
                                {description}
                            </span>
                        )}
                        {editDescription && (
                            <input
                                type='text'
                                className='hidden lg:inline flex-grow p-2 mx-5 rounded-lg bg-transparent'
                                placeholder={description}
                                autoFocus
                                onKeyUp={handleEditDescription}
                                onBlur={() => setEditDescription(false)}
                            />
                        )}
                        {/* Buttons */}
                        <span className='p-2 flex justify-end'>
                            {/* Delete point btn */}
                            <div
                                className={`px-1 ${
                                    !showExtras
                                        ? "visible xl:invisible scale-100 xl:scale-0"
                                        : "scale-100"
                                } transition-all transform duration-500`}
                            >
                                <Button
                                    width='40px'
                                    height='40px'
                                    background='hsl(0,100%,70%)'
                                    onClick={handleDelete}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                            {/* Edit point btn */}
                            <div
                                className={`${
                                    !showExtras
                                        ? "visible xl:invisible scale-100 xl:scale-0"
                                        : "scale-100"
                                } px-1 transition-all transform duration-500`}
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
                {!editDescription && (
                    <p
                        className='pb-5 cursor-pointer'
                        onClick={() => setEditDescription(true)}
                    >
                        {description}
                    </p>
                )}
                {editDescription && (
                    <input
                        type='text'
                        className='mb-5 p-1 w-full rounded-lg bg-transparent'
                        placeholder={description}
                        autoFocus
                        onKeyUp={handleEditDescription}
                        onBlur={() => setEditDescription(false)}
                    />
                )}
            </article>
            {/* Edit menu */}
            {isEditing && (
                <>
                    <div className='w-full h-full fixed top-0 left-0 z-50 backdrop-filter backdrop-blur-2xl overflow-y-scroll bg-gray-200 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50'>
                        <div className='fixed top-24 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center w-10/12 md:w-auto'>
                            {/* Primary Color */}
                            <div className='flex flex-col items-center p-5'>
                                <span className='pb-2 font-bold'>
                                    Primary Color
                                </span>
                                <HslStringColorPicker
                                    color={color}
                                    onChange={handlePrimaryColor}
                                />
                            </div>
                            {/* Text Color */}
                            <div className='flex flex-col items-center p-5'>
                                <span className='pb-2 font-bold'>
                                    Number Color
                                </span>
                                <HslStringColorPicker
                                    color={numberColor}
                                    onChange={handleNumberColor}
                                />
                            </div>
                            {/* Details */}
                            <div className='flex flex-col items-center p-5'>
                                {/* Category */}
                                <div className='w-full text-center pt-5'>
                                    <p>Category</p>
                                    <input
                                        className='text-black border w-full p-1 rounded-lg'
                                        type='text'
                                        onKeyUp={handleCategory}
                                        placeholder={category}
                                    />
                                </div>
                                {/* Image */}
                                <div className='w-full text-center pt-5'>
                                    <p>Background Image URL</p>
                                    <input
                                        className='text-black border w-full p-1 rounded-lg'
                                        type='text'
                                        onKeyUp={handleBackground}
                                        placeholder={imageUrl}
                                    />
                                </div>
                                {/* Min */}
                                <div className='w-full text-center pt-5'>
                                    <p>Minimum Stat Value</p>
                                    <input
                                        className='text-black border w-full p-1 rounded-lg text-center'
                                        type='number'
                                        placeholder={minPoints}
                                        onChange={handleMin}
                                    />
                                </div>
                            </div>
                            <div className='w-full p-5 mb-8 flex justify-center'>
                                <Button
                                    // width='auto'
                                    height='50px'
                                    // background='hsl(220,50%,50%)'
                                    background={tempPrimaryColor}
                                    color={tempNumberColor}
                                    onClick={handleSubmitEdit}
                                >
                                    <FaCheck className='px-5 w-max' />
                                    <span className='pr-5 font-bold'>
                                        SUBMIT CHANGES
                                    </span>
                                </Button>
                            </div>
                        </div>
                        {/* Close edit btn */}
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
                </>
            )}
        </>
    );
}
