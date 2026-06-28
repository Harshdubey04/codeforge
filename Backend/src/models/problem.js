const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },

    tags: [
        {
            type: String,
            enum: [
                "Array",
                "String",
                "Hashing",
                "Sorting",
                "Searching",
                "Binary Search",
                "Two Pointer",
                "Sliding Window",
                "Stack",
                "Queue",
                "Linked List",
                "Doubly Linked List",
                "Recursion",
                "Backtracking",
                "Tree",
                "Binary Tree",
                "Binary Search Tree",
                "Heap",
                "Priority Queue",
                "Graph",
                "Graph Traversal",
                "Dynamic Programming",
                "Greedy",
                "Math",
                "Bit Manipulation",
                "Matrix",
                "Trie",
                "Segment Tree",
                "Union Find",
                "Database",
                "SQL",
                "Simulation"
            ],
            required: true
        }
    ],

    visibleTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true },
            explanation: { type: String, required: true }
        }
    ],

    hiddenTestCases: [
        {
            input: { type: String, required: true },
            output: { type: String, required: true }
        }
    ],

    // startCode: [
    //     {
    //         language: { type: String, required: true },
    //         initialCode: { type: String, required: true }
    //     }
    // ],

    startCode: [
        {
            language: {
                type: String,
                enum: ["javascript", "python", "cpp"],
                required: true
            },
            initialCode: {
                type: String,
                required: true
            }
        }
    ],

    referenceSolution: [
        {
            language: {
                type: String,
                enum: ["javascript", "python", "cpp"],
                required: true
            },
            completeCode: {
                type: String,
                required: true
            }
        }
    ],

    referenceSolution: [
        {
            language: { type: String, required: true },
            completeCode: { type: String, required: true }
        }
    ],

    functionName: {          // ✅ New field
        type: String,
        required: true       // e.g. "add", "twoSum", "maxProfit"
    },

    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;