import Button from "@mui/material/Button";
import React from 'react';
import { LetterOption } from "./Game";
import './Input.css';

interface LetterButtonProps {
    letterOption: LetterOption,
    pressLetter: () => void,
};

const LetterButton: React.FC<LetterButtonProps> = ({
    letterOption,
    pressLetter: addPressedLetter,
}) => {
    return (
        <div className="letterButton">
            <Button
                variant="outlined"
                onClick={addPressedLetter}
                className="letterButton"
                disabled={letterOption.pressed !== undefined}
            >
                {letterOption.letter}
            </Button>
        </div>
    );
}

export default LetterButton;
