import React, { Component } from 'react';
import { ModalManager, ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { Get, Post, Put } from 'common-js-util';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ConfirmUtils } from 'drivezy-web-utils/build/Utils/confirm.utils';
import SelectBox from './../../../../Forms/Components/Select-Box/selectBoxForGenericForm.component';
import './resetPricing.component.css'
import {
    Table
} from 'reactstrap';

export default class ResetPricing extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            selectCar: 0,
            carList: {},
            carId: -1
        };
    }
    componentDidMount() {
        this.chooseCar();
    }

    setValue(value) {
        this.setState({ selectCar: !value })
    }

    chooseCar = async () => {
        const { data } = this.state
        let cars = [];
        const result = await Get({
            // url: `lookupType/8?includes=values`
            url: 'car?query=city_id=' + data.city_id + ' and ' + 'active=1&limit=135'

        });
        if (result.success) {
            // result.response.map((value, key) => {

            //     cars.push(value.name)
            // }
            // )
            this.setState({ carList: result.response });
            console.log(this.state.carList)
        }

    }

    transfer = async () => {
        const { data } = this.state
        const { carId } = this.state

        const result = await Post({
            // url: `lookupType/8?includes=values`
            url: 'changePricing/' + data.id,
            body: { billing_car: carId == -1 ? {} : carId }

        });
        if (result.success) {
            ToastNotifications.success({ title: 'Amount Released' });
            ModalManager.closeModal();
        }
    }


    render() {
        const { data, selectCar, carList } = this.state;
        let cars = []

        Object.keys(carList).map((value) => {
            cars.push(carList[value].name)
        })

        return (
            <div className="reset">
                <div className="modal-reset-pricing">
                    <span className="billing-option"> Want to change billing car: <input type="checkbox" name="selectCar" placeholder="Select Car" value={selectCar} onChange={() => { this.setValue(selectCar); }} /></span>
                    {
                        this.state.selectCar ?
                            <div>
                                <SelectBox isClearable={false} onChange={(e) => {
                                    Object.keys(carList).map((value) => {
                                        if (carList[value].name == e)
                                            this.setState({ carId: carList[value].id })
                                    }
                                    )
                                }}
                                    className="data-field" placeholder='Select Vehicle' options={cars} ></SelectBox>
                            </div>
                            : null
                    }
                </div>
                <div className="col-sm-12 btns">
                    <button className="btn btn-default" onClick={(e) => { e.preventDefault(); ModalManager.closeModal(); }
                    }> Cancel </button>
                    &nbsp;
                            <button type="submit" className="btn btn-success" onClick={(e) => { e.preventDefault(); this.transfer(); }
                    }> Submit </button>
                </div>
            </div>
        )
    }
}



