import Input from "./Input";
import Output from "./Output";
import ProgressTracker from "./ProgressTracker/ProgressTracker";
import Timer from "./Timer";

const Game = () => {
    return (
        <div>
            <Timer/>
            <Output/>
            <Input/>
            <ProgressTracker/>
        </div>
    );
};

export default Game;
