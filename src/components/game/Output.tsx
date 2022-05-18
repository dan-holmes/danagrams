import React from "react";
import "./Output.css";

interface OutputProps {
    guessWord: string,
}

const Output: React.FC<OutputProps> = ({guessWord}) => {
    return (
        <div className="Output">
            <div className="outputText">
                {guessWord}
            </div>
        </div>
    );
};

export default Output;
