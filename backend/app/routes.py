from flask import request, jsonify
import requests
from .services import analyze_drug_with_gemini, fetch_openfda_drug_data

# Temporary storage for user profiles (for demo purposes)
user_profiles = {}

def configure_routes(app):
    @app.route('/', methods=['GET'])
    def home():
        """Basic API health check"""
        return jsonify({"message": "✅ MediTwin API is running!"})

    @app.route('/user_profile', methods=['POST'])
    def save_user_profile():
        try:
            data = request.get_json()
            # Username is now pre-generated in frontend
            username = data.get("username")
            
            if not username:
                return jsonify({"error": "❌ Username is required"}), 400

            user_profiles[username] = data
            print(f"✅ User profile saved: {username}")

            return jsonify({
                "message": f"✅ Profile saved successfully for {data['name']}!", 
                "username": username
            })
        except Exception as e:
            print(f"❌ Error saving user profile: {e}")
            return jsonify({"error": str(e)}), 500

    @app.route('/drug_analysis', methods=['POST'])
    def analyze_drug():
        try:
            data = request.get_json()
            username = data.get("username")
            drug_name = data.get("drug")

            # Validate input
            if not username or username not in user_profiles:
                return jsonify({"error": "❌ User profile not found. Please submit your health details first."}), 400
            if not drug_name:
                return jsonify({"error": "❌ Please provide a drug name"}), 400

            print(f"🔍 Checking drug {drug_name} for user: {username}")

            # Fetch user health data
            user_profile = user_profiles[username]
            full_name = user_profile.get("name", "User")

            # Fetch OpenFDA drug data
            fda_data = fetch_openfda_drug_data(drug_name)
            if not fda_data:
                return jsonify({"error": "❌ No data found for this drug. Try another name or check spelling."}), 404

            # Generate personalized AI summary
            summary = analyze_drug_with_gemini(
                drug_name=drug_name, 
                full_name=full_name, 
                user_profile=user_profile, 
                drug_info=fda_data
            )

            return jsonify({
                "drug": drug_name,
                "user_profile": username,
                "summary": summary
            })

        except Exception as e:
            print(f"❌ Error analyzing drug: {e}")
            return jsonify({"error": str(e)}), 500