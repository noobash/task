const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path : './config.env'});

process.on('uncaughtException',err => {
    console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN....");
    console.log(err.name,err.message);
    process.exit(1);
});

const app = require('./app');
const port = process.env.PORT;
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex:true,
    useFindAndModify:false,
}).then(con => {
    console.log("Successfully Connected!!!!");
});

const server = app.listen(port,()=>{
console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection',err =>{
    console.log("UNHANDLED REJECTION! SHUTTING DOWN....");
    console.log(err);
    server.close(()=>{
        process.exit(1);
    });  
});

