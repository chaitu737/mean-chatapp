import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';



@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url ="http://localhost:3000";
  private socket;

  constructor(
    public http: HttpClient
  ) { this.socket= io(this.url); }





 



public verifyUser = ()=>{
 return Observable.create((observer)=>{
   this.socket.on('verifyUser',(data)=>{
     observer.next(data);
   });
 })
}
public setUser = (authToken)=>{
  this.socket.emit('set-user', authToken);
}

public markChatAsSeen = (userDetails)=>{
  this.socket.emit('mark-chat-as-seen', userDetails);
}



public onlineUserList = ()=>{
  return Observable.create((observer)=>{
    this.socket.on('online-user-list',(userList)=>{
   observer.next(userList);
    })
  });
}



public disconnectedSocket = ()=>{
  return Observable.create((observer)=>{
  this.socket.on('disconnect',()=>{
    observer.next();
  });
  });
}



public chatByUserId = (userId)=>{
  return Observable.create((observer)=>{
    this.socket.on(userId, (data)=>{
   observer.next(data);
    });
  });
}




public sendChatMessage=(chatMsgObject)=>{
  this.socket.emit('chat-msg', chatMsgObject);
}


public exitSocket = ()=>{
  this.socket.disconnect();
}


public getChat(senderId,receiverId, skip):Observable<any>{
  return this.http.get(`${this.url}/chats/chat?senderId=${senderId}&skip=${skip}&receiverId=${receiverId}`).do(data=>console.log('Data received')).catch(this.handleError); 
}


private handleError(err: HttpErrorResponse){
  let errorMessage = '';
  if(err.error instanceof Error){
    errorMessage = `An error occured: ${err.error.message}`;
    }else{
      errorMessage = `Server returned code : ${err.status}, error message is : ${err.message}`
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
}
}