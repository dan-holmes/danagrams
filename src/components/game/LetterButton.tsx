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
            <Button
                variant="outlined"
                onClick={addPressedLetter}
                onTouchStart={addPressedLetter}
                onTouchEnd={e => e.preventDefault()}
                disabled={letterOption.pressed !== undefined}
                className="letterButton"
            >
                {letterOption.letter}
            </Button>
    );
}

export default LetterButton;
