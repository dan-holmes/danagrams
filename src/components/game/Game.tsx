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
const letterGracePeriod = 1000;

const currentTimeMs = (): number => new Date().getTime();

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

type GameState = {
    levelStatus: LevelStatus,
    gameStatus: GameStatus,
    livesLeft: number,
    currentWord: string,
    baseSecondsPerAnagram: number,
    levelStartTime: number,
    lastLetterPress: number,
    timeForLevel: number,
}

const getTimeForLevel = (baseSecondsPerAnagram: number, newWordLength: number): number =>
    (baseSecondsPerAnagram + newWordLength * additionalSecondsPerLetter) * 1000;

const Game: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        levelStatus: LevelStatus.InProgress,
        gameStatus: GameStatus.Ready,
        livesLeft: initialLivesLeft,
        currentWord: getWordOfLength(initialWordLength),
        baseSecondsPerAnagram: initialBaseSecondsPerAnagram,
        levelStartTime: currentTimeMs(),
        lastLetterPress: currentTimeMs(),
        timeForLevel: initialBaseSecondsPerAnagram*1000,
    });
    const [letterOptions, setLetterOptions] = useState<LetterOption[]>([]);
    const [highestWordLength, setHighestWordLength] = useState(initialWordLength);

    const [, setTimeForUpdating] = useState(Date.now());

    useEffect(() => {
    const interval = setInterval(() => setTimeForUpdating(Date.now()), 100);
    return () => {
        clearInterval(interval);
    };
    }, []);
    
    const timeLeft = Math.max(gameState.timeForLevel - (currentTimeMs() - gameState.levelStartTime), 0);
    const gracePeriodLeft = Math.max(letterGracePeriod - (currentTimeMs() - gameState.lastLetterPress), 0);

    const numberOfPressedLetters = letterOptions.filter(lo => lo.pressed !== undefined).length;
    const getGuessWord = (letterOptions: LetterOption[]) => {
        return letterOptions.filter(lo => lo.pressed !== undefined).sort((a, b) => a.pressed! - b.pressed!).map(lo => lo.letter).join('');
    }
    const prestigeLevel = initialBaseSecondsPerAnagram - gameState.baseSecondsPerAnagram + 1;

    const checkWord = (newLetterOptions: LetterOption[]): void => {
        const guessWord = getGuessWord(newLetterOptions);
        if (guessWord.length === gameState.currentWord.length)
        {
            isValidWord(guessWord)
                .then(validWord => {
                    if (validWord) {
                        setGameState(gs => ({...gs, levelStatus: LevelStatus.Won}));
                    }
                })
        }
    };

    useEffect(() => {
        const shuffledLetters = gameState.currentWord
            .split('')
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        setLetterOptions(shuffledLetters.map((l, i) => ({key: i, letter: l, pressed: undefined})));
    }, [gameState.currentWord]);

    useEffect(() => {
        if (gameState.levelStatus === LevelStatus.Won) {
            if (gameState.currentWord.length === winningLength) {
                setGameState(gs => ({...gs,
                    gameStatus: GameStatus.Won,
                    levelStatus: LevelStatus.InProgress,
                }));
            } else {
                setTimeout(() => {
                    const newWordLength = gameState.currentWord.length + 1;
                    const timeForNewLevel = getTimeForLevel(gameState.baseSecondsPerAnagram, newWordLength);
                    setGameState(gs => ({...gs,
                        levelStatus: LevelStatus.InProgress,
                        currentWord: getWordOfLength(newWordLength),
                        timeForLevel: timeForNewLevel,
                        levelStartTime: currentTimeMs(),
                    }));
                }, 500);
            }
        }
    }, [gameState.currentWord, gameState.levelStatus, gameState.baseSecondsPerAnagram]);

    useEffect(() => {
            if (!(timeLeft > 0 || gracePeriodLeft > 0) && gameState.levelStatus === LevelStatus.InProgress && gameState.gameStatus === GameStatus.InProgress) {
                if (gameState.livesLeft > 0) {
                    setGameState(gs => ({...gs, levelStatus: LevelStatus.Lost}));
                    setTimeout(() => {
                        const newWordLength = Math.max(gameState.currentWord.length - 1, initialWordLength);
                        const timeForNewLevel = getTimeForLevel(gameState.baseSecondsPerAnagram, newWordLength);
                        setGameState(gs => ({...gs,
                            currentWord: getWordOfLength(newWordLength),
                            livesLeft: gs.livesLeft - 1,
                            levelStatus: LevelStatus.InProgress,
                            levelStartTime: currentTimeMs(),
                            timeForLevel: timeForNewLevel,
                        }));
                    }, 500);
                } else {
                    setGameState(gs => ({...gs, gameStatus: GameStatus.Lost}));
                }
            }
    }, [gameState, timeLeft, gracePeriodLeft]);

    useEffect(() => {
        if (gameState.currentWord.length > highestWordLength) {
            setHighestWordLength(gameState.currentWord.length);
        }
    }, [gameState.currentWord, highestWordLength]);

    const resetGame = (newSecondsPerAnagram: number): void => {
        setLetterOptions([]);
        setHighestWordLength(initialWordLength);
        setGameState(gs => ({...gs,
            baseSecondsPerAnagram: newSecondsPerAnagram,
            currentWord: getWordOfLength(initialWordLength),
            gameStatus: GameStatus.InProgress,
            livesLeft: initialLivesLeft,
            levelStartTime: currentTimeMs(),
            timeForLevel: getTimeForLevel(newSecondsPerAnagram, initialWordLength),
        }))
    };

    const pressLetter = (key: number): void => {
        if (letterOptions[key].pressed === undefined) {
            letterOptions[key].pressed = numberOfPressedLetters;
        }
        setLetterOptions([...letterOptions]);
        checkWord(letterOptions);
        setGameState(gs => ({...gs, lastLetterPress: currentTimeMs()}));
    };

    const clearPressedLetters = (): void => {
        if (timeLeft <= 0) return;
        letterOptions.forEach(lo => lo.pressed = undefined);
        setLetterOptions([...letterOptions]);
    };

    const removeLastPressedLetter = (): void => {
        if (timeLeft <= 0) return;
        letterOptions.find(lo => lo.pressed === numberOfPressedLetters - 1)!.pressed = undefined;
        setLetterOptions([...letterOptions]);
    };

    switch (gameState.gameStatus) {
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
                        onClick={() => resetGame(gameState.baseSecondsPerAnagram - 1)}
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
                    <p>Game over! The word was "{gameState.currentWord}".</p>

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
                    totalTime={gameState.timeForLevel}
                    levelStatus={gameState.levelStatus}
                />
                <Output
                    displayWord={gameState.levelStatus === LevelStatus.Lost ? gameState.currentWord : getGuessWord(letterOptions)}
                    color={gameState.levelStatus === LevelStatus.Lost ? 'error' : 'default'}
                />
                <Input
                    letterOptions={letterOptions}
                    pressLetter={pressLetter}
                    clearPressedLetters={clearPressedLetters}
                    removeLastPressedLetter={removeLastPressedLetter}
                    enableDeleteButtons={timeLeft > 0}
                />
                <ProgressTracker
                    livesLeft={gameState.livesLeft}
                    currentWordLength={gameState.currentWord.length}
                    highestWordLength={highestWordLength}
                />
            </div>);
    }
};

export default Game;
