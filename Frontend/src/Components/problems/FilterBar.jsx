const DIFFICULTIES = ["all", "easy", "medium", "hard"];
const ALL_TAGS = ["Array", "Linked List", "Graph", "DP"];

const FilterBar = ({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  selectedTag,
  setSelectedTag,
  problems = []
}) => {

  // Only show tags that exist in problems
  // filtered by current difficulty selection
  const availableTags = ALL_TAGS.filter(tag => {
    return problems.some(problem => {

      const matchesDifficulty = difficulty === "all"
        || problem.difficulty === difficulty;

      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesDifficulty
        && matchesSearch
        && problem.tags.includes(tag);

    });
  });

  // If selected tag is no longer available, reset it
  const handleDifficultyChange = (d) => {
    setDifficulty(d);
    setSelectedTag("all"); // reset tag on difficulty change
  };

  return (

    <div className="flex flex-col gap-4 mb-6">

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search problems..."
        className="input input-bordered w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-6">

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">

          <span className="text-sm text-base-content/60 font-medium">
            Difficulty:
          </span>

          <div className="flex gap-2">
            {DIFFICULTIES.map(d => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={`btn btn-sm capitalize ${
                  difficulty === d
                    ? d === "easy"
                      ? "btn-success"
                      : d === "medium"
                        ? "btn-warning"
                        : d === "hard"
                          ? "btn-error"
                          : "btn-neutral"
                    : "btn-ghost"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

        </div>

        {/* Tag Filter — only shown if tags exist */}
        {availableTags.length > 0 && (

          <div className="flex items-center gap-2">

            <span className="text-sm text-base-content/60 font-medium">
              Tag:
            </span>

            <div className="flex gap-2 flex-wrap">

              {/* All button */}
              <button
                onClick={() => setSelectedTag("all")}
                className={`btn btn-sm ${
                  selectedTag === "all" ? "btn-primary" : "btn-ghost"
                }`}
              >
                All
              </button>

              {/* Only available tags */}
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`btn btn-sm ${
                    selectedTag === tag ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {tag}
                </button>
              ))}

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default FilterBar;