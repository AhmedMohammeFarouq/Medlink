import * as notificationService from "./notification.service.js";


export const listMyNotifications=async(req,res)=>{
    try{
        const unreadOnly = req.query.unreadOnly === "true";
        const userId=req.user.id
        const notifications=await notificationService.getNotificationForUser(userId,unreadOnly);

        res.status(200).json({
            success:true,
            notifications
        })

    }catch(error){
        res.status(error.statusCode||500).json({
            success:false,
            message:error.message
        });
    }
}

export const markAsRead= async (req,res)=>{
    try{
        const notificationId=req.params.notificationId;
        const userId=req.user.id;
        const notification=await notificationService.markAsRead(notificationId,userId);
        res.status(200).json({
            success:true,
            data:notification
        });

    }catch(error){
        res.status(error.statusCode||500).json({
            success:false,
            message:error.message
        });
    }
};

export const markAllAsRead=async (req,res)=>{
    try{
        const userId=req.user.id;
        const notifications=await notificationService.markAllAsRead(userId);
        res.status(200).json({
            success:true,
            data:notifications
        })
    }catch(error){
        res.status(error.statusCode||500).json({
            success:false,
            message:error.message
        });
    }
}
