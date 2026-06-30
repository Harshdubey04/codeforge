import { useEffect, useState } from "react";
import { getAllProblems } from "../../api/problemAPI";
import { useNavigate } from "react-router-dom";
import { deleteProblem } from "../../api/problemAPI";

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
  <div className="card bg-base-200 border border-base-300">
    <div className="card-body p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-sm text-base-content/60">{title}</h2>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  </div>
);


const AdminDashBoard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const handleDelete = async () => {
  try {
    setDeleting(true);
    await deleteProblem(deleteId);
    setProblems(problems.filter(p => p._id !== deleteId));
    setDeleteId(null);
  } catch (error) {
    console.log(error);
  } finally {
    setDeleting(false);
  }
};


  const totalProblems = problems.length;
  const easyCount = problems.filter(p => p.difficulty === "easy").length;
  const mediumCount = problems.filter(p => p.difficulty === "medium").length;
  const hardCount = problems.filter(p => p.difficulty === "hard").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Manage all problems from here.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/create")}
          className="btn btn-primary gap-2"
        >
          ➕ Create Problem
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Problems" value={totalProblems} icon="📋" />
        <StatCard title="Easy"           value={easyCount}     icon="🟢" />
        <StatCard title="Medium"         value={mediumCount}   icon="🟡" />
        <StatCard title="Hard"           value={hardCount}     icon="🔴" />
      </div>

      {/* Problems Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          All Problems
          <span className="text-base font-normal text-base-content/50 ml-2">
            ({totalProblems})
          </span>
        </h2>

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
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {problems.map((problem, index) => (
                    <tr key={problem._id}>

                      <td className="text-base-content/50">
                        {index + 1}
                      </td>

                      <td className="font-medium">
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

                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit/${problem._id}`)}
                            className="btn btn-sm btn-outline btn-info"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(problem._id)}
                            className="btn btn-sm btn-outline btn-error"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>
    {/* Delete Confirmation Modal */}
{deleteId && (
  <div className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Delete Problem</h3>
      <p className="py-4 text-base-content/70">
        Are you sure? This action cannot be undone.
      </p>
      <div className="modal-action">
        <button
          className="btn btn-ghost"
          onClick={() => setDeleteId(null)}
        >
          Cancel
        </button>
        <button
          className="btn btn-error"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting
            ? <span className="loading loading-spinner loading-sm"></span>
            : "Yes, Delete"
          }
        </button>
      </div>
    </div>
  </div>
)}
    </div>

  );
};

export default AdminDashBoard;