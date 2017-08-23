import startServer from './server';
import upload from '../';

describe('Uploading file', () => {
    it('Files should be uploaded succcessfully', async () => {
        startServer();

        const { status } = await upload(
            {
                buffer        : new Uint8Array([1, 2, 3, 4]),
                documentType  : 'passport',
                expirationDate: '1345678',
                documentId    : '1234567',
                documentFormat: 'JPEG',
            },
            { endpoint: 'ws://localhost:8080/' }
        );

        expect(status).toEqual('success');
    });
});
