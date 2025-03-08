"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        contact: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear errors on change
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Trim and format inputs
        const fullName = formData.fullName.trim();
        let username = formData.username.trim().toLowerCase().replace(/\s+/g, "_"); // Normalize username
        const contact = formData.contact.trim();

        if (!fullName || !username || !contact) {
            setError("⚠️ Please fill in all fields correctly.");
            return;
        }

        // ✅ Save user details
        localStorage.setItem("userDetails", JSON.stringify({ fullName, username, contact }));
        localStorage.setItem("username", username); // Store username separately for easy access

        router.push("/profile"); // Navigate to health profile page
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: "2rem", textAlign: "center" }}>
            <h1>👋 Welcome to MediTwin</h1>
            <p>Enter your details to begin.</p>

            {error && (
                <div style={{ marginBottom: "1rem", padding: "0.8rem", backgroundColor: "#ffe6e6", borderRadius: "8px", color: "#cc0000" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem" }}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username (No Spaces)"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem" }}
                />
                <input
                    type="email"
                    name="contact"
                    placeholder="Email or Phone"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem" }}
                />
                <button
                    type="submit"
                    style={{ padding: "0.8rem", width: "100%", backgroundColor: "#4A90E2", color: "#fff", fontWeight: "bold" }}
                >
                    Continue to Health Survey
                </button>
            </form>
        </div>
    );
}
