const SubmissionHistory = ({ submissions }) => {

    if (!submissions.length) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Submission History
      </h2>

      <div className="alert">
        No submissions yet.
      </div>
    </div>
  );
}

    return (
        
        <div className="mt-8">

            <h2 className="text-2xl font-bold mb-4">
                Submission History
            </h2>

            <div className="overflow-x-auto">

                <table className="table">

                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Language</th>
                            <th>Passed</th>
                            <th>Runtime</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {submissions.map((submission) => (

                            <tr key={submission._id}>

                                <td>

                                    <span
                                        className={
                                            submission.status === "accepted"
                                                ? "badge badge-success"
                                                : "badge badge-error"
                                        }
                                    >
                                        {submission.status}
                                    </span>

                                </td>

                                <td>{submission.language}</td>

                                <td>
                                    {submission.testCasesPassed}/
                                    {submission.testCasesTotal}
                                </td>

                                <td>
                                    {submission.runtime}s
                                </td>

                                <td>
                                    {new Date(
                                        submission.createdAt
                                    ).toLocaleDateString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default SubmissionHistory;