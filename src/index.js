import WebSocket from 'ws';
import sha1 from 'sha1';
import { log, createError } from './tools';
import { requestDocumentUpload, startBinaryUpload } from './client';

export default function upload(file, config = {}) {
    const { endpoint = 'wss://ws.binaryws.com/websockets/v3?app_id=1', debug = false } = config;
    const { buffer, filename } = file;

    return new Promise((resolve, reject) => {
        const ws = new WebSocket(endpoint);
        const originalChecksum = sha1(buffer);
        const originalSize = buffer.length;
        const send = ws.send.bind(ws);

        ws.on('open', requestDocumentUpload(send, file));

        ws.on('message', data => {
            log(debug, data);

            const json = JSON.parse(data);

            if (json.error) {
                reject(createError('ApiError', json.error));
                log(debug, json.error);
                return;
            }

            const { document_upload: fileInfo } = json;
            const { checksum, size, upload_id: uploadId, call_type: callType } = fileInfo;

            if (!checksum) {
                startBinaryUpload(send, {
                    file,
                    config: Object.assign({}, config, { uploadId, callType }),
                });
            } else if (checksum === originalChecksum && size === originalSize) {
                resolve(fileInfo);
                log(debug, `Upload successful for file: ${filename}`);
                log(debug, fileInfo);
            } else if (checksum !== originalChecksum) {
                const error = createError('ChecksumMismatch', 'Checksum does not match');

                reject(error);
                log(debug, error);
            } else if (size !== originalSize) {
                const error = createError('SizeMismatch', 'File size does not match');
                reject(error);
                log(debug, error);
            }
        });
    });
}
