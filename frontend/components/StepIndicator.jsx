export default function StepIndicator({ currentStep }) {
    const steps = [1, 2, 3, 4];
    return (
      <div className="step-indicator">
        {steps.map(step => (
          <div key={step} className={`step-circle ${step === currentStep ? 'active' : ''}`}>
            {step}
          </div>
        ))}
      </div>
    );
  }
  