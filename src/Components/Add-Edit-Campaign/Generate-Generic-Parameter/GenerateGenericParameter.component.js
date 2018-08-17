import React, { Component } from "react";
import "./GenerateGenericParameter.component.css";
import { withFormik } from "formik";
import { ModalManager } from "drivezy-web-utils/build/Utils";
import {
  ArrayToObject,
  Get,
  Post,
  IsUndefinedOrNull,
  Upload
} from "common-js-util";
import SelectBox from "./../../../Components/Forms/Components/Select-Box/selectBoxForGenericForm.component";

const boolArray = ['1','2'];

export default class GenerateGenericParameter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formContent: {},
      parameters: []
    };
  }

  componentDidMount() {
    this.getParameters();
  }

  getParameters = async () => {
    let url = "campaignValidation?query=active=1";
    const result = await Get({ url: url });
    if (result.success) {
      let parameters = result.response;
      for (var i in parameters) {
        if (parameters[i].operators) {
          parameters[i].operatorArray = parameters[i].operators.split(",");
        }
        parameters[i].operatorArr = ["in", "between", "gt", "lt", "equals"];
        if (parameters[i].possible_values) {
          parameters[i].valuesArray = parameters[i].possible_values.split(",");
          parameters[i].selectedAggregations = [];
        }
        parameters[i].disableFlag = true;
      }
      this.setState({ parameters });
    }
  };

  cancel = () => {
    ModalManager.closeModal();
  };

  submit = async () => {
    let object_name = {};
    let temp;
    this.state.parameters.map((parameter,key) => {
        if (parameter.disableFlag == false) {
            if (parameter.operator == "in") {
                temp = parameter.selectedAggregations ? parameter.selectedAggregations.join() : parameter.value;
            } else {
                temp = parameter.value;
            }
            object_name[parameter.id] = parameter.operator + '-' + temp;
        }
    })

    let url = "serialiseData";
    const result = await Post({ url: url, body: object_name })
    if (result.success) {
    this.props.setValidation(result.response);
    ModalManager.closeModal();
    }
  };

  render() {
    const { formContent, parameters, name } = this.state;
    return (
      <div className="generate-parameter">
        <SelectBox name='reusable' placeholder={'reusable'} onChange={(selected) => { name: selected; this.setState({name}) }} value={name} options={boolArray} />
        <div className="parameters">
          {parameters &&
            parameters.length && (
              <table className="table table-hover flip-content table-striped table-bordered">
                <thead className="flip-content roboto-medium font-12">
                  <tr>
                    <th className="responsive-height text-center">Enable</th>
                    <th>Name</th>
                    <th>Operators</th>
                    <th>Values</th>
                  </tr>
                </thead>
                <tbody className="roboto-regular font-12">
                  {parameters.map((parameter, key) => {
                      return(
                    <tr>
                      <td className="responsive-height text-center">
                        <input
                          type="checkbox"
                          onChange={() => {
                            parameter.disableFlag = !parameter.disableFlag;
                            this.setState({ parameter });
                          }}
                          checked={!parameter.disableFlag}
                        />
                      </td>
                      <td>{parameter.name}</td>
                      <td disabled={parameter.disableFlag}>{parameter.disableFlag}
                        {parameter.operatorArray ? (
                            <SelectBox isDisabled={parameter.disableFlag} name={parameter.name} placeholder={'Operator'} onChange={(selected) => { parameter.operator = selected; this.setState({parameter}) }} value={parameter.operator} options={parameter.operatorArray} />
                        ) : (
                            <SelectBox isDisabled={parameter.disableFlag} name={parameter.name} placeholder={'Operator'} onChange={(selected) => { parameter.operator = selected; this.setState({parameter}) }} value={parameter.operator} options={parameter.operatorArr} />
                        )}
                      </td>
                      <td>
                        {parameter.valuesArray && parameter.operator == 'equals'  ? (
                            <SelectBox isDisabled={parameter.disableFlag} name={parameter.name} placeholder={'Operator'} onChange={(selected) => { parameter.value = selected; this.setState({parameter}) }} value={parameter.value} options={parameter.valuesArray} />
                        ) : ( parameter.valuesArray && parameter.operator == 'in' ? (
                            <SelectBox isDisabled={parameter.disableFlag} name={parameter.name} placeholder={'Operator'} onChange={(selected) => { parameter.value = selected; this.setState({parameter}) }} value={parameter.value} options={parameter.valuesArray} />
                        ):(
                        <input
                          type="text"
                          className="form-control"
                          value={parameter.value}
                          placeholder={"Value"}
                          disabled={parameter.disableFlag}
                          onChange={e => {
                            parameter.value = e.target.value;
                            this.setState({ parameter });
                          }}
                        />))
                        }
                      </td>
                    </tr>)
                  })}
                </tbody>
              </table>
            )}
        </div>

        <div className="modal-footer">
          <div className="col-md-6 text-left">
            <small>Create Parameter for generic campaign.</small>
          </div>
          <div className="col-md-6" style={{ textAlign: "right" }}>
            <button
              onClick={() => this.cancel()}
              className="btn btn-info"
              style={{ margin: "8px" }}
            >
              Cancel
            </button>
            <button
              onClick={() => this.submit()}
              className="btn btn-success"
              style={{ margin: "8px" }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
