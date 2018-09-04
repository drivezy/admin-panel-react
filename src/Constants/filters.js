import COLUMN_TYPE from './../Constants/columnType.constants';

export default {
    "Bold Letter": {
        "name": "Bold Letter",
        "columnType": COLUMN_TYPE.DATETIME,
        "path": 'Generic-Column-Filters/boldLetter.component.js'
    },
    "View HTML": {
        "name": "View HTML",
        "columnType": COLUMN_TYPE.STRING,
        "path": 'Generic-Column-Filters/viewHTML.component.js'
    },
    "Shorten Content" : {
        "name": "Shorten Content",
        "columnType": COLUMN_TYPE.STRING,
        "path": 'Generic-Column-Filters/moreLess.component.js'
    },
    "buildDateRev": {
        "name": "buildDateRev",
        "columnType": COLUMN_TYPE.DATETIME,
    },
    "nameFromEmail": {
        "name": "nameFromEmail",
        "columnType": [
            COLUMN_TYPE.STRING
        ],
    },
    "External Link": {
        "name": "External Link",
        "columnType": COLUMN_TYPE.STRING,
        "path": 'Generic-Column-Filters/hyperlink.component.js'
    },
    "Lead Status": { 
        "name": "Lead Status",
        "columnType": 686,
        "path": 'Lead-Status/leadStatus.component.js'
    }
}