"use client";
import { useRouter } from "next/navigation";
import StepIndicator from "../../components/StepIndicator.jsx";

export default function Results() {
  const router = useRouter();

  return (
    <div className="container">
      <StepIndicator currentStep={4} />
      <h1>Results</h1>
      <p><strong>⚠️ Risk Level: Medium</strong></p>

      <div className="grid">
        <div className="box">
          <h3>Potential Side Effects</h3>
          <p>Unable to analyze side effects</p>
        </div>
        <div className="box">
          <h3>Drug Interactions</h3>
          <p>Unable to analyze interactions</p>
        </div>
      </div>

      <div className="box">
        <h3>Alternative Medicines</h3>
        <p>Consult your healthcare provider for alternatives.</p>
      </div>

      <div className="box">
        <h3>Home Remedies</h3>
        <p>Consult your healthcare provider for appropriate remedies.</p>
      </div>

      <div className="flex-gap">
        <button>Check Another Medicine</button>
        <button>Download Report</button>
        <button onClick={() => router.push('/')}>Go to Home</button>
      </div>
    </div>
  );
}
