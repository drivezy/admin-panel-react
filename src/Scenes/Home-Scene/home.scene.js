import React, { Component } from 'react';

// import { Typeahead } from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';

import Typeahead from './../../Components/Forms/Components/Typeahead/typeahead.component';

import CodeEditor from './../../Components/Code-Editor/codeEditor.component';
import './home.scene.css';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';

import TimePicker from 'rc-time-picker';
import Select from 'react-select';

import FormUtil from './../../Utils/form.utils';

export default class Home extends Component {
    render() {
        return (
            <div className="home-scene">
                {/* <CodeEditor /> */}
                <SelectBox options={[1, 2, 3]}  />
                <Select
                    name="form-field-name"
                    value={1}
                    onChange={this.handleChange}
                    options={[{ value: 1, label: 1 }, { value: 2, label: 2 }]}
                    autoFocus
                    clearable
                />
            </div>
        )
    }

    radios = [
        { label: 'Justify (default)' },
        { label: 'Align left' },
        { label: 'Align right' },
    ];

    state = {
        align: 'shubham'
    };

    exp = (data) => {
        this.setState({ align: data });
        // console.log(data);
    }

    render() {
        const { align } = this.state;


        return (
            <div className="home-scene">
                <Typeahead
                    searchLabel={''}
                    field="label"
                    options={this.radios}
                    placeholder="Choose a state..."
                    onChange={this.exp}
                    onType={(data) => console.log(data)}
                />

            </div>
        );
    }
}
