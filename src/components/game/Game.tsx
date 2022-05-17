import React from "react";
import Input from "./Input";
import Output from "./Output";
import ProgressTracker from "./ProgressTracker/ProgressTracker";
import Timer from "./Timer";
import {useState} from 'react';

const Game: React.FC = () => {
    const currentWord = 'ANAGRAM';
    const [pressedLetters, setPressedLetters] = useState<string[]>([]);
    return (
        <div>
            <Timer/>
            <Output/>
            <Input
                currentWord={currentWord}
                pressedLetters={pressedLetters}
                setPressedLetters={setPressedLetters}
            />
            <ProgressTracker/>
        </div>
    );
};

export default Game;
