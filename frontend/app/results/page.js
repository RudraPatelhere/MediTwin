"use client";
import { useState, useEffect } from "react";

export default function Results() {
    const [medicine, setMedicine] = useState("");
    const [result, setResult] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // ✅ Fetch stored username from localStorage
        const savedUsername = localStorage.getItem("username");

        if (!savedUsername) {
            setError("⚠️ No user profile found. Please complete your health profile first.");
        } else {
            setUsername(savedUsername);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username) {
            setError("⚠️ No user profile found. Please complete your health profile first.");
            return;
        }

        setLoading(true);
        setError("");
        setResult("");

        // ✅ Send request to Flask backend
        const requestData = {
            username: username,  // Use the stored username
            drug: medicine,
        };

        try {
            const response = await fetch("http://127.0.0.1:5000/drug_analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error("❌ Failed to fetch data. Please check if the backend is running.");
            }

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setResult(data.summary || "No insights available.");
            }
        } catch (error) {
            setError(error.message || "❌ An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
            <h1>🔍 Medicine Analysis</h1>
            <p>Enter a medicine name to see how it affects your body based on your health profile.</p>

            {error && (
                <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: "#ffe6e6", borderRadius: "8px", color: "#cc0000" }}>
                    <h4>⚠️ Error:</h4>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Medicine Name (e.g., Ibuprofen)"
                    value={medicine}
                    onChange={(e) => setMedicine(e.target.value)}
                    required
                    style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem" }}
                />
                <button
                    type="submit"
                    style={{ padding: "0.8rem", width: "100%", backgroundColor: "#4A90E2", color: "#fff", fontWeight: "bold" }}
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Analyze Medicine"}
                </button>
            </form>

            {result && (
                <div style={{ marginTop: "2rem", padding: "1rem", backgroundColor: "#f1f5f8", borderRadius: "8px" }}>
                    <h3>Results for {medicine}:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}
