import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet'; // eslint-disable-line
const dotenv = require('dotenv').config();// eslint-disable-line

const app = express();

app.use(helmet());

app.use(helmet.hidePoweredBy());

app.use(express.static(path.join(process.env.PWD, 'dist/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.env.PWD, 'dist/index.html'));
});

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res) => {
    res.status(404).send({url: `${req.originalUrl } not found`});
});


app.listen(port);

console.log(`Listening on port: ${ port}`);
