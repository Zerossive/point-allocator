import React, { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { defaultData } from "./data";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
    // Screen size checks
    const isWidescreen = useMediaQuery({
        query: "(min-width: 1500px)",
    });
    const isMobile = useMediaQuery({
        query: "(max-width: 800px)",
    });

    // localStorage.removeItem("pointAllocatorData");

    const [localData, setLocalData] = useState({});
    const [settings, setSettings] = useState(defaultData.settings);
    const [stats, setStats] = useState(defaultData.stats);
    const [categories, setCategories] = useState([]);
    const [darkMode, setDarkMode] = useState(defaultData.settings.dark);

    // Update list of categories
    useEffect(() => {
        let tempCategories = [];
        Object.keys(stats).map((key) => {
            !tempCategories.includes(stats[key].category) &&
                tempCategories.push(stats[key].category);
            return null;
        });
        setCategories(tempCategories);
    }, [stats]);

    // Run on initial load
    useEffect(() => {
        // Get localData
        let tempLocal = JSON.parse(localStorage.getItem("pointAllocatorData"));
        if (
            tempLocal &&
            tempLocal.settings &&
            tempLocal.settings.version >= defaultData.settings.version
        ) {
            setLocalData(tempLocal);
            setStats(tempLocal.stats);
            setSettings(tempLocal.settings);
            setDarkMode(tempLocal.settings.dark);
        }
    }, []);

    useEffect(() => {
        setSettings((prevState) => ({
            ...prevState,
            dark: darkMode,
        }));
    }, [darkMode]);

    // Update localData on data change
    useEffect(() => {
        setLocalData({ settings: settings, stats: stats });
    }, [stats, settings]);

    // Update local storage after localData is updated
    useEffect(() => {
        localStorage.setItem("pointAllocatorData", JSON.stringify(localData));
        console.log("Saved Data:", localData);
    }, [localData]);

    return (
        <AppContext.Provider
            value={{
                isMobile,
                isWidescreen,
                categories,
                stats,
                setStats,
                settings,
                setSettings,
                darkMode,
                setDarkMode,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
// make sure use
export const useGlobalContext = () => {
    return useContext(AppContext);
};

export { AppContext, AppProvider };
