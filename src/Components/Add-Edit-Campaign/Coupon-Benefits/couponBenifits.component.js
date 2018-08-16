import React, { Component } from "react";
import './couponBenifits.component.css';
import { withFormik } from "formik";

// import { ArrayToObject, Get, Post, SelectFromOptions } from 'common-js-util';
import { ModalManager } from "drivezy-web-utils/build/Utils";



import { ArrayToObject, Get, Post, IsUndefinedOrNull, Upload } from "common-js-util";

import SelectBox from "./../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";


const boolArray = [{ value: '0', label: "No" }, { value: '1', label: "Yes" }];

export default class CouponBenefits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formContent: {},
      formData : [
                    {
                        label: 'percentage',
                    }, {
                        label: 'weekdayOff',
                    }, {
                        label: 'weekendOff',
                    }, {
                        label: 'discount',
                    }, {
                        label: 'duration',
                    }, {
                        label: 'minWeekday',
                    }
                ],
        currentIndex: 0,
        pricingData: []
        };
  }

  componentDidMount(){
    this.couponPricing();
  }
    couponPricing = async () => {
       const result = await Get('couponPricing');
       if(result.success){
            this.setState({pricingData: result.response})
       }
    }

    // couponBenefits = async () => {
    //     let postDict = {};
    //     if (!self.selectedId) {
    //         postDict[self.mode] = self.formData[currentIndex].input;
    //     }

    //     if (self.selectedId) {
    //         postDict = { pricing_id: self.selectedId, custom_param: self.pricingData[currentIndex].custom_input };
    //     }
    //     postDict.object = true;
    //     let url = "serialiseData";
       
    //     const result = await Post({url: url, body: postDict});
    //     if(result.success){
    //         ModalManager.closeModal();
    //     }
    // };


  cancel = () => {
    ModalManager.closeModal();
  }

  submit = () => {
    ModalManager.closeModal();
  }


  render() {
     const  {formContent, formData, pricingData, currentIndex} = this.state;
    return (
     <div className="coupon-benefits">
            <div className="default-calumn">
                <div className="header">
                    default
                </div>
                <div className="content">
                    { 
                        formData && formData.length &&
                         (<table className="table table-hover flip-content table-striped table-bordered">
                            <thead className="flip-content roboto-medium font-12">
                                <tr>
                                    <th>
                                        Check
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Input
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    formData.map((item, key) =>{
                                        return(<tr key={key}>
                                                <td>
                                                    <input type="radio"  value={item.label} onClick={() => this.setState({currentIndex: key}) } checked={key==currentIndex}/>
                                                </td>
                                                <td>
                                                    {item.label}
                                                </td>
                                                <td>
                                                    <input className="form-control" value={item.input} type="text" />
                                                </td>
                                            </tr>)
                                    })
                                }
                            </tbody>
                        </table>)
                    }
                </div>
            </div>
            <div className="default-calumn">
                <div className="header">
                    custom
                </div>
                <div className="content">
                    {
                        pricingData && pricingData.length &&
                        (<table className="table table-hover flip-content table-striped table-bordered">
                            <thead className="flip-content roboto-medium font-12">
                                <tr>
                                    <th>
                                        Check
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Description
                                    </th>
                                    <th>
                                        Input
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="roboto-regular font-12">
                                {
                                    formData.map((item, key) =>{
                                        return (<tr key={key}>
                                            <td>
                                                <input type="radio" value={item.id} />
                                            </td>
                                            <td>
                                                {item.name}
                                            </td>
                                            <td>
                                                {item.description}
                                            </td>
                                            <td>
                                                <input className="form-control" type="text" />
                                            </td>
                                        </tr>)
                                    })
                                }
                            </tbody>
                        </table>)
                    }
                </div>
            </div>
     
                
       <div className="modal-footer">
         <div className="col-md-6 text-left">
           <small>Create Parameter for generic campaign.</small>
         </div>
         <div className="col-md-6" style={{textAlign: 'right'}}>
         
           <button onClick={()=> this.cancel()} className="btn btn-info" style={{ margin: '8px' }}>
             Cancel
           </button>
           <button onClick={()=> this.submit()}  className="btn btn-success" style={{ margin: '8px' }}>
             Submit
           </button>
          </div>
        </div>
     </div>
    );
  }
}
