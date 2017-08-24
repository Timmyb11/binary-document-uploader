# binary-websocket-upload
Uploading files through websocket to binary.com platform

# Installation

```
npm install binary-websocket-upload
```

# Usage

### ES6

```
import upload from 'binary-websocket-upload';
```

### RequireJS

```
const upload = require('binary-websocket-upload');
```

# Example

```
import upload from 'binary-websocket-upload';

upload(file, config)
    .then(result => console.log(`Status: ${result.status}`))
    .catch(error => console.log(error));
```

# file (object)

File information and payload to send

## `file.filename`

Filename

## `file.buffer`

Array buffer containing the file to upload

## `file.documentType`

Document type

## `file.documentId`

Document id

## `file.documentFormat`

Document format

## `file.expirationDate`

Expiration date

# config (optional)

## `config.endpoint`

Default: `'wss://ws.binaryws.com/websockets/v3?app_id=1'`

## `config.connection`

Default: instance of WebSocket with `'wss://ws.binaryws.com/websockets/v3?app_id=1'`

## `config.chunkSize`

Default: `16384` (16 KB)

## `config.wordSize`

Default: `4`
