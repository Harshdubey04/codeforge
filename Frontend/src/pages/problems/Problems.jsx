import { useEffect, useState } from "react";
import { getAllProblems, getSolvedProblems } from "../../api/problemAPI";
import ProblemTable from "../../components/problems/ProblemTable";
import FilterBar from "../../components/problems/FilterBar";

const PROBLEMS_PER_PAGE = 10;

const Problems = () => {

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");//

  const solvedIds = new Set(
    solvedProblems.map(problem => problem._id)
  );

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data);

        const solved = await getSolvedProblems();
        setSolvedProblems(solved.solvedProblems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, difficulty, selectedTag]);

  if (loading) {
    return (
      <span className="loading loading-spinner loading-lg"></span>
    );
  }

  // Filter problems
  const filteredProblems = problems.filter(problem => {

    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty = difficulty === "all"
      || problem.difficulty === difficulty;

    const matchesTag = selectedTag === "all"
      || problem.tags.includes(selectedTag);

    return matchesSearch && matchesDifficulty && matchesTag;

  });

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredProblems.length / PROBLEMS_PER_PAGE
  );

  const paginatedProblems = filteredProblems.slice(
    (currentPage - 1) * PROBLEMS_PER_PAGE,
    currentPage * PROBLEMS_PER_PAGE
  );

  return (

    <div>

      <div className="mb-8">
        <h1 className="text-4xl font-bold">Problems</h1>
        <p className="opacity-70 mt-2">
          Solve coding challenges and improve your skills.
        </p>
      </div>

      <FilterBar
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        status={status}
        setStatus={setStatus}
        problems={problems}
      />

      {/* Results count */}
      <p className="text-sm text-base-content/50 mb-4">
        Showing {paginatedProblems.length} of {filteredProblems.length} problems
      </p>

      <ProblemTable
        problems={paginatedProblems}
        solvedIds={solvedIds}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">

          {/* Prev */}
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`btn btn-sm ${
                currentPage === page
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next */}
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>

        </div>
      )}

    </div>

  );

};

export default Problems;