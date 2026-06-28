const Problem = require('../models/problem');
const Submission = require('../models/submission');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');

const getWrappedCode = (code, language, stdin, functionName) => {
    const input = stdin.trim();

if (language === 'javascript') {
    return `
${code}
const __input = \`${input}\`;
const __lines = __input.trim().split('\\n');
const __args = __lines.map(line => {
    line = line.trim();
    // Try JSON parse first (handles arrays, numbers)
    try { return JSON.parse(line); } catch {}
    // Try space-separated numbers on same line
    const parts = line.split(/\\s+/);
    if (parts.length > 1) {
        const nums = parts.map(p => isNaN(p) ? p : Number(p));
        return nums;
    }
    // Single value
    return isNaN(line) ? line : Number(line);
});
// Flatten one level so "2 3" becomes args (2, 3) not ([2,3])
const __flatArgs = __args.flat();
console.log(JSON.stringify(${functionName}(...__flatArgs)));
    `;
}

 if (language === 'python') {
    return `
import json, sys

${code}

__input = """${input}"""
__lines = [l.strip() for l in __input.strip().split('\\n')]
__args = []
for l in __lines:
    # Try JSON parse first
    try:
        __args.append(json.loads(l))
        continue
    except:
        pass
    # Try space-separated numbers
    parts = l.split()
    if len(parts) > 1:
        __args.extend([int(p) if p.lstrip('-').isdigit() else p for p in parts])
    else:
        __args.append(int(l) if l.lstrip('-').isdigit() else l)

__result = ${functionName}(*__args)
print(json.dumps(__result))
    `;
}

    // Java and C++ — starter code already handles I/O
    if (language === 'java' || language === 'c++') {
        return code;
    }

    return code;
};


const submitCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Some fields are missing");
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            testCasesTotal: problem.hiddenTestCases.length
        });

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).json({ message: `Unsupported language: ${language}` });
        }

        const submissions = problem.hiddenTestCases.map((testcase) => ({
            source_code: getWrappedCode(code, language, testcase.input, problem.functionName),
            language_id: languageId,
            stdin: (language === 'java' || language === 'c++') ? testcase.input : '',
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(500).json({ message: "Judge0 submission failed" });
        }

        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let errorMessage = null;
        let status = 'accepted';

        for (const test of testResult) {
            if (test.status_id === 3) {
                testCasesPassed++;
                runtime += parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            } else {
                status = test.status_id === 4 ? 'error' : 'wrong';
                errorMessage = test.stderr || test.compile_output || "Wrong Answer";
            }
        }

        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;
        await submittedResult.save();

        if (status === 'accepted') {
            if (!Array.isArray(req.user.problemSolved)) {
                req.user.problemSolved = [];
            }
            if (!req.user.problemSolved.some(id => id.toString() === problemId)) {
                // req.user.problemSolved.push(problemId);
                await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: {
                    problemSolved: problemId
                    }
                }
                );
                await req.user.save();
            }
        }

        res.status(201).send(submittedResult);

    } catch (err) {
        res.status(500).send(err.message);
    }
};


const runCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;
        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).send("Some fields are missing");
        }

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).send("Problem not found");
        }

        const languageId = getLanguageById(language);
        if (!languageId) {
            return res.status(400).json({ message: `Unsupported language: ${language}` });
        }

        const submissions = problem.visibleTestCases.map((testcase) => ({
            source_code: getWrappedCode(code, language, testcase.input, problem.functionName),
            language_id: languageId,
            stdin: (language === 'java' || language === 'c++') ? testcase.input : '',
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        if (!submitResult || !Array.isArray(submitResult)) {
            return res.status(500).json({ message: "Judge0 submission failed" });
        }

        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        res.status(201).send(testResult);

    } catch (err) {
        res.status(500).send(err.message);
    }
};


module.exports = { submitCode, runCode };