import React, { Component } from 'react';
import {
    Grid,
    TextField,
    Button,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import '../assets/styles.css';
import DoneIcon from '@mui/icons-material/Done';
import { sortAlphabetically } from '../utils/HelperFunctions';
import { getAllUnis } from '../Service';

const UpdateButton = styled(Button)(({ theme }) => ({
    color: theme.palette.secondary.dark,
    fontFamily: "Ubuntu-Light",
    fontWeight: "bold",
    border: `2px solid ${theme.palette.secondary.dark}`,
    textTransform: "none",
    '&:hover': {
        border: `2px solid ${theme.palette.secondary.dark}`,
        backgroundColor: theme.palette.secondary.dark,
        color: "#ffffff",
    },
}));

export default class EditProfileForm extends Component {
    state = {
        initialFirstname: this.props.userInfo.firstname,
        initialLastname: this.props.userInfo.lastname,
        initialUniversity: this.props.userInfo.university,
        initialStatus: this.props.userInfo.status,
        initialEmail: this.props.userInfo.email,
        universities: [],
    }

    componentDidMount = async () => {
        getAllUnis()
            .then(response => {
                const sortedData = response.sort(sortAlphabetically("uniName", "tr"))
                this.setState({ universities: sortedData })
            })
            .catch(error => console.log(error));
    }

    handleUpdateProfile = () => {
        //TODO: Update Profile
    }

    render() {
        const filterOptions = createFilterOptions({
            matchFrom: 'start',
            stringify: (option) => option.uniName,
        });

        const form_validation_schema = Yup.object().shape({
            firstname: Yup.string()
                .min(2, "It's too Short!")
                .required("This Field is required!"),
            lastname: Yup.string()
                .min(2, "It's too Short!")
                .required("This Field is required!"),
            status: Yup.string()
                .required("This Field is required!"),
            university: Yup.object()
                .required("This Field is required!").nullable(),
            email: Yup.string()
                .email("Invalid Email! Please enter a valid E-Mail address!")
                .required("This Field is required!"),
        });

        const initial_form_values = {
            firstname: this.state.initialFirstname,
            lastname: this.state.initialLastname,
            university: this.state.initialUniversity,
            status: this.state.initialStatus,
            email: this.state.initialEmail,
        };

        return (
            <Formik
                initialValues={initial_form_values}
                validationSchema={form_validation_schema}
                onSubmit={this.props.handleUpdateProfile}>
                {({ values, touched, errors, setFieldValue }) =>
                    <Form>
                        <Grid container alignItems="center" justifyContent="center" style={{paddingBottom: "20px"}}>
                            <Grid item xs={12} sm={12} md={6} lg={6} style={{ padding: "0 2vw" }} container direction="column">
                                <Field
                                    as={TextField}
                                    name="firstname"
                                    error={touched.firstname && Boolean(errors.firstname)}
                                    color="secondary"
                                    required
                                    label="Your Firstname"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {
                                            fontFamily: 'Ubuntu'
                                        }
                                    }}
                                    style={{ margin: "0.5vh 0" }}
                                    helperText={<ErrorMessage name="firstname" />} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} style={{ padding: "0 2vw" }} container direction="column" justifyContent="flex-start">
                                <Field
                                    as={TextField}
                                    name="lastname"
                                    error={touched.lastname && Boolean(errors.lastname)}
                                    color="secondary"
                                    required
                                    label="Your Lastname"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {
                                            fontFamily: 'Ubuntu'
                                        }
                                    }}
                                    style={{ margin: "0.5vh 0" }}
                                    helperText={<ErrorMessage name="lastname" />} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} style={{ padding: "0 2vw" }} container direction="column" justifyContent="flex-start">
                                <Field
                                    as={TextField}
                                    name="email"
                                    error={touched.email && Boolean(errors.email)}
                                    color="secondary"
                                    required
                                    label="Your E-Mail Address"
                                    variant="outlined"
                                    InputLabelProps={{
                                        style: {
                                            fontFamily: 'Ubuntu'
                                        }
                                    }}
                                    style={{ margin: "0.5vh 0" }}
                                    helperText={<ErrorMessage name="email" />} />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} style={{ padding: "0 2vw" }} container direction="column" justifyContent="flex-start">
                                <Field
                                    as={Autocomplete}
                                    name="status"
                                    options={["Undergraduate Student", "Master's Student", "Doctoral Student"]}
                                    getOptionLabel={(option) => option}
                                    autoComplete
                                    includeInputInList
                                    onChange={(e, value) => setFieldValue("status", value !== null ? value : initial_form_values.status)}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            name="status"
                                            error={touched.status && Boolean(errors.status)}
                                            label="Academic Status"
                                            variant="outlined"
                                            color="secondary"
                                            required
                                            style={{ margin: "0.5vh 0" }}
                                            InputLabelProps={{
                                                style: {
                                                    fontFamily: 'Ubuntu'
                                                }
                                            }}
                                            helperText={<ErrorMessage name="status" />} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} style={{ padding: "0 2vw" }} container direction="column" justifyContent="flex-start">
                                <Field
                                    as={Autocomplete}
                                    name="university"
                                    filterOptions={filterOptions}
                                    options={this.state.universities}
                                    isOptionEqualToValue={(option, value) => option.uniName === value.uniName}
                                    getOptionLabel={(option) => option.uniName ? option.uniName : ""}
                                    autoComplete
                                    onChange={(e, value) => setFieldValue("university", value)}
                                    renderInput={(params) => (
                                        <TextField {...params}
                                            name="university"
                                            error={touched.university && Boolean(errors.university)}
                                            label="University"
                                            variant="outlined"
                                            color="secondary"
                                            required
                                            style={{ margin: "0.5vh 0" }}
                                            InputLabelProps={{
                                                style: {
                                                    fontFamily: 'Ubuntu'
                                                }
                                            }}
                                            helperText={<ErrorMessage name="university" />}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {this.state.universities.length === 0 ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <UpdateButton
                                    disabled={Boolean(errors.email) || Boolean(errors.university) || Boolean(errors.status) || Boolean(errors.firstname) || Boolean(errors.lastname) } 
                                    size="large"
                                    type="submit"
                                    startIcon={<DoneIcon />}
                                    style={{ padding: "1vh 6vw", fontFamily: "Ubuntu", marginTop: "0.5rem" }}>
                                        Save Changes
                                </UpdateButton>
                            </Grid>
                        </Grid>
                    </Form>
                }
            </Formik>
        );
    }
}
