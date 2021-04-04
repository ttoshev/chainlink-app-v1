import React, { useState, useEffect, useCallback } from "react";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Quizzes from '../courses/Quizzes.js';
import Card from 'react-bootstrap/Card';
import AnswerTypes from '../courses/AnswerTypes.js';
import Button from 'react-bootstrap/Button';


function Home(props) {
    const [contract, setContract] = useState(null)
    const [currentQuiz, setCurrentQuiz] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(-1);
    const [newValue, setNewValue] = useState("")
	const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [storageValue, setStorageValue] = useState("Test")
    const [styles, setStyles] = useState({})
    const [textAnswer, setTextAnswer] = useState("")

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
            const contractInstance = new props.web3.eth.Contract(
                SimpleStorageContract.abi,
                '0xe4859E3dd8D92a32FEc2bCDC1ca87d9a4e36d00d',
                {
                    from: props.accounts[0],
                    gasPrice: 1000,
                    gas: 100000
                }
            );
            contractInstance.deploy({
                data: SimpleStorageContract.bytecode,
                arguments: ["Boss"] // default name
            });
            setContract(contractInstance);
            runExample(contractInstance);
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

    const handleChange = useCallback(
        (event) => {
            setNewValue(event.target.value)
        },
        [],
    );

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault()
        
            try {
                await contract.methods.set(newValue).send(newValue, { from: props.accounts[0]});
            } 
            catch(error) {
                console.log(error)
            }
        
            const response = await contract.methods.get().call();
            setStorageValue(response) 
        },
        [contract, newValue, props.accounts],
    );   

    const runExample = async (contract) => {
        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();
    
        // Update state with the result.
        setStorageValue(response);
    };

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
        setCurrentQuiz(quiz);
        setShowScore(false);
        setScore(0);
        setCurrentQuestion(0);
    }

    const handleQuizEnd = () => {
        // Check if passed

        // 100% to pass, can change this...
        const requiredScore = 100;

        // note: questions are zero-indexed
        const percentScore = score / (currentQuiz.questions.length - 1) * 100
        console.log("percent score: " + percentScore)

        if (percentScore >= requiredScore) {
            console.log("Awarding NFT for " + currentQuiz.courseName + " to account: " + props.accounts[0])
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


    if (!props.web3) {
        return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
            <div style={styles.contract}>
                <Container>
                    <Row>
                        <Col>
                            <div style={styles.paddedText}>Your name is: {storageValue}</div>
                            <form onSubmit={handleSubmit}>
                                <input type="text" value={newValue} onChange={handleChange}></input>
                                <input type="submit" value="Submit"></input>
                            </form>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container>
                <Row>
                    <Col xs={12}>
                        <h2>Explore courses:</h2>
                    </Col>
                </Row>

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
                                                            <Card.Text>No NFT earned, please try again!</Card.Text>
                                                        ) : (
                                                            <Card.Text>Congratulations! You will be credited for completing this course...</Card.Text>
                                                        )
                                                    }
                                                </Card.Body>
                                            ) : (
                                                <Card.Body>
                                                    <Card.Title>{quiz.courseName}: Quiz</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                            Complete all questions to earn an NFT!
                                                    </Card.Subtitle>
                                                    <br/>
                                                    <div style={styles.questionSection}>
                                                        <p>Question {currentQuestion + 1}/{quiz.questions.length}</p>
                                                        <div style={styles.question}>
                                                            <p>{quiz.questions[currentQuestion].q}</p>
                                                        </div>
                                                    </div>
                                                    <Answers quizQuestion={quiz.questions[currentQuestion]} isLast={(currentQuestion === (quiz.questions.length-1))}/>
                                        
                                                </Card.Body>
                                        )
                                        ) : (
                                            <Card.Body>
                                                <Card.Title>{quiz.courseName}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">
                                                        <a href={quiz.url} target="_blank" rel="noopener noreferrer">
                                                            {quiz.associatedLessonName}
                                                        </a>
                                                    </Card.Subtitle>
                                                    <Card.Text>
                                                        {quiz.courseDescription}
                                                    </Card.Text>
                                                <Button  className="take-quiz" onClick={() => handleStartQuiz(quiz)}>Take Quiz</Button>
                                            </Card.Body>
 
                                        )}
                                    </Card>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </Container> 
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