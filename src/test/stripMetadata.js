const WORD_SIZE = 4;

const uint8ToUint32 = (typedArray, offset) => {
    const dv = new DataView(new Uint8Array(typedArray).buffer);
    return dv.getUint32(offset);
};

module.exports = function stripMetadata(binary) {
    const callType = uint8ToUint32(binary, 0).toString();
    const uploadId = uint8ToUint32(binary, WORD_SIZE).toString();
    const chunkSize = Number(uint8ToUint32(binary, WORD_SIZE * 2).toString());

    const buffer = binary.slice(WORD_SIZE * 3);

    return {
        callType,
        uploadId,
        chunkSize,
        buffer,
    };
};
