import React, { Component } from 'react';

export default class ImageUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }

    render() {
        const { shiftAttendanceComment } = this.state;
        return (
            <div className="comment">
                {
                    shiftAttendanceComment && shiftAttendanceComment.length ?
                    (<table class="table table-hover flip-content table-striped table-bordered">
                        <thead class="flip-content roboto-medium font-12">
                            <tr>
                                <th>
                                    #
                                </th>
                                <th>
                                    Comments
                                </th>
                                <th>
                                    Type
                                </th>
                                <th>
                                    Created By
                                </th>
                                <th>
                                    Created At
                                </th>
                            </tr>
                        </thead>
                        <tbody class="roboto-regular font-12">
                            {
                                shiftAttendanceComment.map((comment) => (
                                    <tr ng-repeat="comment in shiftAttendanceComment.getShiftComment | toArray | orderBy : predicate : reverse">
                                        <td class="responsive-height">
                                            {$index+1}
                                        </td>
                                        <td class="responsive-height">
                                            {comment.comments}
                                        </td>
                                        <td class="responsive-height">
                                            {comment.comment_type.description}
                                        </td>
                                        <td class="responsive-height">
                                            {comment.created_user.display_name}
                                        </td>
                                        <td class="responsive-height">
                                            {comment.created_at}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>):
                    (<div style={{padding: "20px", textAlign: 'center', fontSize: '18px'}} >  No Data To Show. </div>)
                }
            </div>
        );
    }
}