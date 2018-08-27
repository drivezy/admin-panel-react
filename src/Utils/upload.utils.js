import React from 'react';
import { ModalManager } from 'drivezy-web-utils/build/Utils';

import MultipleImageUpload from './../Components/Forms/Components/Multiple-Image-Upload/multipleImageUpload.component';
import { Post } from 'common-js-util';
import { GetTime } from './time.utils';

import { ROUTE_URL } from './../Constants/global.constants';
import { ImageUploadEndpoint } from './../Constants/api.constants';

export function MultiUploadModal({ title, column, onSubmit, source, sourceId }) {
    ModalManager.openModal({
        className: 'generic-form-container',
        headerText: title || 'Multiple Upload',
        modalBody: () => (<MultipleImageUpload column={column} onSubmit={onSubmit} sourceId={sourceId} source={source} />),
    });
}

/**
 * Takes image path (stored online), upload same to aws
 * @param  {string} {source - source 
 * @param  {number} source_id - source_id
 * @param  {array} files} - once uploaded, invokes callback
 */
export function MultipleUpload({ source, source_id, files, }) {
    // export async function UploadToAws({ documentName, bookingId, callback, images, type, imageFormat, lookupTypeId, source_id, hideMessage = false, source = 'booking' }) {
    let counter = 0;

    const payload = new FormData();
    // payload.append('type', type);
    payload.append('source', source = 'booking');
    payload.append('upload', true);
    payload.append('source_id', source_id = '329634');
    files.forEach((image) => {
        payload.append(`files[${counter}][file]`, image.file);
        payload.append(`files[${counter}][type]`, image.file.imgType);
        payload.append(`files[${counter}][expiry]`, GetTime({ dateTime: image.file.expiry, format: 'YYYY-MM-DD' }));
        counter++;
    });

    // payload.append('count', counter - 1);
    const url = ImageUploadEndpoint;
    return Post({ url, body: payload, urlPrefix: ROUTE_URL, payloadType: 'FormData', resetHeader: true, headers: {} });
    // return Post({ url, body: payload, urlPrefix: ROUTE_URL, payloadType: 'FormData', headers: { 'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarylcPNcKVb7yBsuq0e' } });
}
