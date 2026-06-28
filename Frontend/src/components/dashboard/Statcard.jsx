const StatCard = ({ title, value, icon }) => {
  return (
    <div className="card bg-base-200 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300">

      <div className="card-body">

        <div className="flex justify-between items-center">

          <h2 className="text-sm text-base-content/70">
            {title}
          </h2>

          <span className="text-xl">
            {icon}
          </span>

        </div>

        <p className="text-4xl font-bold mt-2">
          {value}
        </p>

      </div>

    </div>
  );
};

export default StatCard;