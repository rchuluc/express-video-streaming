# Express video streaming server

NodeJS and Express video streaming Proof of Concept (POC).

## NodeJS streaming

To stream files to client via Express is used the fs node built-in module with createReadStream and pipe methods.

## HTTP partial content

This project use partial content to deliver audio and video streaming, [See more](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/206).
