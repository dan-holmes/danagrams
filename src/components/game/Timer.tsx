import React from "react";
import "./Timer.css"
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface TimerProps {
    timeLeft: number,
    totalTime: number,
    reseting: boolean,
}

const Timer: React.FC<TimerProps> = ({timeLeft, totalTime, reseting}) => {
    return (
        <div className="Timer">
            <CircularProgress
                variant="determinate"
                value={reseting ? 100 : Math.round(100*timeLeft/totalTime)}
                size='16rem'
                color={reseting ? 'success' : 'primary'}
            />
            <Typography
                variant="h1"
                component="div"
                color={reseting ? "success.main" : "text.secondary"}
                className="TimerText"
            >
              {`${Math.ceil(timeLeft/1000)}`}
            </Typography>
        </div>
    );
};

export default Timer;
