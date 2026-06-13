from google import genai
from app.config import settings

# Initialize the modern client using your Pydantic settings
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def draft_communication_template(event_name: str, stage: str, recipient_type: str, custom_context: str = "") -> str:
    """
    Generates an automated email template based on the event stage and audience.
    """
    prompt = f"""
    You are an automated event orchestrator writing an email template.
    Event Name: {event_name}
    Event Stage: {stage}
    Audience: {recipient_type}
    Additional Context: {custom_context}

    Write a professional, encouraging email body. 
    You MUST strictly use these placeholders where appropriate:
    {{{{name}}}} - The recipient's name
    {{{{event_name}}}} - The name of the event
    {{{{team_name}}}} - The name of the team (if applicable)
    {{{{action_link}}}} - A link they need to click (if applicable)

    Do not include the Subject line in the output, only the body. Keep it concise.
    """
    
    # Using the new, non-deprecated SDK syntax and pointing to the latest model
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt
    )
    
    return response.text.strip()