import Button from "@mui/material/Button";
import React, {useEffect, useState} from "react";
import './Input.css';

interface InputProps {
    pressedLetters: string,
    setPressedLetters: React.Dispatch<React.SetStateAction<string>>,
    currentWord: string,
}

const Input: React.FC<InputProps> = ({
    pressedLetters,
    setPressedLetters,
    currentWord,
}) => {
    const [letterOptions, setLetterOptions] = useState<string[]>([])

    useEffect(() => {
        setLetterOptions(currentWord
            .split('')
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value));
    }, [currentWord])

    const buttons = letterOptions.map((letter, i) =>
        <div key={i} className="letterButton">
            <Button
                variant="outlined"
                onClick={() => setPressedLetters(pressedLetters => pressedLetters + letter)}
                className="letterButton"
            >
                {letter}
            </Button>
        </div>);

    return (
        <div className='Input'>
            <div className='inputRow'>{buttons.slice(0, 4)}</div>
            <div className='inputRow'>{buttons.slice(4, 8)}</div>
            <div className='inputRow'>
                <div className="letterButton">
                    <Button
                        variant="outlined"
                        onClick={() => setPressedLetters('')}
                    >
                        Clear
                    </Button>
                </div>
                <div className="letterButton">
                    <Button
                        variant="outlined"
                        onClick={() => setPressedLetters(pressedLetters => pressedLetters.slice(0, -1))}
                    >
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Input;
