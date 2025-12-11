# Floating Chat Button - Design & Code

Here is the floating chat button design you requested, ready to be used in any project.

## Option 1: React + Tailwind CSS (Recommended)

This is the component used in your current project. It requires **React**, **Tailwind CSS**, and **Lucide React**.

### 1. Install Dependencies
```bash
npm install lucide-react
```
*Ensure Tailwind CSS is properly configured in your project (or use the CDN).*

### 2. Create the Component
Create a file named `FloatingChatButton.tsx` (or `.jsx`):

```tsx
import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  className?: string;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick, className = '' }) => {
  return (
    <div className={`fixed bottom-6 right-6 z-50 group ${className}`}>
        {/* Button Wrapper with Hover Effects */}
        <button
          onClick={onClick}
          className="relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 active:scale-95"
          aria-label="Open Chat"
        >
          {/* Outer Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl transition-all duration-500 group-hover:bg-cyan-400/50 group-hover:blur-2xl" />

          {/* Glassmorphism Background */}
          <div className="absolute inset-0 rounded-full bg-slate-900/10 hover:bg-slate-900/20 backdrop-blur-md transition-colors duration-300" />

          {/* Gradient Border Ring */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '2px' // Border width
            }}
          />

          {/* Inner Highlight Overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-40 pointer-events-none" />

          {/* Icon */}
          <MessageSquare 
            className="w-6 h-6 text-white drop-shadow-md relative z-10" 
            strokeWidth={2.5}
          />
        </button>
    </div>
  );
};
```

### 3. Usage inside your App
```tsx
import { FloatingChatButton } from './FloatingChatButton';

function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
       {/* Your other content */}
       <FloatingChatButton onClick={() => setIsOpen(true)} />
    </div>
  )
}
```

---

## Option 2: Pure HTML & Standard CSS (No React/Tailwind)

If you need to use this in a non-React project or without Tailwind, use this HTML and CSS.

### HTML
```html
<div class="orvia-float-btn-container">
  <button class="orvia-float-btn" onclick="toggleChat()">
    <!-- Glow -->
    <div class="orvia-btn-glow"></div>
    <!-- Glass Background -->
    <div class="orvia-btn-glass"></div>
    <!-- Gradient Border -->
    <div class="orvia-btn-border"></div>
    <!-- Highlight -->
    <div class="orvia-btn-highlight"></div>
    <!-- Icon (SVG) -->
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="orvia-btn-icon">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  </button>
</div>
```

### CSS
```css
/* Container Positioning */
.orvia-float-btn-container {
  position: fixed;
  bottom: 1.5rem; /* 24px */
  right: 1.5rem;
  z-index: 50;
}

/* Button Reset & Layout */
.orvia-float-btn {
  position: relative;
  width: 3.5rem; /* 56px */
  height: 3.5rem;
  border-radius: 9999px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.orvia-float-btn:active {
  transform: scale(0.95);
}

/* 1. Outer Glow */
.orvia-btn-glow {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background-color: rgba(34, 211, 238, 0.3); /* cyan-400 */
  filter: blur(24px);
  transition: all 0.5s;
}

.orvia-float-btn:hover .orvia-btn-glow {
  background-color: rgba(34, 211, 238, 0.5);
  filter: blur(40px);
}

/* 2. Glass Background */
.orvia-btn-glass {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background-color: rgba(15, 23, 42, 0.1); /* slate-900 */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background-color 0.3s;
}

.orvia-float-btn:hover .orvia-btn-glass {
  background-color: rgba(15, 23, 42, 0.2);
}

/* 3. Gradient Border */
.orvia-btn-border {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(to right, #67e8f9, #22d3ee, #3b82f6);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
  opacity: 0.8;
  padding: 2px;
  /* Masking to create the hollow border effect */
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  transition: opacity 0.3s;
}

.orvia-float-btn:hover .orvia-btn-border {
  opacity: 1;
}

/* 4. Inner Highlight */
.orvia-btn-highlight {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(to top right, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0.4;
  pointer-events: none;
}

/* Icon */
.orvia-btn-icon {
  position: relative;
  z-index: 10;
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07));
}
```
