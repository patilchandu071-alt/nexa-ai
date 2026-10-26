# ============================================================
# NEXA AI - FASTAPI BACKEND
# Chat + Conversation Memory + LM STUDIO
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import requests


# ============================================================
# CONFIGURATION
# ============================================================

LM_STUDIO_URL = "http://127.0.0.1:1234"

DEFAULT_MODEL = "google/gemma-4-e2b"

CONNECTION_TIMEOUT = 5
CHAT_TIMEOUT = 90

# Faster local responses
MAX_RESPONSE_TOKENS = 256


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="NEXA AI",
    description="Universal AI Workspace Backend",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ChatRequest(BaseModel):

    message: str

    mode: str = "think"

    history: List[Dict[str, Any]] = Field(
        default_factory=list
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():

    return {
        "success": True,
        "name": "NEXA AI",
        "message": "NEXA backend is running.",
        "version": "1.0.0",
    }


# ============================================================
# LM STUDIO CHECK
# ============================================================

def check_lm_studio():

    try:

        response = requests.get(
            f"{LM_STUDIO_URL}/v1/models",
            timeout=CONNECTION_TIMEOUT,
        )

        return response.status_code == 200

    except Exception as error:

        print("LM STUDIO CHECK ERROR:", error)

        return False


# ============================================================
# GET LM STUDIO MODELS
# ============================================================

def get_models():

    try:

        response = requests.get(
            f"{LM_STUDIO_URL}/v1/models",
            timeout=CONNECTION_TIMEOUT,
        )

        response.raise_for_status()

        return response.json()

    except Exception as error:

        print("MODEL ERROR:", error)

        return None


# ============================================================
# GET ACTIVE MODEL
# ============================================================

def get_active_model():

    try:

        data = get_models()

        if not data:

            return DEFAULT_MODEL

        models = data.get("data", [])

        if not models:

            return DEFAULT_MODEL

        model_id = models[0].get("id")

        if model_id:

            return model_id

    except Exception as error:

        print("MODEL DETECTION ERROR:", error)

    return DEFAULT_MODEL


# ============================================================
# INTENT DETECTION
# ============================================================

def detect_intent(message: str):

    text = message.lower().strip()


    # --------------------------------------------------------
    # CODE
    # --------------------------------------------------------

    code_words = [
        "code",
        "coding",
        "program",
        "programming",
        "python",
        "javascript",
        "typescript",
        "java",
        "c++",
        "c#",
        "react",
        "next.js",
        "nextjs",
        "fastapi",
        "api",
        "sql",
        "database",
        "debug",
        "debugging",
        "bug",
        "error in my code",
        "fix my code",
        "function",
        "class",
        "algorithm",
    ]

    if any(word in text for word in code_words):

        return "code"


    # --------------------------------------------------------
    # CREATE / WEBSITE / APP
    # --------------------------------------------------------

    create_words = [
        "build a website",
        "make a website",
        "create a website",
        "website",
        "web app",
        "web application",
        "landing page",
        "portfolio website",
        "dashboard",
        "frontend",
        "backend",
        "build an app",
        "create an app",
        "make an app",
        "application",
    ]

    if any(word in text for word in create_words):

        return "create"


    # --------------------------------------------------------
    # TRANSLATE
    # --------------------------------------------------------

    translation_words = [
        "translate",
        "translation",
        "translate this",
        "in hindi",
        "in english",
        "in kannada",
        "in marathi",
        "in tamil",
        "in telugu",
        "convert language",
    ]

    if any(word in text for word in translation_words):

        return "translate"


    # --------------------------------------------------------
    # WRITING
    # --------------------------------------------------------

    writing_words = [
        "write",
        "rewrite",
        "letter",
        "application letter",
        "leave letter",
        "email",
        "message",
        "resume",
        "cv",
        "cover letter",
        "essay",
        "report",
        "paragraph",
        "story",
        "caption",
        "script",
        "proposal",
    ]

    if any(word in text for word in writing_words):

        return "writing"


    # --------------------------------------------------------
    # STUDY
    # --------------------------------------------------------

    study_words = [
        "study",
        "exam",
        "explain",
        "learn",
        "teach me",
        "notes",
        "question",
        "questions",
        "quiz",
        "assignment",
        "college",
        "student",
        "dbms",
        "operating system",
        "computer network",
        "artificial intelligence",
        "data structure",
    ]

    if any(word in text for word in study_words):

        return "study"


    # --------------------------------------------------------
    # RESEARCH
    # --------------------------------------------------------

    research_words = [
        "research",
        "compare",
        "comparison",
        "advantages",
        "disadvantages",
        "latest",
        "deep research",
        "investigate",
        "analyze",
        "analysis",
        "why does",
        "how does",
    ]

    if any(word in text for word in research_words):

        return "research"


    # --------------------------------------------------------
    # IMAGE
    # --------------------------------------------------------

    image_words = [
        "image",
        "picture",
        "photo",
        "screenshot",
        "draw",
        "generate an image",
        "create an image",
        "analyze this image",
    ]

    if any(word in text for word in image_words):

        return "image"


    # --------------------------------------------------------
    # AUDIO
    # --------------------------------------------------------

    audio_words = [
        "audio",
        "voice",
        "speak",
        "listen",
        "music",
        "song",
        "sound",
        "recording",
    ]

    if any(word in text for word in audio_words):

        return "audio"


    # --------------------------------------------------------
    # VIDEO
    # --------------------------------------------------------

    video_words = [
        "video",
        "movie",
        "clip",
        "animation",
        "generate video",
        "create video",
        "analyze video",
    ]

    if any(word in text for word in video_words):

        return "video"


    # --------------------------------------------------------
    # DOCUMENT
    # --------------------------------------------------------

    document_words = [
        "pdf",
        "document",
        "file",
        "summarize this document",
        "read this document",
        "document summary",
        "extract from",
    ]

    if any(word in text for word in document_words):

        return "document"


    # --------------------------------------------------------
    # DATA
    # --------------------------------------------------------

    data_words = [
        "excel",
        "spreadsheet",
        "csv",
        "data analysis",
        "dataset",
        "statistics",
        "chart",
        "graph",
        "table",
    ]

    if any(word in text for word in data_words):

        return "data"


    # --------------------------------------------------------
    # DEFAULT
    # --------------------------------------------------------

    return "chat"


# ============================================================
# MODE / INTENT PROMPTS
# ============================================================

INTENT_PROMPTS = {

    "chat": """
You are handling normal conversation.

Answer naturally and directly.
Use the conversation history.
If the user gave you information earlier, remember it
and use it in later replies.
""",

    "code": """
You are handling a programming request.

Focus on:
- correct code
- debugging
- architecture
- APIs
- databases
- practical implementation

When code is requested, provide working code.
Give complete code when the user asks for full code.
""",

    "create": """
You are handling a creation request.

Help the user actually build the requested thing.

For websites or applications:
- understand requirements
- provide practical implementation
- explain important steps
- keep the solution usable
""",

    "translate": """
You are handling a translation request.

Preserve the original meaning.
Do not add unnecessary explanation.
Translate directly when the target language is clear.
""",

    "writing": """
You are handling a writing request.

Produce polished and natural writing.
Match the requested tone and purpose.
Do not add unnecessary commentary.
""",

    "study": """
You are handling a learning or study request.

Explain concepts clearly.
Use simple language when useful.
Use examples and headings when helpful.
For exam questions, focus on what the student can write.
""",

    "research": """
You are handling a research or analysis request.

Structure the answer clearly.
Separate facts from assumptions.
Give balanced explanations.
""",

    "image": """
The user is asking about an image-related task.

Help with image understanding, planning or instructions.
Do not claim that an image was generated unless
an image generation system actually generated it.
""",

    "audio": """
The user is asking about audio, music or voice.

Help with the requested audio-related task.
Do not claim that audio was generated unless
an audio system actually generated it.
""",

    "video": """
The user is asking about video.

Help plan, analyze or create the requested video workflow.
Do not claim that a video was generated unless
a video system actually generated it.
""",

    "document": """
The user is asking about a document or file.

Help summarize, explain, extract or organize information.
Do not invent document information.
""",

    "data": """
The user is asking about data.

Help analyze, organize, calculate or explain the data.
Provide practical steps and code when useful.
""",
}


# ============================================================
# BASE SYSTEM PROMPT
# ============================================================

BASE_SYSTEM_PROMPT = """
You are NEXA AI.

NEXA is a universal AI workspace.

You help users with:

- conversation
- reasoning
- coding
- websites
- applications
- writing
- letters
- translation
- study
- research
- documents
- data
- images
- audio
- video
- planning
- problem solving

IMPORTANT CONVERSATION RULES:

1. Remember the conversation history supplied to you.

2. Use previous user and assistant messages to understand
   follow-up questions.

3. If the user tells you personal information in the
   conversation, you can use that information later
   in the same conversation.

4. Do not say "I don't know" when the answer is already
   present in the conversation history.

5. Answer the user's actual request.

6. Do not unnecessarily repeat the question.

7. Do not claim a tool was used if it was not used.

8. Do not claim an image, video or audio file was created
   unless the connected system actually created it.

9. Be practical.

10. Keep normal answers concise.

11. Give detailed answers when the user asks for detail.

12. When the user asks for full code, provide complete code.
"""


# ============================================================
# BUILD SYSTEM PROMPT
# ============================================================

def build_system_prompt(
    intent: str,
    mode: str,
):

    # Manual mode has priority.

    if mode == "code":

        intent = "code"

    elif mode == "create":

        intent = "create"

    elif mode == "research":

        intent = "research"


    intent_instruction = INTENT_PROMPTS.get(
        intent,
        INTENT_PROMPTS["chat"],
    )


    return (
        BASE_SYSTEM_PROMPT
        + "\n\n"
        + intent_instruction
    )


# ============================================================
# CLEAN HISTORY
# ============================================================

def clean_history(
    history: List[Dict[str, Any]]
):

    cleaned = []


    for item in history:

        if not isinstance(item, dict):

            continue


        role = item.get("role")

        content = item.get("content")


        if role not in [
            "user",
            "assistant",
        ]:

            continue


        if not content:

            continue


        if not isinstance(content, str):

            content = str(content)


        content = content.strip()


        if not content:

            continue


        cleaned.append({

            "role": role,

            "content": content,

        })


    return cleaned


# ============================================================
# CHAT WITH LM STUDIO
# ============================================================

def chat_with_lm_studio(
    message: str,
    mode: str,
    history: List[Dict[str, Any]],
):

    # --------------------------------------------------------
    # Check LM Studio
    # --------------------------------------------------------

    if not check_lm_studio():

        return {
            "success": False,
            "reply": (
                "I couldn't connect to LM Studio. "
                "Start the LM Studio Local Server "
                "on port 1234."
            ),
            "intent": "chat",
        }


    # --------------------------------------------------------
    # Detect intent
    # --------------------------------------------------------

    intent = detect_intent(message)


    # --------------------------------------------------------
    # Build system prompt
    # --------------------------------------------------------

    system_prompt = build_system_prompt(
        intent,
        mode,
    )


    # --------------------------------------------------------
    # Build messages
    # --------------------------------------------------------

    messages = [

        {
            "role": "system",
            "content": system_prompt,
        }

    ]


    # --------------------------------------------------------
    # Previous conversation
    # --------------------------------------------------------

    cleaned_history = clean_history(
        history
    )


    # IMPORTANT:
    # Limit history to avoid making LM Studio too slow.

    max_history_messages = 20


    if len(cleaned_history) > max_history_messages:

        cleaned_history = cleaned_history[
            -max_history_messages:
        ]


    for item in cleaned_history:

        messages.append({

            "role": item["role"],

            "content": item["content"],

        })


    # --------------------------------------------------------
    # Current user message
    # --------------------------------------------------------

    messages.append({

        "role": "user",

        "content": message,

    })


    # --------------------------------------------------------
    # Active model
    # --------------------------------------------------------

    active_model = get_active_model()


    print("")
    print("======================================")
    print("NEXA AI REQUEST")
    print("======================================")
    print("Model   :", active_model)
    print("Mode    :", mode)
    print("Intent  :", intent)
    print("History :", len(cleaned_history))
    print("Message :", message[:120])
    print("======================================")


    # --------------------------------------------------------
    # LM Studio payload
    # --------------------------------------------------------

    payload = {

        "model": active_model,

        "messages": messages,

        "temperature": 0.4,

        "max_tokens": MAX_RESPONSE_TOKENS,

        "stream": False,

    }


    # --------------------------------------------------------
    # Send request
    # --------------------------------------------------------

    try:

        response = requests.post(

            f"{LM_STUDIO_URL}/v1/chat/completions",

            json=payload,

            timeout=CHAT_TIMEOUT,

        )


        # ----------------------------------------------------
        # Error from LM Studio
        # ----------------------------------------------------

        if response.status_code != 200:

            print(
                "LM STUDIO RESPONSE:",
                response.text[:2000],
            )

            return {

                "success": False,

                "reply": (
                    "LM Studio returned an error. "
                    "Please check the loaded model."
                ),

                "intent": intent,

            }


        # ----------------------------------------------------
        # Parse response
        # ----------------------------------------------------

        data = response.json()


        choices = data.get(
            "choices",
            [],
        )


        if not choices:

            return {

                "success": False,

                "reply": (
                    "NEXA received an empty response "
                    "from the AI model."
                ),

                "intent": intent,

            }


        reply = (

            choices[0]

            .get(
                "message",
                {}
            )

            .get(
                "content",
                ""
            )

        )


        if not reply:

            return {

                "success": False,

                "reply": (
                    "NEXA received no text from "
                    "the AI model."
                ),

                "intent": intent,

            }


        return {

            "success": True,

            "reply": reply.strip(),

            "intent": intent,

            "model": active_model,

        }


    # --------------------------------------------------------
    # Timeout
    # --------------------------------------------------------

    except requests.exceptions.Timeout:

        return {

            "success": False,

            "reply": (
                "The AI model is taking too long "
                "to respond. Try a shorter question "
                "or reduce the model response length."
            ),

            "intent": intent,

        }


    # --------------------------------------------------------
    # Connection error
    # --------------------------------------------------------

    except requests.exceptions.ConnectionError:

        return {

            "success": False,

            "reply": (
                "NEXA cannot connect to LM Studio. "
                "Make sure the Local Server is running "
                "on port 1234."
            ),

            "intent": intent,

        }


    # --------------------------------------------------------
    # Other error
    # --------------------------------------------------------

    except Exception as error:

        print(
            "NEXA ENGINE ERROR:",
            error,
        )

        return {

            "success": False,

            "reply": (
                "NEXA engine error: "
                + str(error)
            ),

            "intent": intent,

        }


# ============================================================
# CHAT ENDPOINT
# ============================================================

@app.post("/chat")
def chat(request: ChatRequest):

    message = request.message.strip()


    if not message:

        return {

            "success": False,

            "reply": "Please enter a message.",

        }


    result = chat_with_lm_studio(

        message=message,

        mode=request.mode,

        history=request.history,

    )


    return result


# ============================================================
# API CHAT ENDPOINT
# ============================================================
#
# This gives us compatibility if the frontend uses /api/chat.
#
# ============================================================

@app.post("/api/chat")
def api_chat(request: ChatRequest):

    return chat(request)


# ============================================================
# LM STUDIO TEST ENDPOINT
# ============================================================

@app.get("/test-lm")
def test_lm():

    try:

        response = requests.get(

            f"{LM_STUDIO_URL}/v1/models",

            timeout=CONNECTION_TIMEOUT,

        )


        return {

            "success": True,

            "status": response.status_code,

            "lm_studio": response.json(),

        }


    except Exception as error:

        return {

            "success": False,

            "error": str(error),

        }


# ============================================================
# MODEL ENDPOINT
# ============================================================

@app.get("/models")
def models():

    data = get_models()


    if not data:

        return {

            "success": False,

            "models": [],

        }


    return {

        "success": True,

        "models": data.get(
            "data",
            []
        ),

        "active_model": get_active_model(),

    }


# ============================================================
# CAPABILITIES
# ============================================================

@app.get("/capabilities")
def capabilities():

    return {

        "success": True,

        "name": "NEXA AI",

        "capabilities": [

            "chat",

            "think",

            "code",

            "create",

            "research",

            "writing",

            "translation",

            "study",

            "documents",

            "data",

            "images",

            "audio",

            "video",

        ],

    }


# ============================================================
# SERVER START
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(

        "app:app",

        host="127.0.0.1",

        port=8000,

        reload=True,

    )