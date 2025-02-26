// /server/server.js

import * as http from "node:http";
import * as url from "node:url";

const booksJSON = `[
    {
      "id": "book_001",
      "name": "Cien años de soledad",
      "year": 1967,
      "genre": "Realismo mágico",
      "author": "Gabriel García Márquez",
      "pages": 417
    },
    {
      "id": "book_002",
      "name": "Don Quijote de la Mancha",
      "year": 1605,
      "genre": "Novela de caballería",
      "author": "Miguel de Cervantes",
      "pages": 863
    },
    {
      "id": "book_003",
      "name": "1984",
      "year": 1949,
      "genre": "Distopía",
      "author": "George Orwell",
      "pages": 328
    },
    {
      "id": "book_004",
      "name": "Orgullo y prejuicio",
      "year": 1813,
      "genre": "Romance",
      "author": "Jane Austen",
      "pages": 279
    },
    {
      "id": "book_005",
      "name": "El señor de los anillos: La comunidad del anillo",
      "year": 1954,
      "genre": "Fantasía",
      "author": "J.R.R. Tolkien",
      "pages": 423
    }
  ]

`

http.createServer(function server_onRequest (request, response) {
    let pathname = url.parse(request.url).pathname;

    console.log(`Request for ${pathname} received.`);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(200);

    // response.writeHead(200, {'Content-Type': 'text/html'});
    // response.write("<h1>Hello World</h1>");

    response.write(booksJSON);
    response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');