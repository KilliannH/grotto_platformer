let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static(__dirname+'/src'));

const port = process.env.PORT || '3000';

app.listen(port, () => {
    console.log(`Running on localhost:${port}...`);
});