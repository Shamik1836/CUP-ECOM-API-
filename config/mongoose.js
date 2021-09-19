//This is the basic str5ucture of the config file for mongoDB which woyuuld re,main the same no matter however complex the process or app is

const mongoose=require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db=mongoose.connection;//it's the conncetion instance
db.on('error',console.error.bind(console,"Error connecting to database"));//on will run forever as long as our database is on
db.once('open',()=>{
    console.log("ConneCted to dB");
})//this means that the database instance named db is connceted that's why we are getting

module.exports=db;