import { useEffect, useState } from "react";
import { getAllUserSubmissions } from "../../api/problemApi";

const StatusBadge = ({ status }) => {
    if (status === "accepted") {
        return <span className="badge badge-sm badge-success">Accepted</span>;
    }
    if (status === "wrong") {
        return <span className="badge badge-sm badge-error">Wrong Answer</span>;
    }
    if (status === "error") {
        return <span className="badge badge-sm badge-warning">Error</span>;
    }
    return <span className="badge badge-sm">{status}</span>;
};

const RecentActivity = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await getAllUserSubmissions();
                setSubmissions(response.submissions || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    if (loading) {
        return (
            <div className="card bg-base-200 border border-base-300 shadow-md">
                <div className="card-body">
                    <h2 className="card-title">Recent Activity</h2>
                    <p className="text-base-content/50 text-sm mt-2">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-200 border border-base-300 shadow-md">
            <div className="card-body">

                <h2 className="card-title">Recent Activity</h2>

                {submissions.length === 0 ? (

                    <p className="text-base-content/50 text-sm mt-2">
                        No submissions yet. Start solving problems!
                    </p>

                ) : (

                    <div className="space-y-3 mt-2">
                        {submissions.map((sub, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 rounded-lg bg-base-100"
                            >

                                {/* Left: icon + problem title */}
                                <div className="flex items-center gap-3">

                                    <span className={`text-lg font-bold ${
                                        sub.status === "accepted"
                                            ? "text-success"
                                            : "text-error"
                                    }`}>
                                        {sub.status === "accepted" ? "✓" : "✗"}
                                    </span>

                                    <div>
                                        <p className="font-medium text-sm">
                                            {sub.problemId?.title || "Unknown Problem"}
                                        </p>
                                        <p className="text-xs text-base-content/50">
                                            {sub.language}
                                        </p>
                                    </div>

                                </div>

                                {/* Right: status + test cases */}
                                <div className="flex items-center gap-3">

                                    <span className="text-xs text-base-content/50">
                                        {sub.testCasesPassed}/{sub.testCasesTotal}
                                    </span>

                                    <StatusBadge status={sub.status} />

                                </div>

                            </div>
                        ))}
                    </div>

                )}

            </div>
        </div>
    );
};

export default RecentActivity;