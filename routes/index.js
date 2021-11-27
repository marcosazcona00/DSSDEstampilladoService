require('dotenv').config().parsed

let jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();

const fs = require('fs')
const { request } = require('express');
const axios = require('axios').default;

const tokensContent = () => {
  //Retorna el contenido del json
  let rawdata = fs.readFileSync('tokens/tokens.json');
  const tokensJSON = JSON.parse(rawdata)
  return tokensJSON  
}

async function generateRandomHash(){
  //Pide un hash random
  let response = await axios('https://random.justyy.workers.dev/api/random/?cached&n=128')
  return response.data
}

async function validarCredenciales(body){
  console.log(Object.keys(body))
  if(Object.keys(body).length != 1 || !Object.keys(body).includes("credenciales")){
    return {"status": 500, "code": "Wrong arguments"}
  }
  try {
    const decodedCredentials = jwt.decode(body.credenciales);
    console.log('Credenciales decodeadas ',decodedCredentials);
    if(Object.keys(decodedCredentials).length != 2 || !Object.keys(decodedCredentials).includes("username") || !Object.keys(decodedCredentials).includes("password")){
      return {"status": 500, "code": "Wrong arguments"} 
    }
    if(decodedCredentials.username != 'legales' && decodedCredentials.password != 'legales'){
      return {"status": 403, "code": "Forbidden"} 
    }
  
    const randomHash = await generateRandomHash()
    
    const username = decodedCredentials.username
    let data = {}
    data[username] = randomHash
  
    fs.writeFileSync('tokens/tokens.json', JSON.stringify(data));
    return {"status": 200, "token": randomHash  }
  }catch {
    return {"status": 501, "code": "Invalid Format"}
  }
}


function estampillar(body){
  if(Object.keys(body).length != 4){
    return { "status": 500, "code": "Expected fields estatuto, numeroExpediente, credenciales, username" }
  }

  console.log(body)
  const tokensJSON = tokensContent()
  console.log(tokensJSON)
  console.log(body)
  if(!tokensJSON[body.username] || (tokensJSON[body.username] && tokensJSON[body.username] != body.credenciales)){
    return {"status": 403, "code": "Forbidden invalid token"}
  }

  const token = jwt.sign({estatuto: body.estatuto, numeroExpediente: body.numeroExpediente, username: body.username}, process.env.PRIVATE_KEY, { algorithm: 'HS256'})
  

  const username = body.username
  let data = {}
  const hashQR = token.split('.')[2]
  const url = `http://localhost:8000/SA/${hashQR}`
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`
  // data[username] = ""
  // fs.writeFileSync('tokens/tokens.json', JSON.stringify(data));

  return { "status": 200, 'estampilla': token, 'qr': qr}
}


router.post('/token_estampillado',async function(req, res, next){
  const response = await validarCredenciales(req.body)
  res.json(response)
}) 

router.post('/estampillado', async function(req, res, next) {
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



//curl -X POST localhost:3000/estampillado -d '{"estatuto": "/home/Escritorio/", "numeroExpediente": 1, "username": "marcos", "token": "CWrpVX7hP)H?p~X}k7H?Be1jnLvne?ihJ~Vi]pvoG]CKv%u,KYY.%VnAscE3@hKZ/,!%eSd{jzT?xe.G8IX8Kc(Htak0T1/{lY@Z&h,c5yi@*b?cG?9!Ir&5j4#fnQs4"}' -H  "Content-Type: application/json"
//curl -X POST localhost:3000/token_estampillado -d '{"credenciales": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmNvcyIsInBhc3N3b3JkIjoiMTIzIn0.d0eKJDaKhg3c5bess7cgiN4O66vYMwYYbvdSWf-6PJY"}' -H  "Content-Type: application/json"
