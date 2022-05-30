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
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [secondsPerAnagram, setSecondsPerAnagram] = useState(initialSecondsPerAnagram);
    const [timeLeft, setTimeLeft] = useState(initialSecondsPerAnagram*1000);
    const [guessedCorrectly, setGuessedCorrectly] = useState(false);

    const numberOfPressedLetters = letterOptions.filter(lo => lo.pressed !== undefined).length;
    const guessWord = letterOptions.filter(lo => lo.pressed !== undefined).sort((a, b) => a.pressed! - b.pressed!).map(lo => lo.letter).join('');

    useEffect(() => {
        isValidWord(guessWord)
            .then(validWord => {
                if (validWord && guessWord.length === currentWord.length) {
                    setGuessedCorrectly(true);
                }
            })
    }, [guessWord, currentWord]);

    useEffect(() => {
        const shuffledLetters = currentWord
            .split('')
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        setLetterOptions(shuffledLetters.map((l, i) => ({key: i, letter: l, pressed: undefined})));
    }, [currentWord]);

    useEffect(() => {
        if (guessedCorrectly) {
            if (currentWord.length === winningLength) {
                setShowWinModal(true);
            } else {
                setTimeout(() => {
                    setGuessedCorrectly(false);
                    setTimeLeft(secondsPerAnagram * 1000);
                    const newWord = getWordOfLength(currentWord.length + 1);
                    setCurrentWord(newWord);
                }, 500);
            }
        }
    }, [currentWord, guessedCorrectly, secondsPerAnagram]);

    useEffect(() => {
        if (!guessedCorrectly) {
            window.setTimeout(() => {
                const newTimeLeft = timeLeft - 10;
                if (newTimeLeft > 0 && !guessedCorrectly) {
                    setTimeLeft(newTimeLeft);
                } else {
                    setShowLoseModal(true);
                }
            }, 10)
        }

    }, [timeLeft, guessedCorrectly]);

    const resetGame = (newSecondsPerAnagram: number): void => {
        setSecondsPerAnagram(newSecondsPerAnagram);
        setCurrentWord(getWordOfLength(2));
        setLetterOptions([]);
        setShowWinModal(false);
        setShowLoseModal(false);
        setTimeLeft(newSecondsPerAnagram * 1000);
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
        return <Card className="EndGameMessage">
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

    if (showLoseModal) {
        const prestigeLevel = initialSecondsPerAnagram - secondsPerAnagram;
        const prestigeMessage = prestigeLevel > 0
            ? `You reached prestige level ${prestigeLevel} and had ${secondsPerAnagram} seconds per anagram!`
            : '';
        return <div className="EndGameMessageContainer">
            <Card className="EndGameMessage">
                <p>Game over! The word was "{currentWord}".</p>

                <p>You reached level {currentWord.length}!</p>

                <p>{prestigeMessage}</p>

                <p>Thanks for playing.</p>

                <Button
                    onClick={() => resetGame(initialSecondsPerAnagram)}
                    size={"large"}
                >
                    Play again
                </Button>
            </Card>
        </div>
    }

    return (
        <div className="Game">
            <Timer
                timeLeft={timeLeft}
                totalTime={secondsPerAnagram * 1000}
                reseting={guessedCorrectly}
            />
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
