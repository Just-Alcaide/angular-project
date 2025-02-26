import express from 'express';
import bodyParser from 'body-parser';
import {db} from "./server.mongodb.js";
import {Oauth2} from "./server.oauth.js";
import cors from 'cors';
import process from 'node:process';

const app = express();
const port = process.env.PORT;

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('src'));

//Require Auth//

function requireAuth (req, res, next) {
  if (req.headers.authorization === `Bearer ${Oauth2()}`) {
    next()
  } else {
    res.status(401).json({ error: 'No autorizado' });
  }
}

//===CRUFD USERS===//

app.post('/api/create/users', async (req, res) => {
  res.json(await db.users.create(req.body))
})

app.get('/api/read/users', async (req, res) => {
  res.json(await db.users.get())
})

app.post('/api/read/users', async (req, res) => {
  const {ids} = req.body;
  const users = await db.users.getByIds(ids);
  res.json(users);
})

app.put('/api/update/users/:id', async (req, res) => {
  res.json(await db.users.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/api/filter/users/:name', async (req, res) => {
  res.json(await db.users.get({ $text: { $search: req.params.name } }))
})

app.post('/api/validate/users', requireAuth, async (req, res) => {
  const user = await db.users.validate(req.body)
  if (user) {
    res.json({success: true})
  } else {
    res.status(401).json({success: false, message: 'Credenciales incorrectas'})
  }
})

app.delete('/api/delete/users/:id', requireAuth, async (req, res) => {
  res.json(await db.users.delete(req.params.id))
  //TODO: En adelante, tendrá que borrar datos del user en clubs, propuestas...
})

app.post('/api/login/users', async (req, res) => {
  const user = await db.users.validate(req.body)
  if (user) {
    user.token = Oauth2()
    res.json(user);
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
})


//===CRUFD CLUBS===//

app.post('/api/create/clubs', requireAuth, async (req, res) => {
  const {userId, ...clubData} = req.body
  const newClub = await db.clubs.create(clubData, userId);
  res.json(newClub)
})

//read all clubs
app.get('/api/read/clubs', async (req, res) => {
  res.json(await db.clubs.get())
})

//read clubs by id
app.get('/api/read/clubs/:id', async (req, res) => {
  res.json(await db.clubs.getById(req.params.id))
})

//read clubs by type
app.post('/api/read/clubs', async (req, res) => {
  const {type} = req.body;
  res.json(await db.clubs.getByType(type));
})

app.put('/api/update/clubs/:id', async (req, res) => {
  const clubId = req.params.id;
  const updates = req.body;

  const updatedClub = await db.clubs.update(clubId, updates);
  res.json(updatedClub);
})

app.put('/api/join/clubs/:id', async (req, res) => {
  const clubId = req.params.id
  const { userId, password } = req.body

  console.log("Recibido en Express:", { clubId, userId, password });


  if (!clubId || clubId.length !== 24 || !userId || userId.length !== 24) {
    return res.status(400).json({ success: false, message: "ID de club o usuario inválido" });
  }

  try {
    const updatedClub = await db.clubs.join(clubId, userId);
    console.log("Se unió correctamente:", updatedClub);
    res.json(updatedClub);
  } catch (error) {
    console.error("Error en joinClub:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
});

app.put('/api/leave/clubs/:id', async (req, res) => {
  const clubId = req.params.id
  const userId = req.body.userId

  const updatedClub = await db.clubs.leave(clubId, userId);
  res.json(updatedClub);
})

//TODO: MODIFICAR
app.get('/api/filter/clubs/:name', async (req, res) => {
  res.json(await db.clubs.getByName(req.params.name));
})

app.delete('/api/delete/clubs/:clubId/:userId', requireAuth, async (req, res) => {
  const {clubId, userId} = req.params;

  const result = await db.clubs.delete(clubId, userId);
  res.json(result);
});


//===CRUFD BOOKS===//

app.post('/api/create/books', async (req, res) => {
  res.json(await db.books.create(req.body))
})

app.get('/api/read/books', async (req, res) => {
  res.json(await db.books.get())
})

app.put('/api/update/books/:id', async (req, res) => {
  res.json(await db.books.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/api/filter/books/:name', async (req, res) => {
  res.json(await db.books.get({ $text: { $search: req.params.name } }))
})

app.delete('/api/delete/books/:id', async (req, res) => {
  res.json(await db.books.delete(req.params.id))
})


//===CRUFD MOVIES===//

app.post('/api/create/movies', async (req, res) => {
  res.json(await db.movies.create(req.body))
})

app.get('/api/read/movies', async (req, res) => {
  res.json(await db.movies.get())
})

app.put('/api/update/movies/:id', async (req, res) => {
  res.json(await db.movies.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/api/filter/movies/:name', async (req, res) => {
  res.json(await db.movies.get({ $text: { $search: req.params.name } }))
})

app.delete('/api/delete/movies/:id', async (req, res) => {
  res.json(await db.movies.delete(req.params.id))
})


//===CRUFD PROPOSALS===//

app.post('/api/create/proposals', async (req, res) => {
  res.json(await db.proposals.create(req.body))
})

app.get('/api/read/proposals', async (req, res) => {
  res.json(await db.proposals.get())
})

app.post('/api/read/proposals', async (req, res) => {
  const {ids} = req.body;
  const proposals = await db.proposals.getByIds(ids);
  res.json(proposals);
})

app.put('/api/update/proposals/:id', async (req, res) => {
  res.json(await db.proposals.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/api/filter/proposals/:name', async (req, res) => {
  res.json(await db.proposals.get({ $text: { $search: req.params.name } }))
})

app.delete('/api/delete/proposals/:id', async (req, res) => {
  res.json(await db.proposals.delete(req.params.id))
})


//===CRUFD VOTES===//

app.post('/api/create/votes', async (req, res) => {
  res.json(await db.votes.create(req.body))
})

app.get('/api/read/votes', async (req, res) => {
  res.json(await db.votes.get())
})

app.put('/api/update/votes/:id', async (req, res) => {
  res.json(await db.votes.update(req.params.id, req.body))
})

//TODO: MODIFICAR
app.get('/api/filter/votes/:name', async (req, res) => {
  res.json(await db.votes.get({ $text: { $search: req.params.name } }))
})

app.delete('/api/delete/votes/:id', async (req, res) => {
  res.json(await db.votes.delete(req.params.id))
})


//===LISTEN PORT===//

app.listen(port, async () => {
  const users = await db.users.count();
  const clubs = await db.clubs.count();
  console.log(`Sophia Social listening on port ${port}: ${users} users and ${clubs} clubs`);
})
