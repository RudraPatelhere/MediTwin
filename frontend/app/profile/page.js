"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        name: "",
        age: "",
        gender: "",
        height: "",
        weight: "",
        bloodGroup: "",
        chronicConditions: [],
        allergies: "",
        currentMedications: "",
        pastDrugReactions: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setProfileData((prev) => ({
            ...prev,
            chronicConditions: checked
                ? [...prev.chronicConditions, name]
                : prev.chronicConditions.filter((condition) => condition !== name),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Prepare data for the API request
            const requestData = {
                name: profileData.name,
                age: profileData.age,
                gender: profileData.gender,
                blood_group: profileData.bloodGroup,
                conditions: profileData.chronicConditions,
                allergies: profileData.allergies.split(",").map((item) => item.trim()), // Convert to list
                medications: profileData.currentMedications.split(",").map((item) => item.trim()), // Convert to list
            };

            // ✅ Send user profile to Flask API
            const response = await fetch("http://127.0.0.1:5000/user_profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ Save user details (username) in localStorage
                localStorage.setItem("username", data.username);
                router.push("/results"); // ✅ Redirect to Results Page
            } else {
                setError(data.error || "Failed to save profile. Please try again.");
            }
        } catch (error) {
            setError("Server error. Make sure Flask is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
            <h1>🩺 Health Profile</h1>
            <p>Enter your health details for a personalized analysis.</p>

            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Full Name:</label>
                <input type="text" name="name" value={profileData.name} onChange={handleChange} required />

                <label>Age:</label>
                <input type="number" name="age" value={profileData.age} onChange={handleChange} required />

                <label>Gender:</label>
                <select name="gender" value={profileData.gender} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <label>Height (cm):</label>
                <input type="number" name="height" value={profileData.height} onChange={handleChange} required />

                <label>Weight (kg):</label>
                <input type="number" name="weight" value={profileData.weight} onChange={handleChange} required />

                <label>Blood Group:</label>
                <select name="bloodGroup" value={profileData.bloodGroup} onChange={handleChange} required>
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>

                <label>Chronic Conditions:</label>
                <div>
                    {["Diabetes", "Heart Disease", "Asthma", "Hypertension"].map((condition) => (
                        <label key={condition}>
                            <input
                                type="checkbox"
                                name={condition}
                                checked={profileData.chronicConditions.includes(condition)}
                                onChange={handleCheckboxChange}
                            />
                            {condition}
                        </label>
                    ))}
                </div>

                <label>Allergies (comma-separated):</label>
                <input type="text" name="allergies" value={profileData.allergies} onChange={handleChange} />

                <label>Current Medications (comma-separated):</label>
                <input type="text" name="currentMedications" value={profileData.currentMedications} onChange={handleChange} />

                <label>Past Drug Reactions:</label>
                <textarea name="pastDrugReactions" value={profileData.pastDrugReactions} onChange={handleChange}></textarea>

                <button type="submit" style={{ padding: "0.8rem", width: "100%", backgroundColor: "#4A90E2", color: "#fff", fontWeight: "bold" }} disabled={loading}>
                    {loading ? "Saving..." : "Analyze Medicine"}
                </button>
            </form>
        </div>
    );
}
