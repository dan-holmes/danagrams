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
const initialBaseSecondsPerAnagram = 3;
const additionalSecondsPerLetter = 0.5;
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

const getTimeForLevel = (baseSecondsPerAnagram: number, newWordLength: number): number =>
    (baseSecondsPerAnagram + newWordLength * additionalSecondsPerLetter) * 1000;

const Game: React.FC = () => {
    const [currentWord, setCurrentWord] = useState(getWordOfLength(initialWordLength));
    const [letterOptions, setLetterOptions] = useState<LetterOption[]>([]);
    const [baseSecondsPerAnagram, setBaseSecondsPerAnagram] = useState(initialBaseSecondsPerAnagram);
    const [timeForLevel, setTimeForLevel] = useState(initialBaseSecondsPerAnagram*1000)
    const [timeLeft, setTimeLeft] = useState(initialBaseSecondsPerAnagram*1000);
    const [gameStatus, setGameStatus] = useState(GameStatus.Ready);
    const [levelStatus, setLevelStatus] = useState(LevelStatus.InProgress);
    const [livesLeft, setLivesLeft] = useState(initialLivesLeft);
    const [highestWordLength, setHighestWordLength] = useState(initialWordLength);

    const numberOfPressedLetters = letterOptions.filter(lo => lo.pressed !== undefined).length;
    const getGuessWord = (letterOptions: LetterOption[]) => {
        return letterOptions.filter(lo => lo.pressed !== undefined).sort((a, b) => a.pressed! - b.pressed!).map(lo => lo.letter).join('');
    }
    const prestigeLevel = initialBaseSecondsPerAnagram - baseSecondsPerAnagram + 1;

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
                    const newWordLength = currentWord.length + 1;
                    const timeForNewLevel = getTimeForLevel(baseSecondsPerAnagram, newWordLength);
                    setLevelStatus(LevelStatus.InProgress);
                    setTimeForLevel(timeForNewLevel);
                    setTimeLeft(timeForNewLevel);
                    setCurrentWord(getWordOfLength(newWordLength));
                }, 500);
            }
        }
    }, [currentWord, levelStatus, baseSecondsPerAnagram]);

    useEffect(() => {
        if (gameStatus === GameStatus.InProgress && levelStatus === LevelStatus.InProgress) {
            const updateInterval = 100
            window.setTimeout(() => {
                if (timeLeft > 0) {
                    setTimeLeft(timeLeft - updateInterval);
                } else {
                    if (livesLeft > 0) {
                        setLevelStatus(LevelStatus.Lost);
                        setTimeout(() => {
                            const newWordLength = Math.max(currentWord.length - 1, initialWordLength);
                            const timeForNewLevel = getTimeForLevel(baseSecondsPerAnagram, newWordLength);
                            setTimeForLevel(timeForNewLevel);
                            setTimeLeft(timeForNewLevel);
                            setCurrentWord(getWordOfLength(newWordLength));
                            setLivesLeft(livesLeft - 1);
                            setLevelStatus(LevelStatus.InProgress);
                        }, 500);
                    } else {
                        setGameStatus(GameStatus.Lost);
                    }
                }
            }, updateInterval)
        }

    }, [timeLeft, levelStatus, gameStatus, livesLeft, currentWord, baseSecondsPerAnagram]);

    useEffect(() => {
        if (currentWord.length > highestWordLength) {
            setHighestWordLength(currentWord.length);
        }
    }, [currentWord, highestWordLength]);

    const resetGame = (newSecondsPerAnagram: number): void => {
        setBaseSecondsPerAnagram(newSecondsPerAnagram);
        setCurrentWord(getWordOfLength(initialWordLength));
        setLetterOptions([]);
        setGameStatus(GameStatus.InProgress);
        setTimeLeft(getTimeForLevel(newSecondsPerAnagram, initialWordLength));
        setTimeForLevel(getTimeForLevel(newSecondsPerAnagram, initialWordLength));
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

                    <p>Find and type the anagram before the timer runs out.</p>

                    <p>For each anagram you solve, another letter is added and you get half a second longer.</p>

                    <p>Solve an 8 letter anagram to win!</p>

                    <Button
                        onClick={() => resetGame(initialBaseSecondsPerAnagram)}
                        size={"large"}
                    >
                        Play
                    </Button>
                </Card>
            </div>);
        case GameStatus.Won:
            return (<Card className="EndGameMessage">
                <p>Nice work!</p>

                <p>You completed the game on prestige level {prestigeLevel}.</p>

                {(prestigeLevel === 3)
                    ? <p>That's it! Go show off to your friends!</p>
                    : <><p>The next prestige level has one less second per anagram.</p>
                    <Button
                        onClick={() => resetGame(baseSecondsPerAnagram - 1)}
                        size={"large"}
                    >
                        Go
                    </Button></>
                }
            </Card>);
        case GameStatus.Lost:
            const prestigeMessage = prestigeLevel > 1
                ? ` of prestige level ${prestigeLevel}`
                : '';
            return (<div className="EndGameMessageContainer">
                <Card className="EndGameMessage">
                    <p>Game over! The word was "{currentWord}".</p>

                    <p>You reached level {highestWordLength}{prestigeMessage}!</p>

                    <p>Thanks for playing.</p>

                    <Button
                        onClick={() => resetGame(initialBaseSecondsPerAnagram)}
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
                    totalTime={timeForLevel}
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
