import React, { Component } from 'react';

import CodeEditor from './../../Components/Code-Editor/codeEditor.component';
import './home.scene.css';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';

import TimePicker from 'rc-time-picker';
import Select from 'react-select';


export default class Home extends Component {
    render() {
        return (
            <div className="home-scene">
                {/* <CodeEditor /> */}
                <SelectBox value={1} options={[1, 2, 3]} />
                <Select
                    name="form-field-name"
                    value={1}
                    onChange={this.handleChange}
                    options={[{ value: 1, label: 1 }, { value: 2, label: 2 }]}
                    autoFocus
                    clearable
                />
                <TimePicker />
            </div>
        )
    }
}
