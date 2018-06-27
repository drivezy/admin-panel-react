import React, { Component } from 'react';

// import { Typeahead } from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';

import Typeahead from './../../Components/Forms/Components/Typeahead/typeahead.component';

import CodeEditor from './../../Components/Code-Editor/codeEditor.component';
import './home.scene.css';

import SelectBox from './../../Components/Forms/Components/Select-Box/selectBox';
import TimePicker from 'rc-time-picker';
import Select from 'react-select';
import ToastUtils from './../../Utils/toast.utils.js';
import FormUtil from './../../Utils/form.utils';
import Timeago from './../../Components/Time-Ago/timeAgo.Component.js';

//import ToastUtils from './toast.utils';


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
        const time = '20180105';
       
        return (
            <div className="home-scene">
               <button onClick={()=> ToastUtils.success({description:'ssdhdh',title:'aSHADGJJG'})}>onclick</button>
            </div>
        );
    }
}
