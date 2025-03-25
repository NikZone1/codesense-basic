import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=[
    "https://codesense-suraj0-11s-projects.vercel.app",
    "http://localhost:5173",  # For local development
    "http://localhost:3000"   # For local development alternative port
])

# Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

CODE_REVIEW_PROMPT = """Respond in a JSON format for the following code review task. The model MUST return a structured JSON output with detailed explanations for each section. The output MUST adhere to the following format and include dynamically computed values, findings, and recommendations.

Analyze the following code and provide a detailed review in this exact JSON structure:
{
    "structureAnalysis": {
        "architecture": {
            "score": number,
            "findings": [{
                "aspect": string,
                "evaluation": string,
                "recommendation": string,
                "explanation": string
            }],
            "explanation": string
        },
        "codeQuality": {
            "cyclomaticComplexity": string,
            "documentationScore": number,
            "cohesionScore": number,
            "findings": [],
            "explanation": string
        }
    },
    "implementationReview": {
        "errorHandling": {
            "score": number,
            "issues": [{
                "issue": string,
                "recommendation": string,
                "explanation": string
            }],
            "explanation": string
        },
        "performance": {
            "timeComplexity": string,
            "spaceComplexity": string,
            "bottlenecks": [{
                "function": string,
                "issue": string,
                "recommendation": string,
                "explanation": string
            }],
            "explanation": string
        }
    },
    "bestPractices": {
        "codeStyle": {
            "score": number,
            "violations": [],
            "explanation": string
        },
        "security": {
            "score": number,
            "vulnerabilities": [{
                "issue": string,
                "recommendation": string,
                "explanation": string
            }],
            "explanation": string
        }
    },
    "recommendations": {
        "priority": string,
        "items": [{
            "category": string,
            "title": string,
            "description": string,
            "severity": string,
            "explanation": string
        }],
        "explanation": string
    },
    "metrics": {
        "overallScore": number,
        "qualityScore": number,
        "securityScore": number,
        "performanceScore": number,
        "maintainabilityScore": number,
        "explanation": string
    },
    "corrections": {
        "hasCorrections": boolean,
        "correctedCode": string,
        "changes": [{
            "type": string,
            "location": string,
            "original": string,
            "correction": string,
            "explanation": string
        }],
        "explanation": string
    }
}

If there are code improvements or corrections needed, provide the corrected version of the code in the corrections.correctedCode field, and list all changes made in the corrections.changes array. Include the specific location, original code, correction, and explanation for each change.

Ensure all scores are between 0 and 100, and provide detailed explanations for each section."""

def sanitize_json_response(response_text):
    """Extract and validate JSON from Gemini response."""
    if not response_text:
        return {"error": "Empty response from Gemini"}

    try:
        # First try to parse the entire response as JSON
        return json.loads(response_text)
    except json.JSONDecodeError:
        # If that fails, try to extract JSON from the response
        try:
            # Remove markdown formatting if present
            cleaned_text = response_text.replace('```json\n', '').replace('\n```', '')
            
            # Find the first { and last }
            start = cleaned_text.find('{')
            end = cleaned_text.rfind('}') + 1
            
            if start == -1 or end <= start:
                return {"error": "No valid JSON found in response"}
            
            json_str = cleaned_text[start:end]
            return json.loads(json_str)
        except (json.JSONDecodeError, ValueError) as e:
            return {"error": f"Failed to parse JSON: {str(e)}"}

def validate_analysis_result(result):
    """Validate the structure and content of the analysis result."""
    required_sections = [
        "structureAnalysis", "implementationReview", "bestPractices",
        "recommendations", "metrics", "corrections"
    ]
    
    if not all(section in result for section in required_sections):
        return False, "Missing required sections in analysis result"
    
    # Validate corrections section
    corrections = result.get("corrections", {})
    if not isinstance(corrections.get("hasCorrections"), bool):
        return False, "Invalid corrections.hasCorrections field"
    
    if corrections["hasCorrections"]:
        if not corrections.get("correctedCode"):
            return False, "Missing correctedCode when hasCorrections is true"
        if not isinstance(corrections.get("changes"), list):
            return False, "Invalid corrections.changes field"
    
    return True, None

@app.route('/ping', methods=['GET'])
def ping():
    """Health check endpoint."""
    try:
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": "test"}]
            }]
        }
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return jsonify({"status": "ok", "message": "Backend is running and Gemini API is accessible"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 503

@app.route('/review', methods=['POST'])
def review_code():
    """Endpoint to review code using Gemini API."""
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({"error": "No code provided"}), 400

        code = data['code']

        # Validate code input
        if not isinstance(code, str) or len(code.strip()) == 0:
            return jsonify({"error": "Invalid code provided"}), 400

        # Prepare the prompt
        full_prompt = f"{CODE_REVIEW_PROMPT}\n\nCode to analyze:\n```\n{code}\n```"

        # Prepare the request to Gemini API
        url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }]
        }

        # Make the request to Gemini API
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        # Parse the response
        response_data = response.json()
        if 'candidates' not in response_data or not response_data['candidates']:
            return jsonify({"error": "No response from Gemini API"}), 500
            
        # Extract the text from the response
        response_text = response_data['candidates'][0]['content']['parts'][0]['text']
        
        # Parse and validate the response
        analysis_result = sanitize_json_response(response_text)
        if "error" in analysis_result:
            return jsonify({"error": "Failed to generate valid analysis"}), 500

        # Validate the structure and content of the analysis result
        is_valid, error_message = validate_analysis_result(analysis_result)
        if not is_valid:
            return jsonify({"error": error_message}), 500

        return jsonify(analysis_result), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"API request failed: {str(e)}"}), 503
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    if not GEMINI_API_KEY:
        print("⚠️ WARNING: GEMINI_API_KEY environment variable is not set")
        
    # Enable debug mode for development
    app.run(host='0.0.0.0', port=5000, debug=True)