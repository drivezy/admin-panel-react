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
                {/* <CodeEditor /> */}
                <SelectBox options={[1, 2, 3]} />

                <SelectBox options={[{ name: 'Place', value: 'place' }]} label="name" />

                {/* Select Box Ends */}

                {/* <Select
                    name="form-field-name"
                    // value={1}
                    onChange={this.handleChange}
                    options={[{ value: 1, label: 1 }, { value: 2, label: 2 }]}
                    field="name"
                    autoFocus
                    clearable
                /> */}
            </div>
        );
    }
}
