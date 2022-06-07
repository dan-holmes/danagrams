import React, {useEffect} from "react";
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

    

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent): void => {
            if (e.key === 'Backspace') {
                removeLastPressedLetter();
            }
            if (e.key === 'Delete') {
                clearPressedLetters();
            }
            const letterIndex = letterOptions.findIndex(lo => lo.letter === e.key && lo.pressed === undefined);
            if (letterIndex >= 0) {
                pressLetter(letterIndex);
            }
        }

        document.addEventListener("keydown", handleKeyPress, false);

        return () => {
            document.removeEventListener("keydown", handleKeyPress, false)
        }
    }, [letterOptions, clearPressedLetters, pressLetter, removeLastPressedLetter])

    return (
        <div className='Input'>
            <div className='inputRow'>{buttons.slice(0, 4)}</div>
            <div className='inputRow'>{buttons.slice(4, 8)}</div>
            <div className='inputRow'>
                <Button
                    variant="outlined"
                    onClick={clearPressedLetters}
                    className="letterButton"
                >
                    Clear
                </Button>
                <Button
                    variant="outlined"
                    onClick={removeLastPressedLetter}
                    className="letterButton"
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default Input;
