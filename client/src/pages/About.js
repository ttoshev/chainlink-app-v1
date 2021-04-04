
import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// About Us page
// /about
function About(props) {
    const [styles, setStyles] = useState({})
    useEffect(() => {

        // set initial styles
        setStyles(getStylesForScreenSize())

        // update style on resize to provide responsive ux
        window.addEventListener('resize', (event) => {
            setStyles(getStylesForScreenSize())
        });
    }, []);

    // responsive styling function
    const getStylesForScreenSize = () => {
        let width = document.documentElement.clientWidth

        if (width >= 992) {
            return stylesLg;
        } 
        
        return stylesXs;
    }

    return(
        <div>
            <div style={styles.heroContainer}>
                <Container >
                    <Row>
                        <Col xs={12} lg={6} style={styles.heroHeadingContainer}>
                            <h1> About Us</h1>
                        </Col>
                        <Col xs={12} lg={6}>
                            <div style={styles.alignLeft}>
                                <p style={styles.text}>
                                    All over the world, there is a growing demand for 
                                    affordable, high quality education. edu4all is a 
                                    humanitarian project that aims to provide free education
                                    online that allows individuals to be accredited through 
                                    the use of NFT tokens. Simply complete courses through our
                                    supported web-based platforms and earn instant accrediation.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div style={styles.missionContainer}>
                <Container>
                    <Row>
                        <Col xs={12} lg={6}>
                            <div>
                                <img style={styles.oerImage} alt="" src={require("../public/static/open-educational-resources.png")}/>
                            </div>
                        </Col>
                        <Col xs={12} lg={6}>
                            <div style={styles.missionContent}>
                                <h2 style={styles.sectionHeading}>
                                    Our Mission
                                </h2>
                                    <p style={styles.text}> 
                                        Our mission is to provide quality education to underpriviledged
                                        communities around the world. As we grow, we hope to partner with 
                                        more organizations, as to help us gain recognition in accrediation
                                        of acedemic acheivements.
                                    </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div style={styles.eduHumanRightContainer}>
                <Container >
                    <Row>
                        <Col xs={12} lg={6} style={styles.heroHeadingContainer}>
                            <h2 style={styles.sectionHeading}> Education is a human right.</h2>
                        </Col>
                        <Col xs={12} lg={6}>
                            <p style={styles.text}>
                                We believe that education is a fundamental human right, and we 
                                have a duty to provide widely accessible education. Our goals include
                                reducing drop-out rates in elementary students, increasing global accrediation,
                                and in turn reduce the number of people living in poverty around the globe.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>


        
    );
}

// screen width < 992
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
    eduHumanRightContainer: {
        marginTop: '64px',
        marginBotton: '56px'
    },
    heroContainer: {
        marginTop: '48px',
        marginBottom: '68px',
        textAlign: 'center '
    },
    heroHeadingContainer: {
    },
    missionContainer: {
        marginTop: '64px',
        marginBotton: '56px',
        textAlign: 'center'
    },
    missionContent: {
        marginTop: '10%'
    },
    oerImage: {
        maxWidth: '70%',
        borderRadius: 10
    },
    ourTeamContainer: {
        marginTop: '64px',
        marginBotton: '56px'
    },
    partnerHeading: {
        marginTop: '24px',
        marginBottom:'24px'
    },
    sectionHeading: {
        marginBottom: '24px'
    },
    text: {
        fontSize: '18px'
    }
}

// screen width >= 992
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
    eduHumanRightContainer: {
        marginTop: '98px',
        marginBotton: '56px',
    },
    heroContainer: {
        marginTop: '56px',
        marginBottom: '98px',
        textAlign: 'center '
    },
    heroHeadingContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    missionContainer: {
        marginTop: '98px',
        marginBotton: '56px'
    },
    missionContent: {
        marginTop: '5%'
    },
    oerImage: {
        maxWidth: '80%',
        borderRadius: 10
    },
    ourTeamContainer: {
        marginTop: '98px',
        marginBotton: '56px'
    },
    partnerHeading: {
        marginTop: '24px',
        marginBottom:'24px'
    },
    sectionHeading: {
        marginBottom: '24px'
    },
    teamMember1: {},
    teamMember2: {
        marginTop: '98px'
    },
    text: {
        fontSize: '18px'
    }
}

export default About;
