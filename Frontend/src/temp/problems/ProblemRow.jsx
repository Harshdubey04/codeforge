import { useNavigate } from "react-router-dom";
import DifficultyBadge from "./DifficultyBadge";

const ProblemRow = ({ problem,solved  }) => {

  const navigate = useNavigate();

  return (

    <tr
      className="hover cursor-pointer"
      onClick={() =>
        navigate(`/problems/${problem._id}`)
      }
    >
      <td>
        {solved ? (
          <span className="text-success text-xl">
            ✓
          </span>
        ) : (
          <span className="text-base-content/30 text-xl">
            ○
          </span>
        )}
      </td>

      <td>
        {problem.title}
      </td>

      <td>
        <DifficultyBadge
          difficulty={problem.difficulty}
        />
      </td>

      <td>

        <div className="flex gap-2">

          {problem.tags.map((tag,index)=>(
            <span
              key={index}
              className="badge badge-outline"
            >
              {tag}
            </span>
          ))}

        </div>

      </td>

    </tr>
  );
};

export default ProblemRow;