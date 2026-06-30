import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSolvedProblems } from "../../api/problemAPI";

const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    easy: "badge-success",
    medium: "badge-warning",
    hard: "badge-error"
  };
  return (
    <span className={`badge badge-sm capitalize ${styles[difficulty] || ""}`}>
      {difficulty}
    </span>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="card bg-base-200 border border-base-300 text-center">
    <div className="card-body p-4">
      <div className="text-2xl">{icon}</div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs text-base-content/60">{title}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const response = await getSolvedProblems();
        setSolvedProblems(response.solvedProblems || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolved();
  }, []);

  const totalSolved = solvedProblems.length;
  const easySolved = solvedProblems.filter(p => p.difficulty === "easy").length;
  const mediumSolved = solvedProblems.filter(p => p.difficulty === "medium").length;
  const hardSolved = solvedProblems.filter(p => p.difficulty === "hard").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="card bg-base-200 border border-base-300 shadow-md">
        <div className="card-body">

          <div className="flex items-center gap-6">

            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-20 h-20 text-3xl font-bold flex items-center justify-center">
                {user?.firstName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-base-content/60 mt-1">
                {user?.emailId}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-xl font-bold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Solved" value={totalSolved} icon="🎯" />
          <StatCard title="Easy Solved"  value={easySolved}  icon="🟢" />
          <StatCard title="Medium Solved" value={mediumSolved} icon="🟡" />
          <StatCard title="Hard Solved"  value={hardSolved}  icon="🔴" />
        </div>
      </div>

      {/* Solved Problems List */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          Problems Solved
          <span className="text-base font-normal text-base-content/50 ml-2">
            ({totalSolved})
          </span>
        </h2>

        {solvedProblems.length === 0 ? (

          <div className="card bg-base-200 border border-base-300">
            <div className="card-body text-center text-base-content/50">
              No problems solved yet. Start solving!
            </div>
          </div>

        ) : (

          <div className="card bg-base-200 border border-base-300 shadow-md">
            <div className="card-body p-0">

              <div className="overflow-x-auto">
                <table className="table table-zebra">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Difficulty</th>
                      <th>Tags</th>
                    </tr>
                  </thead>

                  <tbody>
                    {solvedProblems.map((problem, index) => (
                      <tr key={problem._id}>

                        <td className="text-base-content/50">
                          {index + 1}
                        </td>

                        <td className="font-medium">
                          <span className="text-success mr-2">✓</span>
                          {problem.title}
                        </td>

                        <td>
                          <DifficultyBadge difficulty={problem.difficulty} />
                        </td>

                        <td>
                          <div className="flex gap-1 flex-wrap">
                            {problem.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="badge badge-outline badge-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

            </div>
          </div>

        )}

      </div>

    </div>
  );
};

export default Profile;