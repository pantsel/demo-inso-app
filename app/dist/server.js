"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tracer_1 = require("./tracer");
(0, tracer_1.setupTracing)('example-express-server');
// Require in rest of modules
const express = require("express");
// import { default as axios } from 'axios';
// import { RequestHandler } from "express";
// Setup express
const app = express();
const PORT = 3030;
const makeResponse = (req) => {
    return {
        headers: req.headers,
        query: req.query,
        path: req.path,
        message: "Hello from echo server",
        body: req.body,
        method: req.method,
    };
};
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
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});
