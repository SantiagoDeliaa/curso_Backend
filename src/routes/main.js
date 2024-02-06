/*import http from 'http'

//req = request = peticion
//res = response = respuesta
const app = http.createServer((req, res) => {
    res.end("Hola, este es mi primer servidor")
})

app.listen(8000, () => {
    console.log("Server on port 8000")
})*/

import express from 'express'

const app = express()
const PORT = 8000

app.get('/', (req, res) => {
    res.send("Hola, desde mi primer servidor en Express")
})

app.get('/despedida', (req, res) => {
    res.send("Adios, buenas noches!")
})

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})