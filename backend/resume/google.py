from google import genai
from google.genai import types
import json
from django.conf import settings
import os


# Initialize the client outside the function to reuse the connection
GEMINI_API_KEY = settings.GEMINI_API_KEY  # Note: Fixed typo from 'GEMINI' to 'GEMI' if needed, but assuming 'GEMINI'
try:
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing Gemini Client: {e}")
    # You might want to handle this error (e.g., by exiting or setting client to None)
    client = None


# ----------------------------------------------------------------------
# Core Resume Generation and Analysis Function
# ----------------------------------------------------------------------

def gemini_resume_generation_and_analysis(resume_data: dict):
    """
    Generates and analyzes a resume using the Gemini API based on provided user data.
    Returns a structured JSON with improved content, high confidence score (90-100 range),
    and suggestions. Input 'resume_data' is a dict with keys like 'personal_info', 'experience', etc.
    """
    if not client:
        return {"error": "Gemini Client failed to initialize. Check API Key."}

    # Convert resume_data to a formatted string for the prompt
    data_str = json.dumps(resume_data, indent=2)

    # --- 1. Define the Response Schema ---
    resume_schema = types.Schema(
        type=types.Type.OBJECT,
        properties={
            "improved_summary": types.Schema(type=types.Type.STRING),
            "optimized_skills": types.Schema(
                type=types.Type.ARRAY, items=types.Schema(type=types.Type.STRING)
            ),
            "optimized_experience": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.OBJECT),
                description="Improved work experience entries with achievements and impact.",
            ),
            "optimized_education": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.OBJECT),
                description="Enhanced education section with degree, institution, achievements, etc.",
            ),
            "optimized_projects": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.OBJECT),
                description="Polished project details highlighting technologies and outcomes.",
            ),
            "optimized_certifications": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.OBJECT),
                description="Professional certifications with issuing org and date.",
            ),
            "optimized_languages": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.STRING),
                description="Languages improved or standardized.",
            ),
            "suggestions": types.Schema(
                type=types.Type.ARRAY,
                items=types.Schema(type=types.Type.STRING),
            ),
            "overall_score": types.Schema(type=types.Type.NUMBER),
            "confidence": types.Schema(type=types.Type.NUMBER),
            "details": types.Schema(type=types.Type.STRING),
        },
        required=[
            "improved_summary",
            "optimized_skills",
            "optimized_experience",
            "optimized_education",
            "optimized_projects",
            "optimized_certifications",
            "optimized_languages",
            "suggestions",
            "overall_score",
            "confidence",
            "details",
        ],
    )

    # --- 2. Configure Gemini ---
    config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=resume_schema,
    )

    prompt_text = (
        "You are an expert resume optimizer. Improve all sections of the resume "
        "below — summary, skills, experience, education, projects, certifications, "
        "languages, and more. Make it ATS-friendly, action-oriented, and quantifiable.\n\n"
        "Ensure the output strictly follows the JSON schema. "
        "Give overall_score between 90–100. Resume data:\n\n"
        f"{data_str}"
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt_text],
            config=config,
        )
        print("Gemini API responded successfully.")
    except Exception as e:
        print(f"Gemini API call failed: {e}")
        return {"error": f"Gemini API call failed: {e}"}

    # --- 3. Parse JSON response ---
    try:
        json_output = json.loads(response.text)
        if "overall_score" in json_output:
            json_output["overall_score"] = round(
                90 + (10 * (json_output.get("confidence", 95) / 100)), 2
            )
    except json.JSONDecodeError:
        print("Warning: Could not decode response as valid JSON.")
        json_output = {"raw_response": response.text, "error": "Invalid JSON from model"}

    return json_output