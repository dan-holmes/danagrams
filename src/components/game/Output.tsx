import { Typography } from "@mui/material";
import React from "react";
import "./Output.css";

interface OutputProps {
    displayWord: string,
    color: string,
}

const Output: React.FC<OutputProps> = ({displayWord, color}) => {
    return (
        <div className="Output">
            <Typography color={color} variant="h2">
                {displayWord}
            </Typography>
        </div>
    );
};

export default Output;
