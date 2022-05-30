import React, { useEffect } from "react";
import Input from "./Input";
import Output from "./Output";
import ProgressTracker from "./ProgressTracker/ProgressTracker";
import Timer from "./Timer";
import {useState} from 'react';
import './Game.css'
import { getWordOfLength, isValidWord } from "../../wordHelper";
import { Button, Card } from "@mui/material";

const winningLength = 8;
const initialSecondsPerAnagram = 5;

export type LetterOption = {
    letter: string,
    pressed: number|undefined,
};

const Game: React.FC = () => {
    const [currentWord, setCurrentWord] = useState(getWordOfLength(2));
    const [letterOptions, setLetterOptions] = useState<LetterOption[]>([]);
    const [showWinModal, setShowWinModal] = useState(false);
    const [secondsPerAnagram, setSecondsPerAnagram] = useState(initialSecondsPerAnagram);

    const numberOfPressedLetters = letterOptions.filter(lo => lo.pressed !== undefined).length;
    const guessWord = letterOptions.filter(lo => lo.pressed !== undefined).sort((a, b) => a.pressed! - b.pressed!).map(lo => lo.letter).join('');

    useEffect(() => {
        const shuffledLetters = currentWord
            .split('')
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        setLetterOptions(shuffledLetters.map((l, i) => ({key: i, letter: l, pressed: undefined})));
    }, [currentWord]);

    useEffect(() => {
        if (isValidWord(guessWord) && guessWord.length === currentWord.length) {
            if (currentWord.length === winningLength) {
                setShowWinModal(true);
            } else {
                const newWord = getWordOfLength(currentWord.length + 1);
                setCurrentWord(newWord);
            }
        }
    }, [currentWord, letterOptions, guessWord]);

    const resetGame = (newSecondsPerAnagram: number): void => {
        setSecondsPerAnagram(newSecondsPerAnagram);
        setCurrentWord(getWordOfLength(2));
        setLetterOptions([]);
        setShowWinModal(false);
    }

    const pressLetter = (key: number): void => {
        if (letterOptions[key].pressed === undefined) {
            letterOptions[key].pressed = numberOfPressedLetters;
        }
        setLetterOptions([...letterOptions]);
    };

    const clearPressedLetters = (): void => {
        letterOptions.forEach(lo => lo.pressed = undefined);
        setLetterOptions([...letterOptions]);
    };

    const removeLastPressedLetter = (): void => {
        letterOptions.find(lo => lo.pressed === numberOfPressedLetters - 1)!.pressed = undefined;
        setLetterOptions([...letterOptions]);
    };

    if (showWinModal) {
        return <Card className="WinMessage">
            <p>Nice work!</p>

            <p>You completed the game with {secondsPerAnagram} seconds per anagram.</p>

            <p>Try it with {secondsPerAnagram - 1}?</p>

            <Button
                onClick={() => resetGame(secondsPerAnagram - 1)}
                size={"large"}
            >
                Go
            </Button>
        </Card>
    }

    return (
        <div className="Game">
            <Timer/>
            <Output
                guessWord={guessWord}
            />
            <Input
                letterOptions={letterOptions}
                pressLetter={pressLetter}
                clearPressedLetters={clearPressedLetters}
                removeLastPressedLetter={removeLastPressedLetter}
            />
            <ProgressTracker/>
        </div>
    );
};

export default Game;
