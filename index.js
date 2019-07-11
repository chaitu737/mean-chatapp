const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require('body-parser');
const  authentication = require('./routes/authentication')(router);
const config = require('./config/database');
const cors = require('cors');
const User = require('./models/user');
const Chat = require('./models/chat');

mongoose.connect(config.uri,(err)=>{
    if(err){
        console.log('Could not connect to database: ', err);
    }
    console.log('Connected to '+ config.db);
});


var app = express();
var port = 3000;
const controllers= require('./controllers/app');
const scoketLib = require('./libs/socketlib');





const chats = require('./routes/chat')(router);




app.all('*', (req, res, next) => {
    res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
      res.append('Access-Control-Allow-Credentials', true);
      next();
    });
app.use(bodyParser.json());
app.use (cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/authentication', authentication);
app.use('/chats', chats);
app.get('/',(req,res)=>{
    res.send('Project is ready')
});



  const  server = app.listen(port,()=>{
    console.log('listening');
});

const socketServer = scoketLib.setServer(server);




