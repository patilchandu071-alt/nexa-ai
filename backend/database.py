# ============================================================
# NEXA AI
# DATABASE MODULE
# SQLite Database
# ============================================================

import sqlite3
from pathlib import Path
from typing import Optional, List, Dict, Any


# ============================================================
# DATABASE PATH
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATABASE_PATH = BASE_DIR / "nexa.db"


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():
    """
    Create and return a SQLite database connection.
    """

    connection = sqlite3.connect(
        DATABASE_PATH,
        check_same_thread=False,
    )

    connection.row_factory = sqlite3.Row

    return connection


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

def create_tables():
    """
    Create all NEXA AI database tables.
    """

    connection = get_connection()

    cursor = connection.cursor()

    # --------------------------------------------------------
    # USERS
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            email TEXT UNIQUE NOT NULL,

            password TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )
        """
    )

    # --------------------------------------------------------
    # CONVERSATIONS
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS conversations (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            title TEXT DEFAULT 'New Conversation',

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE

        )
        """
    )

    # --------------------------------------------------------
    # MESSAGES
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            conversation_id INTEGER NOT NULL,

            role TEXT NOT NULL,

            content TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (conversation_id)
                REFERENCES conversations(id)
                ON DELETE CASCADE

        )
        """
    )

    # --------------------------------------------------------
    # DOCUMENTS
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS documents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            filename TEXT NOT NULL,

            file_path TEXT,

            file_type TEXT,

            file_size INTEGER,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE

        )
        """
    )

    # --------------------------------------------------------
    # STUDY SESSIONS
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS study_sessions (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            topic TEXT NOT NULL,

            mode TEXT NOT NULL,

            response TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE

        )
        """
    )

    # --------------------------------------------------------
    # QUIZZES
    # --------------------------------------------------------

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS quizzes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER,

            topic TEXT NOT NULL,

            quiz TEXT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE

        )
        """
    )

    connection.commit()

    connection.close()


# ============================================================
# USER FUNCTIONS
# ============================================================

def create_user(
    name: str,
    email: str,
    password: str,
):
    """
    Create a new user.
    """

    connection = get_connection()

    cursor = connection.cursor()

    try:

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                password
            )
            VALUES (?, ?, ?)
            """,
            (
                name,
                email,
                password,
            ),
        )

        connection.commit()

        user_id = cursor.lastrowid

        return user_id

    except sqlite3.IntegrityError:

        return None

    finally:

        connection.close()


# ============================================================
# GET USER BY EMAIL
# ============================================================

def get_user_by_email(
    email: str,
):
    """
    Get a user using email.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = ?
        """,
        (email,),
    )

    user = cursor.fetchone()

    connection.close()

    if user is None:

        return None

    return dict(user)


# ============================================================
# GET USER BY ID
# ============================================================

def get_user_by_id(
    user_id: int,
):
    """
    Get a user using user ID.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    user = cursor.fetchone()

    connection.close()

    if user is None:

        return None

    return dict(user)


# ============================================================
# CREATE CONVERSATION
# ============================================================

def create_conversation(
    user_id: Optional[int] = None,
    title: str = "New Conversation",
):
    """
    Create a new chat conversation.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO conversations
        (
            user_id,
            title
        )
        VALUES (?, ?)
        """,
        (
            user_id,
            title,
        ),
    )

    connection.commit()

    conversation_id = cursor.lastrowid

    connection.close()

    return conversation_id


# ============================================================
# ADD MESSAGE
# ============================================================

def add_message(
    conversation_id: int,
    role: str,
    content: str,
):
    """
    Save a chat message.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO messages
        (
            conversation_id,
            role,
            content
        )
        VALUES (?, ?, ?)
        """,
        (
            conversation_id,
            role,
            content,
        ),
    )

    cursor.execute(
        """
        UPDATE conversations

        SET updated_at = CURRENT_TIMESTAMP

        WHERE id = ?
        """,
        (conversation_id,),
    )

    connection.commit()

    message_id = cursor.lastrowid

    connection.close()

    return message_id


# ============================================================
# GET CONVERSATION MESSAGES
# ============================================================

def get_messages(
    conversation_id: int,
):
    """
    Get all messages from a conversation.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT
            id,
            conversation_id,
            role,
            content,
            created_at

        FROM messages

        WHERE conversation_id = ?

        ORDER BY id ASC
        """,
        (conversation_id,),
    )

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ============================================================
# GET USER CONVERSATIONS
# ============================================================

def get_user_conversations(
    user_id: int,
):
    """
    Get conversations belonging to a user.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *

        FROM conversations

        WHERE user_id = ?

        ORDER BY updated_at DESC
        """,
        (user_id,),
    )

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ============================================================
# SAVE DOCUMENT
# ============================================================

def save_document(
    user_id: Optional[int],
    filename: str,
    file_path: Optional[str] = None,
    file_type: Optional[str] = None,
    file_size: Optional[int] = None,
):
    """
    Save uploaded document information.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO documents
        (
            user_id,
            filename,
            file_path,
            file_type,
            file_size
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            user_id,
            filename,
            file_path,
            file_type,
            file_size,
        ),
    )

    connection.commit()

    document_id = cursor.lastrowid

    connection.close()

    return document_id


# ============================================================
# GET USER DOCUMENTS
# ============================================================

def get_user_documents(
    user_id: int,
):
    """
    Get uploaded documents for a user.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        SELECT *

        FROM documents

        WHERE user_id = ?

        ORDER BY created_at DESC
        """,
        (user_id,),
    )

    rows = cursor.fetchall()

    connection.close()

    return [
        dict(row)
        for row in rows
    ]


# ============================================================
# SAVE STUDY SESSION
# ============================================================

def save_study_session(
    user_id: Optional[int],
    topic: str,
    mode: str,
    response: str,
):
    """
    Save a Study AI session.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO study_sessions
        (
            user_id,
            topic,
            mode,
            response
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            user_id,
            topic,
            mode,
            response,
        ),
    )

    connection.commit()

    session_id = cursor.lastrowid

    connection.close()

    return session_id


# ============================================================
# SAVE QUIZ
# ============================================================

def save_quiz(
    user_id: Optional[int],
    topic: str,
    quiz: str,
):
    """
    Save generated quiz.
    """

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO quizzes
        (
            user_id,
            topic,
            quiz
        )
        VALUES (?, ?, ?)
        """,
        (
            user_id,
            topic,
            quiz,
        ),
    )

    connection.commit()

    quiz_id = cursor.lastrowid

    connection.close()

    return quiz_id


# ============================================================
# DATABASE TEST
# ============================================================

def test_database():
    """
    Test whether the SQLite database is working.
    """

    connection = None

    try:

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT name

            FROM sqlite_master

            WHERE type = 'table'

            ORDER BY name
            """
        )

        result = cursor.fetchone()

        connection.close()

        return result is not None

    except Exception:

        if connection:

            connection.close()

        return False


# ============================================================
# AUTO INITIALIZATION
# ============================================================

if __name__ == "__main__":

    print("")
    print("=" * 60)
    print("NEXA AI DATABASE")
    print("=" * 60)

    try:

        create_tables()

        print("SQLite database created successfully.")
        print(f"Database: {DATABASE_PATH}")

        if test_database():

            print("Database test: PASSED")

        else:

            print("Database test: FAILED")

    except Exception as error:

        print("Database error:")
        print(error)

    print("=" * 60)