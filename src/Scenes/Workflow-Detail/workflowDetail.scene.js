import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Get, Post, Delete, Put } from 'common-js-util';
import _ from 'lodash';
import './workflowDetail.scene.css';
import { GetLookupValues } from './../../Utils/lookup.utils';
import { RECORD_URL } from './../../Constants/global.constants';
import { ToastNotifications } from 'drivezy-web-utils/build/Utils';
import { ROUTE_URL } from './../../Constants/global.constants';

var selectedElement, dragX, dragY, svg, workingWindow, lineDrawFlag = 0, pathObj = {}, pathObjTemp = {}, selectedElement2;
var reTranslate = /translate\s*\(([-\+\d\.\s,e]+)\)/gi;
var position = {};
var port_click_id;
var posFlag = false;
var boxColors = ["#009688", '#9C27B0', '#2196F3', '#673AB7', '#3F51B5', '#2196F3', '#FF9800'];
var desColors = ["#B2DFDB", '#E1BEE7', '#BBDEFB', '#D1C4E9', '#C5CAE9', '#BBDEFB', '#FFE0B2'];
var rand = parseInt(Math.random() * boxColors.length);
var defCompx = 0;
var defCompy = 200;
var defCompWidth = 170;
var defCompHeight = 75;
var defCompIcon = "\uf005";
var defCompStyle = { "fill": boxColors[rand] };
var defCompDesStyle = { "fill": desColors[rand] };
var defCompIconStyle = { "fill": "#FFEB3B", "fontSize": "20px" };
export default class WorkflowDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workflowBoxes: {},
            connectingLines: [],
            selfMarginLine: [],
            selfBoxPorts: [],
            selfJoinLines: [],
            selfBoxes: [],
            selfWidth: 0,
            selfHeight: 0,
            selfWidthRight: 0,
            selfLines: [],
            selfPaths: {},
            components: {},
            classDrag: "draggable"
        };
        this.makeDraggable = this.makeDraggable.bind(this);
        this.startDrag = this.startDrag.bind(this);
        this.drag = this.drag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.makeLine = this.makeLine.bind(this);
        this.deleteLine = this.deleteLine.bind(this);
        this.deleteComponent = this.deleteComponent.bind(this);
        this.makeLineHelper = this.makeLineHelper.bind(this);
    }

    componentDidMount() {
        this.getLookups();
    }


    getLookups = async () => {
        let { components } = this.state;
        const result = await GetLookupValues(155);
        if (result.success) {
            let temArr = [];
            let temp2 = {};
            let temp = result.response;
            temp = _.groupBy(temp, 'id');
            for (let j in temp) {
                temp2[j] = temp[j][0];
            }
            for (let k in temp2) {
                temp2[k].actions = [];
            }
            components = temp2;
            this.setState({ components });
            this.getComponentDetails();
            this.initialise();
        }

    }
    getComponentDetails = async () => {
        let { components } = this.state;
        let result = await Get({ url: 'component' });
        if (result.success) {
            let comp = result.response;
            for (let i in comp) {
                if (comp[i].component_type_id in components) {
                    comp[i].icon = comp[i].icon ? comp[i].icon : "fa fa-star fa-2x";
                    components[comp[i].component_type_id].actions.push(comp[i]);
                }
            }

        }
        this.setState({ components });
    }
    initialise = async () => {
        let { workflowBoxes, classDrag } = this.state;
        classDrag = "draggable";
        let result = await Get({ url: 'workflowComponent?includes=component.actions,destination_component' });
        if (result.success) {
            let temp2 = result.response;
            let temp1 = {};
            temp2 = _.groupBy(temp2, 'id');
            for (let i in temp2) {
                temp1[i] = temp2[i][0];
                temp1[i].style = temp1[i].style ? temp1[i].style : defCompStyle;
                temp1[i].desStyle = temp1[i].desStyle ? temp1[i].desStyle : defCompDesStyle;
                temp1[i].iconStyle = temp1[i].iconStyle ? temp1[i].iconStyle : defCompIconStyle;
                temp1[i].width = temp1[i].width ? temp1[i].width : defCompWidth;
                temp1[i].height = temp1[i].height ? temp1[i].height : defCompHeight;
                temp1[i].icon = temp1[i].icon ? temp1[i].icon : defCompIcon;
                temp1[i].position_x = parseFloat(temp1[i].position_x);
                temp1[i].position_y = parseFloat(temp1[i].position_y);
            }
            workflowBoxes = temp1;
        }
        this.setState({ workflowBoxes, classDrag });
        this.beginDraw();
    }
    beginDraw = () => {
        let { selfWidth, selfHeight, selfWidthRight } = this.state;
        lineDrawFlag = 0;
        svg = ReactDOM.findDOMNode(this.refs.mySvg);
        selfWidth = window.innerWidth;
        selfHeight = window.innerHeight;
        workingWindow = svg.getBoundingClientRect();
        selfWidthRight = selfWidth - workingWindow.x;
        this.setState({ selfWidth, selfHeight, selfWidthRight });
        this.draw();

    }
    draw = () => {
        let { selfPaths, selfBoxes, selfLines, workflowBoxes, connectingLines } = this.state;

        selfBoxes = workflowBoxes;
        selfLines = connectingLines[0];
        let k = 0;
        for (let j in selfBoxes) {
            if (selfBoxes[j].name) {
                selfBoxes[j].oname = selfBoxes[j].name.substring(0, 20);
            }
            // selfBoxes[j].destination_component = _.uniqBy(selfBoxes[j].destination_component, ["destination_component_id", "source_component_id"]);

            for (let i in selfBoxes[j].destination_component) {
                let pathD = this.drawLine(selfBoxes, j, i, selfBoxes[j].destination_component[i].destination_component_id, k);
                selfPaths[k] = pathD;
                k = k + 1;

            }
        }

        this.setState({ selfBoxes, selfPaths, selfLines });
        setTimeout(() => {
            this.makeDraggable();
        })
    }

    drawLine = (selfBoxes, j, i, des_comp_id, k = -99) => {
        let x1 = selfBoxes[j].position_x + selfBoxes[j].width - 15;
        let x2 = selfBoxes[des_comp_id].position_x - 15;
        let m;
        let tempObj = {};
        for (m in selfBoxes[j].component.actions) {
            if (selfBoxes[j].component.actions[m].id == selfBoxes[j].destination_component[i].action_id) {
                tempObj[selfBoxes[j].destination_component[i].action_id] = m;
            }
        }
        let y1 = selfBoxes[j].position_y + selfBoxes[j].height + ((selfBoxes[j].height / 2) * (tempObj[selfBoxes[j].destination_component[i].action_id])) + selfBoxes[j].height / 4;
        let y2 = selfBoxes[des_comp_id].position_y + selfBoxes[des_comp_id].height / 2;
        let pathD = {
            'action_id': selfBoxes[j].destination_component[i].action_id,
            'id': selfBoxes[j].destination_component[i].id,
            'path_id': k,
            'source_component_id': j,
            'destination_component_id': des_comp_id,
            'source_port_id': tempObj[selfBoxes[j].destination_component[i].action_id],
            'x1': x1,
            'x2': x2,
            'y1': y1,
            'y2': y2,
            'd': "M" + x1 + "," + y1 + " " + "C" + (x1 + 75) + "," + y1 + " " + (x2 - 75) + "," + y2 + " " + x2 + "," + y2
        }
        return pathD;
    }

    makeDraggable = () => {
        workingWindow = svg.getBoundingClientRect();
        svg.addEventListener('mousedown', this.startDrag, false);
        svg.addEventListener('mousemove', this.drag, false);
        svg.addEventListener('mouseup', this.endDrag, false);
        svg.addEventListener('mouseleave', this.endDrag, false);
    }

    startDrag = (event, first) => {
        posFlag = false;
        let screenMatrix;
        if (event.target.classList.contains('portBlock')) {
            return;
        }
        if (event.target.classList.contains('draggable') || event.target.parentNode.classList.contains('draggable')) {
            screenMatrix = svg.getScreenCTM();
            selectedElement = event.target;

            if (event.target.parentNode.classList.contains('draggable')) {
                selectedElement = event.target.parentNode;
            }

            dragX = event.clientX / screenMatrix.a;
            dragY = event.clientY / screenMatrix.d;

            let transform = selectedElement.getAttributeNS(null, "transform");
            let translate = reTranslate.exec(transform);
            if (translate) {
                var digits = translate[1].split(/\s*[,\s]+/);
                dragX -= parseFloat(digits[0] || 0);
                dragY -= parseFloat(digits[1] || 0);
            } else {
                // We need to add a translate transform if there isn't already one
                translate = "translate(0, 0)";
                if (transform) {
                    selectedElement.setAttributeNS(null, "transform", translate + transform);
                } else {
                    selectedElement.setAttributeNS(null, "transform", translate);
                }
            }
        }
    }

    drag(event) {
        let { selfPaths, selfBoxes } = this.state;
        if (selectedElement) {
            event.preventDefault();
            let screenMatrix = svg.getScreenCTM();
            let x = event.clientX / screenMatrix.a - dragX;
            let y = event.clientY / screenMatrix.d - dragY;
            let transform = selectedElement.getAttributeNS(null, "transform");
            if (!transform) {
                return;
            }
            transform = transform.replace(reTranslate, "translate(" + x + " " + y + ")");
            selectedElement.setAttributeNS(null, "transform", transform);
            // Drawing paths, lines joining two boxes, this should change dimensions on drag
            for (let j in selfPaths) {
                let temCoordObj = selectedElement.getBoundingClientRect();
                temCoordObj.x = temCoordObj.x - workingWindow.x;
                temCoordObj.y = temCoordObj.y - workingWindow.y;
                let temWidOBj = selectedElement.getBBox();

                // If in the array of paths the source box id is equal to the id then execute the following
                if (selfPaths[j].source_component_id == parseInt(selectedElement.id)) {

                    temWidOBj.height = selfBoxes[selfPaths[j].source_component_id].height;

                    // source changes destination does not need to change
                    var x1 = temCoordObj.x + temWidOBj.width - 15;

                    var y1 = temCoordObj.y + temWidOBj.height + ((temWidOBj.height / 2) * selfPaths[j].source_port_id) + temWidOBj.height / 4;
                    var x2 = selfPaths[j].x2;
                    var y2 = selfPaths[j].y2;
                    selfPaths[j].x1 = x1;
                    selfPaths[j].y1 = y1;


                    selfPaths[j].d = "M" + (x1) + "," + y1 + " " + "C" + (x1 + 75) + "," + y1 + " " + (x2 - 75) + "," + y2 + " " + x2 + "," + y2

                    position = {
                        'x': x1,
                        'y': y1,
                    }

                } else if (selfPaths[j].destination_component_id == parseInt(selectedElement.id)) {
                    // If in the array of paths the source box id is equal to the id then execute the following
                    // Only the destination coordinates needs to change i.e. x2 and y2
                    var x1 = selfPaths[j].x1;
                    var y1 = selfPaths[j].y1;
                    var x2 = temCoordObj.x - 15;
                    var y2 = temCoordObj.y + temWidOBj.height / 2;
                    selfPaths[j].x2 = x2;
                    selfPaths[j].y2 = y2;

                    // Draws sinusoidal curve from (x1,y1) to (x2,y2) with a curvature of 75 pixels
                    selfPaths[j].d = "M" + (x1) + "," + y1 + " " + "C" + (x1 + 75) + "," + y1 + " " + (x2 - 75) + "," + y2 + " " + x2 + "," + y2
                    position = {
                        'x': x2,
                        'y': y2
                    }

                }

            }
            this.setState({ selfBoxes, selfPaths });
        }
    }

    endDrag = async (event) => {
        if (selectedElement) {

            let screenMatrix = svg.getScreenCTM();
            let x = event.clientX / screenMatrix.a - dragX;
            let y = event.clientY / screenMatrix.d - dragY;


            let { selfBoxes, workflowBoxes } = this.state;
            let id = parseInt(selectedElement.id);
            let temCoordObj = selectedElement.getBoundingClientRect();
            temCoordObj.x = temCoordObj.x - workingWindow.x;
            temCoordObj.y = temCoordObj.y - workingWindow.y;
            let params = {
                'position_x': temCoordObj.x,
                'position_y': temCoordObj.y
            }
            const res = await Put({ url: 'workflowComponent/' + id, body: params });
            if (res.success) {
                posFlag = true;
            }
            selectedElement = null;
            this.setState({ selfBoxes })
        }
    }

    openNav = () => {
        document.getElementById("controlNav").style.width = "250px";
        document.getElementById("main").style.marginRight = "250px";
    }

    closeNav = () => {
        document.getElementById("controlNav").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
    }

    newWorkflowComponent = async (comp, c) => {
        const { id } = this.props.match.params;
        let params = {
            'component_id': c.id,
            'workflow_id': id
        };

        const result = await Post({ url: 'workflowComponent', body: params });
        if (result.success) {
            let { workflowBoxes } = this.state;
            workflowBoxes[result.response.id] = {};
            workflowBoxes[result.response.id].id = result.response.id;
            workflowBoxes[result.response.id].position_x = defCompx;
            workflowBoxes[result.response.id].position_y = defCompy;
            workflowBoxes[result.response.id].width = defCompWidth;
            workflowBoxes[result.response.id].height = defCompHeight;
            workflowBoxes[result.response.id].style = defCompStyle;
            workflowBoxes[result.response.id].iconStyle = defCompIconStyle;
            workflowBoxes[result.response.id].icon = defCompIcon;
            workflowBoxes[result.response.id].component = {};
            workflowBoxes[result.response.id].component.actions = [];
            workflowBoxes[result.response.id].component.id = result.response.component_id;
            this.setState({ workflowBoxes });
        }
    }

    makeLineHelper = async (pathObj, pathObjTemp, port_click_id, id = -99) => {
        let { selfPaths, selfBoxes } = this.state;
        if (id == -99) {
            id = selfPaths.length * 2;
        }

        const j = pathObj.source_component_id;
        const des_comp_id = pathObj.destination_component_id;
        let k = selfPaths.length + 1;
        let y1 = pathObjTemp.y1 + selfBoxes[j].height + ((selfBoxes[j].height / 2) * (port_click_id)) + selfBoxes[j].height / 4;
        let x1 = pathObjTemp.x1 + selfBoxes[j].width - 15;
        let x2 = pathObjTemp.x2;
        let y2 = pathObjTemp.y2 + selfBoxes[des_comp_id].height / 2;
        let pathD = {
            'x1': x1,
            'x2': x2 - 15,
            'y1': y1,
            'y2': y2,
            'action_id': pathObj.action_id,
            'source_component_id': pathObj.source_component_id,
            'destination_component_id': pathObj.destination_component_id,
            'd': "M" + x1 + "," + y1 + " " + "C" + (x1 + 75) + "," + y1 + " " + (x2 - 75) + "," + y2 + " " + x2 + "," + y2,
            'source_port_id': port_click_id,
            'id': id,
            'path_id': k
        }

        selfPaths[id] = pathD;
        this.setState({ selfPaths });
    }

    makeLine = async (event, comp, action, flag, key = -99) => {
        if (key != -99) {
            port_click_id = key;
        }
        if (event.target.classList.contains('draggable') || event.target.parentNode.classList.contains('draggable') || event.target.parentNode.classList.contains('portBlock')) {
            selectedElement2 = event.target;
            if (event.target.parentNode.classList.contains('draggable') || event.target.parentNode.classList.contains('portBlock')) {
                selectedElement2 = event.target.parentNode;
            }
        }
        let { classDrag } = this.state;
        if (flag) {
            if (lineDrawFlag == 0) {
                lineDrawFlag = 1;
            }
        }
        if (lineDrawFlag == 1) {
            pathObj.source_component_id = comp.id;
            pathObj.action_id = action.id;
            pathObjTemp.x1 = selectedElement2.getBoundingClientRect().x - workingWindow.x;
            pathObjTemp.y1 = selectedElement2.getBoundingClientRect().y - workingWindow.y;
            pathObj.workflow_id = this.props.match.params.id;
            lineDrawFlag = 2;
            classDrag = "portBlock";
            this.setState({ classDrag });
        }
        else if (lineDrawFlag == 2) {
            pathObj.destination_component_id = comp.id;
            pathObjTemp.x2 = selectedElement2.getBoundingClientRect().x - workingWindow.x;
            pathObjTemp.y2 = selectedElement2.getBoundingClientRect().y - workingWindow.y;
            lineDrawFlag = 3;
        }
        if (lineDrawFlag == 3) {
            if (pathObj.source_component_id == pathObj.destination_component_id) {
                alert("source and destination cannot be same");
                return
            }
            const result = await Post({ url: 'workflowAction', body: pathObj })
            lineDrawFlag = 0;
            classDrag = "draggable";


            if (result.success) {
                this.makeLineHelper(pathObj, pathObjTemp, port_click_id, result.response.id);
            }
            this.setState({ classDrag });

        }
    }

    deleteLine = async (path, key) => {
        let { selfPaths } = this.state;
        const result = await Delete({ url: `api/admin/workflowAction/${path.id}`, urlPrefix: ROUTE_URL });
        // const url = 'workflowAction/'+path.id;
        // const result = await Delete(url);
        if (result.success) {
            ToastNotifications.success({ description: "Workflow action has been deleted", title: "Deleted Successfully" });
            delete selfPaths[key];
        }
        this.setState({ selfPaths });
    }

    deleteComponent = async (rect, key) => {
        let { selfBoxes } = this.state;
        const result = await Delete({ url: `api/admin/workflowComponent/${rect.id}`, urlPrefix: ROUTE_URL });
        if (result.success) {
            ToastNotifications.success({ description: "Component has been deleted", title: "Deleted Successfully" });
            delete selfBoxes[key];
        }
        this.setState({ selfBoxes });
        window.location.reload();
    }

    render() {
        let { selfBoxes, selfPaths, selfHeight, components, classDrag } = this.state;
        return (
            <div className="workflow-detail">
                <div id="controlNav" className="sidenav">
                    <a href="javascript:void(0)" className="closebtn" onClick={() => { this.closeNav(); }} > &times;</a>
                    {
                        Object.keys(components).map((key) => {
                            const comp = components[key];
                            return (
                                <div key={key}>

                                    <span >{comp.name}</span>
                                    <div className="iconGroup">
                                        {
                                            comp.actions.map((c, key2) =>
                                                <div key={key2}>
                                                    <div className="iconSet" >
                                                        <button className="compIcons cursor-pointer"> <i className={c.icon} aria-hidden="true" onClick={() => { this.newWorkflowComponent(comp, c); }}></i></button>

                                                    </div>
                                                    <div className="text" >{c.name.substring(0, 15)}</div>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>

                            )
                        }
                        )
                    }
                </div>
                <button onClick={() => { this.openNav() }} className="btn btn-success pull-right" > <i className="fa fa-cogs" aria-hidden="true"></i> </button>
                <div className="svgArea" id="main">
                    <svg ref="mySvg" width="100%" height={selfHeight}>
                        <defs>
                            <marker id="markerArrow1" markerWidth="13" markerHeight="13" refX="2" refY="6" orient="auto">
                                <path d="M2,2 L2,11 L10,6 L2,2" style={{ fill: "#8BC34A" }} />
                            </marker>
                            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" strokeWidth="0.5" />
                            </pattern>
                            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                <rect width="80" height="80" fill="url(#smallGrid)" />
                                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height={selfHeight} fill="url(#grid)" />
                        {
                            Object.keys(selfBoxes).map((key) => {
                                const rect = selfBoxes[key];
                                return (
                                    <g key={key} className={classDrag} id={rect.id}>
                                        <rect x={rect.position_x} y={rect.position_y} width={rect.width} height={rect.height / 2} style={rect.style} onClick={(e) => { this.makeLine(e, rect, {}, false); }} className="cursor-move"> </rect>
                                        <rect x={rect.position_x} y={rect.position_y + rect.height / 2} width={rect.width} height={rect.height / 2} style={rect.desStyle} onClick={(e) => { this.makeLine(e, rect, {}, false); }} className="cursor-move"> </rect>
                                        <text x={rect.position_x + 20} y={rect.position_y + rect.height / 4 + 8} style={rect.iconStyle} textAnchor="middle" className="fontAwesome">{rect.icon}</text>
                                        <text x={rect.position_x + 40} y={rect.position_y + rect.height / 4 + 8} style={{ fill: "white", fontSize: '14px' }} textAnchor="start" >{rect.component.name}</text>
                                        <text x={rect.position_x + 50} y={rect.position_y + rect.height / 2} fill="white" textAnchor="start"  >
                                            {rect.oname}
                                            <title>
                                                {rect.name}
                                            </title>
                                        </text>
                                        <text x={rect.position_x + rect.width / 2} y={rect.position_y + rect.height - rect.height/4 + 4} style={{ fill: "black", fontSize: '12px' }} textAnchor="middle"  >
                                            {rect.component.description}
                                            <title>
                                                {rect.component.description}
                                            </title>
                                        </text>
                                        {/* <rect x={rect.position_x + rect.width - 15} y={rect.position_y + 5} width="12" height="12" style={{ "fill": "transparent" }}
                                            className="cursor-pointer" onClick={() => { this.deleteComponent(rect) }} /> */}
                                        <circle className="portBlock cursor-pointer" cx={rect.position_x + rect.width} cy={rect.position_y} style={{ 'fill': 'white', 'stroke': 'black', 'strokeWidth': 1 }} r="10"  onClick={() => { this.deleteComponent(rect) }} />
                                        <text x={rect.position_x + rect.width} y={rect.position_y + 4} style={{ "fill": "#F44336",'fontSize': '14px' }} textAnchor="middle" className="fontAwesome cursor-pointer" onClick={() => { this.deleteComponent(rect, key) }} >&times;</text>


                                        {
                                            rect.component.actions.map((port, key2) =>
                                                <rect className="portBlock" key={key2} x={rect.position_x} y={rect.position_y + rect.height + key2 * (rect.height / 2)} width={rect.width} height={rect.height / 2} style={{ 'fill': 'white', 'stroke': 'gray', 'strokeWidth': 0.5 }} />
                                            )
                                        }
                                        {
                                            rect.component.actions.map((text, key2) =>
                                                <text className="portBlock" key={key2} x={rect.position_x + rect.width - 40} y={rect.position_y + rect.height + key2 * (rect.height / 2) + rect.height / 4 + 4} style={{ 'fill': '#848c90' }} textAnchor="end" >{text.name} </text>
                                            )}
                                        {
                                            rect.component.actions.map((circle, key2) =>
                                                <circle className="portBlock cursor-pointer" key={key2} cx={rect.position_x + rect.width - 15} cy={rect.position_y + rect.height + key2 * (rect.height / 2) + rect.height / 4} stroke="#689F38" r="6" fill="transparent" />
                                            )
                                        }
                                        {
                                            rect.component.actions.map((circle, key2) =>
                                                <circle className="portBlock cursor-pointer" key={key2} cx={rect.position_x + rect.width - 15} cy={rect.position_y + rect.height + key2 * (rect.height / 2) + rect.height / 4} style={{ 'fill': '#8BC34A', 'stroke': '#689F38', 'strokeWidth': 3 }} r="6" fill="transparent" onClick={(e) => { this.makeLine(e, rect, circle, true, key2); }} />
                                            )
                                        }
                                    </g>
                                )
                            })
                        }

                        {
                            Object.keys(selfPaths).map((key) => {
                                const path = selfPaths[key];
                                return (
                                    <g key={key} id={path.id}>
                                        <path d={path.d} style={{ 'strokeWidth': "2", 'stroke': '#8BC34A', markerEnd: "url(#markerArrow1)" }} fill="transparent" />
                                        {/* <rect x={(path.x1 + path.x2) / 2} y={(path.y1 + path.y2) / 2} width="12" height="12" style={{ "fill": "red" }} className="cursor-pointer" onClick={() => { this.deleteLine(path, key) }} /> */}
                                        <circle className="portBlock cursor-pointer" cx={(path.x1 + path.x2) / 2} cy={(path.y1 + path.y2) / 2} style={{ 'fill': 'white', 'stroke': 'black', 'strokeWidth': 1 }} r="6" fill="transparent" onClick={() => { this.deleteLine(path, key) }} />
                                        <text x={(path.x1 + path.x2) / 2 } y={(path.y1 + path.y2) / 2 + 4} style={{ "fill": "#F44336" }} textAnchor="middle" className="fontAwesome cursor-pointer" onClick={() => { this.deleteLine(path, key) }} >&times;</text>
                                    </g>
                                )
                            })

                        }
                    </svg>
                </div>

            </div>
        )
    }
}