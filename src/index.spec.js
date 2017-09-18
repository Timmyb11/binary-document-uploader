import { createError, MAX_SIZE, HUMAN_READABLE_MAX_SIZE, typeToNameMap } from './tools';
import DocumentUploader from './';

const mockConnection = { readyState: 1, send() {} };

describe('Max file size error', () => {
    it(`Files can be ${HUMAN_READABLE_MAX_SIZE} at most`, () => {
        expect(testUploader({ buffer: new Uint8Array(Array(MAX_SIZE + 1)) })).toThrow(
            createError('FileSizeError', `The maximum acceptable file size is ${HUMAN_READABLE_MAX_SIZE}`)
        );
    });
});

describe('Mandatory fields', () => {
    it('should check the mandatory fields to be given', () => {
        ['passport', 'proofid', 'driverslicense'].forEach(type => {
            expect(testUploader({ documentType: type, documentId: '', expirationDate: '2020-01-01' })).toThrow(
                createError('DocumentId', `Document ID is required for ${typeToNameMap[type]} scans`)
            );

            expect(testUploader({ documentType: type, documentId: '12312', expirationDate: '' })).toThrow(
                createError('ExpirationDate', `Expiration Date is required for ${typeToNameMap[type]} scans`)
            );
        });
    });
});

function testUploader(fields) {
    return () => {
        const uploader = new DocumentUploader({
            connection: mockConnection,
            debug     : true,
        });

        uploader.upload(
            Object.assign(
                {
                    filename      : 'test-file.jpg',
                    buffer        : new Uint8Array(Array(1)),
                    documentType  : 'passport',
                    expirationDate: '2020-01-01',
                    documentId    : '1241241',
                    documentFormat: 'JPEG',
                },
                fields
            )
        );
    };
}
