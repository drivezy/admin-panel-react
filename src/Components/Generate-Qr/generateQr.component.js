import React, { Component } from "react";
import { QRCode } from 'react-qr-svg';
import { Get, Post } from "common-js-util";
import { ModalManager } from 'drivezy-web-utils/build/Utils';

import "./generateQr.component.css";

export default class GenerateQr extends Component {
  constructor(props) {
    super(props);

    this.state = {
        total: [1,2,3,4,5,6,7,8,9,10]
    };
  }

  UNSAFE_componentWillReceiveProps(nextProp) {
    let vehicleDetailId = (nextProp.data.vehicle_detail_id).toString();
    let vehicleRegistrationNumber = nextProp.data.registration_number;

    this.setState({ vehicleDetailId, vehicleRegistrationNumber });
  }

  print = () => {
    let domClone = document.getElementById("generate-qr");
    let printSection = document.getElementById("printSection");

    if (!printSection) {
        printSection = document.createElement("div");
        printSection.id = "printSection";
        document.body.appendChild(printSection);
    }
    setTimeout(() => {
        printSection.innerHTML = "";
        printSection.appendChild(domClone);
        window.print();
    }, 100);
  }

  close =() =>{
    ModalManager.closeModal();
  }

  render() {
    const { vehicleDetailId, vehicleRegistrationNumber, total } = this.state;
    return (
        <div className="generate-qr" id="generate-qr">
            {
                vehicleDetailId ?
                (<div className="qr-block">
                    {
                        total.map((item)=> (
                            <div key={item} className="individual-qr">
                                <QRCode bgColor="#FFFFFF" fgColor="#000000" level="Q" style={{ width: 150 }} value={vehicleDetailId} />
                                <div className="vehicle">{vehicleRegistrationNumber}</div>
                            </div>
                        ))
                    }
                </div>):
                ( <div style={{textAlign: 'center', padding: '20px'}}></div>)
            }
            <div className="footer">
                <button className="btn btn-warning" onClick={()=> this.close()}>Close</button>
                <button className="btn btn-primary" onClick={() => this.print()}>Print</button>
            </div>
        </div>
    );
  }
}
