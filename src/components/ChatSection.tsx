import { useEffect, useRef, useState } from "react";
import { Bot, User, Send, FileCode, Check } from "lucide-react";
import { processAiMessage, getDetailedAnalysis, getAiConnectionInfo } from "../lib/aiService";
import { useSoftwareStore } from "../lib/store";

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]"
          style={{
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Parses basic markdown elements into HTML for premium rendering of logs, bold text,
 * lists, and code blocks returned by Gemini.
 */
function formatMessage(text: string): string {
  // 1. Escape HTML
  let formatted = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. Format multi-line code blocks
  formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, __, code) => {
    return `<pre class="my-2 p-3 bg-[#08090E] rounded-xl border border-[rgba(167,139,250,0.15)] overflow-x-auto text-[11px] font-mono text-[#C4B5FD] select-all">${code.trim()}</pre>`;
  });

  // 3. Format inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#08090E] border border-[rgba(167,139,250,0.1)] text-[12px] font-mono text-[#A78BFA]">$1</code>');

  // 4. Format bold text
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-[#F5F3FF]">$1</strong>');

  // 5. Format bullet points
  formatted = formatted.replace(/^\s*•\s+(.+)$/gm, '<li class="ml-4 list-disc my-1">$1</li>');
  formatted = formatted.replace(/^\s*-\s+(.+)$/gm, '<li class="ml-4 list-disc my-1">$1</li>');

  // 6. Format line breaks
  formatted = formatted.replace(/\n/g, '<br/>');

  return formatted;
}

export default function ChatSection() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([
    { from: "bot", text: "Hello! I'm SoftScan Copilot. Upload your software list (JSON or TXT) or ask me about any app's health and update instructions." }
  ]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState(getAiConnectionInfo);
  const setScannedApps = useSoftwareStore((state) => state.setScannedApps);
  const setScanning = useSoftwareStore((state) => state.setScanning);
  const saveScanToHistory = useSoftwareStore((state) => state.saveScanToHistory);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInputValue("");
    setShowTyping(true);

    try {
      const response = await processAiMessage(userText, fileContent);
      setShowTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: response }]);
      setAiStatus(getAiConnectionInfo());
    } catch {
      setShowTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, I encountered an error communicating with Gemini." }]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      setFileContent(content);

      // Auto-trigger full analysis report
      setShowTyping(true);
      setScanning(true);
      
      try {
        const [analysisReport, detailedApps] = await Promise.all([
          processAiMessage("Analyze this file and list all detected applications with their versions, indicating any warnings or updates.", content),
          getDetailedAnalysis(content)
        ]);
        
        setScannedApps(detailedApps);
        if (detailedApps.length > 0) {
          saveScanToHistory(file.name, detailedApps);
        }
        setScanning(false);
        setShowTyping(false);
        
        setMessages((prev) => [...prev, {
          from: "bot",
          text: `**File Received: ${file.name}**\n\nI've generated a comprehensive health audit. I've populated the "At a Glance" dashboard with ${detailedApps.length} applications.\n\n${analysisReport}`
        }]);
        setAiStatus(getAiConnectionInfo());
      } catch {
        setScanning(false);
        setShowTyping(false);
        setMessages((prev) => [...prev, {
          from: "bot",
          text: `Failed to process ${file.name}. Please ensure it is a valid text or JSON file with software listings.`
        }]);
      }
    };
    reader.readAsText(file);
    // Reset target value so the same file can be uploaded again
    e.target.value = "";
  };

  return (
    <div id="chat-section" className="w-full max-w-xl mx-auto bg-[#05060A] rounded-2xl p-6 border border-[rgba(167,139,250,0.15)] shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8B5CF6] rounded-full blur-[80px] opacity-10 pointer-events-none" />

      {/* Premium Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(167,139,250,0.1)] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.35)]">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-[#F5F3FF] text-sm font-semibold tracking-wide">SoftScan Copilot</h3>
            <p className="text-[10px] text-[#9CA3AF] font-medium">AI Software Safety & Update Audit</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
            aiStatus.state === 'connected'
              ? 'bg-[rgba(16,185,129,0.06)] border-emerald-500/20'
              : aiStatus.state === 'no_key'
                ? 'bg-[rgba(107,114,128,0.08)] border-gray-500/20'
                : 'bg-[rgba(245,158,11,0.06)] border-amber-500/20'
          }`}
          title={aiStatus.detail}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              aiStatus.state === 'connected'
                ? 'bg-emerald-400 animate-pulse'
                : aiStatus.state === 'no_key'
                  ? 'bg-gray-400'
                  : 'bg-amber-400'
            }`}
          />
          <span
            className={`text-[9px] font-bold uppercase tracking-wider ${
              aiStatus.state === 'connected'
                ? 'text-[#34D399]'
                : aiStatus.state === 'no_key'
                  ? 'text-[#9CA3AF]'
                  : 'text-amber-400'
            }`}
          >
            {aiStatus.label}
          </span>
        </div>
      </div>

      {/* CHAT MESSAGES */}
      <div className="space-y-4 max-h-[450px] min-h-[300px] overflow-y-auto mb-6 pr-2 custom-scrollbar relative z-10">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.from === "bot"
                  ? "bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                  : "bg-[rgba(167,139,250,0.2)] border border-[rgba(167,139,250,0.2)]"
                }`}
            >
              {msg.from === "bot" ? (
                <Bot size={14} className="text-white" />
              ) : (
                <User size={14} className="text-[#C4B5FD]" />
              )}
            </div>

            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.from === "bot"
                  ? "bg-[rgba(139,92,246,0.08)] text-[#E2DEFF] border border-[rgba(139,92,246,0.1)] rounded-tl-none"
                  : "bg-[#8B5CF6] text-white rounded-tr-none shadow-lg"
                }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
            />
          </div>
        ))}

        {showTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              <Bot size={14} className="text-white" />
            </div>
            <div className="bg-[rgba(139,92,246,0.08)] px-4 py-3 rounded-2xl rounded-tl-none border border-[rgba(139,92,246,0.1)]">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="relative z-10">
        <div className="flex flex-col gap-3 p-1 rounded-2xl border border-[rgba(167,139,250,0.2)] bg-[rgba(139,92,246,0.04)] backdrop-blur-sm transition-all focus-within:border-[rgba(167,139,250,0.4)] focus-within:bg-[rgba(139,92,246,0.08)]">

          {/* FILE STATUS BAR */}
          {uploadedFile && (
            <div className="flex items-center justify-between px-3 py-1.5 mx-1 mt-1 rounded-lg bg-[rgba(167,139,250,0.1)] border border-[rgba(167,139,250,0.1)] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-[#A78BFA]" />
                <span className="text-[10px] font-medium text-[#C4B5FD] truncate max-w-[150px]">
                  {uploadedFile.name}
                </span>
                <Check size={12} className="text-emerald-400" />
              </div>
              <button
                onClick={() => { setUploadedFile(null); setFileContent(""); }}
                className="text-[10px] text-[#9CA3AF] hover:text-[#F5F3FF]"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#C4B5FD] hover:bg-[rgba(167,139,250,0.1)] transition-colors"
              title="Upload software list"
            >
              <FileCode size={18} />
            </button>

            <input
              type="text"
              placeholder="Ask about software health, CVEs, or updates..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent text-[#F5F3FF] text-sm placeholder:text-[#6B7280] outline-none"
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || showTyping}
              className="w-8 h-8 rounded-xl bg-[#8B5CF6] flex items-center justify-center hover:bg-[#7C3AED] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(139,92,246,0.3)]"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".json,.txt"
          className="hidden"
        />
      </div>
    </div>
  );
}