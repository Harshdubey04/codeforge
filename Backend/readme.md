### Backend
Day 4---
Creating user problem --->Admin can create it only
    -Verifying the reference solution usnig judge0 for each language(problemCreator,userProblem,ProblemUtility)
    /* Flow:
        Request
        → Admin Check
        → Loop referenceSolution
        → Get languageId
        → Merge testCases
        → Create submissions
        → submitBatch (Judge0)
        → Get tokens
        → submitToken (poll)
        → Check status_id === 3
            → ❌ fail → return error
        → ✅ all pass
        → Save to DB
        → Success response
     */
     -Update Problem
        -runValidators:true-->It will validate the updates mentioned in schema when the problem  will get updated;If it is not given or false the validation will not work

     -deleteProblem
     -getProblemById
     -getAllProblem
        -Pagination concept  req url format-->localhost:3000/problem/getAllProblem?page=2&limit=10
        - in backend await Problem.find({}).skip(10).limit(10)
        formula :if page=2 ,limit=10 then  skip=(page-1)*limit

     -Submisson Code
      -Submit schema
      -Submit code functionality
      -Save problem id in user schema to find unique problem solved
      -Inserting problemId in problemSolved of userSchema if it is not present there
      
      -solvedAllProblemByUser
      -populate()->replaces the referenced ObjectIds with actual documents from the referenced collection
     
     -Run Code feature
     -Total submission for a problem feature-->Create compound Index for userId and problemId


   ### In ProblemSubmission
     testResult format-
    [
  {
    source_code: "const [a,b]=require('fs').readFileSync(0,'utf-8').trim().split(' ').map(Number); console.log(a+b);",
    language_id: 63,
    stdin: '2 3',
    expected_output: '5',
    stdout: '5\n',
    status_id: 3,
    created_at: '2026-06-07T08:41:14.368Z',
    finished_at: '2026-06-07T08:41:14.722Z',
    time: '0.022',
    memory: 7044,
    stderr: null,
    token: '08478a19-55ec-4ec0-80f0-9a75a9566e64',
    number_of_runs: 1,
    cpu_time_limit: '5.0',
    cpu_extra_time: '1.0',
    wall_time_limit: '10.0',
    memory_limit: 256000,
    stack_limit: 64000,
    max_processes_and_or_threads: 128,
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
    max_file_size: 5120,
    compile_output: null,
    exit_code: 0,
    exit_signal: null,
    message: null,
    wall_time: '0.041',
    compiler_options: null,
    command_line_arguments: null,
    redirect_stderr_to_stdout: false,
    callback_url: null,
    additional_files: null,
    enable_network: true,
    post_execution_filesystem: 'UEsDBBQACAAIACdFx1wAAAAAAAAAAGIAAAAJABwAc2NyaXB0LmpzVVQJAAOqLiVqqi4lanV4CwABBOgDAAAE6AMAAA3Mqw6AIBQA0F+hcZnIjG7OarQYnQHw6th46AWCfy/1hGNTzIXtWppjJnyrIwR+ZS4UoT4X53H7ooVB8lqufmxeyAUQKj/eFeCsSdAPrDUYJDEx28LkUfl0g+6MmH5QSwcIPgjtZF4AAABiAAAAUEsBAh4DFAAIAAgAJ0XHXD4I7WReAAAAYgAAAAkAGAAAAAAAAQAAAKSBAAAAAHNjcmlwdC5qc1VUBQADqi4lanV4CwABBOgDAAAE6AMAAFBLBQYAAAAAAQABAE8AAACxAAAAAAA=',
    status: { id: 3, description: 'Accepted' },
    language: { id: 63, name: 'JavaScript (Node.js 12.14.0)' }
  },
  {
    source_code: "const [a,b]=require('fs').readFileSync(0,'utf-8').trim().split(' ').map(Number); console.log(a+b);",
    language_id: 63,
    stdin: '10 20',
    expected_output: '30',
    stdout: '30\n',
    status_id: 3,
    created_at: '2026-06-07T08:41:14.383Z',
    finished_at: '2026-06-07T08:41:14.722Z',
    time: '0.023',
    memory: 7272,
    stderr: null,
    token: '2ca6785c-2875-4282-bd0d-e927e6eb66cb',
    number_of_runs: 1,
    cpu_time_limit: '5.0',
    cpu_extra_time: '1.0',
    wall_time_limit: '10.0',
    memory_limit: 256000,
    stack_limit: 64000,
    max_processes_and_or_threads: 128,
    enable_per_process_and_thread_time_limit: false,
    enable_per_process_and_thread_memory_limit: false,
    max_file_size: 5120,
    compile_output: null,
    exit_code: 0,
    exit_signal: null,
    message: null,
    wall_time: '0.042',
    compiler_options: null,
    command_line_arguments: null,
    redirect_stderr_to_stdout: false,
    callback_url: null,
    additional_files: null,
    enable_network: true,
    post_execution_filesystem: 'UEsDBBQACAAIACdFx1wAAAAAAAAAAGIAAAAJABwAc2NyaXB0LmpzVVQJAAOqLiVqqi4lanV4CwABBOgDAAAE6AMAAA3Mqw6AIBQA0F+hcZnIjG7OarQYnQHw6th46AWCfy/1hGNTzIXtWppjJnyrIwR+ZS4UoT4X53H7ooVB8lqufmxeyAUQKj/eFeCsSdAPrDUYJDEx28LkUfl0g+6MmH5QSwcIPgjtZF4AAABiAAAAUEsBAh4DFAAIAAgAJ0XHXD4I7WReAAAAYgAAAAkAGAAAAAAAAQAAAKSBAAAAAHNjcmlwdC5qc1VUBQADqi4lanV4CwABBOgDAAAE6AMAAFBLBQYAAAAAAQABAE8AAACxAAAAAAA=',
    status: { id: 3, description: 'Accepted' },
    language: { id: 63, name: 'JavaScript (Node.js 12.14.0)' }
  }
]
     

### Frontend

Requirements-HTML,CSS,JS,React(Vite),Tailwind,Daisy UI,ZOD,React From Library



     
