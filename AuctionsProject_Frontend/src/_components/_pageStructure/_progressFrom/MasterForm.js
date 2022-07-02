import { useState } from "react";
import { Form, Button, Card, CardHeader, CardBody, CardTitle, CardText, CardFooter } from "reactstrap";
import { Container, Row, Col } from "react-bootstrap";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Final from "./Final";


//import styled from "styled-components";
import MultiStepProgressBar from "./MultiStepProgressBar";

//https://codesandbox.io/s/j7y1879179?file=/components/Step1.js:305-309

//https://codesandbox.io/s/create-multi-step-form-in-react-with-validation-y5b2j?from-embed=&file=/src/App.js

function MasterForm() {

    //state for steps
    const [step, setstep] = useState(1);

    //state for form data
    const [formData, setFormData] = useState({
        categories: [],
        buy_price: "",
        first_bid: "",
        lat: "",
        lng: "",
        started: "",
        ends: "",
        description: "",
        name:""
    })


    // function for going to next step by increasing step state by 1
    const nextStep = () => {
        setstep(step + 1);
    };

    // function for going to previous step by decreasing step state by 1
    const prevStep = () => {
        setstep(step - 1);
    };


    // handling form input data by taking onchange value and updating our previous form data state
    const handleInputData = (input,location) => e => {

        //console.log(input, e);


        // input value from the form
        const { value } = e.target;
        //console.log(input, e);
        if (input == "categories") {
            setFormData(prevState => ({
                ...prevState,
                [input]: [].slice.call(e.target.selectedOptions).map(item => item.value)
            }));
        }
        else if (input == "location") {

            setFormData(prevState => ({
                ...prevState,
                lat: location.mPosition.lat,
                lng: location.mPosition.lng
            }));
        }
        else {
            //updating for data state taking previous state and then adding new value to create new object
            setFormData(prevState => ({
                ...prevState,
                [input]: value
            }));
        }

    }



    // javascript switch case to show different form in each step
    switch (step) {
        // case 1 to show stepOne form and passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
        case 1:
            return (
                <div>
                    
                        <Card>
                            <CardHeader>Δημιουργία Δημοπρασίας</CardHeader>
                            <CardBody>
                                <CardTitle>
                                    <MultiStepProgressBar currentStep={step} />
                                </CardTitle>
                                <CardText />
                            </CardBody>
                        </Card>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} className="custom-margin">
                                <Step1 nextStep={nextStep} handleFormData={handleInputData} values={formData} />
                            </Col>
                        </Row>
                    
                </div>
            );
        // case 2 to show stepTwo form passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
        case 2:
            return (
                <div>
                    
                        <Card>
                            <CardHeader>Δημιουργία Δημοπρασίας</CardHeader>
                            <CardBody>
                                <CardTitle>
                                    <MultiStepProgressBar currentStep={step} />
                                </CardTitle>
                                <CardText />
                            </CardBody>
                        </Card>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} className="custom-margin">
                                <Step2 nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                            </Col>
                        </Row>
                    
                </div>
            );
        case 3:
            return (
                <div>
                    
                        <Card>
                            <CardHeader>Δημιουργία Δημοπρασίας</CardHeader>
                            <CardBody>
                                <CardTitle>
                                    <MultiStepProgressBar currentStep={step} />
                                </CardTitle>
                                <CardText />
                            </CardBody>
                        </Card>
                        <Row>
                            <Step3 nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                        </Row>
                    
                </div>
            );
        case 4:
            return (
                <div>
                    
                        <Card>
                            <CardHeader>Δημιουργία Δημοπρασίας</CardHeader>
                            <CardBody>
                                <CardTitle>
                                    <MultiStepProgressBar currentStep={step} />
                                </CardTitle>
                                <CardText />
                            </CardBody>
                        </Card>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} className="custom-margin">
                                <Step4 nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                            </Col>
                        </Row>
                    
                </div>
            );
        // Only formData is passed as prop to show the final value at form submit
        case 5:
            return (
                <div>
                    
                        <Card>
                            <CardHeader>Δημιουργία Δημοπρασίας</CardHeader>
                            <CardBody>
                                <CardTitle>
                                    <MultiStepProgressBar currentStep={step} />
                                </CardTitle>
                                <CardText />
                            </CardBody>
                        </Card>
                        <Row>
                            <Col md={{ span: 6, offset: 3 }} className="custom-margin">
                                <Final prevStep={prevStep} values={formData} />
                            </Col>
                        </Row>
                    
                </div>
            );
        // default case to show nothing
        default:
            return (
                <div>

                </div>
            );
    }




}

export default MasterForm;