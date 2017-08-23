const CHUNK_SIZE = Number(process.env.CHUNK_SIZE || 16384); // 16 KB chunk size
const WORD_SIZE = 4;

export const generateChunks = binary =>
    Array.from(binary)
        .reduce((acc, item, i) => {
            const newAcc = [...acc];
            if (i % CHUNK_SIZE === 0) {
                newAcc.push([item]);
                return newAcc;
            }
            newAcc[newAcc.length - 1].push(item);
            return newAcc;
        }, [])
        .map(b => new Uint8Array(b))
        // indication of EOF
        .concat(new Uint8Array([]));

const numToUint8Array = num => {
    const typedArray = new Uint8Array(WORD_SIZE);
    const dv = new DataView(typedArray.buffer);
    dv.setUint32(0, num);
    return typedArray;
};

export const addMetadata = (chunks, { upload_id, call_type }) => {
    const id = numToUint8Array(upload_id);
    const type = numToUint8Array(call_type);
    return chunks.map(data => {
        const size = numToUint8Array(data.length);

        let payload = new Uint8Array([]);

        payload = pushToBuffer(payload, type);
        payload = pushToBuffer(payload, id);
        payload = pushToBuffer(payload, size);
        payload = pushToBuffer(payload, data);

        return payload;
    });
};

export const generateBinary = len => {
    const array = new Uint8Array(len);

    for (let i = 0; i < len; ++i) {
        array[i] = parseInt(Math.random() * 256);
    }

    return array;
};

function pushToBuffer(src, dst) {
    const output = new Uint8Array(src.length + dst.length);

    for (let i = 0; i < src.length; i++) {
        output[i] = src[i];
    }

    for (let i = 0; i < dst.length; i++) {
        output[i + src.length] = dst[i];
    }

    return output;
};

