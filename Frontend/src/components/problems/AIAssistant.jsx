import { useState, useRef, useEffect } from "react";
import { askAI } from "../../api/problemAPI";

const AIAssistant = ({ problem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: "model",
        content: `Hi! I'm your AI assistant for **${problem.title}**. I can give you hints and explain concepts, but I won't give you the full solution. What would you like help with?`
      }]);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Only send actual conversation (skip welcome message)
      const history = newMessages.slice(1, -1).map(m => ({
        role: m.role === "model" ? "model" : "user",
        content: m.content
      }));

      const response = await askAI(
        userMessage.content,
        problem.title,
        problem.description,
        history
      );

      setMessages(prev => [...prev, {
        role: "model",
        content: response.response
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "model",
        content: "Sorry, I encountered an error. Please try again."
      }]);
    }
    finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-base-300 px-1 rounded text-xs">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 btn btn-primary rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform flex items-center justify-center text-xl"
          title="AI Assistant"
        >
          🤖
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] flex flex-col bg-base-100 border border-base-300 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-content shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <p className="font-bold text-sm">AI Assistant</p>
                <p className="text-xs opacity-70">Hints only — no full solutions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMessages([]);
                  setIsOpen(false);
                }}
                className="btn btn-ghost btn-xs text-primary-content opacity-70 hover:opacity-100"
                title="Clear and close"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-ghost btn-xs text-primary-content opacity-70 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                    ? "bg-primary text-primary-content rounded-br-none"
                    : "bg-base-200 text-base-content rounded-bl-none"
                  }`}>
                  {msg.role === "model" ? (
                    <span dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content)
                    }} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-base-200 rounded-2xl rounded-bl-none px-4 py-3">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap shrink-0">
              {[
                "Give me a hint",
                "What approach should I use?",
                "Explain the concept",
              ].map(q => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="btn btn-xs btn-outline"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-base-300 shrink-0">
            <div className="flex gap-2">
              <textarea
                className="textarea textarea-bordered flex-1 text-sm resize-none min-h-[40px] max-h-[100px]"
                placeholder="Ask for a hint..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="btn btn-primary btn-sm self-end"
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : "→"}
              </button>
            </div>
            <p className="text-xs text-base-content/30 mt-1 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>

        </div>
      )}
    </>
  );
};

export default AIAssistant;