# binary-websocket-upload
Uploading files through websocket to binary.com platform

# Installation

```
npm install binary-websocket-upload
```

# Usage

```
import upload from 'binary-websocket-upload';

upload(file)
	.then(() => console.log('Upload successful!'))
	.catch(e => console.log(error));
```
