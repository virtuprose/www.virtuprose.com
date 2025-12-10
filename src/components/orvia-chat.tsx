"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import orviaAnimation from "@/orvia-lottie.json";
import { ArrowLeft, MoreHorizontal, Paperclip, Smile, Mic, Send, Maximize2, Download } from "lucide-react";
import { validateInputClient } from "@/lib/orvia-client-security";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Helper function to decode HTML entities
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
    '&nbsp;': ' ',
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': ''',
    '&rsquo;': ''',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&bull;': '•',
    '&hellip;': '…',
  };
  
  // Replace named and numeric entities
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }
  
  // Handle numeric entities (&#123; or &#x7B;)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

// Helper function to parse and render markdown-like formatting
function formatMessage(content: string): React.ReactNode {
  // Decode HTML entities first
  const decodedContent = decodeHTMLEntities(content);
  
  // Split content into lines for processing
  const lines = decodedContent.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;
  let listCounter = 0;

  const formatInlineText = (text: string): React.ReactNode => {
    // Process inline formatting: bold, italic, code
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Bold: **text** or __text__
      const boldMatch = remaining.match(/\*\*(.+?)\*\*|__(.+?)__/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
        parts.push(
          <strong key={`bold-${keyIndex++}`} className="font-semibold">
            {boldMatch[1] || boldMatch[2]}
          </strong>
        );
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
        continue;
      }

      // Italic: *text* or _text_
      const italicMatch = remaining.match(/\*([^*]+)\*|_([^_]+)_/);
      if (italicMatch && italicMatch.index !== undefined) {
        if (italicMatch.index > 0) {
          parts.push(remaining.slice(0, italicMatch.index));
        }
        parts.push(
          <em key={`italic-${keyIndex++}`} className="italic">
            {italicMatch[1] || italicMatch[2]}
          </em>
        );
        remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
        continue;
      }

      // No more matches, add the rest
      parts.push(remaining);
      break;
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`list-${elements.length}`} className="orvia-format-list">
            {currentList.items.map((item, i) => (
              <li key={i} className="orvia-format-list-item">{item}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elements.length}`} className="orvia-format-list orvia-format-list-numbered">
            {currentList.items.map((item, i) => (
              <li key={i} className="orvia-format-list-item">{item}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
      listCounter = 0;
    }
  };

  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();

    // Empty line
    if (trimmedLine === '') {
      flushList();
      if (elements.length > 0) {
        elements.push(<div key={`space-${lineIndex}`} className="h-2" />);
      }
      return;
    }

    // Numbered list: 1. item or 1) item
    const numberedMatch = trimmedLine.match(/^(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(formatInlineText(numberedMatch[2]));
      return;
    }

    // Bullet list: - item or * item or • item
    const bulletMatch = trimmedLine.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(formatInlineText(bulletMatch[1]));
      return;
    }

    // Regular text - flush any pending list first
    flushList();
    elements.push(
      <p key={`p-${lineIndex}`} className="orvia-format-paragraph">
        {formatInlineText(trimmedLine)}
      </p>
    );
  });

  // Flush any remaining list
  flushList();

  return <div className="orvia-formatted-content">{elements}</div>;
}

const welcomeMessage =
  "Hey! I'm ORVIA, your AI business assistant. Need help with bookings, leads, or scaling your operations? Let's talk.";

export function OrviaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: welcomeMessage }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const lottieRef = useRef<any>(null);

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // Client-side validation
      const validation = validateInputClient(trimmed);
      if (!validation.valid) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: validation.error || "Please check your message and try again.",
          },
        ]);
        return;
      }

      setIsOpen(true);
      const userMessage: ChatMessage = { role: "user", content: trimmed };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setInput("");

      try {
        const response = await fetch("/api/orvia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...messages, userMessage] }),
        });

        if (!response.ok) {
          const errorData = (await response.json().catch(() => ({}))) as { error?: string; retryAfter?: number };

          if (response.status === 429) {
            const retrySeconds = errorData.retryAfter || 60;
            throw new Error(`Too many requests. Please wait ${retrySeconds} seconds before trying again.`);
          }

          if (response.status === 400) {
            throw new Error(errorData.error || "Invalid message format. Please try rephrasing.");
          }

          throw new Error(errorData.error || "Failed to reach Orvia");
        }

        const data = (await response.json()) as { reply?: string };
        const reply: ChatMessage = {
          role: "assistant",
          content: data.reply ?? "I'm here, but something went wrong. Could you please try again?",
        };
        setMessages((prev) => [...prev, reply]);
      } catch (error) {
        console.error("[orvia-chat-error]", error);
        const errorMessage = error instanceof Error ? error.message : "I couldn't connect just now, but I'm still here. Mind trying again?";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorMessage,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages],
  );

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const initial = (event as CustomEvent<string>).detail;
      setIsOpen(true);
      if (initial) {
        void sendText(initial);
      }
    };
    window.addEventListener("open-orvia-chat", handleOpen as EventListener);

    // Tooltip timing: hide after 15 seconds, reappear after 1 minute
    const hideTimer = window.setTimeout(() => setShowTooltip(false), 15000);
    const reappearTimer = window.setTimeout(() => setShowTooltip(true), 60000);
    const finalHideTimer = window.setTimeout(() => setShowTooltip(false), 75000); // Hide again after 15s of reappearing

    const handleResize = () => setIsFullScreen(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(reappearTimer);
      window.clearTimeout(finalHideTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("open-orvia-chat", handleOpen as EventListener);
    };
  }, [sendText]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isOpen) {
      inputRef.current?.focus();
    }

    // Lock body scroll on mobile when chat is open
    if (isOpen && typeof window !== "undefined") {
      const isMobile = window.innerWidth <= 640;
      if (isMobile) {
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${window.scrollY}px`;
      }
    } else if (typeof window !== "undefined") {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      if (typeof window !== "undefined") {
        const scrollY = document.body.style.top;
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
        document.body.style.top = "";
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
        }
      }
    };
  }, [messages, isOpen]);

  // Animation loops automatically with loop={true} and autoplay={true}

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    void sendText(input);
  }

  const downloadTranscript = useCallback(() => {
    const transcript = messages
      .map((msg) => {
        const role = msg.role === "user" ? "You" : "Orvia";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orvia-chat-transcript-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showMenu || showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMenu, showEmojiPicker]);

  // Safe file types - images, documents, and text files only
  const ALLOWED_FILE_TYPES = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    // Text files
    'text/plain', 'text/csv',
    // Spreadsheets
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ];

  const ALLOWED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf',
    '.doc', '.docx',
    '.txt', '.csv',
    '.xls', '.xlsx',
  ];

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const sanitizeFileName = (fileName: string): string => {
    // Remove any path components and dangerous characters
    const sanitized = fileName
      .replace(/^.*[\\/]/, '') // Remove path
      .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
      .substring(0, 255); // Limit length
    return sanitized || 'file';
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `File size exceeds 10MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` };
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return { valid: false, error: `File type not allowed. Please upload images, PDFs, or text documents only.` };
    }

    // Check MIME type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      // Double-check with extension if MIME type check fails (some browsers may not set MIME correctly)
      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return { valid: false, error: `File type not allowed. Please upload safe file types only.` };
      }
    }

    // Block executable files and scripts
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar', '.sh', '.ps1', '.msi', '.dll', '.bin', '.app'];
    const lowerFileName = file.name.toLowerCase();
    if (dangerousExtensions.some(ext => lowerFileName.endsWith(ext))) {
      return { valid: false, error: `Executable files are not allowed for security reasons.` };
    }

    return { valid: true };
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      const validation = validateFile(file);

      if (!validation.valid) {
        // Show error message
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `❌ ${validation.error}`
        }]);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Sanitize file name
      const sanitizedFileName = sanitizeFileName(file.name);
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);

      setMessages((prev) => [...prev, {
        role: "user",
        content: `[File attachment: ${sanitizedFileName} (${fileSizeMB}MB)]`
      }]);

      // In a real implementation, you would upload the file to a secure server and send the URL
      // For now, we'll just acknowledge receipt
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `✅ I've received your file: ${sanitizedFileName}. This file appears safe. How can I help you with it?`
        }]);
      }, 1000);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const commonEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '😵‍💫', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃'];

  const handleGIFClick = () => {
    // In a real implementation, this would open a GIF picker (e.g., Giphy)
    // For now, we'll add a placeholder message
    setMessages((prev) => [...prev, { role: "user", content: "[GIF selection coming soon]" }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "GIF picker will be integrated soon! For now, you can describe what you're looking for."
      }]);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        // In a real implementation, you would upload the audio and send it
        setMessages((prev) => [...prev, { role: "user", content: "[Voice message]" }]);
        setTimeout(() => {
          setMessages((prev) => [...prev, {
            role: "assistant",
            content: "I've received your voice message. Voice processing will be available soon!"
          }]);
        }, 1000);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I couldn't access your microphone. Please check your permissions."
      }]);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const panelClassName = useMemo(
    () => `orvia-chat-panel${isOpen ? " open" : ""}${isFullScreen ? " full" : ""}`,
    [isOpen, isFullScreen],
  );

  return (
    <>
      <button
        type="button"
        className="orvia-launcher"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="orvia-chat-panel"
      >
        <span className="sr-only">{isOpen ? "Hide Orvia chat" : "Chat with Orvia"}</span>
        {!isOpen ? (
          <>
            {showTooltip && <span className="orvia-launcher-tooltip">Hi, I&apos;m Orvia. How can I help you?</span>}
            <div className="orvia-launcher-lottie">
              {orviaAnimation && (
                <Lottie
                  lottieRef={lottieRef}
                  animationData={orviaAnimation}
                  loop={true}
                  autoplay={true}
                  aria-hidden="true"
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
            <Image
              src="/assets/orvia-logo-black.svg"
              alt="Orvia logo"
              width={70}
              height={20}
              className="orvia-launcher-logo"
              priority
            />
          </>
        ) : null}
      </button>
      <div className={panelClassName} id="orvia-chat-panel" role="dialog" aria-label="Orvia live chat">
        {/* Header */}
        <div className="orvia-chat-header-new">
          <button type="button" onClick={() => setIsOpen(false)} className="orvia-header-back" aria-label="Back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="orvia-header-logo-text">
            <span className="orvia-header-name">ORVIA</span>
          </div>
          <p className="orvia-header-subtitle">AI Assistant • 24/7</p>
          <div className="orvia-header-actions" ref={menuRef}>
            <button
              type="button"
              className="orvia-header-menu"
              aria-label="More options"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div className="orvia-menu-dropdown">
                <button
                  type="button"
                  className="orvia-menu-item"
                  onClick={() => {
                    setIsFullScreen(!isFullScreen);
                    setShowMenu(false);
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Expand window</span>
                </button>
                <button
                  type="button"
                  className="orvia-menu-item"
                  onClick={downloadTranscript}
                >
                  <Download className="w-4 h-4" />
                  <span>Download transcript</span>
                </button>
              </div>
            )}
            <button type="button" onClick={() => setIsOpen(false)} className="orvia-header-close" aria-label="Close">
              ×
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="orvia-chat-messages-new">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}-${message.content}`} className="orvia-message-wrapper">
              {message.role === "assistant" ? (
                <div className="orvia-message-assistant">
                  <div className="orvia-message-bubble">{formatMessage(message.content)}</div>
                  <div className="orvia-message-meta">ORVIA • AI Agent • Just now</div>
                </div>
              ) : (
                <div className="orvia-message-user">
                  <div className="orvia-message-pill">{message.content}</div>
                </div>
              )}
            </div>
          ))}
          {isLoading ? (
            <div className="orvia-message-assistant">
              <div className="orvia-message-bubble">
                <div className="typing-indicator inline">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form className="orvia-chat-input-new" onSubmit={sendMessage}>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
            aria-label="File input"
          />
          <div className="orvia-input-container">
            <div className="orvia-input-content" ref={emojiPickerRef}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(event) => {
                  const value = event.target.value;
                  // Limit input length on client side
                  if (value.length <= 2000) {
                    setInput(value);
                  }
                }}
                maxLength={2000}
                className="orvia-input-field"
                aria-label="Your message"
              />
              <div className="orvia-input-icons">
                <button
                  type="button"
                  className="orvia-input-icon"
                  aria-label="Attach file"
                  onClick={handleFileAttachment}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="orvia-input-icon"
                  aria-label="Emoji"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="w-4 h-4" />
                </button>
                {showEmojiPicker && (
                  <div className="orvia-emoji-picker">
                    <div className="orvia-emoji-grid">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          className="orvia-emoji-item"
                          onClick={() => handleEmojiClick(emoji)}
                          aria-label={`Emoji ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  className="orvia-input-icon"
                  aria-label="GIF"
                  onClick={handleGIFClick}
                >
                  <span className="text-xs font-medium">GIF</span>
                </button>
                <button
                  type="button"
                  className={`orvia-input-icon ${isRecording ? 'recording' : ''}`}
                  aria-label="Voice message"
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading || isRecording} className="orvia-send-button" aria-label="Send message">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="orvia-chat-footer">
          <Image
            src="/assets/orvia-logo-black.svg"
            alt="Orvia"
            width={16}
            height={16}
            className="orvia-footer-logo dark:invert"
          />
          <span className="orvia-footer-text">Powered by ORVIA</span>
        </div>
      </div>
    </>
  );
}
