import React from "react";
import ProgressCircle from "./ProgressCircle";
import "./ProgressTracker.css"

const ProgressTracker: React.FC = () => {
    return (
        <div className="ProgressTracker">
            <ProgressCircle/>
            <ProgressCircle/>
            <ProgressCircle/>
            <ProgressCircle/>
            <ProgressCircle/>
            <ProgressCircle/>
            <ProgressCircle/>
            <ProgressCircle/>
        </div>
    );
};

export default ProgressTracker;
