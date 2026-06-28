import ProblemRow from "./ProblemRow";

const ProblemTable = ({ problems,solvedIds }) => {

  return (

    <div className="overflow-x-auto">

      <table className="table table-zebra">

        <thead>

          <tr>

            <th>Status</th>

            <th>Title</th>

            <th>Difficulty</th>

            <th>Tags</th>

          </tr>

        </thead>

        <tbody>

          {
            problems.map(problem => (

              <ProblemRow
                key={problem._id}
                problem={problem}
                solved={solvedIds.has(problem._id)}
              />

            ))
          }

        </tbody>

      </table>

    </div>

  );
};

export default ProblemTable;