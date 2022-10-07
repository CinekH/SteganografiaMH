import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { CgNotes } from "react-icons/cg";

const SignupSchema = Yup.object().shape({

    name: Yup.string()
    .max(35, 'Maksymalnie 35 znaków')
    .required('Pole wymagane'),
 
    fromAddress: Yup.string().email('Niepoprawny adres email').required('Pole wymagane'),
    toAddress: Yup.string().email('Niepoprawny adres email').required('Pole wymagane'),
    subject: Yup.string().max(150, 'Maksymalnie 150 znaków').required('Pole wymagane'),
    text: Yup.string().max(1000, 'Maksymalnie 1000 znaków').required('Pole wymagane'),
 
});

const SendMail = ({ display, handleSubmitMail, showMail, user }) => {

    const handleSubmit = (values) => {
        console.log(values);
        handleSubmitMail(values.name, values.fromAddress, values.toAddress, values.subject, values.text);
    }

    return (
        <div className={`${display} mail-overlay pl-3 pr-3 pl-sm-4 pr-sm-4 pr-md-5 pl-md-5`}>

            <div className={`${display} mail-container`} >
                <div className='mail-top'>
                    <Row>
                        <Col xs="2">
                            <div className="mail-send-exit"><div onClick={() => showMail(false)} className="mail-send-exit-image"></div></div>
                        </Col>
                        <Col>
                            <h2>Wyślij email</h2>
                        </Col>
                        <Col xs="2"></Col>
                    </Row>
                </div>
                <div className="mail-content-container">
                    <div className="mail-content ml-2 mr-2">
                        <div class="form-group">
                        <Formik initialValues={{
                            name: '',
                            fromAddress: '',
                            toAddress: '',
                            subject: '',
                            text: '',
                        }} validationSchema={SignupSchema} onSubmit={values => {handleSubmit(values);}}>

                            {({ errors, touched, setFieldValue }) => (
                                
                                <Form>
                        
                            <Row>
                                <Col lg='4'>
                                    <label for="name">Imię</label>
                                    <Field className={`send-mail-input form-control ${touched.name && errors.name ? 'is-invalid' : 
                                    (touched.name && !errors.name ? 'is-valid' : '')}`} name="name" />
                                    <div className="email-send-error-container">
                                        {touched.name && errors.name && 
                                        (<small id="nameHelp" class="form-text text-muted mail-send-error">{errors.name}</small>)}
                                    </div>
                                    </Col>

                                        <Col>
                                            <label for="fromAddress">Email nadawcy</label>
                                            <Field className={`send-mail-input form-control ${touched.fromAddress && errors.fromAddress ? 'is-invalid' : 
                                            (touched.fromAddress && !errors.fromAddress ? 'is-valid' : '')}`} name="fromAddress" />
                                            <div className="email-send-error-container">
                                                {touched.fromAddress && errors.fromAddress && 
                                                (<small id="fromHelp" class="form-text text-muted mail-send-error">{errors.fromAddress}</small>)} 
                                            </div>
                                        </Col>
                                        {user && (
                                            <Col className="fill-field-with-mail">
                                                <Button onClick={() => {
                                                    setFieldValue('fromAddress', user.email);
                                                    setFieldValue('name', user.name);
                                                }}>
                                                    <CgNotes className="fill-field-icon"/>
                                                </Button>
                                            </Col>
                                        )}
                                    </Row>
                            

                                    <label for="toAddress">Email odbiorcy</label>
                                    <Field className={`send-mail-input form-control ${touched.toAddress && errors.toAddress ? 'is-invalid' : 
                                    (touched.toAddress && !errors.toAddress ? 'is-valid' : '')}`} name="toAddress" />
                                    <div className="email-send-error-container">
                                        {touched.toAddress && errors.toAddress && 
                                        (<small id="toHelp" class="form-text text-muted mail-send-error">{errors.toAddress}</small>)}
                                    </div>

                                    <label for="subject">Temat</label>
                                    <Field className={`send-mail-input form-control ${touched.subject && errors.subject ? 'is-invalid' : 
                                    (touched.subject && !errors.subject ? 'is-valid' : '')}`} name="subject" />
                                    <div className="email-send-error-container">
                                        {touched.subject && errors.subject && 
                                        (<small id="subjectHelp" class="form-text text-muted mail-send-error">{errors.subject}</small>)}
                                    </div>

                                    <label for="text">Tekst wiadomości</label>
                                    <Field className={`send-mail-input form-control ${touched.text && errors.text ? 'is-invalid' : 
                                    (touched.text && !errors.text ? 'is-valid' : '')}`} as="textarea" name="text" />
                                    <div className="email-send-error-container">
                                        {touched.text && errors.text && 
                                        (<small id="textHelp" class="form-text text-muted mail-send-error">{errors.text}</small>)}
                                    </div>
                                    <Row className="justify-content-center">
                                        <Button variant="secondary" className="pl-5 pr-5 mb-3" type="submit">Wyślij</Button>
                                    </Row>
                                </Form>
                            )}
                            </Formik>
                        </div>                  
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SendMail;