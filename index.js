require('dotenv').config()
var path = require('path');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const Connecter = require('./config/db')
const Route = require('./Route')
const PORT = process.env.PORT || 5000
Connecter.connectDB()

app.use(cors())
app.use(bodyParser())
app.use(express.json())
app.use(express.urlencoded({
    extended:true,
    limit: '30mb'
}))
app.use(express.static(path.join(__dirname, 'public')));
Route(app)
app.listen(PORT,() => {
    console.log('Server is running')
})
