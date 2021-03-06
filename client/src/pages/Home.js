import React, { useState, useEffect, useCallback } from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import EduForAllCourse from "../contracts/EduForAllCourse.json";
import ReactPlayer from "react-player"

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Quizzes from '../courses/Quizzes.js';
import consts from '../utils/consts.js';
import Card from 'react-bootstrap/Card';
import AnswerTypes from '../courses/AnswerTypes.js';
import Button from 'react-bootstrap/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faAngleDown,
    faAngleUp
} from '@fortawesome/free-solid-svg-icons'


function Home(props) {
    const [contract, setContract] = useState(null)
    const [currentQuiz, setCurrentQuiz] = useState("");
    const [openedCourse, setOpenedCourse] = useState(-1);
    const [currentQuestion, setCurrentQuestion] = useState(-1);
	const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [showCourses, setShowCourses] = useState(-1);
    const [styles, setStyles] = useState({});
    const [textAnswer, setTextAnswer] = useState("");


    const defaultQuizState = {
        currentQuiz: "",
        showScore: false,
        score: 0,
        textAnswer: "",
        currentQuestion: -1
    }

    // Styling
    useEffect(() => {
        // set initial styles
        setStyles(getStylesForScreenSize())

        // update style on resize to provide responsive ux
        window.addEventListener('resize', (event) => {
            setStyles(getStylesForScreenSize())
        });
    }, []);

    // Contract
    useEffect(() => {
        
        try {
            console.log("deploying contract instance")
            const contractInstance = new props.web3.eth.Contract(
                EduForAllCourse.abi,
                consts.EDU_FOR_ALL_COURSE_CONTRACT,
                {
                    from: props.accounts[0],
                    gasPrice: 1000,
                    gas: 100000
                }
            );

            setContract(contractInstance);
            // runExample(contractInstance);
        } catch (error) {
            console.log(error);
        }

    }, [props.web3, props.accounts]);

    // responsive styling function
    const getStylesForScreenSize = () => {
        let width = document.documentElement.clientWidth

        if (width >= 992) {
            return stylesLg;
        } 
        
        return stylesXs;
    }

    const handleAnswerSubmit = (question, answer, isLast) => {
        if (question.a === answer) {
            setScore(score + 1)
        }

        if (isLast) {
            handleQuizEnd()
        }
        else {
            setCurrentQuestion(currentQuestion + 1)
        }

        // reset text answer
        setTextAnswer("")
    };
    
    const handleStartQuiz = (quiz) => {
        contract.methods.checkCompletion(quiz.courseCode).call()
        .then((isCompleted) => {
            console.log('isCompleted')
            console.log(isCompleted)
            if (!isCompleted) {
                setScore(0);
                setCurrentQuestion(0);
                setCurrentQuiz(quiz);
                setShowScore(false);
            }
            else {
                alert("You've already received an NFT for this course");
            }
        })
    }

    const resetQuizState = () => {
        setScore(defaultQuizState.score);
        setCurrentQuestion(defaultQuizState.currentQuestion);
        setCurrentQuiz(defaultQuizState.currentQuiz);
        setShowScore(defaultQuizState.showScore);
        setTextAnswer(defaultQuizState.textAnswer)
    }

    const handleQuizEnd = () => {
        // Check if passed

        // 100% to pass, can change this...
        const requiredScore = 100;

        // note: questions are zero-indexed
        const percentScore = score / (currentQuiz.questions.length - 1) * 100

        if (percentScore >= requiredScore) {
            console.log("Awarding NFT for " + currentQuiz.courseName + " to account: " + props.accounts[0])
            
            // estimate gas
            // take max of estimate, min

            const minGas = consts.EDU_FOR_ALL_COURSE_CONTRACT_MIN_GAS;
            contract.methods.requestCertificate(currentQuiz.courseCode, currentQuiz.courseName, "BEGINNER", percentScore).send(
                {
                    from: props.accounts[0],
                    gas: minGas
                }
            )
            .then((data) => {
                console.log(data);
            })
            .catch((e) => {
                console.log("Error requesting certificate: " + e)
            })


        }
        // Award NFT if passed
        setCurrentQuestion(-1);
        setShowScore(true)
    }

    const handleAnswerNumChange = useCallback(
        (event) => {
            setTextAnswer(parseInt(event.target.value))
        },
        [],
    );
    const handleAnswerChange = useCallback(
        (event) => {
            setTextAnswer(event.target.value)
        },
        [],
    );

    function Answers(props) {
        if (props.quizQuestion.type === AnswerTypes.MC) {
            return(
                <div className="answer-section">
                    {props.quizQuestion.options.map((answerOption, index) => {
                        return(
                            <Button
                                className="answer-btn"
                                onClick={() => handleAnswerSubmit(props.quizQuestion, index, props.isLast)}>{answerOption}
                            </Button>
                        )
                    })
                    }
                </div>
                
            )
        }

        else if (props.quizQuestion.type === AnswerTypes.NUM) {
            return(
                <div>
                    <input type="text" value={textAnswer} onChange={handleAnswerNumChange}></input>
                    <Button
                        className="confirm-btn"
                        onClick={() => handleAnswerSubmit(props.quizQuestion, textAnswer, props.isLast)}>
                        Confirm
                    </Button>
                </div>
            )
        }

        else if (props.quizQuestion.type === AnswerTypes.TXT) {
            return(
                <div>
                    <input type="text" value={textAnswer} onChange={handleAnswerChange}></input>
                    <Button
                        className="confirm-btn"
                        onClick={() => handleAnswerSubmit(props.quizQuestion, textAnswer, props.isLast)}>
                        Confirm
                    </Button>
                </div>
            )
        }

        // catch invalid questions
        else {
            return <p>Question is invalid.</p>
        }
    }

    function TakeQuizBtn(functionProps) {
        if (props.web3 && props.accounts && contract) {
            return (
                <Button  className="take-quiz" onClick={() => handleStartQuiz(functionProps.quiz)}>Take Quiz</Button>
            )
        }
        else {
            return (
                <p>Loading wallet</p>
            )
        }    
    }


    if (!props.web3) {
        return (
            <div className="home">
                <div>Loading Web3, accounts, and contract...</div>
            </div>
        );
    }
    return (
        <div className="home">
            <div className="App">
                <div style={styles.contract}>
                    <Container>
                        <Row>
                            <Col textAlign='left'>
                                <div className="how-it-works-section">
                                    <h3> How it works:</h3>
                                    <ol>
                                        <li>
                                            Explore our available courses and choose the one that interests you.
                                        </li>
                                        <li>
                                            Complete the video lesson for that course.
                                        </li>
                                        <li>
                                            Complete a short quiz to verify your knowledge.
                                        </li>
                                        <li>
                                            Wait for the transaction to complete and earn an NFT!
                                        </li>
                                    </ol>
                                </div> 
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Container>
                    <Row>
                        <Col xs={3}></Col>
                        <Col xs={5} textAlign="right">
                            <h2 className="padded-title">Explore courses </h2> 
                        </Col>
                        <Col xs={1} textAlign="left"> 
                            <div 
                                onClick={() => {setShowCourses(showCourses*-1)}}
                                style={{marginTop:'5%'}}
                            >
                                {(showCourses == -1) ? (
                                    <FontAwesomeIcon icon={faAngleDown} size = '2x'/>
                                ) : (
                                    <FontAwesomeIcon icon={faAngleUp} size = '2x'/>
                                )}
                            </div>
                        </Col>

                        <Col xs={3}></Col>

                    </Row>
                    {(showCourses == 1) ? (
                        <div className="courses">
                            {Quizzes.map((quiz) => {
                                return(
                                    <Row>
                                        <Col xs={12}>
                                            <Card style={styles.card}>
                                                
                                                {(quiz === currentQuiz) ? 
                                                (
                                                    (showScore) ? 
                                                    (
                                                        <Card.Body>
                                                            <Card.Title>{quiz.courseName}: Quiz</Card.Title>
                                                            <Card.Subtitle>
                                                                You scored {score/quiz.questions.length*100}%!
                                                            </Card.Subtitle>
                                                            {
                                                                (score < quiz.questions.length) ? (
                                                                    <div>
                                                                        <Card.Text>No NFT earned, please try again!</Card.Text>
                                                                        <Button  className="take-quiz" onClick={() => resetQuizState()}>Back</Button>
                                                                    </div>
                                                                    ) : (
                                                                    <div>
                                                                        <Card.Text>Congratulations! You will be credited for completing this course...</Card.Text>
                                                                        <Button  className="take-quiz" onClick={() => resetQuizState()}>Back</Button>
                                                                    </div>
                                                                )
                                                            }
                                                        </Card.Body>
                                                    ) : (
                                                        <Card.Body>
                                                            <div className="inline">
                                                            {
                                                                (currentQuestion < 0) ? (
                                                                    <Card.Title className="centeredTitle">{quiz.courseName}: Quiz</Card.Title>
                                                                ): (
                                                                    <Container>
                                                                        <Row>
                                                                            <Col xs={2}>
                                                                                <Button
                                                                                    variant="danger"
                                                                                    className="exit-quiz-btn"
                                                                                    onClick={() => resetQuizState()}
                                                                                    style={{marginLeft:'-10px'}}
                                                                                >
                                                                                    Exit quiz
                                                                                </Button>
                                                                            </Col>
                                                                            <Col xs={8}>
                                                                                <Card.Title className="centeredTitle">{quiz.courseName}: Quiz</Card.Title>
                                                                            </Col>
                                                                            <Col xs={2}>

                                                                            </Col>
                                                                        </Row>
                                                                    </Container>
                                                                )
                                                            }
                                                                
                                                            </div>
                                                            <Card.Subtitle className="mb-2 text-muted">
                                                                    Complete all questions to earn an NFT!
                                                            </Card.Subtitle>
                                                            <br/>
                                                            <div style={styles.questionSection}>
                                                                <p>Question {currentQuestion + 1}/{quiz.questions.length}</p>
                                                                <div style={styles.question}>
                                                                    <p>{quiz.courseCode}</p>
                                                                    <p>{quiz.questions[currentQuestion].q}</p>
                                                                </div>
                                                            </div>
                                                            <Answers quizQuestion={quiz.questions[currentQuestion]} isLast={(currentQuestion === (quiz.questions.length-1))}/>
                                                
                                                        </Card.Body>
                                                )
                                                ) : (
                                                    <Card.Body>
                                                        <Card.Title className="centeredTitle">{quiz.courseName}</Card.Title>
                                                        <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                                                        <Card.Text>
                                                            {quiz.associatedLessonName}
                                                        </Card.Text>
                                                        <ReactPlayer
                                                            className="centered-vid"
                                                            url={quiz.url} 
                                                            style={{maxWidth:'100%'}}
                                                        />
                                                        
                                                        <Card.Text>
                                                            {quiz.courseDescription}
                                                        </Card.Text>
                                                        <TakeQuizBtn quiz={quiz}/>
                                                    </Card.Body>
                                                )}
                                            </Card>
                                        </Col>
                                    </Row>
                                )
                            })}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </Container> 
            </div>
        </div>
    )
    
}

const stylesXs = {
    alignCenter: {
        textAlign: 'center'
    },
    alignLeft: {
        textAlign: 'left'
    },
    alignRight: {
        textAlign: 'right'
    },
    card: {
        marginTop: '20',
        marginBottom: '20px',
        boxShadow: '5px 3px 10px 3px rgba(0,0,0,0.3)',
        borderRadius: 10
    },
    contract: {
        marginTop: '32px',
        marginBottom: '32px'
    },
    paddedText: {
        marginTop: '24px',
        marginBottom: '24px'
    }
}
const stylesLg = {
    alignCenter: {
        textAlign: 'center'
    },
    alignLeft: {
        textAlign: 'left'
    },
    alignRight: {
        textAlign: 'right'
    },
    card: {
        marginTop: '24px',
        marginBottom: '24px',
        boxShadow: '5px 3px 10px 3px rgba(0,0,0,0.3)',
    },
    contract: {
        marginTop: '36px',
        marginBottom: '36px'
    },
    paddedText: {
        marginTop: '32px',
        marginBottom: '32px'
    }
}

export default Home;
