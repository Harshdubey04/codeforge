const DifficultyBadge = ({ difficulty }) => {

  const styles = {
    easy: "badge badge-success",
    medium: "badge badge-warning",
    hard: "badge badge-error"
  };

  return (
    <span className={styles[difficulty]}>
      {difficulty}
    </span>
  );
};

export default DifficultyBadge;