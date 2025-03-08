"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StepIndicator from "../../components/StepIndicator.jsx";

export default function Results() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysisResult = async () => {
      try {
        const storedResult = localStorage.getItem('drugAnalysisResult');
        if (storedResult) {
          const parsedResult = JSON.parse(storedResult);
          setAnalysisResult(parsedResult);
        } else {
          throw new Error('No analysis results found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisResult();
  }, []);

  const handleDownloadReport = () => {
    // Future implementation for downloading report
    alert('Download functionality coming soon');
  };

  const handleCheckAnother = () => {
    localStorage.removeItem('drugAnalysisResult');
    router.push("/medicine-inquiry");
  };

  if (isLoading) {
    return (
      <div className="container">
        <StepIndicator currentStep={4} />
        <p>Loading analysis results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <StepIndicator currentStep={4} />
        <div className="error-box">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={handleCheckAnother}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <StepIndicator currentStep={4} />
      <h1>Personalized Medicine Analysis</h1>
      
      {analysisResult ? (
        <>
          <div className="summary-section">
            <h2>{analysisResult.drug} Analysis</h2>
            <p><strong>Personalized Summary:</strong></p>
            <div className="analysis-summary">
              {analysisResult.summary || "No detailed analysis available."}
            </div>
          </div>

          <div className="grid">
            <div className="box">
              <h3>Potential Side Effects</h3>
              <p>{analysisResult.side_effects || "No specific side effects identified."}</p>
            </div>
            <div className="box">
              <h3>Drug Interactions</h3>
              <p>{analysisResult.interactions || "No known significant interactions found."}</p>
            </div>
          </div>

          <div className="box">
            <h3>Dosage & Usage</h3>
            <p>{analysisResult.usage || "Standard dosage recommendations not available."}</p>
          </div>

          <div className="box">
            <h3>Precautions</h3>
            <p>{analysisResult.precautions || "General precautions not specified."}</p>
          </div>

          <div className="action-section">
            <div className="flex-gap">
              <button onClick={handleCheckAnother}>Check Another Medicine</button>
              <button onClick={handleDownloadReport}>Download Report</button>
              <button onClick={() => router.push('/')}>Go to Home</button>
            </div>
          </div>
        </>
      ) : (
        <div className="no-results">
          <p>No analysis results available. Please run a drug analysis first.</p>
          <button onClick={() => router.push('/medicine-inquiry')}>
            Go to Medicine Inquiry
          </button>
        </div>
      )}
    </div>
  );
}