var jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

 
 

function estampillar(body){
  var decoded = jwt.decode(body.credenciales);
  console.log(decoded)

  return body
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/estampillado', function(req, res, next) {
  res.json({'hola': 2});
});

router.post('/estampillado', function(req, res, next) {
  /* 
    {
      "estatuto": PathEstatuto,
      "numeroExpediente": numExpediente,
      "credenciales": JWT_TOKEN 
    }
  */
  console.log(req.body)

  let estampilla = estampillar(req.body) || {}

  res.json({'estampilla': estampilla});
});

module.exports = router;


//Ejemplo 
//curl -X POST localhost:3000/estampillado -d '{"key": "value"}' -H  "Content-Type: application/json"
//curl -X POST https://floating-oasis-96990.herokuapp.com/estampillado -d '{"key": "value"}' -H  "Content-Type: application/json"


//curl -X POST https://floating-oasis-96990.herokuapp.com/estampillado -d '{"estatuto": "/home/Escritorio/", "numeroExpediente": 1, "credenciales": "JWDSA987-DSAd_AS"}' -H  "Content-Type: application/json"
//curl -X POST localhost:3000/estampillado -d '{"estatuto": "/home/Escritorio/", "numeroExpediente": 1, "credenciales": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9lc3RhbXBpbGxhZG8iOjEsInBhc3N3b3JkIjoiYWVheW9zb3lzYWJhbGVybyIsImlhdCI6MTUxNjIzOTAyMn0.-j_pFuANumQ-QRQrtMAqLeN1OSGyfREvxTzRhgIi5Ag"}' -H  "Content-Type: application/json"
