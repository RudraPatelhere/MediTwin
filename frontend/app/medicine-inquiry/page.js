"use client";
import { useRouter } from "next/navigation";
import StepIndicator from "../../components/StepIndicator.jsx";

export default function MedicineInquiry() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/results");
  };

  return (
    <div className="container">
      <StepIndicator currentStep={3} />
      <h1>Medicine Inquiry</h1>
      <form onSubmit={handleSubmit}>
        <label>Medicine Name</label>
        <input required />

        <label>Dosage (Optional)</label>
        <input placeholder="e.g., 400mg per day"/>

        <label>Reason for Taking (Optional)</label>
        <textarea placeholder="e.g., For headache"/>

        <label>
          <input type="checkbox" /> Show me alternative medicines
        </label>

        <button type="submit">Analyze Medicine</button>
      </form>
    </div>
  );
}
