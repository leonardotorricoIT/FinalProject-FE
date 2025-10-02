type StepProps = {
    stepNumber: number;
    active?: boolean;
    onClick?: () => void;
};

export default function Step({stepNumber, active=true, onClick}: StepProps) {
    return (
        <button type="button" className={`step-tag ${active ? 'step-active' : 'step-unactive'}`} onClick={onClick}>
            <p>{stepNumber}</p>
        </button>
    );
}