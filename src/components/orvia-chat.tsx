"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import orviaAnimation from "@/AI Robot.json";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const welcomeMessage =
  "Hey there! I'm Orvia, VirtuProse's AI sales consultant. What are you working on and how can I help today?";

export function OrviaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", content: welcomeMessage }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
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
          throw new Error("Failed to reach Orvia");
        }
        const data = (await response.json()) as { reply?: string };
        const reply: ChatMessage = {
          role: "assistant",
          content: data.reply ?? "I'm here, but something went wrong. Could you please try again?",
        };
        setMessages((prev) => [...prev, reply]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I couldn't connect just now, but I'm still here. Mind trying again?",
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
    const tooltipTimer = window.setTimeout(() => setShowTooltip(false), 60000);
    
    // Better mobile detection - check for touch devices and small screens
    const handleResize = () => {
      const isMobileScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsFullScreen(isMobileScreen || isTouchDevice);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    
    return () => {
      window.clearTimeout(tooltipTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("open-orvia-chat", handleOpen as EventListener);
    };
  }, [sendText]);

  useEffect(() => {
    if (messagesEndRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
    if (isOpen && !isLoading) {
      // Delay focus slightly for mobile to prevent keyboard jump
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(focusTimer);
    }
  }, [messages, isOpen, isLoading]);

  // Scroll to bottom when keyboard opens or new message arrives
  useEffect(() => {
    if (keyboardHeight > 0 && messagesEndRef.current) {
      // Wait for keyboard animation to complete
      const scrollTimer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 350);
      return () => clearTimeout(scrollTimer);
    }
  }, [keyboardHeight, messages]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || isLoading) return;
    void sendText(input);
  }

  const panelClassName = useMemo(
    () => 
      `orvia-chat-panel${isOpen ? " open" : ""}${isFullScreen ? " full" : ""}${keyboardHeight > 0 ? " keyboard-open" : ""}`,
    [isOpen, isFullScreen, keyboardHeight],
  );

  // Handle keyboard visibility on mobile
  useEffect(() => {
    if (!isFullScreen || !isOpen) {
      setKeyboardHeight(0);
      return;
    }

    const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;
    const getScreenHeight = () => window.screen.height;
    
    // Store initial height when chat opens
    const initialHeight = getViewportHeight();
    const screenHeight = getScreenHeight();
    let timeoutId: NodeJS.Timeout;

    const checkKeyboard = () => {
      const currentHeight = getViewportHeight();
      const heightDiff = initialHeight - currentHeight;
      
      // Keyboard is likely open if viewport shrunk significantly (more than 150px)
      if (heightDiff > 150) {
        setKeyboardHeight(heightDiff);
        // Scroll to bottom when keyboard opens
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      } else {
        setKeyboardHeight(0);
      }
    };

    const handleViewportResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkKeyboard, 100);
    };

    const handleFocus = () => {
      // Give keyboard time to fully open
      setTimeout(checkKeyboard, 350);
    };

    const handleBlur = () => {
      setKeyboardHeight(0);
    };

    // Use Visual Viewport API (best for mobile keyboard detection)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportResize);
    }

    // Fallback for browsers without Visual Viewport API
    window.addEventListener("resize", handleViewportResize);
    
    // Listen to input focus/blur
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
      inputElement.addEventListener("blur", handleBlur);
    }

    return () => {
      clearTimeout(timeoutId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
        window.visualViewport.removeEventListener("scroll", handleViewportResize);
      }
      window.removeEventListener("resize", handleViewportResize);
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
      }
      setKeyboardHeight(0);
    };
  }, [isFullScreen, isOpen]);

  // Prevent body scroll on mobile when chat is open
  useEffect(() => {
    if (isOpen && isFullScreen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      // Store scroll position to restore later
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen, isFullScreen]);

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
          <div className="orvia-launcher-lottie">
            <Lottie animationData={orviaAnimation} loop autoplay aria-hidden="true" />
          </div>
        ) : null}
        <Image
          src="/assets/orvia-logo-black.svg"
          alt="Orvia logo"
          width={70}
          height={20}
          className="orvia-launcher-logo"
          priority
        />
        {!isOpen && showTooltip ? <span className="orvia-launcher-tooltip">Hi, I&#39;m Orvia. Need help?</span> : null}
      </button>
      <div 
        ref={panelRef}
        className={panelClassName} 
        id="orvia-chat-panel" 
        role="dialog" 
        aria-label="Orvia live chat"
      >
        <div className="orvia-chat-header">
          <div className="orvia-avatar">
            <Lottie animationData={orviaAnimation} loop autoplay aria-hidden="true" />
          </div>
          <div className="orvia-header-text">
            <p>Orvia · Sales AI</p>
            <small>Hi, I’m Orvia. I can help you choose the right service.</small>
          </div>
          <div className="typing-indicator" aria-live="polite">
            <span />
            <span />
            <span />
          </div>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close Orvia chat">
            ×
          </button>
        </div>
        <div className="orvia-chat-messages">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content}`}
              className={`chat-bubble ${message.role} bubble-in`}
            >
              {message.content}
            </div>
          ))}
          {isLoading ? (
            <div className="chat-bubble assistant typing-bubble">
              <div className="typing-indicator inline">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
        <form className="orvia-chat-input" onSubmit={sendMessage}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Tell me about your project…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-label="Your message"
            autoComplete="off"
            autoCorrect="on"
            autoCapitalize="sentences"
            enterKeyHint="send"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className={isLoading ? "sending" : ""}>
            {isLoading ? "…" : "Send"}
          </button>
        </form>
        <p className="chat-footnote">
          Need a human? <Link href="/contact">Contact the VirtuProse team</Link>
        </p>
      </div>
    </>
  );
}
