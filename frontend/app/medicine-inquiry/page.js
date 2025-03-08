"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StepIndicator from "../../components/StepIndicator.jsx";

export default function MedicineInquiry() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    drug: "",
    dosage: "",
    reason: "",
    alternativeMedicines: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
  
    try {
      const response = await axios.post('http://localhost:5000/drug_analysis', {
        username: userDetails.username,  // Use pre-generated username
        drug: formData.drug,
        dosage: formData.dosage,
        reason: formData.reason,
        alternativeMedicines: formData.alternativeMedicines
      });
      
      localStorage.setItem('drugAnalysisResult', JSON.stringify(response.data));
      router.push("/results");
    } catch (error) {
      console.error('Error analyzing drug', error);
    }
  };

  return (
    <div className="container">
      <StepIndicator currentStep={3} />
      <h1>Medicine Inquiry</h1>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>Medicine Name</label>
        <input 
          name="drug"
          value={formData.drug}
          onChange={handleChange}
          required 
          disabled={isLoading}
        />

        <label>Dosage (Optional)</label>
        <input 
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          placeholder="e.g., 400mg per day"
          disabled={isLoading}
        />

        <label>Reason for Taking (Optional)</label>
        <textarea 
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="e.g., For headache"
          disabled={isLoading}
        />

        <label>
          <input 
            type="checkbox"
            name="alternativeMedicines"
            checked={formData.alternativeMedicines}
            onChange={handleChange}
            disabled={isLoading}
          /> Show me alternative medicines
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Medicine'}
        </button>
      </form>
    </div>
  );
}