const OutputConsole = ({ results }) => {
  if (!results) return null;

  return (
    <div className="h-full overflow-y-auto bg-base-200 p-4 rounded-lg">

      <h2 className="font-bold text-lg mb-4">
        Output
      </h2>

      {results.map((result, index) => (
        <div
          key={index}
          className="mb-4 border-b border-base-300 pb-3"
        >

          <p className="font-semibold">
            Test Case {index + 1}
          </p>

          <p className="mt-2">
            <span className="font-medium">
              Output:
            </span>
            {" "}
            {result.stdout || "No output"}
          </p>

          <p>
            <span className="font-medium">
              Time:
            </span>
            {" "}
            {result.time}s
          </p>

          <p>
            <span className="font-medium">
              Memory:
            </span>
            {" "}
            {result.memory}KB
          </p>

          <p>
            <span className="font-medium">
              Status:
            </span>
            {" "}
            {result.status_id === 3
              ? "Passed ✅"
              : "Failed ❌"}
          </p>

        </div>
      ))}

    </div>
  );
};

export default OutputConsole;