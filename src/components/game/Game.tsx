import React, { useEffect } from "react";
import Input from "./Input";
import Output from "./Output";
import ProgressTracker from "./ProgressTracker/ProgressTracker";
import Timer from "./Timer";
import {useState} from 'react';
import './Game.css'
import { getWordOfLength } from "../../wordHelper";

const Game: React.FC = () => {
    const [currentWord, setCurrentWord] = useState(getWordOfLength(2));
    const [pressedLetters, setPressedLetters] = useState<string>('');


    useEffect(() => {
        if (pressedLetters === currentWord) {
            const newWord = getWordOfLength(currentWord.length + 1);
            console.log(newWord);
            setCurrentWord(newWord);
            setPressedLetters('');
        }
    }, [currentWord, pressedLetters])

    return (
        <div className="Game">
            <Timer/>
            <Output
                pressedLetters={pressedLetters}
            />
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
