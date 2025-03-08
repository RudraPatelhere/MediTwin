# MediTwin

MediTwin is an AI-powered health companion application that provides personalized medicine insights based on user health profiles. It analyzes medications in the context of a user's specific health conditions, allergies, and current medications to deliver custom recommendations and safety information.

## Project Overview

This application consists of:
- A Next.js frontend for user interaction
- A Flask backend API that integrates with external services
- Integration with Google's Gemini AI for personalized medicine analysis
- OpenFDA API integration for drug information

## Features

- User profile creation and management
- Health condition and medication tracking
- Personalized medicine analysis
- Drug safety information tailored to individual health profiles

## Tech Stack

### Frontend
- Next.js 15.2.1
- React 19.0.0
- Axios for API requests
- Responsive design with custom CSS

### Backend
- Flask with Flask-CORS
- Google Generative AI (Gemini 1.5 Flash)
- OpenFDA API integration
- Python 3.x

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── services.py
│   ├── .env
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/
│   ├── app/
│   │   ├── medicine-inquiry/
│   │   │   └── page.js
│   │   ├── profile/
│   │   │   └── page.js
│   │   ├── results/
│   │   │   └── page.js
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── Form.jsx
│   │   ├── Form.module.css
│   │   ├── StepIndicator.jsx
│   │   └── StepIndicator.module.css
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   └── package-lock.json
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   OPENFDA_API_KEY=your_openfda_api_key
   SECRET_KEY=your_secret_key
   FLASK_DEBUG=True
   ```

5. Run the Flask application:
   ```
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:3000`

## User Flow

1. User creates an account with basic information
2. User completes a health profile with conditions, allergies, and medications
3. User submits medication inquiries
4. System analyzes the medication against user's health profile
5. User receives personalized analysis results

## API Endpoints

- `GET /` - API health check
- `POST /user_profile` - Save user health profile
- `POST /drug_analysis` - Analyze a medication for a specific user

## Future Enhancements

- User authentication with secure login
- Medication scheduling and reminders
- Interaction detection between multiple medications
- Export and sharing of medication analysis reports
- Mobile application with push notifications

## Contributors

- MediTwin Team

## License

This project is licensed under the MIT License.
