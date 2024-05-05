const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const VinRoute = require('./routes/Vin.js');
const ClientRoute = require('./routes/Client.js');
const CommandeRoute = require('./routes/Commande.js');
const ProductionRoute = require('./routes/Production.js');
const EnregistrerRoute = require('./routes/Enregistrer.js');
const UserRoute = require('./routes/Utilisateur.js');
const cors = require('cors');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
app.use(cors());

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.use('/vin',VinRoute)
app.use('/client',ClientRoute)
app.use('/commande',CommandeRoute)
app.use('/production', ProductionRoute);
app.use('/enregistrer', EnregistrerRoute);
app.use('/user', UserRoute);




/*import React from 'react'

export default function Sidebar({  children }) {
  return (
    <aside className="h-screen">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm">
            <div className="p-4 pb-2 flex justify-between items-center">
                <img src="" alt="" className='w-32'/>
                <button className="p-1 5 rounded-lg bg-gray-50 hover:bg-gray-100">
                    
                </button>
            </div>
            <ul className="flex-1 px-3">{ children }</ul>

            <div className="border-t flex p-3">
                <img src="" alt="" className="w-10 h-10 rounded-md" />
            </div>
            <div className="flex justify-between items-center w-52 ml-3"></div>
        </nav>
    </aside>
  )
}
*/