import Step from "./Step";


type BreadCrumbStepsProps = {
    steps: number[];
    activeStep?: number;
    onClick: (step: number) => void;
};

export default function BreadCrumbSteps({steps, activeStep, onClick}: BreadCrumbStepsProps) {
    return(
        <div className="breadcrumb-steps pt-6">
            {steps.map((step, stepIndex) => (
                <Step key={step} stepNumber={step} active={stepIndex === activeStep} onClick={() => onClick(stepIndex)} />
            ))}
        </div>
    );
}