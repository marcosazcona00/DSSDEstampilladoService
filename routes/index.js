var express = require('express');
var router = express.Router();

function estampillar(body){}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/estampillado', function(req, res, next) {
  res.json({'hola': 2});
});

router.post('/estampillado', function(req, res, next) {
  console.log(req.body)

  let estampilla = estampillar(req.body) || {}

  res.json({'estampilla': estampilla});
});

module.exports = router;


//Ejemplo 
//curl -X POST localhost:3000/estampillado -d '{"key": "value"}' -H  "Content-Type: application/json"

