const express = require('express')
const path = require('path')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 3000
app.use(express.static('public'))
app.use(express.json())

const connectdb=require('./config/db')
connectdb();
//Cors
const corsOpt={
    origin: ['http://localhost:3000',"http://127.0.0.1:3000","https://link-share-app.netlify.app"]
}

app.listen(port, () => console.log(`Server is listening on port ${port}!`))

app.use(cors(corsOpt))
//Template engine
app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')

//Routes
app.use('/api/files',require('./routes/files'))
app.use('/files',require('./routes/show'))
app.use('/files/download',require('./routes/download'))
app.get('*', (req, res)=>{
    res.send({'404': "Page not found!"});
});
