import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getLeaderboard } from "../../api/problemApi";
import { motion } from "framer-motion";

const MEDAL = { 1: "🥇", 2: "🥈", 3: "🥉" };

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await getLeaderboard();
                setLeaderboard(response.leaderboard || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Find current user's rank
    const myRank = leaderboard.find(
        entry => entry.emailId === user?.emailId
    );

    return (
        <div className="space-y-8 max-w-4xl mx-auto">

            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold">Leaderboard</h1>
                <p className="text-base-content/60 mt-1">
                    Top developers ranked by problems solved.
                </p>
            </div>

            {/* My Rank Card */}
            {myRank && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card bg-primary text-primary-content shadow-lg"
                >
                    <div className="card-body py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-content/20 flex items-center justify-center font-bold">
                                    {user?.firstName?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold">Your Ranking</p>
                                    <p className="text-primary-content/70 text-sm">
                                        {user?.firstName}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black">#{myRank.rank}</p>
                                <p className="text-primary-content/70 text-sm">
                                    {myRank.totalSolved} solved
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Top 3 */}
            {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4">
                    {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => (
                        <motion.div
                            key={entry.rank}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`card border text-center ${
                                entry.rank === 1
                                    ? "bg-yellow-500/10 border-yellow-500/30 shadow-lg scale-105"
                                    : "bg-base-200 border-base-300"
                            }`}
                        >
                            <div className="card-body py-6">
                                <div className="text-4xl mb-2">
                                    {MEDAL[entry.rank]}
                                </div>
                                <div className="w-12 h-12 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-lg mx-auto">
                                    {entry.firstName?.charAt(0).toUpperCase()}
                                </div>
                                <p className="font-bold mt-2">
                                    {entry.firstName} {entry.lastName}
                                </p>
                                <p className="text-2xl font-black text-primary">
                                    {entry.totalSolved}
                                </p>
                                <p className="text-xs text-base-content/50">
                                    problems solved
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Full Table */}
            <div className="card bg-base-200 border border-base-300 shadow-md">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>User</th>
                                    <th>Problems Solved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((entry) => (
                                    <motion.tr
                                        key={entry.rank}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: entry.rank * 0.02 }}
                                        className={
                                            entry.emailId === user?.emailId
                                                ? "bg-primary/10 font-semibold"
                                                : ""
                                        }
                                    >
                                        <td>
                                            <span className="font-bold">
                                                {MEDAL[entry.rank] || `#${entry.rank}`}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-xs">
                                                    {entry.firstName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {entry.firstName} {entry.lastName}
                                                    </p>
                                                    <p className="text-xs text-base-content/50">
                                                        {entry.emailId}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-primary">
                                                    {entry.totalSolved}
                                                </span>
                                                <span className="text-xs text-base-content/50">
                                                    solved
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Leaderboard;