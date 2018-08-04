import React, { Component } from 'react';
import UserCard from './../../../../User-Card/userCard.component';
import { ModalManager } from 'drivezy-web-utils/build/Utils';
import './startRide.component.css';

export default class StartRide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            startOdo: 0,
            startFuel: 0,
            alternateNumber: 0,
            comment: "",
            pickupTime: 0


        };
    }

    onSubmit = (startOdo, startFuel, alternateNumber, comment, pickupTime) => {
        // this.state({ startOdo: startOdo1, startFuel: startFuel1, alternateNumber: alternateNumber1, comment: comment1, pickupTime: pickupTime1 })
        this.setState({ startOdo, startFuel, alternateNumber, comment, pickupTime })
        ModalManager.closeModal();

    }

    onCancel() {
        ModalManager.closeModal();
    }

    render() {
        const { startOdo, startFuel, alternateNumber, comment, pickupTime } = this.state;
        const { data } = this.state
        let count = { pillion: 0, complementary: 0 };

        return (
            <div className="modal-start-ride">
                <div className="start-ride">
                    <div className="left-pane">
                        {
                            <UserCard userData={data.user} />
                        }
                    </div>
                    <div className="right-pane">
                        <div className="data">
                            <div className="details">
                                <div className="text-field"> <i className="fa fa-clock-o" aria-hidden="true"></i>Start Time   </div>
                                <input onChange={(e) => (this.state.pickupTime = e.target.value)} type="datetime-local" className="data-field" placeholder='Start Time'></input>
                            </div>

                            <div className="details">
                                <div className="text-field">  <i className="fa fa-hourglass-start" aria-hidden="true"></i>Start Odo Reading  </div>
                                <input onChange={(e) => (this.state.startOdo = e.target.value)} type="number" className="data-field" placeholder='Start Odo Reading'></input>
                            </div>

                            <div className="details">
                                <div className="text-field"> <i className="fa fa-tint" aria-hidden="true"></i>Fuel Percentage</div>
                                <input onChange={(e) => (this.state.startFuel = e.target.value)} type="number" className="data-field" placeholder='Fuel Percentage'></input>
                            </div>

                            <div className="details">
                                <div className="text-field"> <i className="fa fa-phone" aria-hidden="true"></i>Alternate Number</div>
                                <input onChange={(e) => (this.state.alternateNumber = e.target.value)} type="number" className="data-field" placeholder='Alternate Number' required></input>
                                {alternateNumber ? (alternateNumber.length > 10 ? <span>Enter a valid number </span> : null) : null}
                            </div>

                            <div className="details">
                                <div className="text-field">  <i className="fa fa-commenting-o" aria-hidden="true"></i>Comments</div>
                                <textarea onChange={(e) => (this.state.comment = e.target.value)} type="text" className="data-field" placeholder='Comments (If Any)'></textarea>
                            </div>

                        </div>

                        <div className="add-ons">
                            <div> Add Ons
                        <div className="add-ons-details" >
                                    <span className="text-field">Pillion Rider Helmet</span>
                                    <span className="buttons">
                                        <button className="minus">-</button>
                                        <input className="quantity" placeholder={count.pillion}></input>
                                        <button className="plus" onClick>+</button>
                                    </span>
                                </div>
                                <div className="add-ons-details" >
                                    <span className="text-field">Complementary Helmet</span>
                                    <span className="buttons">
                                        <button className="minus">-</button>
                                        <input className="quantity" placeholder={count.complementary}></input>
                                        <button className="plus">+</button>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="cancel-and-submit">
                    <button className="cancel" onClick={() => { this.onCancel() }}>Cancel</button>
                    <button className="submit" onClick={() => { this.onSubmit(startOdo, startFuel, alternateNumber, comment, pickupTime) }}>Submit</button>
                </div>
            </div>
        )
    }
}
