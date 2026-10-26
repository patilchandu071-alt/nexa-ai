"use client";

import React, {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";

import {
  ArrowUp,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  Copy,
  FileText,
  FolderOpen,
  Globe2,
  Home,
  Library,
  Menu,
  MessageSquare,
  Mic,
  Paperclip,
  PenLine,
  Plus,
  Search,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

/* =========================================================
   TYPES
========================================================= */

type Role = "user" | "assistant";

type Capability =
  | "think"
  | "explore"
  | "build"
  | "create"
  | "study"
  | "files"
  | "data";

type Message = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

/* =========================================================
   CAPABILITIES
   IMPORTANT:
   These appear ONLY ONCE in the main area.
========================================================= */

const capabilities: {
  id: Capability;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}[] = [
  {
    id: "think",
    title: "Deep Think",
    description: "Work through complex ideas step by step",
    icon: Sparkles,
    color: "violet",
  },
  {
    id: "build",
    title: "Build",
    description: "Turn ideas into working code",
    icon: Code2,
    color: "cyan",
  },
  {
    id: "create",
    title: "Create",
    description: "Write, design and generate",
    icon: PenLine,
    color: "orange",
  },
  {
    id: "explore",
    title: "Explore",
    description: "Research, compare and discover",
    icon: Globe2,
    color: "blue",
  },
  {
    id: "files",
    title: "Work with Files",
    description: "Understand, summarize and extract",
    icon: FileText,
    color: "green",
  },
  {
    id: "study",
    title: "Study",
    description: "Learn, practice and grow",
    icon: BookOpen,
    color: "teal",
  },
  {
    id: "data",
    title: "Analyze Data",
    description: "Find insights and visualize",
    icon: BarChart3,
    color: "pink",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function makeId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function createConversation(): Conversation {
  return {
    id: makeId(),
    title: "New conversation",
    messages: [],
    updatedAt: Date.now(),
  };
}

function createMessage(
  role: Role,
  content: string
): Message {
  return {
    id: makeId(),
    role,
    content,
    createdAt: Date.now(),
  };
}

function getApiMode(
  capability: Capability
) {
  switch (capability) {
    case "build":
      return "code";

    case "create":
      return "create";

    case "explore":
      return "research";

    case "study":
      return "study";

    case "files":
      return "documents";

    case "data":
      return "data";

    default:
      return "think";
  }
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ChatPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [activeConversationId, setActiveConversationId] =
    useState("");

  const [input, setInput] =
    useState("");

  const [selectedCapability, setSelectedCapability] =
    useState<Capability>("think");

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [attachedFile, setAttachedFile] =
    useState<File | null>(null);

  const [mobileSidebar, setMobileSidebar] =
    useState(false);

  const [copiedId, setCopiedId] =
    useState<string | null>(null);

  const [initialized, setInitialized] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const bottomRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     INITIAL LOAD
     Prevent duplicate conversation.
  ======================================================= */

  const initGuard =
    useRef(false);

  useEffect(() => {
    if (initGuard.current) {
      return;
    }

    initGuard.current = true;

    try {
      const saved =
        localStorage.getItem(
          "nexa_conversations_v6"
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.length > 0
        ) {
          setConversations(parsed);
          setActiveConversationId(
            parsed[0].id
          );
          setInitialized(true);
          return;
        }
      }
    } catch (error) {
      console.error(
        "Could not load NEXA conversations",
        error
      );
    }

    const first =
      createConversation();

    setConversations([first]);

    setActiveConversationId(
      first.id
    );

    setInitialized(true);
  }, []);

  /* =======================================================
     SAVE
  ======================================================= */

  useEffect(() => {
    if (!initialized) {
      return;
    }

    try {
      localStorage.setItem(
        "nexa_conversations_v6",
        JSON.stringify(conversations)
      );
    } catch (error) {
      console.error(
        "Could not save conversations",
        error
      );
    }
  }, [
    conversations,
    initialized,
  ]);

  /* =======================================================
     ACTIVE CONVERSATION
  ======================================================= */

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeConversationId
    ) || null;

  const messages =
    activeConversation?.messages || [];

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredConversations =
    conversations.filter(
      (conversation) =>
        conversation.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =======================================================
     AUTO SCROLL
  ======================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [
    messages.length,
    loading,
  ]);

  /* =======================================================
     NEW CHAT
  ======================================================= */

  function newConversation() {
    const conversation =
      createConversation();

    setConversations(
      (current) => [
        conversation,
        ...current,
      ]
    );

    setActiveConversationId(
      conversation.id
    );

    setInput("");
    setAttachedFile(null);
    setSelectedCapability("think");
    setMobileSidebar(false);
  }

  /* =======================================================
     UPDATE CONVERSATION
  ======================================================= */

  function updateConversation(
    updater: (
      conversation: Conversation
    ) => Conversation
  ) {
    setConversations(
      (current) =>
        current.map(
          (conversation) =>
            conversation.id ===
            activeConversationId
              ? updater(conversation)
              : conversation
        )
    );
  }

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  async function sendMessage(
    event?: FormEvent
  ) {
    event?.preventDefault();

    const text =
      input.trim();

    if (
      !text ||
      loading ||
      !activeConversation
    ) {
      return;
    }

    const userMessage =
      createMessage(
        "user",
        text
      );

    const previousMessages =
      activeConversation.messages;

    updateConversation(
      (conversation) => ({
        ...conversation,

        title:
          conversation.messages
            .length === 0
            ? text.slice(0, 48)
            : conversation.title,

        messages: [
          ...conversation.messages,
          userMessage,
        ],

        updatedAt:
          Date.now(),
      })
    );

    setInput("");
    setLoading(true);

    try {
      const history =
        previousMessages
          .slice(-20)
          .map((message) => ({
            role:
              message.role,
            content:
              message.content,
          }));

      /*
       * EXPLORE MODE
       * ---------------------------------------------------------
       * Explore uses NEXA's real web-search endpoint instead of
       * sending the request to the normal chat endpoint.
       */
      if (selectedCapability === "explore") {
        const response =
          await fetch(
            `${API_URL}/web-search`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                query: text,
                max_results: 5,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            `Web search HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!data.success) {
          throw new Error(
            data.error ||
              "Web search failed."
          );
        }

        const results =
          Array.isArray(data.results)
            ? data.results
            : [];

        let reply = "";

        if (results.length === 0) {
          reply =
            `## Explore\\n\\nI couldn't find web results for **${text}**. Try a more specific search.`;
        } else {
          reply =
            `## Explore results\\n\\nHere are the latest web results I found for **${text}**.\\n\\n`;

          reply += results
            .map(
              (
                result: {
                  title?: string;
                  href?: string;
                  body?: string;
                  snippet?: string;
                },
                index: number
              ) => {
                const title =
                  result.title ||
                  `Result ${index + 1}`;

                const url =
                  result.href || "";

                const summary =
                  result.body ||
                  result.snippet ||
                  "No description available.";

                if (url) {
                  return `### ${index + 1}. [${title}](${url})\\n${summary}`;
                }

                return `### ${index + 1}. ${title}\\n${summary}`;
              }
            )
            .join("\\n\\n");
        }

        const assistantMessage =
          createMessage(
            "assistant",
            reply
          );

        updateConversation(
          (conversation) => ({
            ...conversation,

            messages: [
              ...conversation.messages,
              assistantMessage,
            ],

            updatedAt:
              Date.now(),
          })
        );
      } else {
        /*
         * NORMAL NEXA CHAT
         * -------------------------------------------------------
         * All other capabilities continue using the normal
         * /chat endpoint.
         */
        const response =
          await fetch(
            `${API_URL}/chat`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                message: text,

                mode:
                  getApiMode(
                    selectedCapability
                  ),

                history,
              }),
            }
          );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        const reply =
          data.reply ||
          data.message ||
          "I couldn't generate a response.";

        const assistantMessage =
          createMessage(
            "assistant",
            reply
          );

        updateConversation(
          (conversation) => ({
            ...conversation,

            messages: [
              ...conversation.messages,
              assistantMessage,
            ],

            updatedAt:
              Date.now(),
          })
        );
      }
    } catch (error) {
      console.error(
        "NEXA error:",
        error
      );

      const errorMessage =
        createMessage(
          "assistant",
          "I couldn't connect to NEXA right now. Please make sure the backend is running and try again."
        );

      updateConversation(
        (conversation) => ({
          ...conversation,

          messages: [
            ...conversation.messages,
            errorMessage,
          ],

          updatedAt:
            Date.now(),
        })
      );
    } finally {
      setLoading(false);
    }
  }

  /* =======================================================
     CAPABILITY
  ======================================================= */

  function selectCapability(
    capability: Capability
  ) {
    setSelectedCapability(
      capability
    );

    const prompts: Record<
      Capability,
      string
    > = {
      think:
        "",
      build:
        "I want to build ",
      create:
        "I want to create ",
      explore:
        "Help me research ",
      study:
        "Help me study ",
      files:
        "Help me understand this file: ",
      data:
        "Help me analyze this data: ",
    };

    if (
      prompts[capability]
    ) {
      setInput(
        prompts[capability]
      );

      setTimeout(() => {
        document
          .getElementById(
            "nexa-input"
          )
          ?.focus();
      }, 50);
    }
  }

  /* =======================================================
     QUICK PROMPTS
  ======================================================= */

  function useQuickPrompt(
    text: string,
    capability: Capability
  ) {
    setSelectedCapability(
      capability
    );

    setInput(text);

    setTimeout(() => {
      document
        .getElementById(
          "nexa-input"
        )
        ?.focus();
    }, 50);
  }

  /* =======================================================
     COPY
  ======================================================= */

  async function copyMessage(
    id: string,
    content: string
  ) {
    try {
      await navigator.clipboard.writeText(
        content
      );

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {}
  }

  /* =======================================================
     KEYBOARD
  ======================================================= */

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="nexa-app">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="background-layer">

        <div className="stars stars-one" />
        <div className="stars stars-two" />

        <div className="nebula nebula-one" />
        <div className="nebula nebula-two" />
        <div className="nebula nebula-three" />

        <div className="mountain-silhouette" />

      </div>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileSidebar && (
        <button
          className="mobile-overlay"
          onClick={() =>
            setMobileSidebar(false)
          }
          aria-label="Close menu"
        />
      )}

      {/* =================================================
          LEFT SIDEBAR
      ================================================= */}

      <aside
        className={`sidebar ${
          mobileSidebar
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="brand-area">

          <div className="brand-orb">

            <div className="orb-ring orb-ring-1" />
            <div className="orb-ring orb-ring-2" />
            <div className="orb-letter">
              N
            </div>

          </div>

          <div>

            <div className="brand-name">
              NEXA
            </div>

            <div className="brand-caption">
              YOUR AI WORKSPACE
            </div>

          </div>

        </div>

        {/* NEW CHAT */}

        <button
          onClick={
            newConversation
          }
          className="new-chat-button"
        >

          <Plus size={20} />

          <span>
            New Conversation
          </span>

          <kbd>
            N
          </kbd>

        </button>

        {/* MAIN NAVIGATION */}

        <div className="sidebar-section">

          <div className="sidebar-label">
            WORKSPACE
          </div>

          <button className="sidebar-nav active">

            <MessageSquare
              size={17}
            />

            <span>
              Chat
            </span>

          </button>

          <button className="sidebar-nav">

            <Home size={17} />

            <span>
              Home
            </span>

          </button>

          <button className="sidebar-nav">

            <Library size={17} />

            <span>
              Library
            </span>

          </button>

        </div>

        {/* CONVERSATIONS */}

        <div className="conversation-section">

          <div className="conversation-heading">

            <span>
              CONVERSATIONS
            </span>

            <Search size={13} />

          </div>

          <div className="conversation-list">

            {filteredConversations.length ===
              0 && (
              <div className="empty-history">
                No conversations
              </div>
            )}

            {filteredConversations
              .slice(0, 10)
              .map(
                (
                  conversation
                ) => {

                  const active =
                    conversation.id ===
                    activeConversationId;

                  return (
                    <button
                      key={
                        conversation.id
                      }
                      onClick={() => {
                        setActiveConversationId(
                          conversation.id
                        );

                        setMobileSidebar(
                          false
                        );
                      }}
                      className={`conversation-item ${
                        active
                          ? "conversation-active"
                          : ""
                      }`}
                    >

                      <div className="conversation-file">
                        <FileText
                          size={15}
                        />
                      </div>

                      <div className="conversation-info">

                        <div className="conversation-title">
                          {
                            conversation.title
                          }
                        </div>

                        <div className="conversation-time">
                          {conversation.messages.length}{" "}
                          messages
                        </div>

                      </div>

                    </button>
                  );
                }
              )}

          </div>

        </div>

        {/* PRO */}

        <div className="pro-card">

          <div className="pro-crown">
            ✦
          </div>

          <div className="pro-content">

            <div className="pro-title">
              NEXA Pro
            </div>

            <div className="pro-description">
              Unlock all features
            </div>

          </div>

          <button className="upgrade-button">
            Upgrade
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <section className="main-area">

        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="topbar">

          <div className="mobile-brand">

            <button
              onClick={() =>
                setMobileSidebar(true)
              }
              className="mobile-menu-button"
            >
              <Menu size={18} />
            </button>

            <span>
              NEXA
            </span>

          </div>

          {/* GLOBAL SEARCH */}

          <div className="global-search">

            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search anything... conversations, files, tools"
            />

            <kbd>
              /
            </kbd>

          </div>

          {/* NAV */}

          <nav className="top-navigation">

            <button>
              <Home size={14} />
              Home
            </button>

            <button className="top-active">
              <MessageSquare
                size={14}
              />
              Chat
            </button>

            <button>
              <Zap size={14} />
              Tools
            </button>

            <button>
              <Library size={14} />
              Library
            </button>

          </nav>

          {/* USER */}

          <div className="top-actions">

            <button className="pro-pill">
              ✦ Pro
            </button>

            <button className="notification-button">
              <Bell size={17} />
              <span />
            </button>

            <div className="user-avatar">
              H
            </div>

          </div>

        </header>

        {/* =================================================
            WORKSPACE
        ================================================= */}

        <div className="workspace">

          {/* CENTER */}

          <div className="center-content">

            {messages.length ===
            0 ? (

              <>

                {/* HERO */}

                <section className="hero">

                  <div className="hero-background-image">

                    <div className="hero-mountains" />

                    <div className="hero-moon" />

                    <div className="hero-nexa-orb">

                      <div className="hero-orbit orbit-a" />
                      <div className="hero-orbit orbit-b" />
                      <div className="hero-orbit orbit-c" />

                      <div className="hero-nexa-letter">
                        N
                      </div>

                    </div>

                    <div className="hero-arrow">
                      Your AI
                      <br />
                      Partner ↗
                    </div>

                  </div>

                  <div className="hero-content">

                    <div className="greeting">
                      Good evening 👋
                    </div>

                    <h1>
                      What shall we{" "}
                      <span>
                        create
                      </span>{" "}
                      today?
                    </h1>

                    <p>
                      Your ideas, questions,
                      documents and dreams —
                      all in one intelligent
                      workspace.
                    </p>

                  </div>

                </section>

                {/* CAPABILITIES
                    EACH APPEARS ONLY ONCE
                */}

                <section className="capability-grid">

                  {capabilities.map(
                    (capability) => (
                      <CapabilityCard
                        key={
                          capability.id
                        }
                        capability={
                          capability
                        }
                        selected={
                          selectedCapability ===
                          capability.id
                        }
                        onClick={() =>
                          selectCapability(
                            capability.id
                          )
                        }
                      />
                    )
                  )}

                </section>

                {/* QUICK IDEAS */}

                <section className="quick-section">

                  <div className="quick-heading">
                    Quick ideas to get started:
                  </div>

                  <div className="quick-list">

                    <QuickIdea
                      text="Design a modern portfolio website"
                      capability="build"
                      onClick={
                        useQuickPrompt
                      }
                    />

                    <QuickIdea
                      text="Explain this concept in simple words"
                      capability="think"
                      onClick={
                        useQuickPrompt
                      }
                    />

                    <QuickIdea
                      text="Analyze the data file"
                      capability="data"
                      onClick={
                        useQuickPrompt
                      }
                    />

                    <QuickIdea
                      text="Help me learn Python"
                      capability="study"
                      onClick={
                        useQuickPrompt
                      }
                    />

                  </div>

                </section>

              </>

            ) : (

              /* =================================================
                 CHAT MESSAGES
              ================================================= */

              <section className="messages-area">

                <div className="messages-header">

                  <div>

                    <div className="messages-label">
                      CONVERSATION
                    </div>

                    <h2>
                      {
                        activeConversation?.title
                      }
                    </h2>

                  </div>

                  <div className="selected-mode">

                    <Sparkles
                      size={14}
                    />

                    {
                      capabilities.find(
                        (item) =>
                          item.id ===
                          selectedCapability
                      )?.title
                    }

                  </div>

                </div>

                {messages.map(
                  (message) => (
                    <ChatMessage
                      key={
                        message.id
                      }
                      message={
                        message
                      }
                      copied={
                        copiedId ===
                        message.id
                      }
                      onCopy={() =>
                        copyMessage(
                          message.id,
                          message.content
                        )
                      }
                    />
                  )
                )}

                {loading && (
                  <div className="thinking-row">

                    <div className="message-orb">
                      N
                    </div>

                    <div className="thinking-card">

                      <span />
                      <span />
                      <span />

                      <em>
                        NEXA is thinking
                      </em>

                    </div>

                  </div>
                )}

                <div
                  ref={
                    bottomRef
                  }
                />

              </section>

            )}

            {/* =================================================
                COMPOSER
            ================================================= */}

            <div
              className={`composer-wrapper ${
                messages.length > 0
                  ? "composer-chat"
                  : ""
              }`}
            >

              {attachedFile && (
                <div className="attachment-chip">

                  <FileText size={14} />

                  <span>
                    {
                      attachedFile.name
                    }
                  </span>

                  <button
                    onClick={() =>
                      setAttachedFile(
                        null
                      )
                    }
                  >
                    <X size={13} />
                  </button>

                </div>
              )}

              <form
                onSubmit={
                  sendMessage
                }
                className="composer"
              >

                <div className="composer-top">

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="composer-tool"
                    title="Attach file"
                  >
                    <Paperclip
                      size={17}
                    />
                  </button>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    className="hidden"
                    onChange={(
                      event
                    ) => {
                      const file =
                        event
                          .target
                          .files?.[0];

                      if (file) {
                        setAttachedFile(
                          file
                        );
                      }
                    }}
                  />

                  <button
                    type="button"
                    className="composer-search"
                    onClick={() =>
                      setSelectedCapability(
                        "explore"
                      )
                    }
                  >
                    <Globe2
                      size={14}
                    />
                    Explore
                  </button>

                  <button
                    type="button"
                    className="composer-search"
                    onClick={() =>
                      setSelectedCapability(
                        "think"
                      )
                    }
                  >
                    <Sparkles
                      size={14}
                    />
                    Deep Think
                  </button>

                </div>

                <textarea
                  id="nexa-input"
                  value={input}
                  onChange={(event) =>
                    setInput(
                      event.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                  placeholder="Ask NEXA anything..."
                  rows={2}
                />

                <div className="composer-bottom">

                  <div className="composer-hint">
                    {selectedCapability ===
                    "think"
                      ? "Deep reasoning enabled"
                      : `${
                          capabilities.find(
                            (item) =>
                              item.id ===
                              selectedCapability
                          )?.title
                        } selected`}
                  </div>

                  <div className="composer-actions">

                    <button
                      type="button"
                      className="voice-button"
                    >
                      <Mic
                        size={17}
                      />
                    </button>

                    <button
                      type="submit"
                      disabled={
                        !input.trim() ||
                        loading
                      }
                      className="send-button"
                    >
                      <ArrowUp
                        size={19}
                      />
                    </button>

                  </div>

                </div>

              </form>

              <div className="composer-disclaimer">
                NEXA can make mistakes. Check
                important information.
              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT PANEL
              NO DUPLICATE CAPABILITIES HERE
          ================================================= */}

          <aside className="right-panel">

            {/* TODAY */}

            <div className="right-card today-card">

              <div className="right-heading">

                <strong>
                  Today
                </strong>

                <span>
                  {new Date().toLocaleDateString(
                    "en-US",
                    {
                      weekday:
                        "short",
                      month:
                        "short",
                      day:
                        "numeric",
                    }
                  )}
                </span>

              </div>

              <div className="today-content">

                <div className="progress-ring">

                  <div className="progress-inner">

                    <strong>
                      {messages.length}
                    </strong>

                    <span>
                      messages
                    </span>

                  </div>

                </div>

                <div className="today-stats">

                  <div>
                    <i className="green" />
                    <span>
                      Active
                    </span>
                  </div>

                  <div>
                    <i className="blue" />
                    <span>
                      {conversations.length}{" "}
                      Conversations
                    </span>
                  </div>

                  <div>
                    <i className="orange" />
                    <span>
                      Workspace
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* QUOTE */}

            <div className="quote-card">

              <div className="quote-glow" />

              <p>
                “Big ideas start with
                a single conversation.”
              </p>

            </div>

            {/* RECENT FILES */}

            <div className="right-section">

              <div className="right-section-title">

                <span>
                  Recent Files
                </span>

                <button>
                  See all →
                </button>

              </div>

              <div className="recent-files">

                <RecentFile
                  icon="PDF"
                  name="project-plan.pdf"
                  size="2.4 MB"
                  time="1 hour ago"
                />

                <RecentFile
                  icon="XLS"
                  name="data-analysis.xlsx"
                  size="1.1 MB"
                  time="3 hours ago"
                />

                <RecentFile
                  icon="DOC"
                  name="research-notes.docx"
                  size="856 KB"
                  time="5 hours ago"
                />

              </div>

            </div>

            {/* WORKSPACE */}

            <div className="right-card workspace-status">

              <div className="workspace-status-header">

                <span className="online-dot" />

                <strong>
                  Workspace Status
                </strong>

                <span className="online-text">
                  Online
                </span>

              </div>

              <div className="status-grid">

                <div>
                  <strong>
                    {conversations.length}
                  </strong>

                  <span>
                    Projects
                  </span>
                </div>

                <div>
                  <strong>
                    {messages.length}
                  </strong>

                  <span>
                    Messages
                  </span>
                </div>

                <div>
                  <strong>
                    1
                  </strong>

                  <span>
                    Workspace
                  </span>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

      {/* =====================================================
          GLOBAL STYLES
      ===================================================== */}

      <style jsx global>{`

        * {
          box-sizing:
            border-box;
        }

        html,
        body {
          margin:
            0;

          padding:
            0;

          width:
            100%;

          height:
            100%;

          overflow:
            hidden;

          background:
            #050814;
        }

        body {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input,
        textarea {
          font:
            inherit;
        }

        button {
          cursor:
            pointer;
        }

        .hidden {
          display:
            none;
        }

        /* =====================================================
           APP
        ===================================================== */

        .nexa-app {
          position:
            relative;

          display:
            flex;

          width:
            100vw;

          height:
            100vh;

          overflow:
            hidden;

          color:
            #f8fafc;

          background:
            #050814;
        }

        /* =====================================================
           BACKGROUND
        ===================================================== */

        .background-layer {
          position:
            fixed;

          inset:
            0;

          overflow:
            hidden;

          pointer-events:
            none;

          background:
            radial-gradient(
              circle at 55% 25%,
              rgba(60,80,180,.16),
              transparent 35%
            ),
            radial-gradient(
              circle at 20% 60%,
              rgba(15,160,210,.07),
              transparent 30%
            ),
            #050814;
        }

        .stars {
          position:
            absolute;

          inset:
            0;

          opacity:
            .5;

          background-image:
            radial-gradient(
              circle,
              rgba(255,255,255,.7) 1px,
              transparent 1px
            );

          background-size:
            90px 90px;

          animation:
            starsMove 30s linear infinite;
        }

        .stars-two {
          background-size:
            170px 170px;

          opacity:
            .22;

          animation-duration:
            50s;

          animation-direction:
            reverse;
        }

        @keyframes starsMove {

          from {
            transform:
              translate(0,0);
          }

          to {
            transform:
              translate(90px,45px);
          }

        }

        .nebula {
          position:
            absolute;

          border-radius:
            50%;

          filter:
            blur(90px);

          animation:
            nebulaFloat 15s
            ease-in-out
            infinite;
        }

        .nebula-one {
          width:
            500px;

          height:
            500px;

          left:
            20%;

          top:
            -250px;

          background:
            rgba(99,102,241,.12);
        }

        .nebula-two {
          width:
            450px;

          height:
            450px;

          right:
            -180px;

          top:
            20%;

          background:
            rgba(168,85,247,.12);

          animation-delay:
            -5s;
        }

        .nebula-three {
          width:
            400px;

          height:
            400px;

          left:
            35%;

          bottom:
            -300px;

          background:
            rgba(14,165,233,.08);

          animation-delay:
            -9s;
        }

        @keyframes nebulaFloat {

          0%,
          100% {
            transform:
              translate(0,0)
              scale(1);
          }

          50% {
            transform:
              translate(40px,-30px)
              scale(1.1);
          }

        }

        .mountain-silhouette {
          position:
            absolute;

          left:
            0;

          right:
            0;

          bottom:
            0;

          height:
            24%;

          opacity:
            .22;

          background:
            linear-gradient(
              135deg,
              transparent 0 10%,
              #111b3a 10% 18%,
              transparent 18% 25%,
              #0d1731 25% 40%,
              transparent 40% 48%,
              #111936 48% 62%,
              transparent 62% 70%,
              #0c152e 70% 82%,
              transparent 82%
            );

          clip-path:
            polygon(
              0 100%,
              0 65%,
              10% 48%,
              18% 68%,
              27% 35%,
              35% 60%,
              46% 28%,
              55% 62%,
              65% 38%,
              73% 64%,
              82% 30%,
              92% 57%,
              100% 40%,
              100% 100%
            );
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          position:
            relative;

          z-index:
            20;

          display:
            flex;

          width:
            275px;

          min-width:
            275px;

          height:
            100%;

          flex-direction:
            column;

          border-right:
            1px solid
            rgba(255,255,255,.07);

          background:
            linear-gradient(
              180deg,
              rgba(4,9,22,.96),
              rgba(3,7,17,.91)
            );

          backdrop-filter:
            blur(30px);
        }

        .brand-area {
          display:
            flex;

          align-items:
            center;

          gap:
            12px;

          height:
            82px;

          padding:
            16px 20px;

          border-bottom:
            1px solid
            rgba(255,255,255,.05);
        }

        .brand-orb {
          position:
            relative;

          display:
            flex;

          width:
            43px;

          height:
            43px;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            14px;

          background:
            rgba(18,30,70,.8);

          box-shadow:
            0 0 25px
            rgba(72,82,255,.25);
        }

        .orb-ring {
          position:
            absolute;

          border-radius:
            50%;

          border:
            1px solid
            rgba(95,190,255,.7);
        }

        .orb-ring-1 {
          inset:
            2px;

          animation:
            rotateOrb 6s linear infinite;
        }

        .orb-ring-2 {
          inset:
            7px;

          border-color:
            rgba(191,75,255,.6);

          animation:
            rotateOrb 4s linear infinite reverse;
        }

        .orb-letter {
          font-size:
            19px;

          font-weight:
            900;

          color:
            #67e8f9;

          text-shadow:
            0 0 14px
            rgba(103,232,249,.9);
        }

        @keyframes rotateOrb {

          to {
            transform:
              rotate(360deg);
          }

        }

        .brand-name {
          font-size:
            17px;

          font-weight:
            900;

          letter-spacing:
            -.04em;
        }

        .brand-caption {
          margin-top:
            3px;

          font-size:
            8px;

          letter-spacing:
            .17em;

          color:
            #64748b;
        }

        .new-chat-button {
          position:
            relative;

          display:
            flex;

          align-items:
            center;

          gap:
            11px;

          margin:
            14px 14px 10px;

          padding:
            13px 14px;

          border:
            1px solid
            rgba(126,120,255,.55);

          border-radius:
            14px;

          color:
            white;

          background:
            linear-gradient(
              100deg,
              #4f46e5,
              #7c3aed,
              #2563eb
            );

          box-shadow:
            0 0 30px
            rgba(79,70,229,.25);

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .new-chat-button:hover {
          transform:
            translateY(-2px);

          box-shadow:
            0 0 40px
            rgba(124,58,237,.42);
        }

        .new-chat-button span {
          flex:
            1;

          text-align:
            left;

          font-size:
            12px;

          font-weight:
            700;
        }

        .new-chat-button kbd {
          padding:
            3px 7px;

          border:
            1px solid
            rgba(255,255,255,.22);

          border-radius:
            6px;

          font-size:
            9px;

          color:
            rgba(255,255,255,.7);
        }

        .sidebar-section {
          padding:
            8px 12px;
        }

        .sidebar-label,
        .conversation-heading {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            9px 10px;

          font-size:
            8px;

          font-weight:
            800;

          letter-spacing:
            .22em;

          color:
            #536179;
        }

        .sidebar-nav {
          display:
            flex;

          width:
            100%;

          align-items:
            center;

          gap:
            12px;

          margin:
            2px 0;

          padding:
            10px 11px;

          border:
            1px solid
            transparent;

          border-radius:
            10px;

          color:
            #7c8ba3;

          background:
            transparent;

          text-align:
            left;

          transition:
            color .2s ease,
            background .2s ease,
            transform .2s ease;
        }

        .sidebar-nav:hover {
          color:
            #dbeafe;

          background:
            rgba(255,255,255,.035);

          transform:
            translateX(2px);
        }

        .sidebar-nav.active {
          color:
            #fff;

          background:
            linear-gradient(
              90deg,
              rgba(99,102,241,.2),
              rgba(30,64,175,.08)
            );

          border-color:
            rgba(99,102,241,.2);

          box-shadow:
            inset 2px 0
            #60a5fa;
        }

        .sidebar-nav span {
          font-size:
            11px;
        }

        .conversation-section {
          display:
            flex;

          min-height:
            0;

          flex:
            1;

          flex-direction:
            column;

          padding:
            4px 12px;
        }

        .conversation-list {
          overflow:
            auto;
        }

        .conversation-item {
          display:
            flex;

          width:
            100%;

          align-items:
            center;

          gap:
            10px;

          padding:
            9px 9px;

          border:
            1px solid
            transparent;

          border-radius:
            10px;

          color:
            #7c8ba3;

          background:
            transparent;

          text-align:
            left;

          transition:
            all .2s ease;
        }

        .conversation-item:hover {
          color:
            #dbeafe;

          background:
            rgba(255,255,255,.03);
        }

        .conversation-active {
          color:
            #f1f5f9;

          border-color:
            rgba(34,211,238,.2);

          background:
            linear-gradient(
              90deg,
              rgba(8,145,178,.14),
              rgba(30,41,59,.08)
            );

          box-shadow:
            inset 2px 0
            #22d3ee;
        }

        .conversation-file {
          display:
            flex;

          width:
            31px;

          height:
            31px;

          flex-shrink:
            0;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            8px;

          color:
            #8b5cf6;

          background:
            rgba(139,92,246,.08);
        }

        .conversation-info {
          min-width:
            0;
        }

        .conversation-title {
          overflow:
            hidden;

          font-size:
            10px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .conversation-time {
          margin-top:
            3px;

          font-size:
            8px;

          color:
            #475569;
        }

        .empty-history {
          padding:
            25px 10px;

          text-align:
            center;

          font-size:
            10px;

          color:
            #475569;
        }

        .pro-card {
          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          margin:
            12px;

          padding:
            11px;

          border:
            1px solid
            rgba(245,158,11,.28);

          border-radius:
            14px;

          background:
            linear-gradient(
              135deg,
              rgba(245,158,11,.12),
              rgba(124,58,237,.08)
            );

          box-shadow:
            0 0 30px
            rgba(245,158,11,.06);
        }

        .pro-crown {
          display:
            flex;

          width:
            31px;

          height:
            31px;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            9px;

          color:
            #fbbf24;

          background:
            rgba(245,158,11,.13);
        }

        .pro-content {
          flex:
            1;
        }

        .pro-title {
          font-size:
            10px;

          font-weight:
            800;
        }

        .pro-description {
          margin-top:
            3px;

          font-size:
            8px;

          color:
            #64748b;
        }

        .upgrade-button {
          padding:
            7px 9px;

          border:
            0;

          border-radius:
            8px;

          color:
            white;

          background:
            linear-gradient(
              135deg,
              #f59e0b,
              #d97706
            );

          font-size:
            8px;

          font-weight:
            800;
        }

        /* =====================================================
           MAIN
        ===================================================== */

        .main-area {
          position:
            relative;

          z-index:
            5;

          display:
            flex;

          min-width:
            0;

          flex:
            1;

          flex-direction:
            column;
        }

        .topbar {
          display:
            flex;

          height:
            72px;

          flex-shrink:
            0;

          align-items:
            center;

          gap:
            18px;

          padding:
            0 18px;

          border-bottom:
            1px solid
            rgba(255,255,255,.06);

          background:
            rgba(3,7,17,.65);

          backdrop-filter:
            blur(25px);
        }

        .global-search {
          display:
            flex;

          width:
            min(520px, 42vw);

          height:
            38px;

          align-items:
            center;

          gap:
            10px;

          padding:
            0 12px;

          border:
            1px solid
            rgba(148,163,184,.16);

          border-radius:
            11px;

          color:
            #64748b;

          background:
            rgba(15,23,42,.7);
        }

        .global-search:focus-within {
          border-color:
            rgba(96,165,250,.45);

          box-shadow:
            0 0 25px
            rgba(59,130,246,.08);
        }

        .global-search input {
          min-width:
            0;

          flex:
            1;

          border:
            0;

          outline:
            0;

          color:
            #e2e8f0;

          background:
            transparent;

          font-size:
            11px;
        }

        .global-search input::placeholder {
          color:
            #475569;
        }

        .global-search kbd {
          padding:
            3px 7px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius:
            5px;

          color:
            #64748b;

          font-size:
            9px;
        }

        .top-navigation {
          display:
            flex;

          align-items:
            center;

          gap:
            3px;

          margin-left:
            auto;

          padding:
            3px;

          border:
            1px solid
            rgba(148,163,184,.16);

          border-radius:
            12px;

          background:
            rgba(15,23,42,.65);
        }

        .top-navigation button {
          display:
            flex;

          align-items:
            center;

          gap:
            6px;

          padding:
            7px 11px;

          border:
            0;

          border-radius:
            9px;

          color:
            #64748b;

          background:
            transparent;

          font-size:
            9px;
        }

        .top-navigation button:hover {
          color:
            #e2e8f0;
        }

        .top-navigation .top-active {
          color:
            white;

          background:
            linear-gradient(
              135deg,
              #4338ca,
              #2563eb
            );

          box-shadow:
            0 0 18px
            rgba(59,130,246,.24);
        }

        .top-actions {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;
        }

        .pro-pill {
          padding:
            7px 12px;

          border:
            1px solid
            rgba(245,158,11,.45);

          border-radius:
            999px;

          color:
            #fbbf24;

          background:
            rgba(245,158,11,.07);

          font-size:
            9px;

          font-weight:
            800;
        }

        .notification-button {
          position:
            relative;

          display:
            flex;

          width:
            34px;

          height:
            34px;

          align-items:
            center;

          justify-content:
            center;

          border:
            0;

          border-radius:
            10px;

          color:
            #64748b;

          background:
            transparent;
        }

        .notification-button:hover {
          color:
            white;

          background:
            rgba(255,255,255,.04);
        }

        .notification-button span {
          position:
            absolute;

          top:
            7px;

          right:
            7px;

          width:
            5px;

          height:
            5px;

          border-radius:
            50%;

          background:
            #fb7185;

          box-shadow:
            0 0 8px
            #fb7185;
        }

        .user-avatar {
          display:
            flex;

          width:
            35px;

          height:
            35px;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            rgba(255,255,255,.15);

          border-radius:
            50%;

          color:
            white;

          background:
            linear-gradient(
              135deg,
              #475569,
              #1e293b
            );

          font-size:
            11px;

          font-weight:
            800;
        }

        .mobile-brand {
          display:
            none;
        }

        /* =====================================================
           WORKSPACE
        ===================================================== */

        .workspace {
          display:
            flex;

          min-height:
            0;

          flex:
            1;

          overflow:
            hidden;
        }

        .center-content {
          position:
            relative;

          display:
            flex;

          min-width:
            0;

          flex:
            1;

          flex-direction:
            column;

          overflow:
            auto;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position:
            relative;

          min-height:
            285px;

          margin:
            0 12px;

          overflow:
            hidden;

          border-bottom:
            1px solid
            rgba(255,255,255,.06);

          border-radius:
            0 0 20px 20px;
        }

        .hero-background-image {
          position:
            absolute;

          inset:
            0;

          overflow:
            hidden;

          background:
            linear-gradient(
              90deg,
              rgba(6,12,30,.98) 0%,
              rgba(7,13,34,.92) 42%,
              rgba(13,19,55,.6) 70%,
              rgba(20,15,55,.2)
            );
        }

        .hero-background-image::after {
          content:
            "";

          position:
            absolute;

          inset:
            0;

          background:
            linear-gradient(
              90deg,
              rgba(5,8,20,.95) 0%,
              rgba(5,8,20,.72) 48%,
              transparent 85%
            );
        }

        .hero-mountains {
          position:
            absolute;

          right:
            0;

          bottom:
            0;

          width:
            62%;

          height:
            100%;

          opacity:
            .6;

          background:
            linear-gradient(
              135deg,
              transparent 0 20%,
              #1e1b4b 20% 28%,
              transparent 28% 38%,
              #312e81 38% 50%,
              transparent 50% 60%,
              #172554 60% 73%,
              transparent 73%
            );

          clip-path:
            polygon(
              0 100%,
              0 75%,
              12% 57%,
              23% 75%,
              34% 39%,
              46% 68%,
              58% 24%,
              67% 58%,
              78% 35%,
              88% 67%,
              100% 47%,
              100% 100%
            );
        }

        .hero-moon {
          position:
            absolute;

          right:
            19%;

          top:
            35px;

          width:
            100px;

          height:
            100px;

          border-radius:
            50%;

          background:
            radial-gradient(
              circle at 40% 35%,
              #fff7ed,
              #fbcfe8 40%,
              #a78bfa 75%,
              transparent 76%
            );

          box-shadow:
            0 0 80px
            rgba(196,181,253,.5);

          animation:
            moonFloat 5s ease-in-out infinite;
        }

        @keyframes moonFloat {

          0%,
          100% {
            transform:
              translateY(0);
          }

          50% {
            transform:
              translateY(-8px);
          }

        }

        .hero-nexa-orb {
          position:
            absolute;

          right:
            13%;

          bottom:
            43px;

          display:
            flex;

          width:
            120px;

          height:
            120px;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            50%;

          background:
            radial-gradient(
              circle,
              rgba(103,232,249,.18),
              rgba(99,102,241,.1) 40%,
              transparent 70%
            );

          box-shadow:
            0 0 70px
            rgba(34,211,238,.3);
        }

        .hero-nexa-letter {
          display:
            flex;

          width:
            57px;

          height:
            57px;

          align-items:
            center;

          justify-content:
            center;

          border:
            2px solid
            #67e8f9;

          border-radius:
            50%;

          color:
            #67e8f9;

          background:
            #07101e;

          box-shadow:
            0 0 30px
            rgba(34,211,238,.8),
            inset 0 0 25px
            rgba(34,211,238,.15);

          font-size:
            28px;

          font-weight:
            900;

          animation:
            orbPulse 3s infinite;
        }

        .hero-orbit {
          position:
            absolute;

          border:
            1px solid
            rgba(103,232,249,.35);

          border-radius:
            50%;
        }

        .orbit-a {
          width:
            95px;

          height:
            30px;

          transform:
            rotate(25deg);

          animation:
            orbitRotate 5s linear infinite;
        }

        .orbit-b {
          width:
            110px;

          height:
            42px;

          transform:
            rotate(-30deg);

          border-color:
            rgba(167,139,250,.5);

          animation:
            orbitRotate 7s linear infinite reverse;
        }

        .orbit-c {
          width:
            135px;

          height:
            65px;

          transform:
            rotate(70deg);

          border-color:
            rgba(251,146,60,.3);

          animation:
            orbitRotate 10s linear infinite;
        }

        @keyframes orbitRotate {

          to {
            transform:
              rotate(385deg);
          }

        }

        @keyframes orbPulse {

          0%,
          100% {
            box-shadow:
              0 0 25px
              rgba(34,211,238,.55),
              inset 0 0 20px
              rgba(34,211,238,.1);
          }

          50% {
            box-shadow:
              0 0 55px
              rgba(34,211,238,.9),
              inset 0 0 35px
              rgba(34,211,238,.2);
          }

        }

        .hero-arrow {
          position:
            absolute;

          right:
            3%;

          bottom:
            35%;

          color:
            #c4b5fd;

          font-family:
            cursive;

          font-size:
            13px;

          transform:
            rotate(-8deg);
        }

        .hero-content {
          position:
            relative;

          z-index:
            2;

          display:
            flex;

          height:
            100%;

          max-width:
            620px;

          flex-direction:
            column;

          justify-content:
            center;

          padding:
            40px 30px;
        }

        .greeting {
          margin-bottom:
            9px;

          color:
            #e2e8f0;

          font-size:
            13px;
        }

        .hero h1 {
          margin:
            0;

          font-size:
            clamp(
              32px,
              4vw,
              53px
            );

          font-weight:
            900;

          line-height:
            .98;

          letter-spacing:
            -.055em;
        }

        .hero h1 span {
          background:
            linear-gradient(
              90deg,
              #c084fc,
              #a78bfa,
              #60a5fa,
              #67e8f9
            );

          background-clip:
            text;

          -webkit-background-clip:
            text;

          color:
            transparent;

          background-size:
            200%;

          animation:
            gradientText 5s
            ease-in-out infinite;
        }

        @keyframes gradientText {

          0%,
          100% {
            background-position:
              0%;
          }

          50% {
            background-position:
              100%;
          }

        }

        .hero p {
          max-width:
            560px;

          margin:
            14px 0 0;

          color:
            #94a3b8;

          font-size:
            12px;

          line-height:
            1.7;
        }

        /* =====================================================
           CAPABILITIES
        ===================================================== */

        .capability-grid {
          display:
            grid;

          grid-template-columns:
            repeat(
              4,
              minmax(
                0,
                1fr
              )
            );

          gap:
            10px;

          padding:
            15px 20px 10px;
        }

        .capability-card {
          position:
            relative;

          min-height:
            115px;

          overflow:
            hidden;

          padding:
            14px;

          border:
            1px solid
            rgba(148,163,184,.16);

          border-radius:
            14px;

          background:
            linear-gradient(
              145deg,
              rgba(15,23,42,.82),
              rgba(10,15,30,.65)
            );

          text-align:
            left;

          transition:
            transform .25s ease,
            border-color .25s ease,
            box-shadow .25s ease;
        }

        .capability-card::before {
          content:
            "";

          position:
            absolute;

          width:
            100px;

          height:
            100px;

          left:
            -40px;

          top:
            -50px;

          border-radius:
            50%;

          background:
            var(--cap-color);

          opacity:
            .06;

          filter:
            blur(20px);

          transition:
            opacity .25s ease;
        }

        .capability-card:hover {
          transform:
            translateY(-5px);

          border-color:
            var(--cap-border);

          box-shadow:
            0 15px 40px
            rgba(0,0,0,.25),
            0 0 30px
            var(--cap-glow);
        }

        .capability-card:hover::before {
          opacity:
            .2;
        }

        .capability-card.selected {
          border-color:
            var(--cap-border);

          box-shadow:
            0 0 30px
            var(--cap-glow);
        }

        .capability-card.violet {
          --cap-color:
            #a78bfa;

          --cap-border:
            rgba(167,139,250,.5);

          --cap-glow:
            rgba(139,92,246,.13);
        }

        .capability-card.cyan {
          --cap-color:
            #67e8f9;

          --cap-border:
            rgba(103,232,249,.5);

          --cap-glow:
            rgba(34,211,238,.13);
        }

        .capability-card.orange {
          --cap-color:
            #fb923c;

          --cap-border:
            rgba(251,146,60,.5);

          --cap-glow:
            rgba(249,115,22,.12);
        }

        .capability-card.blue {
          --cap-color:
            #60a5fa;

          --cap-border:
            rgba(96,165,250,.5);

          --cap-glow:
            rgba(59,130,246,.12);
        }

        .capability-card.green {
          --cap-color:
            #4ade80;

          --cap-border:
            rgba(74,222,128,.5);

          --cap-glow:
            rgba(34,197,94,.12);
        }

        .capability-card.teal {
          --cap-color:
            #2dd4bf;

          --cap-border:
            rgba(45,212,191,.5);

          --cap-glow:
            rgba(20,184,166,.12);
        }

        .capability-card.pink {
          --cap-color:
            #f472b6;

          --cap-border:
            rgba(244,114,182,.5);

          --cap-glow:
            rgba(236,72,153,.12);
        }

        .capability-icon {
          display:
            flex;

          width:
            35px;

          height:
            35px;

          align-items:
            center;

          justify-content:
            center;

          margin-bottom:
            12px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius:
            10px;

          color:
            var(--cap-color);

          background:
            color-mix(
              in srgb,
              var(--cap-color) 10%,
              transparent
            );
        }

        .capability-title {
          font-size:
            11px;

          font-weight:
            800;

          color:
            #f1f5f9;
        }

        .capability-description {
          max-width:
            180px;

          margin-top:
            5px;

          color:
            #64748b;

          font-size:
            8px;

          line-height:
            1.5;
        }

        .capability-arrow {
          position:
            absolute;

          right:
            12px;

          top:
            14px;

          color:
            #475569;

          transition:
            transform .2s ease,
            color .2s ease;
        }

        .capability-card:hover
        .capability-arrow {
          color:
            var(--cap-color);

          transform:
            translateX(3px);
        }

        /* =====================================================
           QUICK IDEAS
        ===================================================== */

        .quick-section {
          padding:
            5px 20px 25px;
        }

        .quick-heading {
          margin-bottom:
            8px;

          color:
            #94a3b8;

          font-size:
            10px;
        }

        .quick-list {
          display:
            flex;

          gap:
            8px;

          overflow-x:
            auto;
        }

        .quick-idea {
          display:
            flex;

          min-width:
            max-content;

          align-items:
            center;

          gap:
            7px;

          padding:
            9px 12px;

          border:
            1px solid
            rgba(148,163,184,.2);

          border-radius:
            999px;

          color:
            #cbd5e1;

          background:
            rgba(15,23,42,.55);

          font-size:
            9px;

          transition:
            all .2s ease;
        }

        .quick-idea:hover {
          border-color:
            rgba(96,165,250,.5);

          color:
            white;

          background:
            rgba(59,130,246,.1);

          transform:
            translateY(-2px);
        }

        /* =====================================================
           COMPOSER
        ===================================================== */

        .composer-wrapper {
          position:
            relative;

          z-index:
            10;

          width:
            min(
              95%,
              920px
            );

          margin:
            0 auto;

          padding:
            5px 20px 16px;
        }

        .composer-chat {
          margin-top:
            auto;
        }

        .composer {
          position:
            relative;

          overflow:
            hidden;

          border:
            1px solid
            rgba(96,165,250,.45);

          border-radius:
            17px;

          background:
            rgba(7,12,27,.94);

          box-shadow:
            0 15px 60px
            rgba(0,0,0,.35),
            0 0 45px
            rgba(59,130,246,.06);

          backdrop-filter:
            blur(25px);

          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .composer:focus-within {
          border-color:
            rgba(103,232,249,.7);

          box-shadow:
            0 20px 70px
            rgba(0,0,0,.45),
            0 0 55px
            rgba(34,211,238,.12);
        }

        .composer-top {
          display:
            flex;

          align-items:
            center;

          gap:
            5px;

          padding:
            8px 10px 0;
        }

        .composer-tool {
          display:
            flex;

          width:
            29px;

          height:
            29px;

          align-items:
            center;

          justify-content:
            center;

          border:
            0;

          border-radius:
            8px;

          color:
            #64748b;

          background:
            transparent;
        }

        .composer-tool:hover {
          color:
            #67e8f9;

          background:
            rgba(34,211,238,.08);
        }

        .composer-search {
          display:
            flex;

          align-items:
            center;

          gap:
            5px;

          padding:
            6px 9px;

          border:
            0;

          border-radius:
            8px;

          color:
            #64748b;

          background:
            rgba(255,255,255,.025);

          font-size:
            8px;
        }

        .composer-search:hover {
          color:
            #e2e8f0;

          background:
            rgba(255,255,255,.06);
        }

        .composer textarea {
          display:
            block;

          width:
            100%;

          min-height:
            75px;

          resize:
            none;

          padding:
            10px 15px 5px;

          border:
            0;

          outline:
            0;

          color:
            #f1f5f9;

          background:
            transparent;

          font-size:
            12px;

          line-height:
            1.7;
        }

        .composer textarea::placeholder {
          color:
            #475569;
        }

        .composer-bottom {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            5px 10px 9px;
        }

        .composer-hint {
          padding-left:
            5px;

          color:
            #475569;

          font-size:
            8px;
        }

        .composer-actions {
          display:
            flex;

          align-items:
            center;

          gap:
            7px;
        }

        .voice-button {
          display:
            flex;

          width:
            32px;

          height:
            32px;

          align-items:
            center;

          justify-content:
            center;

          border:
            0;

          border-radius:
            9px;

          color:
            #64748b;

          background:
            transparent;
        }

        .voice-button:hover {
          color:
            #e2e8f0;

          background:
            rgba(255,255,255,.05);
        }

        .send-button {
          display:
            flex;

          width:
            38px;

          height:
            38px;

          align-items:
            center;

          justify-content:
            center;

          border:
            0;

          border-radius:
            11px;

          color:
            white;

          background:
            linear-gradient(
              135deg,
              #6366f1,
              #2563eb,
              #06b6d4
            );

          box-shadow:
            0 0 25px
            rgba(59,130,246,.3);

          transition:
            transform .2s ease,
            box-shadow .2s ease;
        }

        .send-button:hover:not(:disabled) {
          transform:
            scale(1.08)
            translateY(-2px);

          box-shadow:
            0 0 35px
            rgba(34,211,238,.45);
        }

        .send-button:disabled {
          opacity:
            .35;

          cursor:
            default;

          box-shadow:
            none;
        }

        .composer-disclaimer {
          margin-top:
            6px;

          text-align:
            center;

          color:
            #334155;

          font-size:
            8px;
        }

        .attachment-chip {
          display:
            flex;

          width:
            max-content;

          align-items:
            center;

          gap:
            8px;

          margin-bottom:
            7px;

          padding:
            7px 9px;

          border:
            1px solid
            rgba(34,211,238,.18);

          border-radius:
            9px;

          color:
            #67e8f9;

          background:
            rgba(34,211,238,.06);

          font-size:
            9px;
        }

        .attachment-chip span {
          max-width:
            250px;

          overflow:
            hidden;

          color:
            #94a3b8;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .attachment-chip button {
          display:
            flex;

          border:
            0;

          color:
            #64748b;

          background:
            transparent;
        }

        /* =====================================================
           RIGHT PANEL
        ===================================================== */

        .right-panel {
          display:
            flex;

          width:
            285px;

          min-width:
            285px;

          flex-direction:
            column;

          gap:
            12px;

          overflow:
            auto;

          padding:
            14px;

          border-left:
            1px solid
            rgba(255,255,255,.06);

          background:
            rgba(3,7,18,.55);

          backdrop-filter:
            blur(25px);
        }

        .right-card {
          border:
            1px solid
            rgba(148,163,184,.12);

          border-radius:
            15px;

          background:
            rgba(15,23,42,.52);
        }

        .today-card {
          padding:
            14px;
        }

        .right-heading {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-bottom:
            13px;
        }

        .right-heading strong {
          font-size:
            11px;
        }

        .right-heading span {
          color:
            #64748b;

          font-size:
            8px;
        }

        .today-content {
          display:
            flex;

          align-items:
            center;

          gap:
            15px;
        }

        .progress-ring {
          display:
            flex;

          width:
            83px;

          height:
            83px;

          align-items:
            center;

          justify-content:
            center;

          border:
            7px solid
            #312e81;

          border-top-color:
            #60a5fa;

          border-right-color:
            #a855f7;

          border-radius:
            50%;

          box-shadow:
            0 0 25px
            rgba(139,92,246,.12);

          animation:
            ringRotate 8s linear infinite;
        }

        .progress-inner {
          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          animation:
            ringRotateReverse 8s linear infinite;
        }

        @keyframes ringRotate {

          to {
            transform:
              rotate(360deg);
          }

        }

        @keyframes ringRotateReverse {

          to {
            transform:
              rotate(-360deg);
          }

        }

        .progress-inner strong {
          font-size:
            19px;
        }

        .progress-inner span {
          margin-top:
            1px;

          color:
            #64748b;

          font-size:
            7px;
        }

        .today-stats {
          display:
            flex;

          flex:
            1;

          flex-direction:
            column;

          gap:
            9px;
        }

        .today-stats div {
          display:
            flex;

          align-items:
            center;

          gap:
            7px;

          color:
            #94a3b8;

          font-size:
            8px;
        }

        .today-stats i {
          width:
            6px;

          height:
            6px;

          border-radius:
            50%;
        }

        .today-stats .green {
          background:
            #4ade80;

          box-shadow:
            0 0 8px
            #4ade80;
        }

        .today-stats .blue {
          background:
            #60a5fa;

          box-shadow:
            0 0 8px
            #60a5fa;
        }

        .today-stats .orange {
          background:
            #fb923c;

          box-shadow:
            0 0 8px
            #fb923c;
        }

        .quote-card {
          position:
            relative;

          overflow:
            hidden;

          padding:
            18px;

          border:
            1px solid
            rgba(168,85,247,.35);

          border-radius:
            15px;

          background:
            linear-gradient(
              135deg,
              rgba(126,34,206,.22),
              rgba(37,99,235,.16)
            );

          text-align:
            center;

          box-shadow:
            0 0 30px
            rgba(139,92,246,.08);
        }

        .quote-glow {
          position:
            absolute;

          width:
            120px;

          height:
            120px;

          right:
            -50px;

          top:
            -50px;

          border-radius:
            50%;

          background:
            rgba(34,211,238,.15);

          filter:
            blur(25px);
        }

        .quote-card p {
          position:
            relative;

          margin:
            0;

          color:
            #e9d5ff;

          font-size:
            11px;

          line-height:
            1.6;
        }

        .right-section {
          padding:
            4px 0;
        }

        .right-section-title {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          padding:
            4px 3px 8px;

          color:
            #cbd5e1;

          font-size:
            10px;

          font-weight:
            700;
        }

        .right-section-title button {
          border:
            0;

          color:
            #64748b;

          background:
            transparent;

          font-size:
            8px;
        }

        .right-section-title button:hover {
          color:
            #67e8f9;
        }

        .recent-files {
          overflow:
            hidden;

          border:
            1px solid
            rgba(148,163,184,.1);

          border-radius:
            13px;

          background:
            rgba(15,23,42,.55);
        }

        .recent-file {
          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          padding:
            10px;

          border-bottom:
            1px solid
            rgba(255,255,255,.04);
        }

        .recent-file:last-child {
          border-bottom:
            0;
        }

        .file-type {
          display:
            flex;

          width:
            29px;

          height:
            29px;

          align-items:
            center;

          justify-content:
            center;

          border-radius:
            7px;

          color:
            #c4b5fd;

          background:
            rgba(139,92,246,.1);

          font-size:
            7px;

          font-weight:
            800;
        }

        .recent-file-info {
          min-width:
            0;

          flex:
            1;
        }

        .recent-file-name {
          overflow:
            hidden;

          color:
            #cbd5e1;

          font-size:
            9px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .recent-file-meta {
          margin-top:
            3px;

          color:
            #475569;

          font-size:
            7px;
        }

        .workspace-status {
          margin-top:
            auto;

          padding:
            13px;
        }

        .workspace-status-header {
          display:
            flex;

          align-items:
            center;

          gap:
            7px;
        }

        .workspace-status-header strong {
          flex:
            1;

          font-size:
            10px;
        }

        .online-dot {
          width:
            6px;

          height:
            6px;

          border-radius:
            50%;

          background:
            #34d399;

          box-shadow:
            0 0 10px
            #34d399;

          animation:
            onlinePulse 2s infinite;
        }

        @keyframes onlinePulse {

          0%,
          100% {
            opacity:
              .4;
          }

          50% {
            opacity:
              1;
          }

        }

        .online-text {
          color:
            #34d399;

          font-size:
            8px;
        }

        .status-grid {
          display:
            grid;

          grid-template-columns:
            repeat(3,1fr);

          margin-top:
            13px;

          padding-top:
            11px;

          border-top:
            1px solid
            rgba(255,255,255,.05);
        }

        .status-grid div {
          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          border-right:
            1px solid
            rgba(255,255,255,.05);
        }

        .status-grid div:last-child {
          border-right:
            0;
        }

        .status-grid strong {
          font-size:
            14px;
        }

        .status-grid span {
          margin-top:
            3px;

          color:
            #475569;

          font-size:
            7px;
        }

        /* =====================================================
           MESSAGES
        ===================================================== */

        .messages-area {
          width:
            min(
              100%,
              920px
            );

          margin:
            0 auto;

          padding:
            35px 25px 180px;
        }

        .messages-header {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          margin-bottom:
            30px;

          padding-bottom:
            18px;

          border-bottom:
            1px solid
            rgba(255,255,255,.06);
        }

        .messages-label {
          margin-bottom:
            5px;

          color:
            #67e8f9;

          font-size:
            8px;

          font-weight:
            800;

          letter-spacing:
            .2em;
        }

        .messages-header h2 {
          margin:
            0;

          font-size:
            19px;
        }

        .selected-mode {
          display:
            flex;

          align-items:
            center;

          gap:
            6px;

          padding:
            7px 10px;

          border:
            1px solid
            rgba(103,232,249,.18);

          border-radius:
            999px;

          color:
            #67e8f9;

          background:
            rgba(103,232,249,.05);

          font-size:
            8px;
        }

        .chat-message {
          display:
            flex;

          gap:
            12px;

          margin-bottom:
            28px;

          animation:
            messageIn .35s ease both;
        }

        @keyframes messageIn {

          from {
            opacity:
              0;

            transform:
              translateY(8px);
          }

          to {
            opacity:
              1;

            transform:
              translateY(0);
          }

        }

        .chat-message.user {
          justify-content:
            flex-end;
        }

        .message-orb {
          display:
            flex;

          width:
            34px;

          height:
            34px;

          flex-shrink:
            0;

          align-items:
            center;

          justify-content:
            center;

          border:
            1px solid
            rgba(103,232,249,.4);

          border-radius:
            11px;

          color:
            #67e8f9;

          background:
            rgba(34,211,238,.06);

          box-shadow:
            0 0 20px
            rgba(34,211,238,.1);

          font-size:
            11px;

          font-weight:
            900;
        }

        .user-message {
          max-width:
            75%;

          padding:
            11px 14px;

          border:
            1px solid
            rgba(96,165,250,.18);

          border-radius:
            14px 14px 3px 14px;

          color:
            #e2e8f0;

          background:
            linear-gradient(
              135deg,
              rgba(59,130,246,.16),
              rgba(99,102,241,.12)
            );

          font-size:
            12px;

          line-height:
            1.7;
        }

        .assistant-message {
          min-width:
            0;

          max-width:
            85%;

          color:
            #cbd5e1;

          font-size:
            12px;

          line-height:
            1.8;
        }

        .assistant-message p {
          margin:
            0 0 12px;
        }

        .assistant-message p:last-child {
          margin-bottom:
            0;
        }

        .assistant-message h1,
        .assistant-message h2,
        .assistant-message h3 {
          margin:
            20px 0 10px;

          color:
            white;
        }

        .assistant-message ul,
        .assistant-message ol {
          padding-left:
            22px;
        }

        .assistant-message li {
          margin:
            5px 0;
        }

        .assistant-message code {
          padding:
            2px 5px;

          border-radius:
            5px;

          color:
            #67e8f9;

          background:
            rgba(15,23,42,.9);

          font-size:
            10px;
        }

        .assistant-message pre {
          overflow:
            auto;

          padding:
            14px;

          border:
            1px solid
            rgba(148,163,184,.12);

          border-radius:
            11px;

          background:
            #020617;

          font-size:
            10px;

          line-height:
            1.6;
        }

        .message-actions {
          display:
            flex;

          gap:
            3px;

          margin-top:
            7px;

          opacity:
            0;

          transition:
            opacity .2s ease;
        }

        .chat-message:hover
        .message-actions {
          opacity:
            1;
        }

        .message-action {
          display:
            flex;

          align-items:
            center;

          gap:
            5px;

          padding:
            5px 7px;

          border:
            0;

          border-radius:
            6px;

          color:
            #475569;

          background:
            transparent;

          font-size:
            8px;
        }

        .message-action:hover {
          color:
            #94a3b8;

          background:
            rgba(255,255,255,.04);
        }

        .thinking-row {
          display:
            flex;

          align-items:
            center;

          gap:
            12px;

          margin:
            20px 0;
        }

        .thinking-card {
          display:
            flex;

          align-items:
            center;

          gap:
            5px;

          padding:
            10px 12px;

          border:
            1px solid
            rgba(103,232,249,.1);

          border-radius:
            10px;

          background:
            rgba(103,232,249,.03);
        }

        .thinking-card span {
          width:
            5px;

          height:
            5px;

          border-radius:
            50%;

          background:
            #67e8f9;

          animation:
            thinkingDot 1.2s infinite;
        }

        .thinking-card span:nth-child(2) {
          animation-delay:
            .15s;
        }

        .thinking-card span:nth-child(3) {
          animation-delay:
            .3s;
        }

        @keyframes thinkingDot {

          0%,
          100% {
            opacity:
              .25;

            transform:
              translateY(0);
          }

          50% {
            opacity:
              1;

            transform:
              translateY(-3px);
          }

        }

        .thinking-card em {
          margin-left:
            4px;

          color:
            #475569;

          font-size:
            8px;

          font-style:
            normal;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        .mobile-overlay {
          position:
            fixed;

          z-index:
            30;

          inset:
            0;

          border:
            0;

          background:
            rgba(0,0,0,.7);

          backdrop-filter:
            blur(5px);
        }

        @media (max-width: 1250px) {

          .right-panel {
            width:
              245px;

            min-width:
              245px;
          }

          .capability-grid {
            grid-template-columns:
              repeat(4,1fr);
          }

          .capability-card {
            min-height:
              105px;
          }

        }

        @media (max-width: 1050px) {

          .right-panel {
            display:
              none;
          }

          .top-navigation {
            display:
              none;
          }

          .global-search {
            width:
              min(
                500px,
                60vw
              );

            margin-left:
              auto;
          }

        }

        @media (max-width: 800px) {

          .sidebar {
            position:
              fixed;

            left:
              0;

            top:
              0;

            bottom:
              0;

            transform:
              translateX(-100%);

            transition:
              transform .3s ease;
          }

          .sidebar-open {
            transform:
              translateX(0);
          }

          .mobile-brand {
            display:
              flex;

            align-items:
              center;

            gap:
              8px;

            font-weight:
              900;

            font-size:
              13px;
          }

          .mobile-menu-button {
            display:
              flex;

            width:
              32px;

            height:
              32px;

            align-items:
              center;

            justify-content:
              center;

            border:
              1px solid
              rgba(255,255,255,.08);

            border-radius:
              9px;

            color:
              #94a3b8;

            background:
              rgba(255,255,255,.03);
          }

          .global-search {
            flex:
              1;

            width:
              auto;

            margin-left:
              0;
          }

          .top-actions .pro-pill,
          .notification-button {
            display:
              none;
          }

          .capability-grid {
            grid-template-columns:
              repeat(2,1fr);

            padding:
              12px;
          }

          .quick-section {
            padding:
              5px 12px 20px;
          }

          .hero {
            margin:
              0;

            min-height:
              280px;

            border-radius:
              0;
          }

          .hero-content {
            padding:
              30px 22px;
          }

          .hero-nexa-orb {
            right:
              5%;

            bottom:
              25px;

            transform:
              scale(.75);
          }

          .hero-arrow {
            display:
              none;
          }

          .composer-wrapper {
            width:
              100%;

            padding:
              5px 10px 10px;
          }

          .messages-area {
            padding:
              25px 15px 170px;
          }

        }

        @media (max-width: 520px) {

          .topbar {
            gap:
              8px;

            padding:
              0 10px;
          }

          .global-search {
            display:
              none;
          }

          .top-actions {
            margin-left:
              auto;
          }

          .hero h1 {
            font-size:
              34px;
          }

          .hero p {
            font-size:
              10px;
          }

          .hero-moon {
            right:
              5%;

            width:
              65px;

            height:
              65px;
          }

          .hero-nexa-orb {
            right:
              -10px;

            bottom:
              5px;

            transform:
              scale(.55);
          }

          .capability-grid {
            grid-template-columns:
              repeat(2,1fr);

            gap:
              7px;
          }

          .capability-card {
            min-height:
              115px;

            padding:
              11px;
          }

          .capability-description {
            font-size:
              7px;
          }

          .composer-search {
            display:
              none;
          }

          .composer textarea {
            min-height:
              65px;
          }

          .messages-header {
            align-items:
              flex-start;

            flex-direction:
              column;

            gap:
              10px;
          }

          .user-message,
          .assistant-message {
            max-width:
              92%;
          }

        }

      `}</style>

    </main>
  );
}

/* =========================================================
   CAPABILITY CARD
========================================================= */

function CapabilityCard({
  capability,
  selected,
  onClick,
}: {
  capability: {
    id: Capability;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
  };

  selected: boolean;

  onClick: () => void;
}) {
  const Icon =
    capability.icon;

  return (
    <button
      onClick={onClick}
      className={`capability-card ${capability.color} ${
        selected
          ? "selected"
          : ""
      }`}
    >

      <div className="capability-icon">

        <Icon size={17} />

      </div>

      <div className="capability-title">
        {capability.title}
      </div>

      <div className="capability-description">
        {capability.description}
      </div>

      <ChevronRight
        size={14}
        className="capability-arrow"
      />

    </button>
  );
}

/* =========================================================
   QUICK IDEA
========================================================= */

function QuickIdea({
  text,
  capability,
  onClick,
}: {
  text: string;
  capability: Capability;
  onClick: (
    text: string,
    capability: Capability
  ) => void;
}) {
  return (
    <button
      className="quick-idea"
      onClick={() =>
        onClick(
          text,
          capability
        )
      }
    >

      <MessageSquare
        size={12}
      />

      {text}

      <ChevronRight
        size={11}
      />

    </button>
  );
}

/* =========================================================
   RECENT FILE
========================================================= */

function RecentFile({
  icon,
  name,
  size,
  time,
}: {
  icon: string;
  name: string;
  size: string;
  time: string;
}) {
  return (
    <div className="recent-file">

      <div className="file-type">
        {icon}
      </div>

      <div className="recent-file-info">

        <div className="recent-file-name">
          {name}
        </div>

        <div className="recent-file-meta">
          {size} · {time}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   CHAT MESSAGE
========================================================= */

function ChatMessage({
  message,
  copied,
  onCopy,
}: {
  message: Message;
  copied: boolean;
  onCopy: () => void;
}) {
  const isUser =
    message.role === "user";

  if (isUser) {
    return (
      <div className="chat-message user">

        <div className="user-message">
          {message.content}
        </div>

      </div>
    );
  }

  return (
    <div className="chat-message">

      <div className="message-orb">
        N
      </div>

      <div className="assistant-message">

        <ReactMarkdown>
          {message.content}
        </ReactMarkdown>

        <div className="message-actions">

          <button
            className="message-action"
            onClick={onCopy}
          >

            {copied ? (
              <>
                <Check size={11} />
                Copied
              </>
            ) : (
              <>
                <Copy size={11} />
                Copy
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}