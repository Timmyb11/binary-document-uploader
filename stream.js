#!/usr/bin/env node

const WebSocket = require("ws");
const { generateBinary } = require("./tools");
const { sendAuthReq, uploadBinary, getFile } = require('./client');

const FILE_SIZE = process.env.FILE_SIZE || 1000000;

const ws = new WebSocket("ws://localhost:8080");

const binaryData = generateBinary(FILE_SIZE);

function onMessage(data) {
    console.log(data);
    const json = JSON.parse(data);

    if (json.error) {
        return console.log(json.error);
    }

    const metadata = getFile(json)

    const {checksum} = metadata;
    if (checksum) {
        return;
    }
    uploadBinary(ws, metadata, binaryData)
}

function onOpen() {
    sendAuthReq(ws)
}

ws.on("open", onOpen);
ws.on('message', onMessage);

