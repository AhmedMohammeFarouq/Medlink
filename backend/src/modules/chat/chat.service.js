import Message from "./message.model.js";
import ChatRoom from "./chat.model.js";
import { chat_room_status } from "./chat.types.js";
import * as notificationService from "../notifications/notification.service.js";
import { notification_type } from "../notifications/notification.types.js";






class ChatError extends Error{
    constructor(message,statusCode){    
        super(message);
        this.name="ChatError";
        this.statusCode=statusCode||400;
}
}


function assertParticipant(room,userId){
    if(!room){
        throw new ChatError("chat room not found",404);
    }
    if(!room.hasParticipant(userId)){
        throw new ChatError("user is not a participant in this room",403);
    }

}



async function findOrCreateChatRoom({doctorId,patientId,appointmentId,expiresAt}){
    if(!doctorId||!patientId){
        throw new ChatError("patient and doctor are required",400)
    }

    const existingRoom=await ChatRoom.findOne({
        doctorId,
        patientId,
        appointmentId:appointmentId||null,
        status:chat_room_status.ACTIVE
    });


    if(existingRoom){
        return existingRoom
    }

    const room = await ChatRoom.create({
        doctorId,
        patientId,
        appointmentId:appointmentId||null,
        expiresAt: expiresAt || null,
        status:chat_room_status.ACTIVE
    });

    return room ;

}


async function getAllRoomsForUser(userId){
    const rooms = await ChatRoom.find(
        {
            $or:[{doctorId:userId},{patientId:userId}]
        }
    ).sort({
        updatedAt:-1
    })

    return rooms 
}


async function getRoomByIdForUser(roomId,userId){
    const room = await ChatRoom.findById(roomId);
    assertParticipant(room,userId);
    return room;

}



async function closeRoom(roomId,userId){
    const room = await getRoomByIdForUser(roomId,userId);
    room.status=chat_room_status.CLOSED;
    await room.save();
    return room;
}

async function getMessages(roomId,userId){
    await getRoomByIdForUser(roomId,userId);
    const messages = await Message.find({roomId});
    return messages;
}




async function sendMessage({roomId,senderId,messageType,content,attachments}){
    const room =await ChatRoom.findById(roomId);
    assertParticipant(room,senderId);

    if(room.status!==chat_room_status.ACTIVE){
        throw new ChatError("room is closed or expired",400);
    }

    const trimmedContent= (content||"").trim();
    const hasAttachments=Array.isArray(attachments)&&attachments.length>0;
    if(!trimmedContent&&!hasAttachments){
        throw new ChatError("the message needs text content or at least one attachment",400)
    }


    const message=await Message.create({
        roomId:room._id,
        senderId,
        messageType,
        content:trimmedContent,
        attachments: hasAttachments? attachments:[]
    });
    const recipientId= room.patientId.equals(senderId)? room.doctorId:room.patientId;

    try {
    await notificationService.createNotification({
        userId: recipientId,
        type: notification_type.NEW_MESSAGE,
        title: "New message",
        body: trimmedContent || "You received an attachment.",
        metadata: { roomId: room._id.toString(), messageId: message._id.toString() },
    });
    } catch (notificationError) {
    console.error("Failed to create new-message notification:", notificationError.message);
    }

    return message;


};


async function markMessagesAsRead(roomId,userId){
    const room=await getRoomByIdForUser(roomId,userId);
    const unreadMessages=await Message.find({
        roomId:room._id,
        senderId:{$ne:userId},
        readAt:null,
    }).select("_id");

    if(unreadMessages.length===0){
        return [];
    }

    const unreadMessagesIds=unreadMessages.map((m)=>m._id)

    await Message.updateMany(
        {_id:{$in:unreadMessagesIds}},
        {$set:{readAt:new Date()}}
    );

    return unreadMessagesIds
}


export {
    findOrCreateChatRoom,
    getAllRoomsForUser,
    getRoomByIdForUser,
    closeRoom,
    getMessages,
    sendMessage,
    markMessagesAsRead
}
