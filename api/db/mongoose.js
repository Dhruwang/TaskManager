//This file will handle connection logic to the mongo db database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TaskManager',{useNewUrlParser:true},{useCreateIndex:true},{useFindAndMondify:true}).then(()=>{
    console.log("connected to MongoDB");
}).catch((e)=>{
    console.log("Error while connecting to MongoDB");
    console.log(e);
});

//To prevent deprectation warnings (from MongoDB nagtive drivers)
// mongoose.set('useCreateIndex',true);
// mongoose.set('useFindAndMondify',true);

module.export = {
   mongoose 
};