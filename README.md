# websocket-streaming
Show case of streaming binary data through websocket

# Usage

```
git clone https://github.com/aminmarashi/websocket-streaming.git
cd websocket-streaming
npm install
perl server.pl
./stream.js
```

# Throughput Experiment

```
perl server.pl
FILE_SIZE=10000 CHUNK_SIZE=1024 ./stream.js
```
