import React, { Component } from 'react';
import $ from 'jquery';


import 'imageviewer/dist/viewer';
import 'imageviewer/dist/viewer.css';
import './imageViewer.component.css';

export default class ImageViewer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            images: props.images
            // toolbar:props.toolbar
        }
        console.log(props.images);
    }


    componentDidMount = () => {
        const { idVal = 'images' } = this.props;
        let $image = $(`#${idVal}`);

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
                $image.viewer('zoomTo', 0.2);
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
        let { idVal = 'images' } = this.props;
        console.log('idVal', idVal);
        return (
            <div className="image-viewer ">
                <ul id={idVal} style={{ display: 'none' }}>
                    {
                        images.map((image, key) => (
                            <li className="image-content" key={key}>
                                <img src={image.image} alt="Picture 1" />
                            </li>
                        ))
                    }
                </ul>

            </div >

        )
    }
}