import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Form, Card, Button } from "react-bootstrap";
import validator from "validator";

//import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


// creating functional component ans getting props from app.js and destucturing them
const Step3 = ({ nextStep, handleFormData, prevStep, values }) => {
    const center = {
        lat: 37.97980251076412,
        lng: 23.736648559570316,
    }

    //creating error state for validation
    const [error, setError] = useState(false);
    const [mPosition, setMPosition] = useState(center)



    function DraggableMarker() {
        const [draggable, setDraggable] = useState(false)
        const [position, setPosition] = useState(center)
        const markerRef = useRef(null)

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        setPosition(marker.getLatLng())
                        setMPosition({ position })
                    }
                },
            }),
            [],
        )
        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)
        }, [])

        //console.log({ position });
        
        //console.log({ mPosition });
        return (
            <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? 'Αλλαγή τοποθεσίας!'
                            : 'Πατήστε για αλλαγή τοποθεσίας!'}
                    </span>
                </Popup>
            </Marker>
        )
    }

    


    // after form submit validating the form data using validator
    const submitFormData = (e) => {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to next step
        if (!validator.isCurrency(values.buy_price) || !validator.isCurrency(values.first_bid)) {
            setError(true);
        } else {
            nextStep();
        }
    };


    return (
        <>

            <Form onSubmit={submitFormData}>
                <Form.Label>Επιλογή Τοποθεσίας</Form.Label>
                <MapContainer
                    className="markercluster-map"
                    center={center}
                    zoom={15}
                    maxZoom={18}
                    style={{ width: "100%", height: "80vh" }}
                    
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker />
                </MapContainer>




                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Button variant="primary" onClick={prevStep}>
                        Προηγούμενο
                    </Button>

                    <Button variant="primary" type="submit" onClick={handleFormData("location", { mPosition })}>
                        Επόμενο
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Step3;
