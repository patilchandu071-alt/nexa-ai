# ============================================================
# NEXA AI ENGINE
# AUTO INTELLIGENCE + LM STUDIO + STREAMING
# ============================================================

import requests
import re
import json


# ============================================================
# CONFIG
# ============================================================

LM_STUDIO_URL = "http://127.0.0.1:1234"

MODEL_NAME = "google/gemma-4-e2b"

CONNECTION_TIMEOUT = 5

CHAT_TIMEOUT = 90


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

    except Exception:

        return False


# ============================================================
# GET MODELS
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
            return MODEL_NAME

        models = data.get("data", [])

        if not models:
            return MODEL_NAME

        detected = models[0].get("id")

        if detected:
            return detected

    except Exception as error:

        print("MODEL DETECTION ERROR:", error)

    return MODEL_NAME


# ============================================================
# AUTO INTENT DETECTION
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
    # WEBSITE / APP
    # --------------------------------------------------------

    website_words = [
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

    if any(word in text for word in website_words):

        return "create"


    # --------------------------------------------------------
    # TRANSLATION
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
        "algorithm",
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


    return "chat"


# ============================================================
# INTENT PROMPTS
# ============================================================

INTENT_PROMPTS = {

    "chat": """
You are handling a normal conversation.

Answer naturally and directly.
Be useful and concise.
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
Explain important parts briefly.
""",

    "create": """
You are handling a creation request.

Help the user actually build the requested thing.

For websites or applications:
- understand the requirements
- propose a practical structure
- provide implementation when requested
- keep the solution usable
""",

    "translate": """
You are handling a translation request.

Preserve the original meaning.
Do not add unnecessary explanation.
If the target language is clear, translate directly.
""",

    "writing": """
You are handling a writing request.

Produce polished, natural writing.
Match the requested tone and purpose.
Do not add unnecessary commentary.
""",

    "study": """
You are handling a learning or study request.

Explain concepts clearly.
Use simple language when useful.
Use examples, headings and bullet points when helpful.
For exam questions, focus on what the student can actually write.
""",

    "research": """
You are handling a research or analysis request.

Structure the answer clearly.
Separate known information from assumptions.
Give balanced explanations.
""",

    "image": """
The user is asking about an image-related task.

Explain what can be done and provide a useful response.
If image generation or image processing requires an external
capability that is not currently connected, clearly state that.
Do not pretend an image was generated when it was not.
""",

    "audio": """
The user is asking about audio, music or voice.

Help with the requested audio-related task.
Do not claim to generate or play audio unless the capability
is actually connected.
""",

    "video": """
The user is asking about video.

Help plan, analyze or create the requested video workflow.
Do not claim to generate a video unless the capability
is actually connected.
""",

    "document": """
The user is asking about a document or file.

Help summarize, explain, extract or organize information.
Use only the provided document when document content is supplied.
""",

    "data": """
The user is asking about data.

Help analyze, organize, calculate or explain the data.
Provide practical steps and code when useful.
""",
}


# ============================================================
# BASE SYSTEM
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

Important rules:

1. Answer the user's actual request.
2. Do not unnecessarily repeat the question.
3. Do not claim a tool was used if it was not.
4. Do not claim an image, video or audio file was created
   unless the connected system actually created it.
5. Be practical.
6. Keep normal answers concise.
7. Give detailed answers when the user asks for detail.
"""


# ============================================================
# MAIN NEXA ENGINE
# ============================================================

def nexa_engine(
    message: str,
    mode: str = "think",
):

    if not message or not message.strip():

        return "Please enter a message."


    message = message.strip()


    if not check_lm_studio():

        return (
            "I couldn't connect to LM Studio. "
            "Start the LM Studio Local Server on port 1234."
        )


    intent = detect_intent(message)


    print("")
    print("======================================")
    print("NEXA REQUEST")
    print("======================================")
    print("Intent :", intent)
    print("Mode   :", mode)
    print("Message:", message[:120])
    print("======================================")


    if mode == "code":

        intent = "code"

    elif mode == "create":

        intent = "create"

    elif mode == "research":

        intent = "research"


    system_prompt = (
        BASE_SYSTEM_PROMPT
        + "\n\n"
        + INTENT_PROMPTS.get(
            intent,
            INTENT_PROMPTS["chat"],
        )
    )


    active_model = get_active_model()


    payload = {

        "model": active_model,

        "messages": [

            {
                "role": "system",
                "content": system_prompt,
            },

            {
                "role": "user",
                "content": message,
            },

        ],

        "temperature": 0.4,

        "max_tokens": 768,

        "stream": False,

    }


    try:

        response = requests.post(

            f"{LM_STUDIO_URL}/v1/chat/completions",

            json=payload,

            timeout=CHAT_TIMEOUT,

        )


        if response.status_code != 200:

            print(
                "LM STUDIO RESPONSE:",
                response.text[:1000],
            )

            return (
                "LM Studio returned an error. "
                "Please check the loaded model."
            )


        data = response.json()


        choices = data.get(
            "choices",
            [],
        )


        if not choices:

            return (
                "NEXA received an empty response "
                "from the AI model."
            )


        reply = (
            choices[0]
            .get("message", {})
            .get("content", "")
        )


        if not reply:

            return (
                "NEXA received no text from "
                "the AI model."
            )


        return reply.strip()


    except requests.exceptions.Timeout:

        return (
            "The AI model is taking too long to respond."
        )


    except requests.exceptions.ConnectionError:

        return (
            "NEXA cannot connect to LM Studio. "
            "Make sure the Local Server is running "
            "on port 1234."
        )


    except Exception as error:

        print(
            "NEXA ENGINE ERROR:",
            error,
        )

        return (
            "NEXA engine error: "
            + str(error)
        )


# ============================================================
# STREAMING NEXA ENGINE
# ============================================================

def nexa_engine_stream(
    message: str,
    mode: str = "think",
):

    if not message or not message.strip():

        yield "Please enter a message."

        return


    message = message.strip()


    # --------------------------------------------------------
    # AUTO INTENT
    # --------------------------------------------------------

    intent = detect_intent(message)


    # --------------------------------------------------------
    # MANUAL MODE
    # --------------------------------------------------------

    if mode == "code":

        intent = "code"

    elif mode == "create":

        intent = "create"

    elif mode == "research":

        intent = "research"


    # --------------------------------------------------------
    # SYSTEM PROMPT
    # --------------------------------------------------------

    system_prompt = (
        BASE_SYSTEM_PROMPT
        + "\n\n"
        + INTENT_PROMPTS.get(
            intent,
            INTENT_PROMPTS["chat"],
        )
    )


    # --------------------------------------------------------
    # ACTIVE MODEL
    # --------------------------------------------------------

    active_model = get_active_model()


    # --------------------------------------------------------
    # REQUEST
    # --------------------------------------------------------

    payload = {

        "model": active_model,

        "messages": [

            {
                "role": "system",
                "content": system_prompt,
            },

            {
                "role": "user",
                "content": message,
            },

        ],

        "temperature": 0.4,

        "max_tokens": 768,

        "stream": True,

    }


    try:

        response = requests.post(

            f"{LM_STUDIO_URL}/v1/chat/completions",

            json=payload,

            timeout=CHAT_TIMEOUT,

            stream=True,

        )


        if response.status_code != 200:

            print(
                "LM STUDIO STREAM ERROR:",
                response.text[:1000],
            )

            yield (
                "LM Studio returned an error. "
                "Please check the loaded model."
            )

            return


        # ----------------------------------------------------
        # READ STREAM
        # ----------------------------------------------------

        for line in response.iter_lines(
            decode_unicode=True
        ):

            if not line:
                continue


            if not line.startswith("data:"):
                continue


            data_text = line[5:].strip()


            if data_text == "[DONE]":
                break


            try:

                data = json.loads(
                    data_text
                )

            except Exception:

                continue


            choices = data.get(
                "choices",
                []
            )


            if not choices:
                continue


            delta = choices[0].get(
                "delta",
                {}
            )


            content = delta.get(
                "content",
                ""
            )


            if content:

                yield content


    except requests.exceptions.Timeout:

        yield (
            "\n\nNEXA timed out while "
            "waiting for the model."
        )


    except requests.exceptions.ConnectionError:

        yield (
            "\n\nNEXA cannot connect to "
            "LM Studio. Make sure the "
            "Local Server is running."
        )


    except Exception as error:

        print(
            "NEXA STREAM ERROR:",
            error
        )

        yield (
            "\n\nNEXA streaming error: "
            + str(error)
        )


# ============================================================
# DOCUMENT AI
# ============================================================

def answer_from_document(
    question: str,
    document_text: str,
    filename: str,
):

    if not question.strip():

        return "Please enter a question."


    if not document_text.strip():

        return (
            "I couldn't find readable text "
            "inside this document."
        )


    max_chars = 12000


    if len(document_text) > max_chars:

        document_text = (
            document_text[:max_chars]
            + "\n\n[Document shortened]"
        )


    prompt = f"""
You are NEXA Document Intelligence.

Document:
{filename}

DOCUMENT CONTENT:
----------------
{document_text}

USER REQUEST:
-------------
{question}

Rules:
- Use the document as the primary source.
- Do not invent information.
- If information is missing, say so.
- Give a clear useful answer.
"""


    return nexa_engine(
        message=prompt,
        mode="think",
    )