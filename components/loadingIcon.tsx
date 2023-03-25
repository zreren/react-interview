import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import { SpringValue } from "@react-spring/web";




  
const Loading = () => {
    const [dots, setDots] = useState("");



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
