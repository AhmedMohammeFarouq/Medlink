import mongoose from "mongoose";
import { notification_type, notification_status } from "./notification.types.js";

const notificationSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user id is required"],
        index:true
    },
    type:{
        type:String,
        enum:Object.values(notification_type),
        required:[true,"notification type is required"],
        index:true
    },
    title:{
        type:String,
        required:[true,"title is required"],
        trim:true
    },
    body:{
        type:String,
        default:"",
        trim:true
    },
    metadata:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },
    notificationStatus:{
        type:String,
        enum:Object.values(notification_status),
        default:notification_status.UNREAD,
        index:true
    },
    readAt:{
        type:Date,
        default:null
    }
},{
    timestamps:{createdAt:true,updatedAt:false}
});


notificationSchema.index({userId:1,notificationStatus:1,createdAt:-1});

notificationSchema.methods.markAsRead=function(){
    if(this.notificationStatus!==notification_status.READ){
        this.notificationStatus=notification_status.READ;
        this.readAt=new Date();
    }
    return this;
}

export default mongoose.model("Notification",notificationSchema);
