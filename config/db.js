const mongoose =require('mongoose');
require('dotenv').config();
function connectdb(){
    mongoose.connect("mongodb+srv://getlost01:yVe7jIn5R5eMMGjH@cluster0.auyyt.mongodb.net/linkshare?retryWrites=true&w=majority", {useNewUrlParser: true ,useUnifiedTopology: true});
    const connection=mongoose.connection;
    try{
        connection.once('open',()=>{
        console.log('Database connected.')
    })
    }
    catch(e){
        console.log("Connection Fails.")
    }
}

module.exports = connectdb;
