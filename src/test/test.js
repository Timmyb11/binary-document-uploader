import WebSocket from 'ws';
import startServer from './server';
import upload from '../';

const connection = new WebSocket('ws://localhost:8080/');
const onOpen = new Promise(r => connection.on('open', r));

describe('Uploading file', () => {
    it('Files should be uploaded succcessfully', async () => {
        startServer();

        await onOpen;

        const { status } = await upload(
            {
                connection,
                filename      : 'test-file.jpg',
                buffer        : new Uint8Array([1, 2, 3, 4]),
                documentType  : 'passport',
                expirationDate: '2020-01-01',
                documentId    : '1234567',
                documentFormat: 'JPEG',
            },
            {
                debug: true,
                wordSize: 4,
                chunkSize: 2,
            }
        );

        expect(status).toEqual('success');
    });
});
