let jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();

const { request } = require('express');
const ENV = require('dotenv').config().parsed

function validarCredenciales(credenciales){
  return true
}

function estampillar(body){
  if(Object.keys(body).length != 3){
    return { "status": 500, "code": "Expected fields estatuto, numeroExpediente, credenciales" }
  }

  const decodedCredentials = jwt.decode(body.credenciales);
  if(!validarCredenciales(decodedCredentials)) {
    return { "status": 403, "code": "Forbidden"}
  }
  const token = jwt.sign(body, process.env.PRIVATE_KEY, { algorithm: 'HS256'})
  return { "status": 200, 'estampilla': token}
}

router.post('/estampillado', function(req, res, next) {
  /* 
    {
      "estatuto": PathEstatuto,
      "numeroExpediente": numExpediente,
      "credenciales": JWT_TOKEN 
    }
  */
  const response = estampillar(req.body) || {}
  res.json(response);
});

module.exports = router;

//Ejemplo 
//curl -X POST localhost:3000/estampillado -d '{"key": "value"}' -H  "Content-Type: application/json"
//curl -X POST https://floating-oasis-96990.herokuapp.com/estampillado -d '{"key": "value"}' -H  "Content-Type: application/json"


//curl -X POST https://floating-oasis-96990.herokuapp.com/estampillado -d '{"estatuto": "/home/Escritorio/", "numeroExpediente": 1, "credenciales": "JWDSA987-DSAd_AS"}' -H  "Content-Type: application/json"
//curl -X POST localhost:3000/estampillado -d '{"estatuto": "/home/Escritorio/", "numeroExpediente": 1, "credenciales": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9lc3RhbXBpbGxhZG8iOjEsInBhc3N3b3JkIjoiYWVheW9zb3lzYWJhbGVybyIsImlhdCI6MTUxNjIzOTAyMn0.-j_pFuANumQ-QRQrtMAqLeN1OSGyfREvxTzRhgIi5Ag"}' -H  "Content-Type: application/json"


//curl -X POST https://floating-oasis-96990.herokuapp.com/estampillado -d '{"estatuto": "/home/Escritorio/", "numeroExpediente": 1, "credenciales": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9lc3RhbXBpbGxhZG8iOjEsInBhc3N3b3JkIjoiYWVheW9zb3lzYWJhbGVybyIsImlhdCI6MTUxNjIzOTAyMn0.-j_pFuANumQ-QRQrtMAqLeN1OSGyfREvxTzRhgIi5Ag"}' -H  "Content-Type: application/json"
