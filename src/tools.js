const WORD_SIZE = 4;

export const MAX_SIZE = 3 * 2 ** 20;
export const HUMAN_READABLE_MAX_SIZE = '3 MB';

export const generateChunks = (binary, { chunkSize = 16384 /* 16KB */ }) => {
    const chunks = [];
    for (let i = 0; i < binary.length; i++) {
        const item = binary[i];
        if (i % chunkSize === 0) {
            chunks.push([item]);
        } else {
            chunks[chunks.length - 1].push(item);
        }
    }
    return chunks.map(b => new Uint8Array(b)).concat(new Uint8Array([]));
};

export function addMetadata(chunks, { uploadId, callType }) {
    const id = numToUint8Array(uploadId);
    const type = numToUint8Array(callType);

    return chunks.map(data => {
        const size = numToUint8Array(data.length);

        let payload = new Uint8Array([]);

        payload = pushToBuffer(payload, type);
        payload = pushToBuffer(payload, id);
        payload = pushToBuffer(payload, size);
        payload = pushToBuffer(payload, data);

        return payload;
    });
}

export function log(debug, ...args) {
    if (!debug) {
        return;
    }
    // eslint-disable-next-line no-console
    console.log(`${new Date()}:`, ...args);
}

export function createError(code, error) {
    const newError = new Error(error.message || error.message_to_client || error);
    newError.name = error.code || code;
    return newError;
}

export function pushToBuffer(src, dst) {
    const output = new Uint8Array(src.length + dst.length);

    for (let i = 0; i < src.length; i++) {
        output[i] = src[i];
    }

    for (let i = 0; i < dst.length; i++) {
        output[i + src.length] = dst[i];
    }

    return output;
}

export function getFile(options) {
    const file = Object.assign({}, options);

    file.buffer = new Uint8Array(options.buffer);

    return file;
}

export function checkOptions(options) {
    if (!options) {
        throw Error('Options is required');
    }
    const requiredOpts = ['filename', 'buffer', 'documentType', 'documentFormat'];
    requiredOpts.forEach(opt => {
        if (!(opt in options)) {
            throw createError('InvocationError', `Required option <${opt}> is not found in the given options`);
        }
    });

    if (options.buffer.length > MAX_SIZE) {
        throw createError('FileSizeError', `The maximum acceptable file size is ${HUMAN_READABLE_MAX_SIZE}`);
    }

    if (options.documentType === 'passport') {
        if (!options.documentId) {
            throw createError('DocumentId', 'Document ID is required for passport scans');
        }
        if (!options.expirationDate) {
            throw createError('ExpirationDate', 'Expiration Date is required for passport scans');
        }
    }
}

function numToUint8Array(num) {
    const typedArray = new Uint8Array(WORD_SIZE);
    const dv = new DataView(typedArray.buffer);
    dv.setUint32(0, num);
    return typedArray;
}
