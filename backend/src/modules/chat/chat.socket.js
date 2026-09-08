import * as chatService from "./chat.service.js";
import { chat_socket_event } from "./chat.types.js";
import { verifyAccessToken } from "../../utils/token.utils.js";


const onlineUserBySocket=new Map();

function markUserOnline(io,userId,socketId){
    const existingSockets=onlineUserBySocket.get(userId);
    if(existingSockets){
        existingSockets.add(socketId)
    }else{
        onlineUserBySocket.set(userId,new Set([socketId]));
        io.emit(chat_socket_event.USER_ONLINE,{userId});
    }
}

function markUserOffline(io,userId,socketId){
    const existingSockets=onlineUserBySocket.get(userId);
    if(!existingSockets){
        return;
    }
    existingSockets.delete(socketId);
    if(existingSockets.size==0){
        onlineUserBySocket.delete(userId);
        io.emit(chat_socket_event.USER_OFFLINE,{userId});

    }
};


export const registerChatSocket=(io)=>{

    io.use((socket,next)=>{
        const token=socket.handshake.auth? socket.handshake.auth.token:null;
        if(!token){
            next(new Error("token not found"));
            return;
        }

        try{
            const user= verifyAccessToken(token);
            socket.data.user=user;
            next()
        }catch(error){
            next(new Error("invalid or expired token"))
        }
        
    });



    io.on("connection",(socket)=>{
        const user=socket.data.user;

        socket.join(`user:${user.id}`);
        markUserOnline(io,user.id,socket.id);

        socket.on(chat_socket_event.JOIN_ROOM,async({roomId})=>{
            try{
                const room = await chatService.getRoomByIdForUser(roomId,user.id);
                socket.join(`chatRoom:${room._id}`);
                socket.emit(chat_socket_event.ROOM_JOINED,{roomId:room._id});

            }catch(error){
                socket.emit(chat_socket_event.ERROR, { message: error.message });
            }
        })

        socket.on(chat_socket_event.LEAVE_ROOM,({roomId})=>{
            if(roomId){
                socket.leave(`chatRoom:${roomId}`)
            }
        })


        socket.on(chat_socket_event.SEND_MESSAGE,async({roomId,senderId,content,messageType,attachments})=>{

            try{
                const message = await chatService.sendMessage({
                    roomId,
                    senderId:user.id,
                    content,
                    messageType,
                    attachments
                })

                io.to(`chatRoom:${roomId}`).emit(chat_socket_event.NEW_MESSAGE,message)
            }catch(error){
                socket.emit(chat_socket_event.ERROR,{message:error.message})
            }
        })

        socket.on(chat_socket_event.TYPING_START,({roomId})=>{
            if(!roomId){
                return;
            }
            socket.to(`chatRoom:${roomId}`).emit(chat_socket_event.USER_TYPING,{roomId  ,userId:user.id});
        });


        socket.on(chat_socket_event.TYPING_STOP,({roomId})=>{
            if(!roomId){
                return;
            }
            socket.to(`chatRoom:${roomId}`).emit(chat_socket_event.USER_STOPPED_TYPING,{roomId,userId:user.id})
        });


        socket.on(chat_socket_event.MARK_READ,async({roomId})=>{

            try{
                const updatedMessages=await chatService.markMessagesAsRead(roomId,user.id);
                if(updatedMessages.length>0){
                    io.to(`chatRoom:${roomId}`).emit(chat_socket_event.MESSAGE_READ,{
                        roomId,
                        messageIds:updatedMessages,
                        readBy:user.id
                    })
                }
            }catch(error){
            socket.emit(chat_socket_event.ERROR, { message: error.message });

            }
        });

        socket.on("disconnect", () => {
        markUserOffline(io, user.id, socket.id);
    });


    });


}
