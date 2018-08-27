import { Post } from 'common-js-util';

import { ROUTE_URL } from './../Constants/global.constants';
import { ImageUploadEndpoint } from './../Constants/api.constants';

/**
 * Takes image path (stored online), upload same to aws
 * @param  {string} {source - source 
 * @param  {number} source_id - source_id
 * @param  {array} files} - once uploaded, invokes callback
 */
export function MultipleUpload({ source, source_id, files, }) {
    // export async function UploadToAws({ documentName, bookingId, callback, images, type, imageFormat, lookupTypeId, source_id, hideMessage = false, source = 'booking' }) {
    let counter = 1;

    const payload = new FormData();
    // payload.append('type', type);
    payload.append('source', source);
    payload.append('upload', true);
    payload.append('source_id', source_id);
    files.forEach((image) => {
        payload.append(`file${counter++}`, image);
    });

    payload.append('count', counter - 1);
    const url = ImageUploadEndpoint;
    return Post({ url, body: payload, urlPrefix: ROUTE_URL, payloadType: 'FormData', headers: { 'Content-Type': 'multipart/form-data' } });
}
