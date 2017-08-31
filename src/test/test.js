import WebSocket from 'ws';
import startServer from './server';
import upload from '../';

const onMessage = jest.fn();
const connection = new WebSocket('ws://localhost:8080/');
connection.onmessage = onMessage;
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
                debug    : true,
                chunkSize: 2,
            }
        );

        expect(status).toEqual('success');
        expect(onMessage.mock.calls.length).toBe(2);
    });
});
