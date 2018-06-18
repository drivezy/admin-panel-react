import React, { Component } from 'react';
import $ from 'jquery';


import './../../../node_modules/imageviewer/dist/viewer';
import './../../../node_modules/imageviewer/dist/viewer.css';
import './imageViewer.component.css';

export default class ImageViewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userLicenseImageArr: props.userLicenseImageArr,

        }
    }


    componentDidMount = () => {
        let $image = $('#images');

        $image.viewer({
            inline: true,
            viewed: function () {
                $image.viewer('zoomTo', 0.4);
            }
        });

        // Get the Viewer.js instance after initialized
        var viewer = $image.data('viewer');
        // console.log(viewer);

        // View a list of images
        // $('#images').viewer();
    }


    render() {
        const { userLicenseImageArr } = this.state;
        return (
            <div className="image-viewer">
                <ul id="images">
                    {
                        userLicenseImageArr.map((image, key) => (
                            <li className="image-content" key={key}><img src={image.license} alt="Picture 1" /></li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}