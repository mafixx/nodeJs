const express = require('express')
const cors = require('cors')
const usuarios = require('./login')
const clientes = require('./clientes')
const app = express()


const port = process.env.PORT

app.use(express.urlencoded({extended: false}))
app.use(express.json()) 
app.use(cors())
app.use('/usuarios',usuarios)
app.use('/clientes', clientes)


app.listen(port, () => {console.log(`executando em http://localhost:9090`)})