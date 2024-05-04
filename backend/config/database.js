const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://aashukushwah53678:aQFWh3hTbPKlZMI5@ecommerce.mduns4t.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Ecommerce').then(() => {
        console.log(`Mongodb connected with server :${mongoose.connection.host}`);
    }); 
}

module.exports = connectDatabase;