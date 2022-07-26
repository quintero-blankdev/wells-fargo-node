import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

const app = express();



// Oauth2 Code

const id = Buffer.from('rLb5ZiM1GM31BSAGG9uQFpDs5RMql0xE:AIolAuwdqHRl9q6p').toString('base64');
console.log(id)

const params = new URLSearchParams()
params.append('grant_type', 'client_credentials')

const url = 'https://api-sandbox.wellsfargo.com/oauth2/v1/token' 

async function createServer() {
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${id}`},
        body: params
    });
    const data = await response.json();

    console.log(data)
}

app.get('/', function (req, res) {
    createServer()
    res.send('Hello World!');
});
app.listen(3000, function () {
    createServer()
    console.log('Example app listening on port 3000!');
});

// var options = {
//   'method': 'POST',
//   'hostname': 'api-sandbox.wellsfargo.com',
//   'path': [
//     'oauth2',
//     'v1',
//     'token'
//   ],
//   'headers': {
//      'Authorization': `Basic ${id}`,
//      'Content-Type': 'application/json'
//   }
// };

// var req = http.request(options, function (res) {
//   var chunks = [];

//   res.on('data', function (chunk) {
//     chunks.push(chunk);
//   });

//   res.on('end', function () {
//     var body = Buffer.concat(chunks);
//     console.log(body.toString());
//   });
// });

// req.write(qs.stringify({ grant_type: 'client_credentials',
//   scope: '{space-delimited scopes}',
//   undefined: undefined }));
// req.end();

