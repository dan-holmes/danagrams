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
const initialLivesLeft = 3;
const initialWordLength = 2;

enum GameStatus {
    InProgress,
    Won,
    Lost,
    Ready,
}

export enum LevelStatus {
    Won,
    Lost,
    InProgress,
}

export type LetterOption = {
    letter: string,
    pressed: number|undefined,
};

const Game: React.FC = () => {
    const [currentWord, setCurrentWord] = useState(getWordOfLength(initialWordLength));
    const [letterOptions, setLetterOptions] = useState<LetterOption[]>([]);
    const [secondsPerAnagram, setSecondsPerAnagram] = useState(initialSecondsPerAnagram);
    const [timeLeft, setTimeLeft] = useState(initialSecondsPerAnagram*1000);
    const [gameStatus, setGameStatus] = useState(GameStatus.Ready);
    const [levelStatus, setLevelStatus] = useState(LevelStatus.InProgress);
    const [livesLeft, setLivesLeft] = useState(initialLivesLeft);
    const [highestWordLength, setHighestWordLength] = useState(initialWordLength);

    const numberOfPressedLetters = letterOptions.filter(lo => lo.pressed !== undefined).length;
    const getGuessWord = (letterOptions: LetterOption[]) => {
        return letterOptions.filter(lo => lo.pressed !== undefined).sort((a, b) => a.pressed! - b.pressed!).map(lo => lo.letter).join('');
    }

    const checkWord = (newLetterOptions: LetterOption[]): void => {
        const guessWord = getGuessWord(newLetterOptions);
        if (guessWord.length === currentWord.length)
        {
            isValidWord(guessWord)
                .then(validWord => {
                    if (validWord) {
                        setLevelStatus(LevelStatus.Won);
                    }
                })
        }
    };

    useEffect(() => {
        const shuffledLetters = currentWord
            .split('')
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        setLetterOptions(shuffledLetters.map((l, i) => ({key: i, letter: l, pressed: undefined})));
    }, [currentWord]);

    useEffect(() => {
        if (levelStatus === LevelStatus.Won) {
            if (currentWord.length === winningLength) {
                setGameStatus(GameStatus.Won);
                setLevelStatus(LevelStatus.InProgress);
            } else {
                setTimeout(() => {
                    setLevelStatus(LevelStatus.InProgress);
                    setTimeLeft(secondsPerAnagram * 1000);
                    const newWord = getWordOfLength(currentWord.length + 1);
                    setCurrentWord(newWord);
                }, 500);
            }
        }
    }, [currentWord, levelStatus, secondsPerAnagram]);

    useEffect(() => {
        if (gameStatus === GameStatus.InProgress && levelStatus === LevelStatus.InProgress) {
            window.setTimeout(() => {
                if (timeLeft > 0) {
                    setTimeLeft(timeLeft - 10);
                } else {
                    if (livesLeft > 0) {
                        setLevelStatus(LevelStatus.Lost);
                        setTimeout(() => {
                            setTimeLeft(secondsPerAnagram * 1000);
                            const newWord = getWordOfLength(Math.max(currentWord.length - 1, initialWordLength));
                            setCurrentWord(newWord);
                            setLivesLeft(livesLeft - 1);
                            setLevelStatus(LevelStatus.InProgress);
                        }, 500);
                    } else {
                        setGameStatus(GameStatus.Lost);
                    }
                }
            }, 10)
        }

    }, [timeLeft, levelStatus, gameStatus, livesLeft, currentWord, secondsPerAnagram]);

    useEffect(() => {
        if (currentWord.length > highestWordLength) {
            setHighestWordLength(currentWord.length);
        }
    }, [currentWord, highestWordLength]);

    const resetGame = (newSecondsPerAnagram: number): void => {
        setSecondsPerAnagram(newSecondsPerAnagram);
        setCurrentWord(getWordOfLength(initialWordLength));
        setLetterOptions([]);
        setGameStatus(GameStatus.InProgress);
        setTimeLeft(newSecondsPerAnagram * 1000);
        setLivesLeft(initialLivesLeft);
        setHighestWordLength(initialWordLength);
    };

    const pressLetter = (key: number): void => {
        if (letterOptions[key].pressed === undefined) {
            letterOptions[key].pressed = numberOfPressedLetters;
        }
        setLetterOptions([...letterOptions]);
        checkWord(letterOptions);
    };

    const clearPressedLetters = (): void => {
        letterOptions.forEach(lo => lo.pressed = undefined);
        setLetterOptions([...letterOptions]);
    };

    const removeLastPressedLetter = (): void => {
        letterOptions.find(lo => lo.pressed === numberOfPressedLetters - 1)!.pressed = undefined;
        setLetterOptions([...letterOptions]);
    };

    switch (gameStatus) {
        case GameStatus.Ready:
            return (
                <div className="EndGameMessageContainer">
                <Card className="EndGameMessage">
                    <p>Welcome to Danagrams.</p>

                    <p>Find and type the anagram in 5 seconds.</p>

                    <p>For each anagram you solve, another letter is added.</p>

                    <p>Solve an 8 letter anagram to win!</p>

                    <Button
                        onClick={() => resetGame(initialSecondsPerAnagram)}
                        size={"large"}
                    >
                        Play
                    </Button>
                </Card>
            </div>);
        case GameStatus.Won:
            return (<Card className="EndGameMessage">
                <p>Nice work!</p>

                <p>You completed the game with {secondsPerAnagram} seconds per anagram.</p>

                <p>Try it with {secondsPerAnagram - 1}?</p>

                <Button
                    onClick={() => resetGame(secondsPerAnagram - 1)}
                    size={"large"}
                >
                    Go
                </Button>
            </Card>);
        case GameStatus.Lost:
            const prestigeLevel = initialSecondsPerAnagram - secondsPerAnagram;
            const prestigeMessage = prestigeLevel > 0
                ? `You reached prestige level ${prestigeLevel} and had ${secondsPerAnagram} seconds per anagram!`
                : '';
            return (<div className="EndGameMessageContainer">
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
            </div>);
        case GameStatus.InProgress:
            return (<div className="Game">
                <Timer
                    timeLeft={timeLeft}
                    totalTime={secondsPerAnagram * 1000}
                    levelStatus={levelStatus}
                />
                <Output
                    displayWord={levelStatus === LevelStatus.Lost ? currentWord : getGuessWord(letterOptions)}
                    color={levelStatus === LevelStatus.Lost ? 'error' : 'default'}
                />
                <Input
                    letterOptions={letterOptions}
                    pressLetter={pressLetter}
                    clearPressedLetters={clearPressedLetters}
                    removeLastPressedLetter={removeLastPressedLetter}
                />
                <ProgressTracker
                    livesLeft={livesLeft}
                    currentWordLength={currentWord.length}
                    highestWordLength={highestWordLength}
                />
            </div>);
    }
};

export default Game;
