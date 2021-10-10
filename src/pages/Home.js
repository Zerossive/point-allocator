import { React, useState } from "react";
import { useGlobalContext } from "../context";
import Category from "../components/Category";
import Stat from "../components/Stat";
import Button from "../components/Button";
import {
    FaCog,
    FaMoon,
    FaStream,
    FaTimes,
    FaDownload,
    FaUpload,
} from "react-icons/fa";
import { defaultData } from "../data";

export default function Home() {
    const {
        categories,
        stats,
        setStats,
        darkMode,
        setDarkMode,
        settings,
        setSettings,
    } = useGlobalContext();

    const [showSettings, setShowSettings] = useState(false);

    const handleNewCategory = () => {
        const newId = new Date().getTime();
        setStats((prevState) => ({
            ...prevState,
            [newId]: {
                category: `New Category (${newId})`,
                title: "New Stat",
                description: "Description",
                minPoints: 0,
                allocatedPoints: 5,
                maxPoints: 10,
                imageUrl: "",
                color: "hsl(220,50%,50%)",
                numberColor: "hsl(0,100%,100%)",
                id: newId,
            },
        }));
    };

    const handleReset = () => {
        setStats(defaultData.stats);
        setShowSettings(false);
        console.log("Data Reset to Default Values");
    };

    const handleDownload = () => {
        let dlData = { settings: settings, stats: stats };
        setShowSettings(false);
        console.log("Downloaded:", dlData);
    };

    const handleUpload = (event) => {
        let file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = onReaderLoad;
            reader.readAsText(file);
            setShowSettings(false);
        }
    };

    // Update current dataset on upload
    const onReaderLoad = (event) => {
        const uploadedData = JSON.parse(event.target.result);

        if (
            uploadedData &&
            uploadedData.settings &&
            uploadedData.settings.version >= defaultData.settings.version
        ) {
            setStats(uploadedData.stats);
            setSettings(uploadedData.settings);
            console.log("Uploaded:", uploadedData);
        } else {
            console.log("Data is outdated or incorrectly formatted");
        }
    };

    return (
        <main
            className={`${
                darkMode ? "dark text-white" : ""
            } max-w-full overflow-hidden`}
        >
            <div className='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500'>
                <div
                    className='flex flex-col md:flex-row w-full'
                    style={{ maxWidth: "100%" }}
                >
                    {/* Left */}
                    <div className='flex-grow order-2 md:order-1 flex flex-wrap'>
                        {/* Categories */}
                        {categories.map((category, index) => {
                            return (
                                <Category title={category} key={index}>
                                    {/* Stats */}
                                    {Object.keys(stats).map((key, index) => {
                                        if (stats[key].category === category) {
                                            return (
                                                <Stat
                                                    data={stats[key]}
                                                    key={index}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                                </Category>
                            );
                        })}
                        {/* New category btn */}
                        <div className='p-5 w-full md:w-1/2 min-w-min flex justify-center'>
                            <Button
                                width='auto'
                                height='50px'
                                onClick={handleNewCategory}
                            >
                                <FaStream className='px-5 w-max' />
                                <span className='pr-5 font-bold'>
                                    NEW CATEGORY
                                </span>
                            </Button>
                        </div>
                    </div>
                    {/* Right */}
                    <div className='flex-none p-5 order-1 md:order-2 flex flex-row-reverse md:flex-col'>
                        {/* Settings btn */}
                        <div className='pl-5 md:pl-0 md:pb-5'>
                            <Button
                                height='50px'
                                width='50px'
                                onClick={() => setShowSettings(true)}
                            >
                                <FaCog className='h-full w-full p-1' />
                            </Button>
                        </div>
                        {/* Dark mode toggle btn */}
                        <div className='pl-5 md:pl-0 md:pb-5'>
                            <Button
                                height='50px'
                                width='50px'
                                onClick={() => setDarkMode(!darkMode)}
                            >
                                <FaMoon className='h-full w-full p-1' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {showSettings && (
                <>
                    {/* Blur */}
                    <div className='fixed top-0 left-0 w-full h-full backdrop-filter backdrop-blur-2xl transition-all duration-500 bg-gray-200 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50'>
                        {/* Close settings */}
                        <div className='p-5 fixed top-0 right-0'>
                            <Button
                                background='hsl(0,50%,50%)'
                                height='50px'
                                width='50px'
                                onClick={() => setShowSettings(false)}
                            >
                                <FaTimes className='h-full w-full p-1' />
                            </Button>
                        </div>
                        {/* Settings */}
                        <div className='p-5 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-max flex flex-col items-center'>
                            {/* Reset btn */}
                            <div className='p-5'>
                                <Button
                                    background='hsl(0,50%,50%)'
                                    height='50px'
                                    onClick={handleReset}
                                >
                                    <FaTimes className='px-5 w-max' />
                                    <span className='pr-5 font-bold'>
                                        RESET
                                    </span>
                                </Button>
                            </div>
                            {/* Download btn */}
                            <div className='p-5'>
                                <a
                                    onClick={handleDownload}
                                    href={
                                        "data:text/json;charset=utf-8," +
                                        encodeURIComponent(
                                            JSON.stringify({
                                                settings: settings,
                                                stats: stats,
                                            })
                                        )
                                    }
                                    download={`Point Allocator Data - ${new Date().getTime()}.json`}
                                >
                                    <Button height='50px'>
                                        <FaDownload className='px-5 w-max' />
                                        <span className='pr-5 font-bold'>
                                            DOWNLOAD
                                        </span>
                                    </Button>
                                </a>
                            </div>
                            {/* Upload btn */}
                            <div className='p-5'>
                                <Button
                                    height='50px'
                                    for='file-upload'
                                    className=''
                                >
                                    <label className='flex flex-row items-center cursor-pointer'>
                                        <FaUpload className='px-5 w-max' />
                                        <input
                                            id='file-upload'
                                            type='file'
                                            accept='.json'
                                            className='invisible w-0 h-0'
                                            onChange={handleUpload}
                                        />
                                        <span className='pr-5 font-bold'>
                                            UPLOAD
                                        </span>
                                    </label>
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
