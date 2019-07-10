

const socket = require('socket.io');
const mongoose = require('mongoose');
const controllers = require('../controllers/app');
const shortID= require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const Chat = mongoose.model('Chat')

let setServer = (server)=>{
    let userList = []
    let io = socket.listen(server);

    io.on('connection',(socket)=>{
        console.log('on connection verifying user');
        socket.emit('verifyUser', '');


        socket.on('set-user',(authToken)=>{
            console.log('set-user called');
            controllers.verifyToken(authToken, (err,decoded)=>{
                if(err){
                    socket.emit('auth-error',{status:500, error:'Please provide a  valid token'})
                }else{
                    console.log('user is verified...setting details');
                    let currentUser =decoded.user;
                    socket.userId = currentUser.userId;
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                   
                    
          let userObj= {userId: currentUser.userId, fullName: fullName}
          userList.push(userObj)
          
          socket.emit('online-user-list', userList);
        
        //  socket.room ="Chat"
        //  socket.join(socket.room)
        //  socket.to(socket.room).broadcast.emit('online-user-list',userList);
                }
            })
           
        })

    

        socket.on('disconnect', ()=>{
            console.log('User is disconnected');
            console.log(socket.userId);

            var removeIndex = userList.map(function(user){
                return user.userId;
            }).indexOf(socket.userId);

            userList.splice(removeIndex,1);
            console.log(userList)

        });


    socket.emit('userId', socket.userId);




        socket.on('chat-msg',(data)=>{
            console.log('socket chat-msg called');
            
            data['chatId']= shortID.generate();
            console.log(data);

            setTimeout(function(){
                eventEmitter.emit('save-chat', data);
            }, 2000)
            io.emit(data.receiverId, data)
        });

    socket.on('typing', (fullName)=>{
        socket.emit('typing', fullName);
    });

    })

}



eventEmitter.on('save-chat',(data)=>{
    let newChat = new Chat({

        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn

    });
    newChat.save((err,result) => {
        if(err){
            console.log(`error occurred: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("Chat Is Not Saved.");
        }
        else {
            console.log("Chat Saved.");
            console.log(result);
        }
    });

}); 

module.exports = {
    setServer: setServer
}