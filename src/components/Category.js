import { React, useState } from "react";
import Button from "./Button";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useGlobalContext } from "../context";

export default function Category(props) {
    const { stats, setStats } = useGlobalContext();

    const { title } = props;

    const [editCategory, setEditCategory] = useState(false);

    const handleCategoryTitle = (event) => {
        if (event.key === "Enter") {
            let newCategory = event.target.value;
            newCategory === "" && (newCategory = title);

            let idList = [];
            Object.keys(stats).map((key) => {
                if (stats[key].category === title) {
                    idList.push(stats[key].id);
                }
                return null;
            });
            idList.map((id) => {
                setStats((prevState) => ({
                    ...prevState,
                    [id]: {
                        ...prevState[id],
                        category: newCategory,
                    },
                }));
                return null;
            });
            setEditCategory(false);
            console.log(`Changed ${title} to ${newCategory}`);
        }
    };

    const handleNewStat = () => {
        const newId = new Date().getTime();
        // console.log(newId);
        setStats((prevState) => ({
            ...prevState,
            [newId]: {
                category: title,
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

    return (
        <div className='p-5 w-full md:w-1/2 min-w-min'>
            {/* Category title */}
            {!editCategory && (
                <h2
                    className='text-3xl text-center md:text-left cursor-pointer px-5 pb-5 md:pb-0'
                    onClick={() => setEditCategory(!editCategory)}
                >
                    {title}
                </h2>
            )}
            {/* Edit category title */}
            {editCategory && (
                <div className='w-full flex px-5'>
                    <input
                        type='text'
                        placeholder={title}
                        className='text-3xl w-9/12 md:w-10/12 flex-grow bg-transparent text-center md:text-left border'
                        autoFocus
                        onKeyDown={handleCategoryTitle}
                    />
                    <div className='w-3/12 md:w-2/12 px-5'>
                        <Button
                            width='100%'
                            height='100%'
                            onClick={() => setEditCategory(!editCategory)}
                        >
                            <FaTimes className='w-max' />
                        </Button>
                    </div>
                </div>
            )}

            {props.children}

            {/* New stat btn */}
            <div className='w-full pt-5 flex justify-center'>
                <Button width='auto' height='50px' onClick={handleNewStat}>
                    <FaPlus className='px-5 w-max' />
                    <span className='pr-5 font-bold'>NEW STAT</span>
                </Button>
            </div>
        </div>
    );
}
