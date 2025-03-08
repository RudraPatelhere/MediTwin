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
    side_effects = drug_info.get("side_effects", ["No side effects listed."])
    usage = drug_info.get("indications_and_usage", ["Usage information not available."])
    interactions = drug_info.get("ask_doctor_or_pharmacist", ["No interactions found."])

    # Prepare AI prompt
    user_prompt = f"""
    Hi {full_name}! Let's talk about **{drug_name}** and how it might affect you given your health conditions.

    Here's what I found based on your profile:
    - **Chronic Conditions:** {", ".join(chronic_conditions) if chronic_conditions else "None"}
    - **Allergies:** {", ".join(allergies) if allergies else "None"}
    - **Current Medications:** {", ".join(medications) if medications else "None"}

    Here's a personalized breakdown for you:
    - **Warnings:** {warnings}
    - **Side Effects:** {side_effects}
    - **Usage Instructions:** {usage}
    - **Possible Interactions with Your Medications:** {interactions}

    My goal is to make this simple and clear for you. If you need more details, consult your doctor or pharmacist!
    """

    # Generate AI summary
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        ai_response = model.generate_content(user_prompt)
        return ai_response.text if hasattr(ai_response, "text") else "⚠️ Unable to generate summary."
    except Exception as e:
        print(f"Error generating AI summary: {e}")
        return "⚠️ Unable to generate summary."