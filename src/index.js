import WebSocket from 'ws';
import sha1 from 'sha1';
import { log, createError } from './tools';
import { requestDocumentUpload, startBinaryUpload } from './client';

export default function upload(fileOptions, config = {}) {
    // Unify input buffer
    const file = Object.assign({}, fileOptions, { buffer: new Uint8Array(fileOptions.buffer) });

    const { buffer, filename } = file;
    const {
        endpoint = 'wss://ws.binaryws.com/websockets/v3?app_id=1',
        debug = false,
        connection = new WebSocket(endpoint),
    } = config;

    const originalChecksum = sha1(Array.from(buffer));
    const originalSize = buffer.length;
    const send = connection.send.bind(connection);

    const requestUpload = requestDocumentUpload(send, file);

    return new Promise((resolve, reject) => {
        if (connection.readyState === 1) {
            requestUpload();
        } else {
            connection.on('open', requestUpload);
        }

        connection.on('message', data => {
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
