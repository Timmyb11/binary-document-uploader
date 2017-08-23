#!/usr/bin/env node

const WebSocket = require("ws");
const { generateBinary } = require("./tools");
const { sendAuthReq, uploadBinary } = require("./client");
const crypto = require("crypto");
const shasum = crypto.createHash("sha1");

const FILE_SIZE = Number(process.env.FILE_SIZE || 1000000);

const ws = new WebSocket(process.env.ENDPOINT || "ws://localhost:8080");

const binaryData = generateBinary(FILE_SIZE);

shasum.update(binaryData);

const checksum = shasum.digest("hex");

function onMessage(data) {
  console.log(data);
  const json = JSON.parse(data);

  if (json.error) {
    return console.log(json.error);
  }

  const { document_upload: metadata } = json;

  const { checksum: receivedChecksum, size } = metadata;
  if (receivedChecksum) {
    if (receivedChecksum === checksum) {
      console.log("Checksum matches");
    } else {
      console.log("Checksum does not match");
    }
    if (size === FILE_SIZE) {
      console.log("Size matches");
    } else {
      console.log("Size does not match");
    }
    return;
  }
  uploadBinary(ws, metadata, binaryData);
}

function onOpen() {
  sendAuthReq(ws);
}

ws.on("open", onOpen);
ws.on("message", onMessage);
