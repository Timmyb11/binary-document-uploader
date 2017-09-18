import { createError, MAX_SIZE, HUMAN_READABLE_MAX_SIZE } from './tools';
import DocumentUploader from './';

const mockConnection = { readyState: 1, send() {} };

describe('Max file size error', () => {
    it(`Files can be ${HUMAN_READABLE_MAX_SIZE} at most`, () => {
        let error;

        const uploader = new DocumentUploader({
            connection: mockConnection,
            debug     : true,
        });

        try {
            uploader.upload({
                filename      : 'test-file.jpg',
                buffer        : new Uint8Array(Array(MAX_SIZE + 1)),
                documentType  : 'passport',
                expirationDate: '2020-01-01',
                documentId    : '1234567',
                documentFormat: 'JPEG',
                chunkSize     : 2,
            });
        } catch (e) {
            error = e;
        }

        expect(error).toEqual(
            createError('FileSizeError', `The maximum acceptable file size is ${HUMAN_READABLE_MAX_SIZE}`)
        );
    });
});

describe('Mandatory fields', () => {
    it('should check the mandatory fields to be given', () => {
        let error;

        const uploader = new DocumentUploader({
            connection: mockConnection,
            debug     : true,
        });

        try {
            uploader.upload({
                filename      : 'test-file.jpg',
                buffer        : new Uint8Array(Array(1)),
                documentType  : 'passport',
                expirationDate: '2020-01-01',
                documentId    : '',
                documentFormat: 'JPEG',
            });
        } catch (e) {
            error = e;
        }

        expect(error).toEqual(
            createError('DocumentId', 'Document ID is required for passport scans')
        );

        try {
            uploader.upload({
                filename      : 'test-file.jpg',
                buffer        : new Uint8Array(Array(1)),
                documentType  : 'passport',
                expirationDate: '',
                documentId    : '12312313',
                documentFormat: 'JPEG',
            });
        } catch (e) {
            error = e;
        }

        expect(error).toEqual(
            createError('ExpirationDate', 'Expiration Date is required for passport scans')
        );
    });
});
