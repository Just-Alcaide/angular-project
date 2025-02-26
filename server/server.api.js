// server.api.js
import * as http from "node:http";
import * as qs from "node:querystring";
import { crud } from "./server.crud.js";


import {User} from "../Proyecto-final/src/js/classes/User.js";
import {Club} from "../Proyecto-final/src/js/classes/Club.js";
// import {Proposal} from "../Proyecto-final/src/js/classes/Proposal.js";
// import {/*Product,*/ Book, Movie} from "../Proyecto-final/src/js/classes/Product.js";
let newUser 
let newClub
// let newProposal = new Proposal(urlParams)
// let newBook = new Book(urlParams)
// let newMovie = new Movie(urlParams)

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const USERS_URL = './server/BBDD/users.json'
const CLUBS_URL = './server/BBDD/clubs.json'
const PROPOSALS_URL = './server/BBDD/proposals.json'
const BOOKS_URL = './server/BBDD/books.json'
const MOVIES_URL = './server/BBDD/movies.json'

/**
 * Returns an object with the action name and id from the given pathname.
 * For example, for "/create/articles/:id", it will return { name: "/create/articles", id: ":id" }
 * @param {string} pathname
 * @returns {{name: string, id: string}}
 */
function getAction(pathname) {
  // /create/articles/:id
  const actionParts = pathname.split('/');
  return {
    name: `/${actionParts[1]}/${actionParts[2]}`,
    id: actionParts[3]
   }
}

http
  .createServer(async (request, response) => {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlParams = Object.fromEntries(url.searchParams);
    const action = getAction(url.pathname);
    const statusCode = 200
    let responseData = []
    let chunks = []

    console.log(request.method, url.pathname, urlParams, action.name, action.id);

    // Set Up CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', MIME_TYPES.json);
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(statusCode);

    if (request.method === 'OPTIONS') {
      response.end();
      return;
    }

    switch (action.name) {

      case '/create/users':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          console.log('create user - body BUFFER', body)
          let parsedData = qs.parse(body.toString())
          newUser = new User(parsedData)
          console.log('create user - body', newUser)

          crud.create(USERS_URL, newUser, (data) => {
            console.log(`server create user ${data.name} creado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;

      case '/read/users':
        crud.read(USERS_URL, (data) => {
          console.log('server read users', data)
          responseData = data
          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/update/users':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(USERS_URL, action.id, parsedData, (data) => {
              console.log(`server update user ${action.id} modificado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/filter/users':
        crud.filter(USERS_URL, urlParams, (data) => {
          console.log('server filter users', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      case '/delete/users':
        crud.delete(USERS_URL, action.id, (data) => {
          console.log('server delete user', action.id, data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

      case '/create/clubs':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())

            const loggedUserId = parsedData.loggedUserId
            delete parsedData.loggedUserId

            newClub = new Club({
              ...parsedData,
              admins: [loggedUserId],
              members: [loggedUserId]
            });

            crud.create(CLUBS_URL, newClub, (data) => {
              console.log(`server create club ${data.name} creado`, data)
              responseData = data

              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/read/clubs':
        crud.read(CLUBS_URL, (data) => {
          console.log('server read clubs', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

      case '/update/clubs':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          let parsedData = qs.parse(body.toString())
          crud.update(CLUBS_URL, action.id, parsedData, (data) => {
            console.log(`server update club ${action.id} modificado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;

      case '/filter/clubs':
        crud.filter(CLUBS_URL, urlParams, (data) => {
          console.log('server filter clubs', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

        case '/delete/clubs':
          crud.delete(CLUBS_URL, action.id, (data) => {
            console.log('server delete club', action.id, data)
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;

        case '/create/proposals':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.create(PROPOSALS_URL, parsedData, (data) => {
              console.log(`server create proposal ${data.name} creado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/read/proposals':
        crud.read(PROPOSALS_URL, (data) => {
          console.log('server read proposals', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/update/proposals':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(PROPOSALS_URL, action.id, parsedData, (data) => {
              console.log(`server update proposal ${action.id} modificado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/filter/proposals':
        crud.filter(PROPOSALS_URL, urlParams, (data) => {
          console.log('server filter proposals', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

        case '/delete/proposals':
          crud.delete(PROPOSALS_URL, action.id, (data) => {
            console.log('server delete proposal', action.id, data)
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;

      case '/create/books':
        request.on('data', (chunk) => {
          chunks.push(chunk)
        })
        request.on('end', () => {
          let body = Buffer.concat(chunks)
          let parsedData = qs.parse(body.toString())
          crud.create(BOOKS_URL, parsedData, (data) => {
            console.log(`server create book ${data.name} creado`, data)
            responseData = data

            response.write(JSON.stringify(responseData));
            response.end();
          });
        })
        break;

      case '/read/books':
        crud.read(BOOKS_URL, (data) => {
          console.log('server read books', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/update/books':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(BOOKS_URL, action.id, parsedData, (data) => {
              console.log(`server update book ${action.id} modificado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/filter/books':
        crud.filter(BOOKS_URL, urlParams, (data) => {
          console.log('server filter books', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

        case '/delete/books':
          crud.delete(BOOKS_URL, action.id, (data) => {
            console.log('server delete book', action.id, data)
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;

        case '/create/movies':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.create(MOVIES_URL, parsedData, (data) => {
              console.log(`server create movie ${data.name} creado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/read/movies':
        crud.read(MOVIES_URL, (data) => {
          console.log('server read movies', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        });
        break;

        case '/update/movies':
          request.on('data', (chunk) => {
            chunks.push(chunk)
          })
          request.on('end', () => {
            let body = Buffer.concat(chunks)
            let parsedData = qs.parse(body.toString())
            crud.update(MOVIES_URL, action.id, parsedData, (data) => {
              console.log(`server update movie ${action.id} modificado`, data)
              responseData = data
  
              response.write(JSON.stringify(responseData));
              response.end();
            });
          })
          break;

      case '/filter/movies':
        crud.filter(MOVIES_URL, urlParams, (data) => {
          console.log('server filter movies', data)
          responseData = data

          response.write(JSON.stringify(responseData));
          response.end();
        })
        break;

        case '/delete/movies':
          crud.delete(MOVIES_URL, action.id, (data) => {
            console.log('server delete movie', action.id, data)
            responseData = data
  
            response.write(JSON.stringify(responseData));
            response.end();
          })
          break;

      default:
        console.log('no se encontro el endpoint');

        response.write(JSON.stringify('no se encontro el endpoint'));
        response.end();
        break;
    }
  })
  .listen(process.env.API_PORT, process.env.IP);

  console.log('Server running at http://' + process.env.IP + ':' + process.env.API_PORT + '/');