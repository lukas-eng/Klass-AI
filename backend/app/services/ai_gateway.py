import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("AI_API_KEY", "")

async def call_ai(prompt: str):

    if not API_KEY:
        return {
            "text": "ERROR: No se encontró AI_API_KEY en .env",
            "provider": "error"
        }

    try:
        genai.configure(api_key=API_KEY)

        model = genai.GenerativeModel("gemma-3-4b-it")

        response = await model.generate_content_async(prompt)

        print("🔍 GEMINI RESPONSE:", response.text)

        return {
            "text": response.text,
            "provider": "gemini"
        }
    except Exception as e:
        print(f"🚨 ERROR al llamar a Gemini: {e}")
        return {"text": str(e), "provider": "error"}
