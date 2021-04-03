import AnswerTypes from './AnswerTypes'

const Quizzes = [
    {
        courseCode: "ENG101",
        courseName: "English 101",
        associatedLessonName: "English Lesson 1 (Kids)", 
        url: "https://www.youtube.com/watch?v=7k4uBAiJsMM",
        courseDescription: "Evaluation of fundamental skills in Engilsh",
        questions: [
            {
                q: "Which word means a person, place, or thing?",
                type: AnswerTypes.MC,
                options: [
                    "verb",
                    "noun",
                    "adjective",
                    "pronoun"
                ],
                a: 1
            },
            {
                q: "_ is the last letter in the English alphabet.",
                type: AnswerTypes.MC,
                options: [
                    "A",
                    "X",
                    "Y",
                    "Z"
                ],
                a: 3
            },
            {
                q: "______________ happy?",
                type: AnswerTypes.MC,
                options: [
                    "You are",
                    "Is you",
                    "Are you",
                    "Do you are"
                ],
                a: 2
            },
            {
                q: "Write the number one as a digit",
                type: AnswerTypes.NUM,
                a: 1 
            }
        ]
    },
    {
        courseCode: "MATH101",
        courseName: "Math 101",
        associatedLessonName: "Math Lesson 1 (Kids)", 
        url: "",
        courseDescription: "Evaluation of basic mathematical skills",
        questions: [
            {
                q: "The P in PEDMAS stands for ______.",
                type: AnswerTypes.MC,
                options: [
                    "Point",
                    "Primary",
                    "Pentagon",
                    "Parenthesis"
                ],
                a: 3
            },
            {
                q: "Complete the statement: 2 + 2 = _",
                type: AnswerTypes.NUM,
                a: 4
            },
            {
                q: "Which of the following is a basic mathematic operation?",
                type: AnswerTypes.MC,
                options: [
                    "Addition",
                    "Subtraction",
                    "Multiplication",
                    "Division",
                    "All of the above"
                ],
                a: 4
            }
        ]
    }
]

export default Quizzes;