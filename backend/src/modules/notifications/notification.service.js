import Notification from "./notification.model.js";
import { notification_socket_event, notification_status } from "./notification.types.js";




let server=null;

export const setServer=function (io){
    server=io;
};

class NotificationError extends Error{
    constructor(message,statusCode){
        super(message);
        this.name="NotificationError";
        this.statusCode=statusCode||400;
    }
}


function pushNotification(userId,notification){
    if(!notification){
        return ;
    }
    server.to(`user:${userId.toString()}`).emit(notification_socket_event.NEW_NOTIFICATION,notification);

};


export const createNotification=async({userId,type,title,body,metadata})=>{
    if(!userId||!title||!type){
        throw new NotificationError("create notification requires (userId,type,title)")
    }
        const notification=await Notification.create({
            userId,
            type,
            title,
            body:body||"",
            metadata:metadata||{}
        });

        pushNotification(userId,notification);
        return notification;

}

export const getNotificationForUser=async(userId,unreadOly="false")=>{
    const query={userId};
    if(unreadOly==true){
        query.notificationStatus=notification_status.UNREAD;
    }

    const notifications=await Notification.find(query).sort({createdAt:-1});
    return notifications
};


export const markAsRead=async(notificationId,userId)=>{
    const notification=await Notification.findById(notificationId);
    if(!notification){
        throw new NotificationError(" notification not found ",404);
    };

    if(notification.userId.toString()!=userId.toString()){
        throw new NotificationError("You cannot modify another user's notification",403);
    };

    notification.markAsRead();
    await notification.save();
    return notification;

};

export const markAllAsRead=async(userId)=>{
    const query={
        userId,
        notificationStatus:notification_status.UNREAD
    };


    const notifications=await Notification.updateMany(query,
        {$set:{notificationStatus:notification_status.READ,readAt: new Date()
    }});
    return notifications;
}
