const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

const Question = require('./models/Question');
const questions = [
    {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
        answer: "O(log n)",
        difficulty: "easy",
        topic: "DSA"
    },
    {
        question: "Which data structure uses LIFO order?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: "Stack",
        difficulty: "easy",
        topic: "DSA"
    },
    {
        question: "What does the Array.prototype.reduce() method do in JavaScript?",
        options: [
            "Filters elements based on a condition",
            "Maps each element to a new value",
            "Reduces the array to a single value",
            "Sorts the array in ascending order"
        ],
        answer: "Reduces the array to a single value",
        difficulty: "easy",
        topic: "JavaScript"
    },
    {
        question: "What is the worst case time complexity of quicksort?",
        options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
        answer: "O(n^2)",
        difficulty: "medium",
        topic: "DSA"
    },
    {
        question: "Which of the following is NOT a valid way to declare a variable in JavaScript?",
        options: ["var x = 5", "let x = 5", "const x = 5", "int x = 5"],
        answer: "int x = 5",
        difficulty: "easy",
        topic: "JavaScript"
    },
    {
        question: "What is the output of typeof null in JavaScript?",
        options: ["null", "undefined", "object", "string"],
        answer: "object",
        difficulty: "medium",
        topic: "JavaScript"
    },
    {
        question: "In a min-heap, which element is always at the root?",
        options: ["Maximum element", "Minimum element", "Last inserted element", "Middle element"],
        answer: "Minimum element",
        difficulty: "easy",
        topic: "DSA"
    },
    {
        question: "What is a closure in JavaScript?",
        options: [
            "A function that calls itself",
            "A function that has access to its outer scope even after the outer function returns",
            "A way to close a browser window",
            "A method to terminate a loop"
        ],
        answer: "A function that has access to its outer scope even after the outer function returns",
        difficulty: "medium",
        topic: "JavaScript"
    },
    {
        question: "Which traversal of a BST gives elements in sorted order?",
        options: ["Preorder", "Postorder", "Inorder", "Level order"],
        answer: "Inorder",
        difficulty: "medium",
        topic: "DSA"
    },
    {
        question: "What is the time complexity of inserting an element at the beginning of a linked list?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
        answer: "O(1)",
        difficulty: "easy",
        topic: "DSA"
    }
];
const seedDB = async () => {
    await connectDB();
    await Question.insertMany(questions);
    console.log("Questions seeded");
    process.exit();
    
};

seedDB();
