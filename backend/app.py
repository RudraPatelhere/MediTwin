from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# ✅ Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDDhMEb5ZsGy3-wFnHABtHpFApJK7NhnZA")  # Replace with your key
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Configure OpenFDA API
OPENFDA_API_KEY = os.getenv("OPENFDA_API_KEY", "2FhZUVpCAgNJNuYGHKAmYqkGpqM2wpqvotAkfJQe")  # Replace with your key

# ✅ Temporary Storage for User Profiles (for demo purposes)
user_profiles = {}

@app.route('/', methods=['GET'])
def home():
    """ Basic API health check """
    return jsonify({"message": "✅ MediTwin API is running!"})

# 🔹 **STEP 1: Collect User Health Profile**
@app.route('/user_profile', methods=['POST'])
def save_user_profile():
    try:
        data = request.get_json()
        required_fields = ["name", "age", "gender", "blood_group", "conditions", "allergies", "medications"]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"❌ Missing field: {field}"}), 400

        username = data["name"].strip().lower().replace(" ", "_")  # Normalize username
        user_profiles[username] = data  # Store user profile in memory

        print(f"✅ User profile saved: {username}")

        return jsonify({"message": "✅ Profile saved successfully!", "username": username})

    except Exception as e:
        print(f"❌ Error saving user profile: {e}")
        return jsonify({"error": str(e)}), 500

# 🔹 **STEP 2: Analyze Medicine for User Profile**
@app.route('/drug_analysis', methods=['POST'])
def analyze_drug():
    try:
        data = request.get_json()
        username = data.get("username")
        drug_name = data.get("drug")

        # ✅ Validate input
        if not username or username not in user_profiles:
            return jsonify({"error": "❌ User profile not found. Please submit your health details first."}), 400
        if not drug_name:
            return jsonify({"error": "❌ Please provide a drug name"}), 400

        print(f"🔍 Checking drug {drug_name} for user: {username}")

        # ✅ Fetch user health data
        user_profile = user_profiles[username]
        chronic_conditions = user_profile.get("conditions", [])
        allergies = user_profile.get("allergies", [])
        medications = user_profile.get("medications", [])

        # ✅ Try multiple OpenFDA search fields
        search_fields = ["openfda.brand_name", "openfda.generic_name", "openfda.substance_name", "openfda.active_ingredient"]
        fda_data = None

        for field in search_fields:
            url = f"https://api.fda.gov/drug/label.json?search={field}:{drug_name}&limit=1&api_key={OPENFDA_API_KEY}"
            print(f"🌐 Fetching: {url}")
            response = requests.get(url)
            fda_data = response.json()

            if "results" in fda_data:
                print(f"✅ Data found using: {field}")
                break  # Stop once we find valid data

        if not fda_data or "results" not in fda_data:
            return jsonify({"error": "❌ No data found for this drug. Try another name or check spelling."}), 404

        drug_info = fda_data["results"][0]

        # ✅ Extract relevant fields
        warnings = drug_info.get("warnings", ["No warnings available."])
        side_effects = drug_info.get("side_effects", ["No side effects listed."])
        usage = drug_info.get("indications_and_usage", ["Usage information not available."])
        interactions = drug_info.get("ask_doctor_or_pharmacist", ["No interactions found."])

        # ✅ AI Summary Prompt
        user_prompt = f"""
        A patient is asking for drug safety based on their health profile.
        Here’s their medical data:
        - **Chronic Conditions:** {chronic_conditions}
        - **Allergies:** {allergies}
        - **Current Medications:** {medications}

        Provide a **personalized** explanation for the drug **{drug_name}**, including:
        - **Warnings**: {warnings}
        - **Side Effects**: {side_effects}
        - **Usage**: {usage}
        - **Drug Interactions**: {interactions}

        Response should be **simple, friendly, and useful for the patient**.
        """

        # ✅ Generate AI Summary
        model = genai.GenerativeModel("gemini-1.5-flash")
        ai_response = model.generate_content(user_prompt)
        summary = ai_response.text if hasattr(ai_response, "text") else "⚠️ Unable to generate summary."

        return jsonify({
            "drug": drug_name,
            "user_profile": username,
            "summary": summary
        })

    except Exception as e:
        print(f"❌ Error analyzing drug: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
