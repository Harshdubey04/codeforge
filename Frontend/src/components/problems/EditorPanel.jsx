import { useEffect, useState, useRef, useCallback } from "react";
import CodeEditor from "./CodeEditor";
import { runCodeApi, submitCodeApi } from "../../api/submissionAPI";
import OutputConsole from "./OutputConsole";

const EditorPanel = ({ problem, onSubmitSuccess }) => {

  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState("testcase");
  const [customInput, setCustomInput] = useState("");
  const [editorHeight, setEditorHeight] = useState(65); // percentage
  const codePerLanguage = useRef({});
  const [code, setCode] = useState("");
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!problem) return;
    problem.startCode.forEach(item => {
      if (!codePerLanguage.current[item.language]) {
        codePerLanguage.current[item.language] = item.initialCode;
      }
    });
    const starter = problem.startCode.find(item => item.language === language);
    if (starter) setCode(starter.initialCode);
    if (problem.visibleTestCases?.[0]) {
      setCustomInput(problem.visibleTestCases[0].input);
    }
  }, [problem]);

  // Vertical drag logic
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
      if (newHeight >= 25 && newHeight <= 80) {
        setEditorHeight(newHeight);
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

  const handleLanguageChange = (newLanguage) => {
    codePerLanguage.current[language] = code;
    const saved = codePerLanguage.current[newLanguage];
    if (saved !== undefined) {
      setCode(saved);
    } else {
      const starter = problem.startCode.find(item => item.language === newLanguage);
      setCode(starter ? starter.initialCode : "");
    }
    setLanguage(newLanguage);
    setRunResult(null);
    setSubmitResult(null);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    codePerLanguage.current[language] = newCode;
  };

  const handleRun = async () => {
    try {
      setRunning(true);
      setSubmitResult(null);
      setActiveConsoleTab("output");
      const result = await runCodeApi(problem._id, code, language);
      setRunResult(result);
    } catch (error) {
      console.log(error);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setRunResult(null);
      setActiveConsoleTab("output");
      const result = await submitCodeApi(problem._id, code, language);
      setSubmitResult(result);
      if (onSubmitSuccess) await onSubmitSuccess();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) return null;

  return (
    <div ref={containerRef} className="flex flex-col h-full">

      {/* Toolbar */}
      <div className="h-12 flex items-center justify-between px-4 bg-base-200 border-b border-base-300 shrink-0">
        <select
          className="select select-bordered select-sm"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          {problem.startCode.map(lang => (
            // <option key={lang._id} value={lang.language}>
            //   {lang.language}
            // </option>

            <option
              key={lang._id}
              value={lang.language}
            >
              {
                lang.language === "cpp"
                  ? "C++"
                  : lang.language
              }
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-outline gap-1"
            onClick={handleRun}
            disabled={running || submitting}
          >
            {running
              ? <><span className="loading loading-spinner loading-xs"></span>Running...</>
              : "▶ Run"
            }
          </button>
          <button
            className="btn btn-sm btn-primary gap-1"
            onClick={handleSubmit}
            disabled={submitting || running}
          >
            {submitting
              ? <><span className="loading loading-spinner loading-xs"></span>Submitting...</>
              : "✓ Submit"
            }
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        style={{ height: `${editorHeight}%` }}
        className="overflow-hidden shrink-0"
      >
        <CodeEditor
          code={code}
          setCode={handleCodeChange}
          language={language}
        />
      </div>

      {/* Horizontal Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="h-1.5 bg-base-300 hover:bg-primary active:bg-primary transition-colors cursor-row-resize shrink-0 relative group"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-primary" />
          ))}
        </div>
      </div>

      {/* Console */}
      <div className="flex-1 flex flex-col overflow-hidden bg-base-100 border-t border-base-300 min-h-0">

        {/* Console Tab Bar */}
        <div className="flex items-center justify-between bg-base-200 border-b border-base-300 px-3 shrink-0">
          <div className="flex">
            <button
              onClick={() => setActiveConsoleTab("testcase")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeConsoleTab === "testcase"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/50 hover:text-base-content"
                }`}
            >
              Testcase
            </button>
            <button
              onClick={() => setActiveConsoleTab("output")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeConsoleTab === "output"
                  ? "border-primary text-primary"
                  : "border-transparent text-base-content/50 hover:text-base-content"
                }`}
            >
              Test Result
              {(runResult || submitResult) && (
                <span className={`w-2 h-2 rounded-full ${submitResult?.status === "accepted" ? "bg-success"
                    : submitResult ? "bg-error" : "bg-info"
                  }`} />
              )}
            </button>
          </div>
          {(runResult || submitResult) && (
            <button
              className="text-xs text-base-content/40 hover:text-base-content"
              onClick={() => { setRunResult(null); setSubmitResult(null); }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Console Content */}
        <div className="flex-1 overflow-y-auto p-4">

          {/* Testcase Tab */}
          {activeConsoleTab === "testcase" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {problem.visibleTestCases.map((tc, i) => (
                  <button
                    key={i}
                    onClick={() => setCustomInput(tc.input)}
                    className={`btn btn-xs ${customInput === tc.input ? "btn-primary" : "btn-outline"}`}
                  >
                    Case {i + 1}
                  </button>
                ))}
              </div>
              <div>
                <label className="text-xs text-base-content/50 font-semibold uppercase tracking-wider block mb-2">
                  Input
                </label>
                <textarea
                  className="textarea textarea-bordered w-full font-mono text-sm resize-none bg-base-200"
                  rows={3}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />
              </div>
              {problem.visibleTestCases.map((tc, i) =>
                customInput === tc.input ? (
                  <div key={i}>
                    <label className="text-xs text-base-content/50 font-semibold uppercase tracking-wider block mb-2">
                      Expected Output
                    </label>
                    <div className="bg-base-200 rounded-lg px-3 py-2 font-mono text-sm">
                      {tc.output}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )}

          {/* Output Tab */}
          {activeConsoleTab === "output" && (
            <div>
              {!runResult && !submitResult && (
                <div className="flex items-center justify-center h-20 text-base-content/30">
                  <p className="text-sm">You must run your code first</p>
                </div>
              )}
              {runResult && <OutputConsole results={runResult} />}
              {submitResult && (
                <div className={`rounded-xl p-4 ${submitResult.status === "accepted"
                    ? "bg-success/10 border border-success/30"
                    : "bg-error/10 border border-error/30"
                  }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">
                      {submitResult.status === "accepted" ? "✅" : "❌"}
                    </span>
                    <span className={`text-xl font-black capitalize ${submitResult.status === "accepted" ? "text-success" : "text-error"
                      }`}>
                      {submitResult.status === "accepted" ? "Accepted" : submitResult.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-base-200 rounded-lg p-3">
                      <p className="text-xs text-base-content/50 mb-1">Test Cases</p>
                      <p className="font-bold">{submitResult.testCasesPassed}/{submitResult.testCasesTotal}</p>
                    </div>
                    <div className="bg-base-200 rounded-lg p-3">
                      <p className="text-xs text-base-content/50 mb-1">Runtime</p>
                      <p className="font-bold">{submitResult.runtime}s</p>
                    </div>
                    <div className="bg-base-200 rounded-lg p-3">
                      <p className="text-xs text-base-content/50 mb-1">Memory</p>
                      <p className="font-bold">{submitResult.memory}KB</p>
                    </div>
                  </div>
                  {submitResult.errorMessage && (
                    <div className="mt-3 bg-error/10 rounded-lg p-3">
                      <p className="text-xs text-base-content/50 mb-1 font-semibold">Error</p>
                      <p className="text-xs text-error font-mono whitespace-pre-wrap">
                        {submitResult.errorMessage}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default EditorPanel;
