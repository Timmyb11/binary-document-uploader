import 'babel-polyfill'; // eslint-disable-line import/extensions,import/no-unresolved
import sha1 from 'sha1';
import { log, createError } from './tools';
import { requestDocumentUpload, startBinaryUpload } from './client';

export default function upload(options, config = {}) {
    checkOptions(options);

    const { debug = false } = config;
    const { connection } = options;
    const file = getFileOptions(options);
    const { buffer } = file;
    const originalChecksum = sha1(Array.from(buffer));
    const originalSize = buffer.length;
    const send = payload => {
        log(debug, '<Sent>:', payload);
        connection.send(payload);
    };
    const requestUpload = requestDocumentUpload(send, file);

    return new Promise((resolve, reject) => {
        if (connection.readyState === 1) {
            log(debug, 'Uploading started, File options:', file);
            requestUpload();
        } else {
            throw Error('Connection is not ready!');
        }

        const originalOnMessage = connection.onmessage;

        connection.onmessage = ({ data }) => {
            if (originalOnMessage) {
                originalOnMessage.call(connection, data);
            }
            log(debug, '<Received>:', data);

            const json = JSON.parse(data);

            if (json.error) {
                reject(createError('ApiError', json.error));
                connection.onmessage = originalOnMessage;
                log(debug, json.error);
                return;
            }

            const { document_upload: uploadInfo } = json;
            const { checksum, size, upload_id: uploadId, call_type: callType } = uploadInfo;

            if (!checksum) {
                startBinaryUpload(send, {
                    file,
                    config: Object.assign({}, config, { uploadId, callType }),
                });
                return;
            }
            if (checksum === originalChecksum && size === originalSize) {
                resolve(uploadInfo);
                log(debug, 'Upload successful, upload info:', uploadInfo);
            } else if (checksum !== originalChecksum) {
                const error = createError('ChecksumMismatch', 'Checksum does not match');
                reject(error);
                log(debug, error);
            } else {
                const error = createError('SizeMismatch', 'File size does not match');
                reject(error);
                log(debug, error);
            }
            connection.onmessage = originalOnMessage;
        };
    });
}

function getFileOptions(options) {
    const file = Object.assign({}, options, { connection: undefined });

    file.buffer = new Uint8Array(options.buffer);

    return file;
}

function checkOptions(options) {
    if (!options) {
        throw Error('Options is required');
    }
    const requiredOpts = ['connection', 'filename', 'buffer', 'documentType', 'documentFormat'];
    requiredOpts.forEach(opt => {
        if (!(opt in options)) {
            throw Error(`Required option <${opt}> is not found in the given options`);
        }
    });
}
