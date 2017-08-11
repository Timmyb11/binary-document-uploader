const { generateChunks, addMetadata } = require("./tools");

const uploadBinary = (ws, metadata, binaryData) => {
  const chunks = addMetadata(generateChunks(binaryData), metadata);

  chunks.forEach(chunk => ws.send(chunk));
};

const sendAuthReq = ws => {
  const payload = JSON.stringify({
    request_document_authentication: 1,
    document_type: "passport",
    expiry_date: "1345678",
    document_id: "1234567",
    req_id: 10
  });

  ws.send(payload);
};

const getFile = ({ request_document_authentication: {file} }) => file;

module.exports = {
    getFile, 
    uploadBinary,
    sendAuthReq,
}
