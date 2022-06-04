import React from "react";
import "./Timer.css"
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { LevelStatus } from "./Game";

const getTimerColor = (levelStatus: LevelStatus): 'primary'|'success'|'error'  => {
    switch(levelStatus) {
        case LevelStatus.InProgress:
            return 'primary';
        case LevelStatus.Won:
            return 'success';
        case LevelStatus.Lost:
            return 'error';
    }
}

const getTextColor = (levelStatus: LevelStatus): 'text.secondary'|'success.main'|'error.main'  => {
    switch(levelStatus) {
        case LevelStatus.InProgress:
            return 'text.secondary';
        case LevelStatus.Won:
            return 'success.main';
        case LevelStatus.Lost:
            return 'error.main';
    }
}

interface TimerProps {
    timeLeft: number,
    totalTime: number,
    levelStatus: LevelStatus,
}

const Timer: React.FC<TimerProps> = ({timeLeft, totalTime, levelStatus}) => {
    return (
        <div className="Timer">
            <CircularProgress
                variant="determinate"
                value={levelStatus === LevelStatus.InProgress
                    ? Math.round(100*timeLeft/totalTime)
                    : 100
                }
                size='16rem'
                color={getTimerColor(levelStatus)}
            />
            <Typography
                variant="h1"
                component="div"
                color={getTextColor(levelStatus)}
                className="TimerText"
            >
              {`${Math.ceil(timeLeft/1000)}`}
            </Typography>
        </div>
    );
};

export default Timer;
