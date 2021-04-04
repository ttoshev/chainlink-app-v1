import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Navbar, Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NavigationBar() {
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

    return (
        <Navbar bg="dark" expand="lg" variant="dark">
            <Container>
                <Row>                        
                    <Col xs={12} lg={4} lgOffset={8} >
                        <div className="logo-navbar">
                            <img style={styles.logo} alt="" src={require("../public/static/edu4all.png")}/>
                            <h1 style={styles.appName}>
                                EDU4ALL
                            </h1>
                        </div> 
                    </Col>
                </Row>
            </Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>
                            Home
                        </Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/about">
                        <Nav.Link>
                            About
                        </Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
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
    appName: {
        color: '#f9f9f9',
        fontSize:'1.4rem'
    },
    centerSmall: {
        textAlign: 'center',
        flexDirection: 'row'
    },
    logo: {
        maxWidth: '32px',
        borderRadius: 5
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
    appName: {
        color: '#f9f9f9',
        fontSize:'2.5rem',
        marginLeft: '16px',
    },
    centerSmall: {
        textAlign: 'right',
        flexDirection: 'row'
    },
    logo: {
        maxWidth: '64px',
        borderRadius: 5
    }
}

export default NavigationBar;

