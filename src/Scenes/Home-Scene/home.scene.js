import React, { Component } from 'react';

// import { Typeahead } from 'react-bootstrap-typeahead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
import MultipleUpload from './../../Components/Forms/Components/Multiple-Image-Upload/multipleImageUpload.component';
import './home.scene.css';


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
                <h1 onClick={() => MultipleUpload({ title: 'Home Upload' })}>
                    Upload
                </h1>
            </div>
        );
    }
}
