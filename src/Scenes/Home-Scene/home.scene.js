import React, { Component } from 'react';

// import { Typeahead } from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';

import Typeahead from './../../Components/Forms/Components/Typeahead/typeahead.component';

import CodeEditor from './../../Components/Code-Editor/codeEditor.component';
import './home.scene.css';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';
import { toast } from 'react-toastify';
import TimePicker from 'rc-time-picker';
import Select from 'react-select';
import ToastUtils from './../../Utils/toast.utils.js';
import FormUtil from './../../Utils/form.utils';
import Timeago from './../../Components/Time-Ago/timeAgo.Component.js';

// import ToastUtils frpom './toast.utils';


export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            
        }
    }
    render() {
        return (
            <div className="home-scene">
                {/* <CodeEditor /> */}
                <SelectBox options={[1, 2, 3]} />
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
        const time = '20180105';
        const actions = [
            {
              content: 'Nice one!',
              onClick: () => {alert("hello")},
            },
            { content: 'Not right now thanks', onClick: ()=>{ alert("do u dumbit")} },
          ];
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
                < Timeago time={time} />

                <button onClick={() => ToastUtils.success({description:'safbsffs',title:'sdVDJBDAKFN',actions:actions})} > Hello Message</button>
                
               
                
                

            </div>
        );
    }
}
