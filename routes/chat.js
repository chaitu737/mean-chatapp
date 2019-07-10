const express = require('express');
const router = express.Router();
const authentication = require('../routes/authentication');
const response = require('../libs/responselib');

const check = require('../libs/checklib');
const mongoose = require('mongoose');

const ChatModel = mongoose.model('Chat');


module.exports = (router)=>{

    router.get('/chat',(req,res)=>{
     
        let validateParams = () => {
            return new Promise((resolve, reject) => {
              if (check.isEmpty(req.query.senderId) || check.isEmpty(req.query.receiverId)) {
                
                let apiResponse = response.generate(true, 'parameters missing.', 403, null)
                reject(apiResponse)
              } else {
                resolve()
              }
            })
          } // end of the validateParams function.
        
          //function to get chats.
          let findChats = () => {
            return new Promise((resolve, reject) => {
              // creating find query.
              let findQuery = {
                $or: [
                  {
                    $and: [
                      {senderId: req.query.senderId},
                      {receiverId: req.query.receiverId}
                    ]
                  },
                  {
                    $and: [
                      {receiverId: req.query.senderId},
                      {senderId: req.query.receiverId}
                    ]
                  }
                ]
              }
            
              ChatModel.find(findQuery)
                .select('-_id -__v -chatRoom')
                .sort('-createdOn')
                .skip(parseInt(req.query.skip) || 0)
                .lean()
                .limit(10)
                .exec((err, result) => {
                  if (err) {
                    console.log(err)
                
                    let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                    reject(apiResponse)
                  } else if (check.isEmpty(result)) {
        
                    let apiResponse = response.generate(true, 'No Chat Found', 404, null)
                    reject(apiResponse)
                  } else {
                    console.log('chat found and listed.')
        
                    // reversing array.
                    let reverseResult = result.reverse()
        
                    resolve(result)
                  }
                })
        })
            } // end of the findChats function.
        
        
          validateParams()
            .then(findChats)
            .then((result) => {
              let apiResponse = response.generate(false, 'All Chats Listed', 200, result)
              res.send(apiResponse)
            })
            .catch((error) => {
              res.send(error)
            }) 

            });


    return router;
}