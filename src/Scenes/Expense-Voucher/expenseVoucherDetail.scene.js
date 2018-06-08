import React, { Component } from 'react';
import './expenseVoucherDetail.scene.css';

import {
    Card, CardHeader, CardBody, Row, Col
} from 'reactstrap';

import TableWrapper from './../../Components/Table-Wrapper/tableWrapper.component';

import { Get, Post, Put } from './../../Utils/http.utils';
import ToastNotifications from './../../Utils/toast.utils';
import { ConfirmUtils } from './../../Utils/confirm-utils/confirm.utils';

export default class ExpenseVoucherDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            voucherDetail: {},
        };
    }

    componentDidMount() {
        this.getVoucherDetail();
    }

    getVoucherDetail = async () => {
        const { voucherId } = this.props.match.params;
        const url = 'expenseVoucher/' + voucherId + '?includes=head,comments.created_user,tags,receipts.created_user,receipts.type,cash.created_user,cheque.created_user,imps.created_user,details,status,payee,vendor,authorized_by,unauthorized_by,invoices.created_user,invoices.tds_type,city,venue'
        const result = await Get({ url });

        if (result.success) {
            const voucherDetail = result.response;
            this.setState({ voucherDetail });
        }
    }

    refresh = () => {
        this.getVoucherDetail();
    }

    requestApproval = (voucher) => {
        const method = async () => {
            const result = await Put({ url: "expenseVoucher/" + voucher.id, body: { state: 277 } });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Expense Status changed to Pending Approval');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to request approval?", callback: method });
    }

    approveExpense = (voucher) => {
        const method = async () => {
            const result = await Put({ url: "expenseVoucher/" + voucher.id, body: { state: 278 } });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Expense Approved');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to approve this expense?", callback: method });
    }

    rejectExpense = (voucher) => {
        const method = async () => {
            const result = await Put({ url: "expenseVoucher/" + voucher.id, body: { state: 312 } });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Expense Rejected');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to reject expense?", callback: method });
    }

    rejectInvoice = (voucher) => {
        const method = async () => {
            const result = await Put({ url: "expenseVoucher/" + voucher.id, body: { state: 279 } });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Invoice Rejected');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to reject this invoice?", callback: method });
    }

    onHold = (voucher) => {
        const method = async () => {
            const result = await Put({ url: "expenseVoucher/" + voucher.id, body: { state: 1070 } });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Expense On Hold');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to on hold this expense?", callback: method });
    }

    authorizeExpense = (voucher) => {
        const method = async () => {
            const result = await Post({ url: "authorizeExpense/" + voucher.id });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Expense Authorized successfully');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to authorize this expense?", callback: method });
    }

    unauthorizeExpense = (voucher) => {
        const method = async () => {
            const result = await Post({ url: "unAuthorizeExpense/" + voucher.id });
            if (result.success) {
                this.getVoucherDetail();
                ToastNotifications.success('Expense Unauthorized successfully');
            }
        }
        ConfirmUtils.confirmModal({ message: "Are you sure you want to unauthorize this expense?", callback: method });
    }

    render() {
        const { voucherDetail = {} } = this.state;
        console.log(voucherDetail);
        return (
            <div className="expense-voucher-detail">
                {
                    voucherDetail.id &&
                    <div className="expense-voucher">
                        <div className="expense-voucher-header">
                            <div className="header-content">
                                <h6>Expense Voucher Detail</h6>
                                <button type="button" className="btn btn-sm btn-primary" uib-tooltip="Refresh Content" onClick={() => { this.refresh() }} >
                                    <i className="fa fa-refresh"></i>
                                </button>
                            </div>
                        </div>
                        <div className="expense-cards">
                            <div className="voucher-detail">
                                <Card className="expense-detail">
                                    <CardHeader className="expense-detail-header">Expense Detail</CardHeader>
                                    <CardBody>
                                        <div className="gray-border-bottom">
                                        </div>
                                        {
                                            voucherDetail.head &&
                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Head Name</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.head.head_name}</p>
                                                </Col>
                                            </Row>
                                        }
                                        <Row className="gray-border-bottom">
                                            <Col sm="6">
                                                <p>Amount</p>
                                            </Col>
                                            <Col sm="6">
                                                <p className="text-right">{voucherDetail.amount}</p>
                                            </Col>
                                        </Row>

                                        <Row className="gray-border-bottom">
                                            <Col sm="6">
                                                <p>Expense Date</p>
                                            </Col>
                                            <Col sm="6">
                                                <p className="text-right">{voucherDetail.expense_date}</p>
                                            </Col>
                                        </Row>
                                        {
                                            voucherDetail.status &&
                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Expense Status</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.status.value}</p>
                                                </Col>
                                            </Row>
                                        }
                                        {
                                            voucherDetail.city &&
                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>City</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.city.name}</p>
                                                </Col>
                                            </Row>
                                        }
                                        {
                                            voucherDetail.venue &&
                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Venue</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.venue.name}</p>
                                                </Col>
                                            </Row>
                                        }
                                        {
                                            voucherDetail.source &&
                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Expense Source</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.source}</p>
                                                </Col>
                                            </Row>
                                        }
                                    </CardBody>
                                </Card>

                                {
                                    voucherDetail.vendor &&
                                    <Card className="vendor-detail">
                                        <CardBody>
                                            {
                                                voucherDetail.pay_vendor &&
                                                <CardHeader className="expense-vendor-details">Vendor Detail (Payee)</CardHeader>
                                            }

                                            <div className="gray-border-bottom">
                                            </div>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Vendor Name</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.vendor.name}</p>
                                                </Col>
                                            </Row>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Mobile</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.vendor.primary_contact_number}</p>
                                                </Col>
                                            </Row>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Email</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.vendor.email_id}</p>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                }
                                {
                                    voucherDetail.payee && !voucherDetail.pay_vendor &&
                                    <Card className="payee-detail">
                                        <CardHeader className="expense-payee-details">User Detail (Payee)</CardHeader>
                                        <CardBody>
                                            <div className="gray-border-bottom">
                                            </div>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>User Name</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.payee.display_name}</p>
                                                </Col>
                                            </Row>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Mobile</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.payee.mobile}</p>
                                                </Col>
                                            </Row>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Email</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.payee.email}</p>
                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                }
                                {
                                    voucherDetail.financial_authorized_by &&
                                    <Card className="payee-detail">
                                        <CardHeader className="expense-authorize-details">Authorized</CardHeader>
                                        <CardBody>
                                            <div className="gray-border-bottom">
                                            </div>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Authorized By</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.authorized_by.display_name}</p>
                                                </Col>
                                            </Row>

                                        </CardBody>
                                    </Card>
                                }
                                {
                                    voucherDetail.unauthorized_by &&
                                    <Card className="payee-detail">
                                        <CardHeader className="expense-unauthorize-details">Unauthorized</CardHeader>
                                        <CardBody>
                                            <div className="gray-border-bottom">
                                            </div>

                                            <Row className="gray-border-bottom">
                                                <Col sm="6">
                                                    <p>Unauthorized By</p>
                                                </Col>
                                                <Col sm="6">
                                                    <p className="text-right">{voucherDetail.unauthorized_by.display_name}</p>
                                                </Col>
                                            </Row>

                                        </CardBody>
                                    </Card>
                                }
                                {
                                    voucherDetail.status.id === 276 &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-primary btn-block" onClick={() => { this.requestApproval(voucherDetail) }}>
                                            Request Approval
                                    </button>
                                    </div>
                                }
                                {
                                    voucherDetail.status.id === 277 &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-success btn-block" onClick={() => { this.approveExpense(voucherDetail) }}>
                                            Approve Expense
                                    </button>
                                    </div>
                                }
                                {
                                    (voucherDetail.cash.length === 0 && voucherDetail.imps.length === 0 && voucherDetail.cheque.length === 0 && voucherDetail.status.id !== 312 && voucherDetail.status.id !== 279) &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-danger btn-block" onClick={() => { this.rejectExpense(voucherDetail) }}>
                                            Reject Expense
                                    </button>
                                    </div>
                                }
                                {
                                    (voucherDetail.cash.length === 0 && voucherDetail.imps.length === 0 && voucherDetail.cheque.length === 0 && voucherDetail.status.id !== 312 && voucherDetail.status.id !== 279) &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-warning btn-block" onClick={() => { this.rejectInvoice(voucherDetail) }}>
                                            Reject Invoice
                                    </button>
                                    </div>
                                }
                                {
                                    (voucherDetail.cash.length === 0 && voucherDetail.imps.length === 0 && voucherDetail.cheque.length === 0 && voucherDetail.status.id !== 312 && voucherDetail.status.id !== 279 && voucherDetail.status.id !== 1070) &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-info btn-block" onClick={() => { this.onHold(voucherDetail) }}>
                                            On Hold
                                    </button>
                                    </div>
                                }
                                {
                                    !voucherDetail.financial_authorized_by && voucherDetail.status.id !== 279 &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-primary btn-block" onClick={() => { this.authorizeExpense(voucherDetail) }}>
                                            Authorize Expense
                                    </button>
                                    </div>
                                }
                                {
                                    !voucherDetail.unauthorized_by && voucherDetail.status.id !== 279 &&
                                    <div className="padding-top-10">
                                        <button type="button" className="btn btn-primary btn-block" onClick={() => { this.unauthorizeExpense(voucherDetail) }}>
                                            Unauthorize Expense
                                    </button>
                                    </div>
                                }
                            </div>

                            <div className="tabs-card">
                                {
                                    voucherDetail.comments && voucherDetail.comments.length ?
                                        <Card className="comments-card">
                                            <CardHeader>Comments</CardHeader>
                                            <CardBody>
                                                <TableWrapper listing={voucherDetail.comments} columns={[{
                                                    field: "comments",
                                                    label: "Comments"
                                                }, {
                                                    field: "created_at",
                                                    label: "Creation Time"
                                                }, {
                                                    field: "created_user.display_name",
                                                    label: "Created By",
                                                    sref: "/user/",
                                                    type: "sref",
                                                    id: "created_user.id"
                                                }]}></TableWrapper>
                                            </CardBody>
                                        </Card>
                                        : null
                                }
                                {
                                    voucherDetail.receipts && voucherDetail.receipts.length ?
                                        <Card className="receipts-card">
                                            <CardHeader>Receipts</CardHeader>
                                            <CardBody>
                                                <TableWrapper listing={voucherDetail.receipts} columns={[{
                                                    field: "document_link",
                                                    label: "Document Link",
                                                    sref: 'document_link',
                                                    type: "link"
                                                }, {
                                                    field: "created_user.display_name",
                                                    label: "Created By",
                                                    sref: "/user/",
                                                    type: "sref",
                                                    id: "created_user.id"
                                                }]}></TableWrapper>
                                            </CardBody>
                                        </Card>
                                        : null
                                }
                                {
                                    voucherDetail.cash && voucherDetail.cash.length ?
                                        <Card className="cash-card">
                                            <CardHeader>Cash</CardHeader>
                                            <CardBody>
                                                <TableWrapper listing={voucherDetail.cash} columns={[{
                                                    field: "amount",
                                                    label: "Amount"
                                                }, {
                                                    field: "source",
                                                    label: "Source"
                                                }, {
                                                    field: "payment_date",
                                                    label: "Payment Date"
                                                }, {
                                                    field: "comment",
                                                    label: "Comment"
                                                }, {
                                                    field: "created_user.display_name",
                                                    label: "Created By",
                                                    sref: "/user/",
                                                    type: "sref",
                                                    id: "created_user.id"
                                                }]}></TableWrapper>
                                            </CardBody>
                                        </Card>
                                        : null
                                }
                                {
                                    voucherDetail.cheque && voucherDetail.cheque.length ?
                                        <Card className="cheque-card">
                                            <CardHeader>Cheque</CardHeader>
                                            <CardBody>
                                                <TableWrapper listing={voucherDetail.cheque} columns={[{
                                                    field: "cheque_number",
                                                    label: "Cheque Number"
                                                }, {
                                                    field: "amount",
                                                    label: "Amount"
                                                }, {
                                                    field: "issuing_bank",
                                                    label: "Issuing Bank"
                                                }, {
                                                    field: "created_user.display_name",
                                                    label: "Created By",
                                                    sref: "/user/",
                                                    type: "sref",
                                                    id: "created_user.id"
                                                }]}></TableWrapper>
                                            </CardBody>
                                        </Card>
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}