const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log(`Mongodb connected with server :${mongoose.connection.host}`);
    });
}

module.exports = connectDatabase;