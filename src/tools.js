const WORD_SIZE = 4;

export const generateChunks = (binary, { chunkSize = 16384 /* 16KB */ }) =>
    Array.from(binary)
        .reduce((acc, item, i) => {
            const newAcc = [...acc];
            if (i % chunkSize === 0) {
                newAcc.push([item]);
                return newAcc;
            }
            newAcc[newAcc.length - 1].push(item);
            return newAcc;
        }, [])
        .map(b => new Uint8Array(b))
        .concat(new Uint8Array([]));

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
    const newError = new Error(error.message || error);
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

function numToUint8Array(num) {
    const typedArray = new Uint8Array(WORD_SIZE);
    const dv = new DataView(typedArray.buffer);
    dv.setUint32(0, num);
    return typedArray;
}
