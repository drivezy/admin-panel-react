import React, { Component } from 'react';

import { Button } from 'reactstrap';
import { Post } from 'common-js-util';
import { Location } from 'drivezy-web-utils/build/Utils/location.utils';

import { RECORD_URL } from './../../../../Constants/global.constants';

export default class FormType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceId: props.sourceId
        }
    }

    openForm = async () => {
        const url = 'customForm';

        if (this.state.sourceId) {
            Location.navigate({ url: '/form/' + this.state.sourceId });
            this.props.onChange(null, true);
        } else {
            const { payload } = this.props;
            const name = payload.relationship.related_model ? payload.relationship.related_model.name : payload.relationship.name;

            const body = {
                identifier: '#' + payload.data.id,
                name
            };
            const result = await Post({ url, body, urlPrefix: RECORD_URL });
            if (result.success) {
                const { response } = result;
                this.props.onChange(result.response.id);
                this.setState({ sourceId: result.response.id });
            }
        }
    }

    render() {
        const { sourceId } = this.state;
        return (
            <div>
                <div className="col inline">
                    <Button className='primary' onClick={(e) => this.openForm(e)} color="primary">{sourceId ? 'Edit' : 'Add'} Form</Button>
                </div>

                <div className="col inline">
                    {
                        sourceId ?
                            <button className="btn btn-secondary" onClick={() => { this.setState({ sourceId: null }); this.props.onChange(null) }}>
                                Remove Form
                            </button>
                            :
                            null
                    }

                </div>
            </div>
        )
    }
}