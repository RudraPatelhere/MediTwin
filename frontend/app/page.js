"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "../components/StepIndicator.jsx";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: "", username: "", contact: "" });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("userDetails", JSON.stringify(formData));
    router.push("/profile");
  };

  return (
    <div className="container">
      <StepIndicator currentStep={1} />
      <h1>Welcome to MediTwin</h1>
      <form onSubmit={handleSubmit}>
        <label>Full Name:</label>
        <input name="fullName" required onChange={handleChange}/>

        <label>Username:</label>
        <input name="username" required onChange={handleChange}/>

        <label>Contact Information:</label>
        <input name="contact" required onChange={handleChange}/>

        <button type="submit">Continue to Health Survey</button>
      </form>
    </div>
  );
}
