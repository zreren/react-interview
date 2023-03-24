import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

const Loading = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((dots) => (dots.length >= 3 ? "" : dots + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex justify-center items-center space-x-3 h-10">
            <div className="relative inline-block">
                <ArrowPathIcon className="animate-spin h-5 w-5 text-gray-200" />
            </div>
            <div>loading{dots}</div>
        </div>
    );
};

export default Loading;
