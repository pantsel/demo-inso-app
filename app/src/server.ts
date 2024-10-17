import { setupTracing } from './tracer'

setupTracing(process.env.SERVICE_NAME || 'otel-echo-server');

// Require in rest of modules
import * as express from 'express';
// import { default as axios } from 'axios';
// import { RequestHandler } from "express";

// Setup express
const app = express();
const PORT = 3030;

const makeResponse = (req: express.Request) => {
  return {
    headers: req.headers,
    query: req.query,
    path: req.path,
    message: "Hello from echo server",
    body: req.body,
    method: req.method,
  }
}

// const getCrudController = () => {
//   const router = express.Router();
//   router.all('/', (req, res) => {
//     return res.status(200).send(makeResponse(req));
//   });
//   return router;
// };

// const authMiddleware: RequestHandler = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (authorization && authorization.includes('secret_token')) {
//     next();
//   } else {
//     res.sendStatus(401);
//   }
// };

app.use(express.json());
app.all('/*', (req, res) => {
  res.send(makeResponse(req));
});
// app.get('/health', (req, res) => res.status(200).send("HEALTHY")); // endpoint that is called by framework/cluster
// app.get('/run_test', async (req, res) => {
//   // Calls another endpoint of the same API, somewhat mimicking an external API call
//   const createdCat = await axios.post(`http://localhost:${PORT}/cats`, {
//     name: 'Tom',
//     friends: [
//       'Jerry',
//     ],
//   }, {
//     headers: {
//       Authorization: 'secret_token',
//     },
//   });

//   return res.status(201).send(createdCat.data);
// });
// app.use('/cats', authMiddleware, getCrudController());

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${PORT}`);
});