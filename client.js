const { generateChunks, addMetadata } = require("./tools");

const uploadBinary = (ws, metadata, binaryData) => {
  const chunks = addMetadata(generateChunks(binaryData), metadata);

  chunks.forEach(chunk => ws.send(chunk));
};

const sendAuthReq = ws => {
  const payload = JSON.stringify({
    document_upload: 1,
    req_id: 10,
    document_type: "passport",
    document_format: "JPEG",
    expiration_date: "1345678",
    document_id: "1234567"
  });

  ws.send(payload);
};

module.exports = {
  uploadBinary,
  sendAuthReq
};
