import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef,AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ChatMessage } from './chat';




@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
  providers: [SocketService ]
})
export class ChatBoxComponent implements OnInit {

@ViewChild('scrollMe',{static: false})ElementRef: 'scrollMe';

public scrollMe: ElementRef

  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public userList: any = [];
  public disconnectedSocket: boolean;
  public scrollToChatTop:boolean = false;
  messageText;
  messageList: any=[];
  public loadPreviousChat: boolean = false;
  pageValue: number = 0;
  data;


  constructor(
    private authService: AuthService,
    private socketService: SocketService,
    private router: Router,
    public toastr: ToastrService

  ) { 
    
 
  }


 
  ngOnInit() {
  
this.authToken = this.authService.authToken;
    
     this.userInfo = this.authService.user;
     this.receiverId = localStorage.getItem("receiverId");

     this.receiverName =  localStorage.getItem('receiverName');
 

if(this.receiverId!=null && this.receiverId!=undefined && this.receiverId!=''){
      this.userSelectedToChat(this.receiverId,this.receiverName)
    }

    this.chcekStatus();

      this.verifyUserConfirmation();
      this.getOnlineUserList();
      this.getMessageFromUser();
   
  }


  public chcekStatus: any = ()=>{
    if(localStorage.getItem('token')===undefined|| localStorage.getItem('token')===''||localStorage.getItem('token')===null){
     this.router.navigate(['/login']);
      return false;
    }else{
     return true;
    }
  }


  public verifyUserConfirmation: any = ()=>{
    this.socketService.verifyUser().subscribe((data)=>{
  
       
      this.disconnectedSocket = false;
      this.socketService.setUser(this.authToken);
    
    
    });

  }


  public getOnlineUserList :any =()=>{

    this.socketService.onlineUserList()
      .subscribe((userList) => {
        console.log(userList)
   

        this.userList = [];

        for (let x of userList) {
          console.log(x);

          let temp = { 'userId': x.userId, 'name': x.fullName, 'unread': 0, 'chatting': false };

          this.userList.push(temp);          

        }
        
        console.log(this.userList);

      }); // end online-user-list
  }


  public getPreviousChatWithAUser :any = ()=>{
    let previousData = (this.messageList.length > 0 ? this.messageList.slice() : []);
    
    this.socketService.getChat(this.userInfo.userId, this.receiverId, this.pageValue * 10)
    .subscribe((apiResponse) => {

    

      if (apiResponse.status == 200) {

        this.messageList = apiResponse.data.concat(previousData);

      } else {

        this.messageList = previousData;
        this.toastr.warning('No Messages available')

       

      }

      this.loadPreviousChat = false;

    }, (err) => {

      
      this.toastr.error('some error occured')

    });

  }


  public loadEarlierPageOfChat: any = () => {

    this.loadPreviousChat = true;

    this.pageValue++;
    this.scrollToChatTop = true;

    this.getPreviousChatWithAUser() 
  }
  
 public userSelectedToChat: any = (id,name)=>{
    this.userList.map((user)=>{
      if(user.userId == id){
        user.chatting = true;
      }else{
        user.chatting = false;
      }
    })

    localStorage.setItem('receiverId', id);
    localStorage.setItem('receiverName', name);
    this.receiverName = name;
    this.receiverId = id;
    this.messageList = [];
    this.pageValue = 0;
    let chatDetails = {
      userId : this.userInfo.userId,
      senderId :id
    }

    this.socketService.markChatAsSeen(chatDetails);
     this.getPreviousChatWithAUser();
  }


  public sendMessageUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.sendMessage();

    }

  }


  public sendMessage:any = ()=>{
    if(this.messageText){
      let chatMsgObject:ChatMessage = {
        senderName: this.userInfo.firstName + ''+ this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: localStorage.getItem('receiverName'),
        receiverId: localStorage.getItem('receiverId'),
        message: this.messageText,
        createdOn: new Date()
       }
    
       this.socketService.sendChatMessage(chatMsgObject)
       this.pushToChatWindow(chatMsgObject) 
    }
    else{
      this.toastr.warning('text message can not be empty')
    }
  }

  public pushToChatWindow : any =(data)=>{

    this.messageText="";
    this.messageList.push(data);
    this.scrollToChatTop = false;


  }


  
  public getMessageFromUser : any = ()=>{
    this.socketService.chatByUserId(this.userInfo.userId).subscribe((data)=>{
    console.log(data);
      (this.receiverId==data.senderId)?this.messageList.push(data):'';
      this.toastr.success(`${data.senderName} says: ${data.message}`)
      this.scrollToChatTop = false;
    });
  }

  public logout: any = ()=>{
    this.authToken = null;
    localStorage.clear();
    this.socketService.exitSocket();
    this.toastr.success('User loggedout succesfully');
    this.router.navigate(['/login']);
    
  }

  

public showUserName= (name:string)=>{
  this.toastr.success('yOU ARE CHATTING WITH '+ name);
}


}

  
  