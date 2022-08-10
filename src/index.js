const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const express = require("express");
const app = express();
const cors = require('cors')

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())

const url = process.env.URL || "localhost";
const port = process.env.PORT || 3000;

const colors = require("colors");

const modelRouter = require('./routes/model.routes');
const authRouter = require('./routes/auth.routes');
const intentsRouter = require('./routes/intent.routes');

app.use('/', modelRouter);
app.use('/api', authRouter);
app.use('/api', intentsRouter);

app.get("/", (req, res) => {
	res.send("[AMUP] - Artifical Machine Understanding Plataform - API");
});

app.listen(port, () => {
	console.log(`${'[AMUP]'.yellow} Server is running on http://${url}:${port}`);
});
