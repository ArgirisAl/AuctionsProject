import React from 'react'
import { Pagination } from "react-bootstrap";
import { MDBDataTable } from 'mdbreact';

function JsonDataDisplay(JsonData) {
    //custom table
    //const DisplayData = JsonData.JsonData.map(
    //    (info) => {
    //        return (
    //            <tr>
    //                <td>{info.BID_AMOUNT}</td>
    //                <td>{info.BIDDER_COUNTRY}</td>
    //                <td>{info.BID_TIME}</td>
    //            </tr>
    //        )
    //    }
    //)


    const data = {
        columns: [
            {
                label: 'Προσφορά',
                field: 'amount',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Όνομα',
                field: 'fullname',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Όνομα Χρήστη',
                field: 'username',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Χώρα',
                field: 'bidder_country',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Ημερομηνία',
                field: 'time',
                sort: 'asc',
                width: 270
            }
        ],
        rows: [
        ]
    };

    JsonData.JsonData.map(
        (info) => {
            data.rows.push({ amount: info.BID_AMOUNT +"€", fullname: info.BIDDER_FIRSTNAME + " " + info.BIDDER_LASTNAME, username: info.BIDDER_USERNAME, time: info.BID_TIME, bidder_country: info.BIDDER_COUNTRY_NAME });
        }
    )
    //console.log(data);

    //console.log(DisplayData);
    //console.log(JsonData);
    return (
        <div>
            {/* Custom table
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Προσφορά</th>
                        <th>Χώρα</th>
                        <th>Ημερομηνία</th>
                    </tr>
                </thead>
                <tbody>


                    {DisplayData}

                </tbody>
            </table>
            */ }
            <MDBDataTable
                striped
                bordered
                small
                data={data}
            />
        </div>
    )
}

export default JsonDataDisplay;