import os
import requests
import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDDhMEb5ZsGy3-wFnHABtHpFApJK7NhnZA")
OPENFDA_API_KEY = os.getenv("OPENFDA_API_KEY", "2FhZUVpCAgNJNuYGHKAmYqkGpqM2wpqvotAkfJQe")

genai.configure(api_key=GEMINI_API_KEY)

def fetch_openfda_drug_data(drug_name):
    """Fetch drug information from OpenFDA API"""
    search_fields = ["openfda.brand_name", "openfda.generic_name", "openfda.substance_name", "openfda.active_ingredient"]
    
    for field in search_fields:
        url = f"https://api.fda.gov/drug/label.json?search={field}:{drug_name}&limit=1&api_key={OPENFDA_API_KEY}"
        try:
            response = requests.get(url)
            fda_data = response.json()
            
            if "results" in fda_data:
                return fda_data["results"][0]
        except Exception as e:
            print(f"Error fetching OpenFDA data: {e}")
    
    return None

def analyze_drug_with_gemini(drug_name, full_name, user_profile, drug_info):
   """Generate personalized drug analysis using Gemini AI"""
   # Extract user profile details
   chronic_conditions = user_profile.get("conditions", [])
   allergies = user_profile.get("allergies", [])
   medications = user_profile.get("medications", [])

   # Extract drug information safely
   warnings = drug_info.get("warnings", ["No warnings available."])
   side_effects = drug_info.get("adverse_reactions", ["No side effects listed."])
   usage = drug_info.get("indications_and_usage", ["Usage information not available."])
   interactions = drug_info.get("drug_interactions", ["No interactions found."])

   # Prepare AI prompt with structured format requirement
   user_prompt = f"""
   Analyze {drug_name} for {full_name} with these health conditions:
   - Chronic Conditions: {", ".join(chronic_conditions) if chronic_conditions else "None"}
   - Allergies: {allergies if allergies else "None"}
   - Current Medications: {medications if medications else "None"}
   
   Based on this drug information:
   - Warnings: {warnings}
   - Side Effects: {side_effects}
   - Usage Instructions: {usage}
   - Interactions: {interactions}
   
   Return your analysis in this exact JSON format:
   {{
       "summary": "brief overview of key points",
       "side_effects": "most relevant side effects for this patient",
       "interactions": "potential interactions with their medications",
       "usage": "recommended usage considering their conditions",
       "precautions": "specific precautions based on their health profile"
   }}
   
   The response must be valid JSON with no additional text, comments, or explanation before or after the JSON.
   """

   # Generate AI summary
   try:
       model = genai.GenerativeModel("gemini-1.5-flash")
       ai_response = model.generate_content(user_prompt)
       return ai_response.text if hasattr(ai_response, "text") else "⚠️ Unable to generate summary."
   except Exception as e:
       print(f"Error generating AI summary: {e}")
       return "⚠️ Unable to generate summary."