import React from "react";
import "./Output.css";

interface OutputProps {
    pressedLetters: string,
}

const Output: React.FC<OutputProps> = ({pressedLetters}) => {
    return (
        <div className="Output">
            <div className="outputText">
                {pressedLetters}
            </div>
        </div>
    );
};

export default Output;
