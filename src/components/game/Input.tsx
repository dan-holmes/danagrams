import React, {useEffect, useState} from "react";
import LetterButton from "./LetterButton";
import Button from "@mui/material/Button";
import './Input.css';
import { LetterOption } from "./Game";

interface InputProps {
    letterOptions: LetterOption[],
    pressLetter: (key: number) => void,
    clearPressedLetters: () => void,
    removeLastPressedLetter: () => void,
};

const Input: React.FC<InputProps> = ({
    letterOptions,
    pressLetter,
    clearPressedLetters,
    removeLastPressedLetter,
}) => {
    const buttons = letterOptions.map((letterOption, i) =>
        <LetterButton
            key={i}
            letterOption={letterOption}
            pressLetter={() => pressLetter(i)}
        />
    );

    return (
        <div className='Input'>
            <div className='inputRow'>{buttons.slice(0, 4)}</div>
            <div className='inputRow'>{buttons.slice(4, 8)}</div>
            <div className='inputRow'>
                <div className="letterButton">
                    <Button
                        variant="outlined"
                        onClick={clearPressedLetters}
                    >
                        Clear
                    </Button>
                </div>
                <div className="letterButton">
                    <Button
                        variant="outlined"
                        onClick={removeLastPressedLetter}
                    >
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Input;
