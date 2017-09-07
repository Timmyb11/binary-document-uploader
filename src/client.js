import sha1 from 'sha1';
import { generateChunks, addMetadata, createError } from './tools';

export default class Client {
    constructor({ send, file, reqId }) {
        this.send = send;
        this.file = file;
        this.reqId = reqId;

        const { buffer } = file;

        this.checksum = sha1(Array.from(buffer));
        this.size = buffer.length;
    }
    requestUpload() {
        const {
            documentType: document_type,
            documentFormat: document_format,
            documentId: document_id,
            expirationDate: expiration_date,
        } = this.file;

        this.send(
            JSON.stringify({
                req_id         : this.reqId,
                passthrough    : { document_upload: true },
                document_upload: 1,
                document_type,
                document_format: document_format.toUpperCase(),
                expiration_date,
                document_id,
            })
        );
    }
    handleMessage({ error, document_upload: uploadInfo }) {
        if (error) {
            throw createError('ApiError', error);
        }

        const { checksum, size, upload_id: uploadId, call_type: callType } = uploadInfo;

        if (!checksum) {
            this.startBinaryUpload(Object.assign({}, this.file, { uploadId, callType }));
            return undefined;
        }

        if (size !== this.size) {
            throw createError('SizeMismatch', 'File size does not match');
        }

        if (checksum !== this.checksum) {
            throw createError('ChecksumMismatch', 'Checksum does not match');
        }

        return uploadInfo;
    }
    startBinaryUpload(file) {
        addMetadata(generateChunks(file.buffer, file), file).forEach(chunk => this.send(chunk));
    }
}
