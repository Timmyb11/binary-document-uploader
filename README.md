# binary-document-uploader
Uploading files through websocket to binary.com platform

# Installation

```
npm install binary-document-uploader
```

# Usage

### ES6

```
import DocumentUploader from 'binary-document-uploader';

const uploader = new DocumentUploader(config);
```

### RequireJS

```
const DocumentUploader = require('binary-document-uploader');

const uploader = new DocumentUploader(config);
```

### Browser

```
<script src="./documentUploader.js"></script>
<script>
    const uploader = new DocumentUploader(config);
    uploader(file);
</script>
```

# Example

```
import DocumentUploader from 'binary-document-uploader';

const uploader = new DocumentUploader(config);

uploader.upload(file)
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

## `file.documentId` (optional)

Document id

## `file.documentFormat`

Document format

## `file.expirationDate` (optional)

Expiration date

## `file.chunkSize`

Default: `16384` (16 KB)

# config (object)

## `config.connection`

A **ready** websocket connection

## `config.debug`

Default: `false`
