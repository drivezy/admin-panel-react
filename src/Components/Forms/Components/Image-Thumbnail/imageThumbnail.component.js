

import React, { Component } from 'react';

import './imageThumbnail.component.css';

export default class ImageThumbnail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            thumb: undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.file) { return; }

        this.setState({ loading: true }, () => {
            let reader = new FileReader();

            reader.onloadend = () => {
                this.setState({ loading: false, thumb: reader.result });
            };

            reader.readAsDataURL(nextProps.file.image);
        });
    }

    render() {
        const { file } = this.props;
        const { loading, thumb } = this.state;

        if (!file) { return null; }

        if (loading) { return <p>loading...</p>; }

        return (
            <div className="thumbnail">
                <span className="delete-icon" onClick={() => this.props.removeImage(this.props.index)}>
                    <i className="fa fa-times"></i>
                </span>
                <img src={thumb}
                    alt={file.column}
                    className="img-thumbnail mt-2"
                    height={200}
                    width={200} />
                <span className="image-label">
                    {file.column}
                </span>
            </div>
        )
    }
}