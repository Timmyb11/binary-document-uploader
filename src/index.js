import 'babel-polyfill'; // eslint-disable-line import/extensions,import/no-unresolved
import { log, checkOptions, getFile, createError } from './tools';
import Client from './client';

let reqId = 0;

export default class DocumentUploader {
    constructor(config) {
        this.config = config;
        this.clients = {};
        this.wrapConnection();
    }
    upload(fileOptions) {
        const { debug = false } = this.config;

        checkOptions(fileOptions);

        const file = getFile(fileOptions);

        reqId += 1;
        const client = new Client({ send: this.send, file, reqId });

        this.clients[reqId] = { client };

        return new Promise((resolve, reject) => {
            this.clients[reqId].promise = { resolve, reject };
            log(debug, 'Uploading started, File options:', file);
            client.requestUpload();
        });
    }
    wrapConnection() {
        const { connection, debug = false } = this.config;

        if (!connection || connection.readyState !== 1) {
            throw createError('ConnectionError', 'Connection is not ready!');
        }

        this.connection = connection;

        this.send = payload => {
            log(debug, '<Sent>:', payload);
            connection.send(payload);
        };

        const originalOnMessage = connection.onmessage;

        connection.onmessage = response => {
            const { data } = response;

            log(debug, '<Received>:', data);

            const json = JSON.parse(data);
            const { passthrough: { document_upload: isDocumentUpload } } = json;

            if (originalOnMessage && !isDocumentUpload) {
                originalOnMessage.call(connection, response);
                return;
            }

            if (!(json.req_id in this.clients)) {
                return;
            }

            const { client, promise } = this.clients[json.req_id];

            try {
                const result = client.handleMessage(json);

                if (result) {
                    log(debug, 'Upload successful, upload info:', result);
                    promise.resolve(result);
                }
            } catch (e) {
                promise.reject(e);
                log(debug, e);
            }
        };
    }
}
