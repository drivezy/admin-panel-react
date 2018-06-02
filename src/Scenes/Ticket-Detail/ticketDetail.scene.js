import React, { Component } from 'react';

import {
    Card
} from 'reactstrap';



import { Get } from './../../Utils/http.utils';

import './ticketDetail.scene.css';

export default class TicketDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ticketDetail: {}
        };
    }

    componentDidMount() {
        this.getTicketDetail();
    }

    getTicketDetail = async () => {
        const { ticketId } = this.props.match.params;
        const url = 'task/' + ticketId + '?includes=status,group,assigned_to,user,associations,tags.tag.type,subscribers,category'
        const result = await Get({ url });

        if (result.success) {
            const ticketDetail = result.response;
            console.log(ticketDetail);
            this.setState({ ticketDetail });
        }
    }

    render() {
        const { ticketDetail = {} } = this.state;

        return (
            <div className="ticket-detail">
                {
                    ticketDetail.id &&
                    <div className="ticket-content">
                        <div className="task-header">
                            <div className="task-content">
                                <h6>Ticket Detail {ticketDetail.ticket_number} => {ticketDetail.subject ? ticketDetail.subject : 'No Subject'}</h6>
                            </div>
                        </div>
                        <div className="ticket-wrapper">
                            <div className="conversations-wrapper">

                                {
                                    ticketDetail.comments.map((message, key) => {
                                        return (
                                            <div key={key}>
                                                <div className="conversation-block">
                                                    {
                                                        !message.system_generated &&
                                                        <div className="external">
                                                            <div key={1} className="conversation-header">
                                                                <div className="conversation-label">
                                                                    <div className="label-bg">
                                                                        <i className="fa fa-envelope-o" aria-hidden="true"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="conversation-detail">
                                                                    <h4>
                                                                        <strong>
                                                                            {message.ticket_number}
                                                                        </strong>
                                                                    </h4>
                                                                </div>
                                                                <div className="conversation-timing">
                                                                    <span className="time-ago">
                                                                        {message.time} .
                                                            </span>
                                                                    <span className="time-current">
                                                                        ( {message.time} )
                                                            </span>
                                                                </div>
                                                            </div>
                                                            <div key={2} className="conversation-content">
                                                                <div className="message">
                                                                    <p dangerouslySetInnerHTML={{ __html: message.messageStrippedHtml }}></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        message.system_generated &&
                                                        <div className="internal">
                                                            <div className="internal-message">
                                                                <p dangerouslySetInnerHTML={{ __html: message.messageStrippedHtml }}>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                <div className="conversation-reply">
                                    <Card>
                                        <form name="commentForm">
                                            <textarea ng-model="ticketPreviewController.postReply.comment" required className="form-control textArea" id="commentTextArea"
                                                rows="3">
                                            </textarea>
                                            <div className="actions-form">

                                                <button type="button" className="btn btn-info margin-right-6" uib-tooltip="Upload Files" ng-click="ticketPreviewController.uploadFiles()">
                                                    <i className="fa fa-upload"></i>
                                                </button>

                                                {/* <button popover-append-to-body="true" ng-click="ticketPreviewController.loadTemplates()" popover-placement="top" popover-is-open="ticketPreviewController.dynamicPopover.isOpen"
                                                    uib-popover-template="ticketPreviewController.dynamicPopover.templateUrl" popover-title="{{ticketPreviewController.dynamicPopover.title}}"
                                                    popover-trigger="outsideClick" type="button" className="btn btn-default btn-xs templates margin-right-6"
                                                    rel="popover-content">
                                                    <img className="icon-message" ng-src="/img/auto-message.png" alt="..." />
                                                </button> */}

                                                <button className="btn btn-success margin-right-6" ng-click="ticketPreviewController.submitReply(postReply.comment)"
                                                    type="submit">
                                                    Send
                                                </button>
                                            </div>
                                        </form>
                                    </Card>
                                </div>
                            </div>
                            <div className="ticket-section">
                                <div className="panel section-wrapper">
                                    {/* <div className="panel-body detail-section">
                                        {
                                            (!ticketDetail.category.id === 630 || !ticketDetail.category.id === 650 || !ticketDetail.category.id === 646 || !ticketDetail.category.id === 645) &&
                                            <div className="ticket-content">
                                                <table className="table borderless ticket-detail-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="smooth-text">
                                                                Name
                                                        </td>
                                                            <td className="text-right">
                                                                <span>
                                                                    <p>
                                                                        {ticketDetail.from_name}
                                                                    </p>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="smooth-text">
                                                                Email
                                                        </td>
                                                            <td className="text-right">
                                                                <span>
                                                                    <p>
                                                                        {ticketDetail.from_email}
                                                                    </p>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="smooth-text">
                                                                <div className="margin-top-5">Priority</div>
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="priority-content">
                                                                    <div className="button-priority">
                                                                        <div className="btn-group">
                                                                            <label className="btn btn-default btn-xs priority" ng-className="{true:'activeButton'}[ticketPreviewController.activeBtn == 1]" ng-click="ticketPreviewController.changePriority(1)">
                                                                                High
                                                                        </label>
                                                                            <label className="btn btn-default btn-xs priority" ng-className="{true:'activeButton'}[ticketPreviewController.activeBtn == 2]" ng-click="ticketPreviewController.changePriority(2)">
                                                                                Medium
                                                                        </label>
                                                                            <label className="btn btn-default btn-xs priority" ng-className="{true:'activeButton'}[ticketPreviewController.activeBtn == 3]" ng-click="ticketPreviewController.changePriority(3)">
                                                                                Low
                                                                        </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="smooth-text">
                                                                Assigned
                                                        </td>
                                                            <td className="text-right">
                                                                <span>
                                                                    <p>
                                                                        {ticketDetail.assigned_to.display_name}
                                                                    </p>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="smooth-text">
                                                                Status
                                                        </td>
                                                            <td>
                                                                <span>
                                                                    <p>
                                                                        {ticketDetail.status.name}
                                                                    </p>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="smooth-text">
                                                                Category
                                                        </td>
                                                            <td>
                                                                <span>
                                                                    <p>
                                                                        {ticketDetail.category.name}
                                                                    </p>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        }

                                        <div className="ticket-content" ng-if="ticketDetail.category.id == 630">

                                            <a className="ticket-label lead-label clickable">
                                                <p>
                                                    <i className="fa fa-line-chart" aria-hidden="true"></i> Lead : {ticketPreviewController.record.id}
                                                </p>
                                            </a>

                                            <a className="ticket-label deal-label clickable" href="#/partnerLeadDetail/{{ticketPreviewController.record.id}}">
                                                <p>
                                                    <i className="fa fa-check" aria-hidden="true"></i>{ticketPreviewController.record.deal.length} Deals
                                                </p>
                                            </a>


                                            <div className="deal-labels">
                                                <span className="smooth-text">
                                                    <a href="#/partnerLeads">Show All Leads</a>
                                                </span>
                                            </div>

                                            <table className="table borderless ticket-detail-table">
                                                <tbody>
                                                    <tr>
                                                        <td className="smooth-text">
                                                            Lead Name
                                                        </td>
                                                        <td className="text-right">
                                                            <span>
                                                                <p>
                                                                    {ticketPreviewController.record.first_name} {
                                                                        ticketPreviewController.record ? ticketPreviewController.record.last_name
                                                                            : ''
                                                                    }
                                                                </p>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="smooth-text">
                                                            Email
                                                        </td>
                                                        <td className="text-right">
                                                            <span>
                                                                <p>
                                                                    {ticketPreviewController.record.email}
                                                                </p>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="smooth-text">
                                                            Assignee
                                                        </td>
                                                        <td className="text-right">
                                                            <span>
                                                                <p>
                                                                    {ticketDetail.assigned_to.display_name}
                                                                </p>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div>
                                                <span className="smooth-text">
                                                </span>
                                                <lead-status refresh="ticketPreviewController.getTicketsFromLeadId()" className="width-100 center-flex" status="ticketPreviewController.record.status_id"
                                                    id="ticketPreviewController.record.id">
                                                </lead-status>
                                            </div>

                                            <div className="priority-content">
                                                <div className="row">
                                                    <div className="button-priority text-center">
                                                        <button className="btn btn-info" ng-click="ticketPreviewController.openCalendar()">
                                                            MEETING/CALL
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="ticket-content" ng-if="ticketDetail.category.id == 650 || ticketDetail.category.id == 646 || ticketDetail.category.id == 645">
                                            <div className="ticket-label">
                                                <p>
                                                    <i className="fa fa-ticket" aria-hidden="true"></i> {ticketDetail.ticket_number}
                                                </p>
                                            </div>

                                            <a ng-if="ticketPreviewController.record.deal_number" className="ticket-label lead-label clickable" href="/#/deals/{{ticketPreviewController.record.lead_id}}">
                                                <p>
                                                    <i className="fa fa-handshake-o" aria-hidden="true"></i> Deal : {ticketPreviewController.record.deal_number}
                                                </p>
                                            </a>
                                            <table className="table borderless ticket-detail-table">
                                                <tbody>
                                                    <tr ng-if="ticketDetail.to_email">
                                                        <td className="smooth-text">
                                                            Email
                                                        </td>
                                                        <td className="text-right">
                                                            <span>
                                                                <p>
                                                                    {ticketDetail.to_email}
                                                                </p>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr ng-if="ticketDetail.from_email">
                                                        <td className="smooth-text">
                                                            From Email
                                                        </td>
                                                        <td className="text-right">
                                                            <span>
                                                                <p>
                                                                    {ticketDetail.from_email}
                                                                </p>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="smooth-text">
                                                            Assignee
                                                        </td>
                                                        <td className="text-right">
                                                            <span>
                                                                <p>
                                                                    {ticketDetail.assigned_to.display_name}
                                                                </p>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                    </div> */}

                                    
                                    {/* <div className="panel-heading" ng-if="ticketPreviewController.associations.length">Associations
                                    </div>
                                    <div className="panel-body">
                                        <div className="customer-content">
                                            <table className="table borderless ticket-detail-table">
                                                <tbody>
                                                    <tr ng-repeat="association in ticketPreviewController.associations">
                                                        <td>
                                                            {association.source_type}
                                                        </td>
                                                        <td className="DateRangeSelector">
                                                            <span className="cursor-pointer" ng-click="ticketPreviewController.deleteAssociation(association)">
                                                                <i className="fa fa-times"></i>
                                                            </span>&nbsp;&nbsp;
                                                            <span source-redirect icon="fa fa-info-circle" row-data="association"></span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="panel-heading">Subscriber
                                        <button ng-click="ticketPreviewController.addSubscriber()" type="button" className="btn btn-xs btn-info  pull-right">
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className="panel-body">
                                        <div className="customer-content">
                                            <table className="table borderless ticket-detail-table">
                                                <tbody>
                                                    <tr ng-repeat="subscriber in ticketPreviewController.subscribers">
                                                        <td>
                                                            {subscriber.email_id}
                                                        </td>
                                                        <td>
                                                            <span className="cursor-pointer" ng-click="ticketPreviewController.changeSubscriber(subscriber)" ng-if="subscriber.subscriber==1">
                                                                <i className="fa fa-check"></i>
                                                            </span>
                                                            <span className="cursor-pointer" ng-click="ticketPreviewController.changeSubscriber(subscriber)" ng-if="subscriber.subscriber==0">
                                                                <i className="fa fa-times"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="panel-heading">Tags
                                        <button ng-click="ticketPreviewController.addTag()" type="button" className="btn btn-xs btn-info  pull-right">
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                    <div className="panel-body">
                                        <div className="tag-content">
                                            <div ng-repeat="tag in ticketPreviewController.tags">
                                                <span ng-click="ticketPreviewController.deleteTag(tag)" className="label cursor-pointer" ng-className="{'label-danger':tag.tag.tag}">
                                                    {tag.tag.tag}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <uib-accordion close-others="true" ng-if="ticketDetail.category.id == 630">
                                        <div uib-accordion-group className="panel-default" heading="List of scheduled meetings ({{ticketPreviewController.calendarEvents.length}})">
                                            <uib-accordion-heading>
                                                List of scheduled meetings ({ticketPreviewController.calendarEvents.length})
                                                <button className="btn btn-default btn-xs pull-right" style="margin-top:-4px;" ng-click="ticketPreviewController.loadCalendarEvents()">
                                                    <i className="fa fa-refresh" aria-hidden="true"></i>
                                                </button>
                                            </uib-accordion-heading>

                                            <div className="list-group">
                                                <button ng-repeat="comment in ticketPreviewController.calendarEvents|orderBy:'scheduled_start_time'" type="button" className="list-group-item">
                                                    <span className="smooth-text">
                                                        {comment.type_id == 647 ? 'Meeting' : 'Call'}
                                                    </span>
                                                    with
                                                    <span ng-if="!comment.lead">lead</span>
                                                    {comment.lead.first_name} {comment.lead.last_name} at {comment.scheduled_start_time}
                                                </button>
                                            </div>
                                        </div>
                                    </uib-accordion> */}
                                </div>
                            </div>
                        </div>
                    </div>

                }
            </div>
        )
    }
}