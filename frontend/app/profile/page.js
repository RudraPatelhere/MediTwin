"use client";
import { useRouter } from "next/navigation";
import StepIndicator from "../../components/StepIndicator.jsx";

export default function Profile() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/medicine-inquiry");
  };

  return (
    <div className="container">
      <StepIndicator currentStep={2} />
      <h1>Health Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input type="number" required />

        <label>Gender:</label>
        <select required>
          <option value="">Select gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label>Height (cm):</label>
        <input type="number" />

        <label>Weight (kg):</label>
        <input type="number" />

        <label>Chronic Conditions:</label>
        <div>
          <input type="checkbox"/> Diabetes
          <input type="checkbox"/> Heart Disease
          <input type="checkbox"/> Asthma
          <input type="checkbox"/> Arthritis
          <input type="checkbox"/> Hypertension
        </div>

        <label>Known Allergies:</label>
        <textarea />

        <label>Current Medications:</label>
        <textarea />

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
