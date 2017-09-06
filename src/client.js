import { generateChunks, addMetadata } from './tools';

let reqId = 0;

export const startBinaryUpload = (send, { file: { buffer }, config }) =>
    addMetadata(generateChunks(buffer, config), config).forEach(chunk => send(chunk));

export const requestDocumentUpload = (
    send,
    {
        documentType: document_type,
        documentFormat: document_format,
        documentId: document_id,
        expirationDate: expiration_date,
    }
) => () =>
    send(
        JSON.stringify({
            document_upload: 1,
            req_id         : ++reqId,
            document_type,
            document_format: document_format.toUpperCase(),
            expiration_date,
            document_id,
        })
    );
