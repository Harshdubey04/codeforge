const DIFFICULTY_STYLES = {
  easy:   "badge-success",
  medium: "badge-warning",
  hard:   "badge-error",
};

const ProblemInfo = ({ problem }) => {
  return (
    <div className="space-y-6">

      {/* Title + Difficulty */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{problem.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge capitalize ${DIFFICULTY_STYLES[problem.difficulty] || ""}`}>
            {problem.difficulty}
          </span>
          {problem.tags.map((tag, i) => (
            <span key={i} className="badge badge-outline badge-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="leading-relaxed text-base-content/80 whitespace-pre-line">
          {problem.description}
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg">Examples</h2>

        {problem.visibleTestCases.map((test, index) => (
          <div
            key={index}
            className="bg-base-200 rounded-xl p-4 space-y-2 border border-base-300"
          >
            <p className="text-sm font-bold text-base-content/60">
              Example {index + 1}
            </p>

            <div className="space-y-1 font-mono text-sm">
              <div className="flex gap-2">
                <span className="text-base-content/50 min-w-24">Input:</span>
                <span className="text-primary font-semibold">{test.input}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-base-content/50 min-w-24">Output:</span>
                <span className="text-success font-semibold">{test.output}</span>
              </div>
              {test.explanation && (
                <div className="flex gap-2">
                  <span className="text-base-content/50 min-w-24">Explanation:</span>
                  <span>{test.explanation}</span>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Constraints */}
      <div className="space-y-2">
        <h2 className="font-bold text-lg">Constraints</h2>
        <ul className="space-y-1 text-sm text-base-content/70">
          <li>• Function name: <code className="bg-base-300 px-1 rounded">{problem.functionName}</code></li>
          <li>• Supported languages: {problem.startCode.map(s => s.language).join(", ")}</li>
        </ul>
      </div>

    </div>
  );
};

export default ProblemInfo;