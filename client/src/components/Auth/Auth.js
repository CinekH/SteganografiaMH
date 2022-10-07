import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Collapse } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { IoIosLock, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux'
import { signIn, signUp } from '../../actions/auth';
import { clearMessage } from '../../actions/message';
import { activationRepeat } from '../../actions/auth';

import './styles.css';

const SignupSchema = Yup.object().shape({
    isSignUp: Yup.boolean(),

    firstName: Yup.string().when('isSignUp', {
        is: true,
        then: Yup.string().required('Pole wymagane').max(35, 'Maksymalnie 35 znaków'),
        otherwise: Yup.string()
    }),
 
    email: Yup.string().email('Niepoprawny adres email').required('Pole wymagane'),

    password: Yup.string()
    .matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])?.{8,64})/, 
    'Hasło musi składać się z minimum 8 znaków, małej i wielkiej litery oraz cyfry')
    .max(64, 'Hasło może składać się z maksymalnie 64 znaków')
    .required('Pole wymagane'),

    confirmPassword: Yup.string().when('isSignUp', {
        is: true,
        then: Yup.string().oneOf([Yup.ref('password'), null], 'Hasła nie są identyczne').required('Hasła nie są identyczne'),
        otherwise: Yup.string()
    })
});


const Auth = () => {
    const [isSignUp, setisSignUp] = useState(false);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [alertShow, setAlertShow] = useState(false);
    const message = useSelector(state => state.message);
    const dispatch = useDispatch();
    const history = useHistory();

    const formData = useRef();

    useEffect(() => {
        if(message.text !== undefined && message.text !== null) {
            setAlertShow(true);
        } else {
            setAlertShow(false);
        } 
    }, [message]);

    const handleSubmit = (values) => {
        if(isSignUp) {
            dispatch(signUp(values, history));
        } else {
            dispatch(signIn(values, history));
        }
    }

    useEffect(() => {
        if(isSignUp) {
            document.title = 'Rejestracja';
        } else {
            document.title = 'Logowanie';
        }

    }, [isSignUp])


    if((JSON.parse(localStorage.getItem('profile')))) {
        history.push('/');
    }

    const switchMode = () => {
        setisSignUp(!isSignUp);
        setisShowPassword(false);
    }

    const showPassword = () => {
        setisShowPassword(!isShowPassword);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type:"AUTH", data: { result, token } });

            history.push('/')
        } catch (error) {
            console.log(error);
        }
    };

    const googleFailure = (error) => {
        console.log('Logowanie Google nieudane, spróbuj ponownie później');
        console.log(error);
    };
    
    const sendActivationLink = () => {
        dispatch(activationRepeat(formData.current.values.email, history));
    }

    return (
        <Container className="auth-container">           
            <Row className="justify-content-center">
                <Collapse in={alertShow}>
                    <Col lg="12">
                        <Row className="justify-content-center">
                            <Col lg="6" className="align-self-center">
                                <Alert variant="danger" onClose={() => {setAlertShow(false); dispatch(clearMessage());}} dismissible>
                                    <Alert.Heading>Błąd!</Alert.Heading>
                                    <p>{message.text}{message.type === 'ACTIVATE_ERROR' && (
                                        <span onClick={sendActivationLink} role="button" className="btn-link">wysłać go ponownie</span>
                                    )}</p>
                                </Alert>
                            </Col>
                        </Row>
                    </Col>
                </Collapse>
                <Col xs lg="6" className="login-content">
                    <Row className="justify-content-center">
                        <IoIosLock className="bg-dark rounded-circle p-2" size="5em" color="#cccccc" />
                    </Row>
                    <Row className="justify-content-center">
                        <h1>{isSignUp ? 'Zarejestruj się' : 'Zaloguj się'}</h1>
                    </Row>
                    <Row className="justify-content-center pr-5 pl-5">
                        <Formik enableReinitialize={true} initialValues={{
                            isSignUp: isSignUp,
                            firstName: '',
                            password: '',
                            email: '',
                            confirmPassword: '',
                        }}
                        innerRef={formData}
                        validationSchema={SignupSchema} onSubmit={values => {handleSubmit(values);}}>

                        {({ errors, touched }) => (
                            <Form className="w-100">

                            {isSignUp && (  
                                <>  
                                    <label className={`pl-1 mt-3 ${touched.firstName && errors.firstName ? 'text-danger' : 
                                    (touched.firstName && !errors.firstName ? 'text-success' : '')}`} htmlFor="firstName">Imię</label>
                                    <Field className={`form-control ${touched.firstName && errors.firstName ? 'is-invalid' : 
                                    (touched.firstName && !errors.firstName ? 'is-valid' : '')}`} name="firstName" />
                                    {touched.firstName && <small id="toHelp" className="form-text text-danger">{errors.firstName}</small>}
                                </>
                            )}

                            <label className={`pl-1 mt-3 ${touched.email && errors.email ? 'text-danger' : 
                            (touched.email && !errors.email ? 'text-success' : '')}`} htmlFor="email">Adres email</label>
                            <Field className={`form-control ${touched.email && errors.email ? 'is-invalid' : 
                            (touched.email && !errors.email ? 'is-valid' : '')}`} name="email" />
                            {touched.email && <small id="emailHelp" className="form-text text-danger">{errors.email}</small>}
                            
                            <label className={`pl-1 mt-3 ${touched.password && errors.password ? 'text-danger' : 
                            (touched.password && !errors.password ? 'text-success' : '')}`} htmlFor="password">Hasło</label>
                            <Field className={`form-control pr-5 ${touched.password && errors.password ? 'is-invalid' : 
                            (touched.password && !errors.password ? 'is-valid' : '')}`} type={isShowPassword ? '' : 'password'} name="password" />

                            {isShowPassword ? (
                                <IoIosEyeOff onClick={showPassword} size="1.5em" className="position-relative show-password" />
                            ) : (
                                <IoIosEye onClick={showPassword} size="1.5em" className="position-relative show-password" />
                            )}
                            
                            
                            {touched.password && <small id="passwordHelp" className="form-text text-danger">{errors.password}</small>}
                            
                            {isSignUp && (  
                                <>  
                                    <label className={`pl-1 mt-3 ${touched.confirmPassword && errors.confirmPassword ? 'text-danger' : 
                                    (touched.confirmPassword && !errors.confirmPassword ? 'text-success' : '')}`} htmlFor="confirmPassword">Powtórz hasło</label>
                                    <Field className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : 
                                    (touched.confirmPassword && !errors.confirmPassword ? 'is-valid' : '')}`} type={isShowPassword ? '' : 'password'} name="confirmPassword" />
                                    {touched.confirmPassword && <small id="confirmPasswordHelp" className="form-text text-muted text-danger">{errors.confirmPassword}</small>}
                                </>
                            )}
                                <Button className="mt-3 w-100" type="submit">{isSignUp ? 'Zarejestruj' : 'Zaloguj'}</Button>
                            </Form>
                        )}
                        </Formik>
                        <Row className="mt-4 w-100 align-items-center">
                            <Col lg="5">
                                <div className="or-line"></div>
                            </Col>
                            <Col className="or-text text-center" lg="2">lub</Col>
                            <Col lg="5">
                                <div className="or-line"></div>
                            </Col>
                        </Row>
                        <GoogleLogin
                            clientId="837634172449-no1bel8s06l2f8lut0grvtn89faj1aru.apps.googleusercontent.com"
                            render={(renderProps) => (
                                <Button className="btn-link w-100 mt-3" variant="white" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    <FcGoogle size="2em" /> Zaloguj się za pomocą konta Google
                                </Button>
                            )}
                            onSuccess={googleSuccess}
                            onFailure={googleFailure}
                            cookiePolicy="single_host_origin"
                        />
                        <Button className="mt-3" variant="outline-secondary" onClick={switchMode}>{isSignUp ? 'Masz już konto? Zaloguj się' : 'Nie masz konta? Zarejestruj się'}</Button>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Auth
