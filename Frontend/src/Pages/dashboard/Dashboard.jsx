import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StatCard from "../../components/dashboard/StatCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import HeatMap from "../../components/dashboard/HeatMap";
import { getSolvedProblems } from "../../api/problemApi";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalSolved: 0,
    easySolved:  0,
    mediumSolved: 0,
    hardSolved:  0,
  });
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getSolvedProblems();
        const solved   = response.solvedProblems;

        setStats({
          totalSolved:  solved.length,
          easySolved:   solved.filter(p => p.difficulty === "easy").length,
          mediumSolved: solved.filter(p => p.difficulty === "medium").length,
          hardSolved:   solved.filter(p => p.difficulty === "hard").length,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">
            Good morning, {user?.firstName}! 👋
          </h1>
          <p className="text-base-content/60 mt-1">
            Keep solving and improve your skills every day.
          </p>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 bg-base-200 border border-base-300 px-5 py-3 rounded-xl">
          <span className="text-2xl">🔥</span>
          <div>
            <p className="text-2xl font-black">{streak}</p>
            <p className="text-xs text-base-content/50">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Problems Solved" value={stats.totalSolved}  icon="🎯" />
        <StatCard title="Easy Solved"     value={stats.easySolved}   icon="🟢" />
        <StatCard title="Medium Solved"   value={stats.mediumSolved} icon="🟡" />
        <StatCard title="Hard Solved"     value={stats.hardSolved}   icon="🔴" />
      </div>

      {/* Heatmap */}
      <HeatMap onStreakLoad={(s) => setStreak(s)} />

      {/* Recent Activity */}
      <RecentActivity />

    </div>
  );
};

export default Dashboard;