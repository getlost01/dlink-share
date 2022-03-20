const express = require('express')
const path = require('path')
const app = express()

const port = process.env.PORT || 3000
app.use(express.static('public'))
app.use(express.json())

const connectdb=require('./config/db')
connectdb();

//Template engine
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')

//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))

app.listen(port, () => console.log(`Server is listening on port ${port}!`))