import React from "react";
import LetterButton from "./LetterButton";

interface InputProps {
    pressedLetters: string[],
    setPressedLetters: React.Dispatch<React.SetStateAction<string[]>>,
    currentWord: string,
}

const Input: React.FC<InputProps> = ({
    pressedLetters,
    setPressedLetters,
    currentWord,
}) => {
    const pressButton = (letter: string) => {
        setPressedLetters(pressedLetters => [...pressedLetters, letter]);
    };
    const buttons = currentWord.split('').map(l => <LetterButton letter={l} pressButton={() => pressButton(l)} />);
    return (
        <div>
            {buttons}
        </div>
    );
};

export default Input;
