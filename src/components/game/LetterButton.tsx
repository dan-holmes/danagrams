import React from "react";

interface LetterButtonProps {
    letter: string,
    pressButton: () => void,
}

const LetterButton: React.FC<LetterButtonProps> = ({letter, pressButton}) => {
    return (
        <>{letter}</>
    );
};

export default LetterButton;
