import startServer from './server';
import upload from '../';

describe('Uploading file', () => {
    it('Files should be uploaded succcessfully', async () => {
        startServer();

        const { status } = await upload({
            filename      : 'test-file.jpg',
            buffer        : new Uint8Array([1, 2, 3, 4]),
            documentType  : 'passport',
            expirationDate: '2020-01-01',
            documentId    : '1234567',
            documentFormat: 'JPEG',
        }, {
            endpoint: 'ws://localhost:8080/',
        });

        expect(status).toEqual('success');
    });
});
