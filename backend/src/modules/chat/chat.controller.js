import * as chatService from "./chat.service.js";


export const createOrGetRoom=async (req,res)=>{
    try{
        const{patientId, doctorId, appointmentId, expiresAt }=req.body;

        const userId=req.user.id.toString();
        if(userId!==String(patientId)&&userId!==String(doctorId)){
            return res.status(400).json({
                success:false,
                message:"You can only create a chat room you are a participant of"
            })
        };

        const room = await chatService.findOrCreateChatRoom(
            {
                patientId,
                doctorId, 
                appointmentId, 
                expiresAt
            });
            return res.status(200).json({ success: true, data: room });
    }catch(error){
        if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
        console.error("createOrGetRoom failed:", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
    }
}


export const listMyRooms=async (req,res)=>{
    try{
        const rooms=await chatService.getAllRoomsForUser(req.user.id);
        return res.status(200).json({ success: true, data: rooms });

    }catch(error){
    console.error("listMyRooms failed:", error.message);
    return res.status(500).json({ success: false, message: "Something went wrong." });
    }
};

export const getRoom=async (req,res)=>{
    try{
        const room=await chatService.getRoomByIdForUser(req.params.roomId,req.user.id);
        return res.status(200).json({ success: true, data: room });
    }catch(error){
if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
        console.error("getRoom failed:", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
    }
};

export const closeRoom=async (req, res) => {
    try {
    const room = await chatService.closeRoom(req.params.roomId, req.user.id);
    return res.status(200).json({ success: true, data: room });
    } catch (error) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
        console.error("closeRoom failed:", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
    }
};

export const getMessages=async (req, res) => {
    try {

    const messages = await chatService.getMessages(req.params.roomId, req.user.id);

    return res.status(200).json({ success: true, data: messages });
    } catch (error) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
        console.error("getMessages failed:", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
    }
};



export const sendMessage= async (req,res)=>{
    try{
        const {content ,messageType,attachments}=req.body;
        const message=await chatService.sendMessage({
            roomId:req.params.roomId,
            senderId:req.user.id,
            content ,
            messageType,
            attachments
        });
        res.status(201).json({success:true,data:message})
    }catch(error){
        if(error.statusCode){
            res.status(error.statusCode).json({success:false,message:error.message});
        }else{
            console.error("sendMessage failed:", error.message);
            return res.status(500).json({ success: false, message: "Something went wrong." });
        }
    }
};

export const markAsRead=async (req, res) => {
    try {
    const updatedMessageIds = await chatService.markMessagesAsRead(req.params.roomId, req.user.id);
    return res.status(200).json({ success: true, data: { updatedMessageIds } });
    } catch (error) {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
    } else {
        console.error("markAsRead failed:", error.message);
        return res.status(500).json({ success: false, message: "Something went wrong." });
    }
    }
};
