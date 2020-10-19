const mongoose = require('mongoose');


function connection() {
    try{
        mongoose.connect('mongodb://localhost:27017/clo', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Database Conected")
    }
    catch(error){
        console.log("error")
        console.log(error)
        process.exit(1)
    }
}
module.exports = connection;