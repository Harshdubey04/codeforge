import { useEffect, useState } from "react";
import { getSubmissionHeatmap } from "../../api/problemApi";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const getColor = (count) => {
    if (!count || count === 0) return "bg-base-300";
    if (count === 1)           return "bg-primary/30";
    if (count === 2)           return "bg-primary/50";
    if (count === 3)           return "bg-primary/70";
    return                            "bg-primary";
};

const HeatMap = ({ onStreakLoad }) => {
    const [heatmap, setHeatmap] = useState({});
    const [streak, setStreak]   = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await getSubmissionHeatmap();
                setHeatmap(response.heatmap || {});
                setStreak(response.streak  || 0);
                if (onStreakLoad) onStreakLoad(response.streak || 0);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Build last 52 weeks grid
    const buildGrid = () => {
        const weeks = [];
        const today = new Date();
        // Start from 364 days ago
        const start = new Date(today);
        start.setDate(start.getDate() - 363);
        // Align to Sunday
        start.setDate(start.getDate() - start.getDay());

        let current = new Date(start);
        while (current <= today) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dateStr = current.toISOString().split('T')[0];
                week.push({
                    date:  dateStr,
                    count: heatmap[dateStr] || 0,
                    future: current > today,
                });
                current.setDate(current.getDate() + 1);
            }
            weeks.push(week);
        }
        return weeks;
    };

    // Get month labels
    const getMonthLabels = (weeks) => {
        const labels = [];
        let lastMonth = -1;
        weeks.forEach((week, i) => {
            const month = new Date(week[0].date).getMonth();
            if (month !== lastMonth) {
                labels.push({ index: i, label: MONTHS[month] });
                lastMonth = month;
            }
        });
        return labels;
    };

    if (loading) {
        return (
            <div className="card bg-base-200 border border-base-300 shadow-md">
                <div className="card-body">
                    <h2 className="card-title">Submission Heatmap</h2>
                    <div className="flex justify-center py-8">
                        <span className="loading loading-spinner"></span>
                    </div>
                </div>
            </div>
        );
    }

    const weeks       = buildGrid();
    const monthLabels = getMonthLabels(weeks);
    const totalThisYear = Object.values(heatmap).reduce((a, b) => a + b, 0);

    return (
        <div className="card bg-base-200 border border-base-300 shadow-md">
            <div className="card-body">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title">Submission Heatmap</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-base-content/50">
                            {totalThisYear} submissions this year
                        </span>
                        <div className="flex items-center gap-1 bg-base-300 px-3 py-1 rounded-full">
                            <span>🔥</span>
                            <span className="font-bold text-sm">{streak}</span>
                            <span className="text-xs text-base-content/50">day streak</span>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                    <div className="inline-flex flex-col gap-1 min-w-max">

                        {/* Month labels */}
                        <div className="flex gap-1 ml-8">
                            {weeks.map((_, i) => {
                                const label = monthLabels.find(m => m.index === i);
                                return (
                                    <div key={i} className="w-3 text-xs text-base-content/40">
                                        {label ? label.label : ""}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Day rows */}
                        {[0,1,2,3,4,5,6].map(dayIndex => (
                            <div key={dayIndex} className="flex items-center gap-1">

                                {/* Day label */}
                                <div className="w-7 text-xs text-base-content/40 text-right pr-1">
                                    {dayIndex % 2 === 1 ? DAYS[dayIndex] : ""}
                                </div>

                                {/* Cells */}
                                {weeks.map((week, weekIndex) => {
                                    const cell = week[dayIndex];
                                    return (
                                        <div
                                            key={weekIndex}
                                            className={`w-3 h-3 rounded-sm ${
                                                cell.future
                                                    ? "bg-transparent"
                                                    : getColor(cell.count)
                                            } cursor-pointer transition-all hover:scale-125`}
                                            title={`${cell.date}: ${cell.count} submission${cell.count !== 1 ? "s" : ""}`}
                                        />
                                    );
                                })}
                            </div>
                        ))}

                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 justify-end">
                    <span className="text-xs text-base-content/40">Less</span>
                    {["bg-base-300","bg-primary/30","bg-primary/50","bg-primary/70","bg-primary"].map((c, i) => (
                        <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                    ))}
                    <span className="text-xs text-base-content/40">More</span>
                </div>

            </div>
        </div>
    );
};

export default HeatMap;