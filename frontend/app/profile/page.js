"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import StepIndicator from "../../components/StepIndicator.jsx";

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    conditions: [],
    allergies: "",
    medications: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        conditions: checked 
          ? [...prev.conditions, value]
          : prev.conditions.filter(condition => condition !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    
    try {
      const response = await axios.post('http://localhost:5000/user_profile', {
        name: userDetails.fullName, // Explicitly pass name
        username: userDetails.username,
        age: formData.age,
        gender: formData.gender,
        blood_group: "", 
        conditions: formData.conditions,
        allergies: formData.allergies,
        medications: formData.medications
      });
      
      router.push("/medicine-inquiry");
    } catch (error) {
      console.error('Error saving profile', error);
    }
  };

  return (
    <div className="container">
      <StepIndicator currentStep={2} />
      <h1>Health Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input 
          type="number" 
          name="age" 
          value={formData.age} 
          onChange={handleChange}
          required 
        />

        <label>Gender:</label>
        <select 
          name="gender" 
          value={formData.gender} 
          onChange={handleChange}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Height (cm):</label>
        <input 
          type="number" 
          name="height" 
          value={formData.height} 
          onChange={handleChange}
        />

        <label>Weight (kg):</label>
        <input 
          type="number" 
          name="weight" 
          value={formData.weight} 
          onChange={handleChange}
        />

        <label>Chronic Conditions:</label>
        <div>
          <input 
            type="checkbox" 
            name="conditions" 
            value="Diabetes" 
            onChange={handleChange}
          /> Diabetes
          <input 
            type="checkbox" 
            name="conditions" 
            value="Heart Disease" 
            onChange={handleChange}
          /> Heart Disease
          <input 
            type="checkbox" 
            name="conditions" 
            value="Asthma" 
            onChange={handleChange}
          /> Asthma
          <input 
            type="checkbox" 
            name="conditions" 
            value="Arthritis" 
            onChange={handleChange}
          /> Arthritis
          <input 
            type="checkbox" 
            name="conditions" 
            value="Hypertension" 
            onChange={handleChange}
          /> Hypertension
        </div>

        <label>Known Allergies:</label>
        <textarea 
          name="allergies" 
          value={formData.allergies} 
          onChange={handleChange}
        />

        <label>Current Medications:</label>
        <textarea 
          name="medications" 
          value={formData.medications} 
          onChange={handleChange}
        />

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}