import React, { Component } from 'react';
import $ from 'jquery';


import './../../../node_modules/imageviewer/dist/viewer';
import './../../../node_modules/imageviewer/dist/viewer.css';
import './imageViewer.component.css';

export default class ImageViewer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: props.images
            // toolbar:props.toolbar

        }
    }


    componentDidMount = () => {
        let $image = $('#images');

        $image.viewer({
            inline: true,

            // customToolbar: (toolbars) => {
            //     const customToolbar = [{
            //         key: 'test',
            //         render: <span className="custom-action" onClick={() => { this.acceptL() }}>Accept License</span>,
            //         onClick: (activeImage) => {
            //             console.log(activeImage);
            //         },
            //     }]

            //     const tools = customToolbar.concat(toolbars);
            //     return tools.concat([
            //         {
            //             key: 'test1',
            //             render: <span onClick={(e) => this.rejectL()} className="custom-action">Reject License</span>,

            //             onClick: (activeImage) => {
            //                 console.log(activeImage);
            //             },
            //         },
            //         {
            //             key: 'test2',
            //             render: <span onClick={(e) => this.deleteL()} className="custom-action">Delete License</span>,

            //             onClick: (activeImage) => {
            //                 console.log(activeImage);
            //             },
            //         }
            //     ]);
            // },

            // toolbar: [{
            //     key: 'test',
            //     render: <span className="custom-action" onClick={() => { this.acceptL() }}>Accept License</span>,
            //     onClick: (activeImage) => {
            //         console.log(activeImage);
            //     },
            // }, {
            //     key: 'test1',
            //     render: <span onClick={(e) => this.rejectL()} className="custom-action">Reject License</span>,

            //     onClick: (activeImage) => {
            //         console.log(activeImage);
            //     },
            // }],


            viewed: function () {
                // $image.viewer('zoomTo', 0.4);
            }
        });

        // Get the Viewer.js instance after initialized
        var viewer = $image.data('viewer');
        // console.log(viewer);

        // View a list of images
        // $('#images').viewer();
    }


    render() {
        const { images } = this.state;
        return (
            <div className="image-viewer">
                <ul id="images">
                    {
                        images.map((image, key) => (
                            <li className="image-content" key={key}><img src={image.license} alt="Picture 1" /></li>
                        ))
                    }
                </ul>

            </div>
            
        )
    }
}