import React from 'react';
import { CssBaseline, Grid, Paper } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { redirectToLoginPage, redirectToRegisterPage } from '../../utils/Redirecter';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import LandingWelcomeGif from '../../assets/gifs/LandingWelcome.gif';

import {Link} from 'react-scroll';
import {TextField,  Button, InputAdornment, IconButton, Divider, AccordionActions } from '@mui/material';

import '../../assets/styles.css';
const useStyles = makeStyles(theme => ({
    header: {
        paddingTop: "0.5rem",
        marginBottom: "0",
        fontFamily: "Ubuntu-Light",
        fontSize: "x-large",
        textAlign: "center",
    },
    headerSpan: {
        paddingBottom: "0.5rem",
        fontFamily: "Ubuntu-Light",
        fontSize: "large",
        textAlign: "center",
    },
    illustrationLabel: {
        fontSize: "xx-large",
        fontFamily: "Ubuntu",
        color: "black",
        [theme.breakpoints.down('md')]: {
            fontSize: "x-large",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "x-large",
        },
    },
    loginIllustration: {
        width: "16rem",
        [theme.breakpoints.down('md')]: {
            width: "12rem",
        },
        [theme.breakpoints.down('sm')]: {
            width: "10rem",
        },
    }
}));

const LandingPage = () => {
    const classes = useStyles();
    const navigator = useNavigate();
    return (
        <div className="loginPageContainer">
            <Navbar />
            <div style={{padding: "20px", marginTop: "10px", display: "flex", justifyContent: "center"}}>
                <Paper style={{width: "80%", padding: "50px"}}>
                    <p className={classes.illustrationLabel}>Welcome to Tithenai</p>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={12} md={5} lg={4}>
                            <img src={LandingWelcomeGif} alt="Welcome" className={classes.loginIllustration}/>
                        </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={8}>
                            <p className="textWithSecondaryGradient">Get inspired by others' thesis, publish your own one and share your thoughts with your colleages.</p>
                        </Grid>
                        <Grid container alignItems="center" direction="column">
                            <Grid item xs={12} sm={12} md={7} lg={8}>
                                <p className={classes.headerSpan}>
                                    To start
                                </p>
                                <Button 
                                        className="forwardingSpan" 
                                        onClick={() => redirectToRegisterPage(navigator)}
                                        color="secondary" 
                                                variant="outlined" 
                                                size="large" 
                                                type="submit" 
                                                style={{padding: "1vh 2vw", fontFamily: "Ubuntu", backgroundColor: "green", color: "white"}}>
                                        &nbsp;Sign Up Now!
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={7} lg={8}>
                                <p className={classes.headerSpan}>
                                    If you already have an account
                                </p>
                                <Button 
                                    className="forwardingSpan" 
                                    onClick={() => redirectToRegisterPage(navigator)}
                                    color="secondary" 
                                            variant="outlined" 
                                            size="large" 
                                            type="submit" 
                                            style={{padding: "1vh 2vw", fontFamily: "Ubuntu", backgroundColor: "green", color: "white"}}>
                                    &nbsp;Sign In
                                </Button>
                            </Grid>
                            <p className={classes.headerSpan}>
                                To learn more,
                                <Link className="forwardingSpan" to="aboutTithenai">&nbsp;click here.</Link>
                            </p>
                        </Grid>
                    </Grid>
                </Paper>
            </div>
            <div style={{padding: "20px", display: "flex", justifyContent: "center"}}>
                <Paper style={{width: "80%", padding: "50px"}} id="aboutTithenai">
                    <p className={classes.illustrationLabel}>About Tithenai</p>
                    <p className={classes.header}>
                        The application was developed to target two groups. The first group consists of undergraduate
                        students who are undertaking or plan to undertake research for their thesis. The second group
                        includes students who have completed their studies and have a ready-to-publish thesis and wish
                        to present their work in a professional setting where they can also inspire other students.
                    </p>
                </Paper>
            </div>
            <Footer />
            <CssBaseline />
        </div>
    )
}

export default LandingPage;