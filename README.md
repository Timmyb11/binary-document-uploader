# binary-document-uploader
Uploading files through websocket to binary.com platform

# Installation

```
npm install binary-document-uploader
```

# Usage

### ES6

```
import upload from 'binary-document-uploader';
```

### RequireJS

```
const upload = require('binary-document-uploader');
```

# Example

```
import upload from 'binary-document-uploader';

upload(options, config)
    .then(result => console.log(`Status: ${result.status}`))
    .catch(error => console.log(error));
```

# options (object)

File information and payload to send

## `options.connection`

A **ready** websocket connection

## `options.filename`

Filename

## `options.buffer`

Array buffer containing the file to upload

## `options.documentType`

Document type

## `options.documentId`

Document id

## `options.documentFormat`

Document format

## `options.expirationDate`

Expiration date

# config (optional)

## `config.chunkSize`

Default: `16384` (16 KB)

## `config.wordSize`

Default: `4`

## `config.debug`

Default: `false`
