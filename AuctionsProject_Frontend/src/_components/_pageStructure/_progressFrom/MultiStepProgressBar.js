import React from "react";
import { ProgressBar } from "react-bootstrap";


const MultiStepProgressBar = props => {
    var stepPercentage = 0;

    if (props.currentStep === 1) {
        stepPercentage = 0;
    } else if (props.currentStep === 2) {
        stepPercentage = 25;
    } else if (props.currentStep === 3) {
        stepPercentage = 50;
    } else if (props.currentStep === 4) {
        stepPercentage = 75;
    } else if (props.currentStep === 5) {
        stepPercentage = 100;
    } else {
        stepPercentage = 0;
    }


    return (
        <div>
            <ProgressBar animated now={stepPercentage} />
        </div>
    );
};

export default MultiStepProgressBar;
