import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProblemById, getProblemSubmissions } from "../../api/problemApi";
import ProblemInfo from "../../components/problems/ProblemInfo";
import EditorPanel from "../../components/problems/EditorPanel";
import SubmissionHistory from "../../components/problems/SubmissionHistory";
import AIAssistant from "../../components/problems/AIAssistant";

const TABS = ["Description", "Editorial", "Solutions", "Submissions"];

const extractCoreFunction = (code, language) => {
  if (!code) return "";
  if (language === "javascript") {
    return code.split("\n").filter(line => {
      const l = line.trim();
      return !l.startsWith("const lines") && !l.startsWith("const __") &&
        !l.startsWith("let __") && !l.startsWith("var __") &&
        !l.includes("readFileSync") && !l.includes("JSON.parse(lines") &&
        !l.includes("console.log(") && !l.startsWith("__input") &&
        !l.startsWith("__lines") && !l.startsWith("__args") &&
        !l.startsWith("__result") && !l.startsWith("__flat");
    }).join("\n").trim();
  }
  if (language === "python") {
    return code.split("\n").filter(line => {
      const l = line.trim();
      return !l.startsWith("import json") && !l.startsWith("import sys") &&
        !l.startsWith("__input") && !l.startsWith("__lines") &&
        !l.startsWith("__args") && !l.startsWith("__result") &&
        !l.startsWith("print(json");
    }).join("\n").trim();
  }
  return code.trim();
};

const Editorial = () => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold">Editorial</h2>
    <div className="aspect-video bg-base-200 border border-base-300 rounded-xl flex flex-col items-center justify-center gap-3">
      <span className="text-5xl">🎬</span>
      <p className="font-semibold">Video Solution</p>
      <p className="text-sm text-base-content/50">Coming soon</p>
    </div>
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body">
        <h3 className="font-bold">Written Explanation</h3>
        <p className="text-base-content/50 text-sm">Not added yet.</p>
      </div>
    </div>
  </div>
);

const Solutions = ({ problem }) => {
  const [activeLanguage, setActiveLanguage] = useState(
    problem.referenceSolution?.[0]?.language || ""
  );
  const [copied, setCopied] = useState(false);

  const currentSolution = problem.referenceSolution?.find(
    s => s.language === activeLanguage
  );
  const cleanCode = currentSolution
    ? extractCoreFunction(currentSolution.completeCode, activeLanguage)
    : "";

  if (!problem.referenceSolution?.length) {
    return (
      <div className="text-center py-12 text-base-content/50">
        <p className="text-4xl mb-3">📭</p>
        <p>No solutions available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Solutions</h2>
      <div className="flex gap-2 flex-wrap">
        {problem.referenceSolution.map(sol => (
          <button key={sol.language} onClick={() => setActiveLanguage(sol.language)}
            className={`btn btn-sm capitalize ${activeLanguage === sol.language ? "btn-primary" : "btn-ghost"}`}>
            {sol.language}
          </button>
        ))}
      </div>
      {cleanCode && (
        <div>
          <div className="flex items-center justify-between bg-base-300 px-4 py-2 rounded-t-xl">
            <span className="text-xs text-base-content/50 capitalize">{activeLanguage}</span>
            <button className="btn btn-xs btn-ghost" onClick={() => {
              navigator.clipboard.writeText(cleanCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          <pre className="bg-base-200 rounded-b-xl p-4 overflow-x-auto text-sm font-mono leading-relaxed whitespace-pre-wrap border border-base-300 border-t-0 max-h-[60vh] overflow-y-auto">
            <code>{cleanCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem]         = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab]     = useState("Description");

  // Resizable panel state
  const [leftWidth, setLeftWidth]     = useState(42); // percentage
  const isDragging                    = useRef(false);
  const containerRef                  = useRef(null);

  const fetchSubmissions = async () => {
    try {
      const history = await getProblemSubmissions(id);
      setSubmissions(history.submissions || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
        await fetchSubmissions();
      } catch (error) {
        console.log(error);
      }
    };
    fetchProblem();
  }, [id]);

  // Drag logic
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newLeftWidth >= 25 && newLeftWidth <= 70) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!problem) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full overflow-hidden">

      {/* Left Panel */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="flex flex-col h-full border-r border-base-300 overflow-hidden shrink-0"
      >
        {/* Tabs */}
        <div className="flex border-b border-base-300 bg-base-200 px-2 overflow-x-auto shrink-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === "Submissions") fetchSubmissions();
              }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/50 hover:text-base-content"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "Description" && <ProblemInfo problem={problem} />}
          {activeTab === "Editorial"   && <Editorial />}
          {activeTab === "Solutions"   && <Solutions problem={problem} />}
          {activeTab === "Submissions" && <SubmissionHistory submissions={submissions} />}
        </div>
      </div>

      {/* Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="w-1.5 bg-base-300 hover:bg-primary active:bg-primary transition-colors cursor-col-resize shrink-0 relative group"
      >
        {/* Visual grip dots */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-primary" />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 h-full overflow-hidden">
        <EditorPanel
          problem={problem}
          onSubmitSuccess={() => {
            fetchSubmissions();
            setActiveTab("Submissions");
          }}
        />
      </div>

      {/* AI Assistant */}
      <AIAssistant problem={problem} />
    
    </div>
  );
};

export default ProblemDetails;
