import WebSocket from 'ws';
import sha1 from 'sha1';
import stripMetadata from './stripMetadata';
import { pushToBuffer } from '../tools';

const CALL_TYPE = 1;
let lastUploadId = 0;
const stash = {};

export default function startServer() {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', ws => {
        ws.on('message', message => {
            try {
                const json = JSON.parse(message);
                onJson(ws, json);
            } catch (e) {
                onBinary(ws, message);
            }
        });
    });
}

function onBinary(ws, bytes) {
    const { buffer, chunkSize, uploadId, callType } = stripMetadata(bytes);

    const stashed = stash[uploadId];

    if (!chunkSize) {
        ws.send(
            JSON.stringify({
                req_id         : stashed.req_id,
                passthrough    : stashed.passthrough,
                document_upload: {
                    status   : 'success',
                    size     : stashed.received_bytes.length,
                    checksum : sha1(Array.from(stashed.received_bytes)),
                    upload_id: uploadId,
                    call_type: callType,
                },
            })
        );
        return;
    }

    stashed.received_bytes = pushToBuffer(stashed.received_bytes, buffer);
}

function onJson(ws, json) {
    stash[++lastUploadId] = Object.assign({}, json, { received_bytes: new Uint8Array([]) });

    ws.send(
        JSON.stringify({
            req_id         : json.req_id,
            passthrough    : json.passthrough,
            document_upload: {
                upload_id: lastUploadId,
                call_type: CALL_TYPE,
            },
        })
    );
}
