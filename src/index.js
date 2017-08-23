// eslint-disable-next-line import/no-unresolved,import/extensions
import WebSocket from 'ws';
import sha1 from 'sha1';
import { generateBinary } from './tools';
import { sendAuthReq, uploadBinary } from './client';

const FILE_SIZE = Number(process.env.FILE_SIZE || 1000000);

const ws = new WebSocket(process.env.ENDPOINT || 'ws://localhost:8080');

const binaryData = generateBinary(FILE_SIZE);

const checksum = sha1(binaryData);

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

function onMessage(data) {
    log(data);
    const json = JSON.parse(data);

    if (json.error) {
        log(json.error);
        return;
    }

    const { document_upload: metadata } = json;
    const { checksum: receivedChecksum, size } = metadata;

    if (receivedChecksum) {
        log(receivedChecksum === checksum ? 'Checksum matches' : 'Checksum does not match');
        log(size === FILE_SIZE ? 'Size matches' : 'Size does not match');
        return;
    }
    uploadBinary(ws, metadata, binaryData);
}

function onOpen() {
    sendAuthReq(ws);
}

ws.on('open', onOpen);
ws.on('message', onMessage);
