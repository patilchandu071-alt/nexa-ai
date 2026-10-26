"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const API_URL = "http://127.0.0.1:8000";

type DocumentItem = {
  id: number;
  filename: string;
  file_type: string;
  created_at: string;
};

type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

export default function DocumentsPage() {
  const fileInput = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [dragging, setDragging] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedDocument, setSelectedDocument] =
    useState<DocumentItem | null>(null);

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  const [conversation, setConversation] =
    useState<ChatMessage[]>([]);

  // =========================================================
  // LOAD DOCUMENTS
  // =========================================================

  async function loadDocuments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/documents`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load documents."
        );
      }

      const data = await response.json();

      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);

      setError(
        "NEXA backend is not available."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  // =========================================================
  // UPLOAD
  // =========================================================

  async function uploadDocument(file: File) {
    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    if (
      extension !== "pdf" &&
      extension !== "txt"
    ) {
      setError(
        "Only PDF and TXT files are supported."
      );

      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/documents/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Upload failed."
        );
      }

      setMessage(
        `${file.name} is now part of NEXA Knowledge Vault.`
      );

      await loadDocuments();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  // =========================================================
  // FILE PICKER
  // =========================================================

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      uploadDocument(file);
    }

    event.target.value = "";
  }

  // =========================================================
  // DRAG
  // =========================================================

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    setDragging(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragging(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      uploadDocument(file);
    }
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function deleteDocument(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Delete this document?"
      );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Delete failed."
        );
      }

      if (
        selectedDocument?.id === id
      ) {
        setSelectedDocument(null);
        setConversation([]);
      }

      setMessage(
        "Document deleted successfully."
      );

      await loadDocuments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Delete failed."
      );
    }
  }

  // =========================================================
  // SELECT DOCUMENT
  // =========================================================

  function selectDocument(
    document: DocumentItem
  ) {
    setSelectedDocument(document);

    setConversation([]);

    setQuestion("");

    setMessage("");
    setError("");
  }

  // =========================================================
  // ASK NEXA
  // =========================================================

  async function askNexa() {
    if (
      !selectedDocument ||
      !question.trim() ||
      asking
    ) {
      return;
    }

    const currentQuestion =
      question.trim();

    setQuestion("");

    setConversation(
      (current) => [
        ...current,
        {
          role: "user",
          content: currentQuestion,
        },
      ]
    );

    try {
      setAsking(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/documents/${selectedDocument.id}/ask`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              question:
                currentQuestion,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "NEXA could not answer."
        );
      }

      setConversation(
        (current) => [
          ...current,
          {
            role: "ai",
            content:
              data.reply ||
              "NEXA could not generate an answer.",
          },
        ]
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "NEXA could not answer."
      );
    } finally {
      setAsking(false);
    }
  }

  // =========================================================
  // ENTER TO ASK
  // =========================================================

  function handleQuestionKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      askNexa();
    }
  }

  // =========================================================
  // DATE
  // =========================================================

  function formatDate(
    date: string
  ) {
    try {
      return new Date(
        date
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen bg-[#02070b] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[5%] top-[5%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />

        <div className="absolute right-[5%] top-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[150px]" />

        <div className="absolute bottom-0 left-[40%] h-[400px] w-[400px] rounded-full bg-emerald-500/[0.04] blur-[130px]" />

      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-20 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#030609]/80 px-6 backdrop-blur-2xl md:px-10">

        <div className="flex items-center gap-4">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] text-xl font-black text-cyan-300">
            N
          </div>

          <div>

            <div className="text-sm font-bold">
              NEXA
              <span className="text-cyan-300">
                .AI
              </span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-white/25">
              KNOWLEDGE ENGINE
            </div>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-4 py-2 sm:flex">

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]" />

            <span className="text-[10px] text-emerald-300">
              ENGINE ONLINE
            </span>

          </div>

          <button
            onClick={() =>
              window.location.href =
                "/chat"
            }
            className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs text-slate-400 transition hover:border-cyan-300/20 hover:text-white"
          >
            Back to Chat
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">

        {/* HERO */}

        <div className="mb-10">

          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] text-cyan-300">
              ✦
            </div>

            <span className="text-[10px] font-bold tracking-[0.4em] text-cyan-300">
              NEXA KNOWLEDGE VAULT
            </span>

          </div>

          <h1 className="text-4xl font-black tracking-[-0.04em] md:text-6xl">

            Your knowledge.

            <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
              Now intelligent.
            </span>

          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">
            Upload documents and ask NEXA questions
            directly from your private knowledge base.
          </p>

        </div>

        {/* STATUS */}

        {message && (

          <div className="mb-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] px-5 py-4 text-sm text-emerald-300">
            ✓ {message}
          </div>

        )}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-400/15 bg-red-400/[0.05] px-5 py-4 text-sm text-red-300">
            {error}
          </div>

        )}

        {/* =====================================================
            UPLOAD
        ===================================================== */}

        <div
          onClick={() =>
            fileInput.current?.click()
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative mb-12 flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[30px] border transition-all ${
            dragging
              ? "border-cyan-300 bg-cyan-300/[0.08]"
              : "border-white/[0.08] bg-white/[0.018] hover:border-cyan-300/25"
          }`}
        >

          <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:50px_50px]" />

          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/20 bg-[#07131a] text-3xl text-cyan-300 shadow-[0_0_50px_rgba(34,211,238,.08)] transition group-hover:scale-105">
            ↑
          </div>

          <h2 className="relative mt-6 text-xl font-bold">
            {uploading
              ? "Uploading to NEXA..."
              : "Drop your knowledge here"}
          </h2>

          <p className="relative mt-2 text-center text-sm text-slate-600">
            PDF and TXT files supported
          </p>

          <div className="relative mt-5 flex gap-2">

            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-slate-500">
              PDF
            </span>

            <span className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] text-slate-500">
              TXT
            </span>

          </div>

        </div>

        <input
          ref={fileInput}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* =====================================================
            DOCUMENT GRID
        ===================================================== */}

        <div className="mb-5 flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <h2 className="text-xl font-bold">
                Knowledge Vault
              </h2>

              <span className="rounded-full bg-cyan-300/[0.08] px-3 py-1 text-[10px] text-cyan-300">
                {documents.length}
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-600">
              Select a document to talk with NEXA
            </p>

          </div>

        </div>

        {loading ? (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="h-56 animate-pulse rounded-3xl bg-white/[0.025]"
                />

              )
            )}

          </div>

        ) : documents.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-white/[0.08] py-20 text-center">

            <div className="text-5xl text-slate-800">
              ◇
            </div>

            <h3 className="mt-5 font-semibold">
              Your vault is empty
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Upload a document to start.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {documents.map(
              (document) => (

                <article
                  key={document.id}
                  className={`group relative rounded-3xl border p-5 transition-all ${
                    selectedDocument?.id ===
                    document.id
                      ? "border-cyan-300/30 bg-cyan-300/[0.045] shadow-[0_0_50px_rgba(34,211,238,.06)]"
                      : "border-white/[0.08] bg-white/[0.018] hover:border-cyan-300/20 hover:bg-white/[0.025]"
                  }`}
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] px-3 py-3 text-[10px] font-bold text-cyan-300">
                      {document.file_type}
                    </div>

                    <button
                      onClick={() =>
                        deleteDocument(
                          document.id
                        )
                      }
                      className="text-[10px] text-slate-700 transition hover:text-red-400"
                    >
                      Delete
                    </button>

                  </div>

                  <h3
                    className="mt-6 truncate font-semibold"
                    title={document.filename}
                  >
                    {document.filename}
                  </h3>

                  <p className="mt-2 text-[10px] text-slate-600">
                    Added{" "}
                    {formatDate(
                      document.created_at
                    )}
                  </p>

                  <button
                    onClick={() =>
                      selectDocument(
                        document
                      )
                    }
                    className="mt-6 w-full rounded-xl bg-cyan-300/[0.07] px-4 py-3 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/[0.12]"
                  >
                    {selectedDocument?.id ===
                    document.id
                      ? "✓ Selected"
                      : "Ask NEXA →"}
                  </button>

                </article>

              )
            )}

          </div>

        )}

        {/* =====================================================
            AI PANEL
        ===================================================== */}

        {selectedDocument && (

          <div className="mt-10 overflow-hidden rounded-[30px] border border-cyan-300/15 bg-[#050b10]/90 shadow-[0_20px_100px_rgba(0,0,0,.35)]">

            {/* PANEL HEADER */}

            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.05] text-cyan-300">
                  N
                </div>

                <div>

                  <div className="text-sm font-bold">
                    NEXA Document Intelligence
                  </div>

                  <div className="mt-1 max-w-[240px] truncate text-[10px] text-slate-600 sm:max-w-md">
                    {selectedDocument.filename}
                  </div>

                </div>

              </div>

              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setConversation([]);
                }}
                className="text-xs text-slate-600 hover:text-white"
              >
                Close
              </button>

            </div>

            {/* CONVERSATION */}

            <div className="max-h-[500px] min-h-[180px] space-y-5 overflow-y-auto p-6">

              {conversation.length === 0 ? (

                <div className="flex min-h-[160px] flex-col items-center justify-center text-center">

                  <div className="mb-4 text-3xl text-cyan-300">
                    ✦
                  </div>

                  <h3 className="font-semibold">
                    Ask NEXA about this document
                  </h3>

                  <p className="mt-2 max-w-md text-xs leading-6 text-slate-600">
                    Ask for a summary, explanation,
                    important points, definitions,
                    or anything contained in the document.
                  </p>

                </div>

              ) : (

                conversation.map(
                  (item, index) => (

                    <div
                      key={index}
                      className={`flex ${
                        item.role ===
                        "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-7 ${
                          item.role ===
                          "user"
                            ? "rounded-tr-sm bg-cyan-300/[0.08] text-cyan-100"
                            : "rounded-tl-sm border border-white/[0.07] bg-white/[0.025] text-slate-300"
                        }`}
                      >
                        {item.content}
                      </div>

                    </div>

                  )
                )

              )}

              {asking && (

                <div className="flex items-center gap-3 text-xs text-slate-600">

                  <div className="flex gap-1">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:200ms]" />

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:400ms]" />

                  </div>

                  NEXA is reading...

                </div>

              )}

            </div>

            {/* INPUT */}

            <div className="border-t border-white/[0.06] p-4">

              <div className="flex items-end gap-2 rounded-2xl border border-white/[0.08] bg-black/30 p-2">

                <textarea
                  value={question}
                  onChange={(event) =>
                    setQuestion(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleQuestionKeyDown
                  }
                  placeholder="Ask something about this document..."
                  rows={1}
                  className="min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-700"
                />

                <button
                  onClick={askNexa}
                  disabled={
                    asking ||
                    !question.trim()
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-300 text-lg font-black text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-20"
                >
                  ↑
                </button>

              </div>

              <div className="mt-2 text-center text-[8px] tracking-[0.3em] text-slate-800">
                ANSWERS GENERATED FROM YOUR DOCUMENT
              </div>

            </div>

          </div>

        )}

      </section>

    </main>
  );
}