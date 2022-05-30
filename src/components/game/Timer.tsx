import React from "react";
import "./Timer.css"

interface TimerProps {
    timeLeft: number
}

const Timer: React.FC<TimerProps> = ({timeLeft}) => {
    return (
        <div className="Timer">
            {timeLeft}
        </div>
    );
};

export default Timer;
