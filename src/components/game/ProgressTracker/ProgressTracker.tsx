import { Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./ProgressTracker.css"
import FavoriteIcon from '@mui/icons-material/Favorite';
import CircleIcon from '@mui/icons-material/Circle';
import { FavoriteBorderOutlined } from "@mui/icons-material";

interface ProgressTrackerProps {
    livesLeft: number;
    currentWordLength: number;
    highestWordLength: number;
}

const RemainingLife = <FavoriteIcon className="life"></FavoriteIcon>;
const UsedLife = <FavoriteBorderOutlined className="life"></FavoriteBorderOutlined>;

const CompletedLevel = <CircleIcon color="success"></CircleIcon>;
const CurrentLevel = <CircleIcon color="primary"></CircleIcon>;
const UncompletedLevel = <CircleIcon color="disabled"></CircleIcon>;

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
    livesLeft,
    currentWordLength,
    highestWordLength,
}) => {
    let livesDisplay = [];
    for (let i = 0; i < 3; i++) {
        livesDisplay.push(i < livesLeft ? RemainingLife : UsedLife);
    }

    let levelsDisplay = [];
    for (let j = 1; j <= 8; j++) {
        levelsDisplay.push(
            j === currentWordLength
                ? CurrentLevel
                : j <= highestWordLength
                    ? CompletedLevel
                    : UncompletedLevel
        )
    }
    return (
        <div className="ProgressTracker">
            <div>{livesDisplay}</div>
            <div>{levelsDisplay}</div>
        </div>
    );
};

export default ProgressTracker;
