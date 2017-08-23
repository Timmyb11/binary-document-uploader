import WebSocket from 'ws';
import sha1 from 'sha1';
import stripMetadata from './stripMetadata';
import { pushToBuffer } from '../tools';

const CALL_TYPE = 1;

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

let received = new Uint8Array([]);

function onBinary(ws, bytes) {
    const { buffer, chunkSize, uploadId, callType } = stripMetadata(bytes);

    if (!chunkSize) {
        ws.send(
            JSON.stringify({
                document_upload: {
                    status   : 'success',
                    size     : received.length,
                    checksum : sha1(Array.from(received)),
                    upload_id: uploadId,
                    call_type: callType,
                },
            })
        );
        return;
    }

    received = pushToBuffer(received, buffer);
}

let uploadId = 0;
const stash = {};

function onJson(ws, json) {
    stash[++uploadId] = json;

    ws.send(
        JSON.stringify({
            document_upload: {
                upload_id: uploadId,
                call_type: CALL_TYPE,
            },
        })
    );
}
