import mongoose from "mongoose";
import { message_type } from "./chat.types.js";

const attachmentSchema=mongoose.Schema({
    url:{
        type:String,
        required:[true,"attachment url is required"]
    },
    fileName:{
        type:String,
        default:null
    },
    mimeType:{
        type:String,
        default:null
    },
    sizeInBytes:{
        type:Number,
        default:null
    }
},{_id:false});




const messageSchema=mongoose.Schema({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChatRoom",
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    messageType:{
        type:String,
        enum:Object.values(message_type),
        default:message_type.TEXT
    },
    content:{
        type:String,
        default:"",
        trim:true
    },
    attachments:{
        type:[attachmentSchema],
        default:[]
    },
    readAt:{
        type:Date,
        default:null
    }
},
{
    timestamps:{createdAt:true,updatedAt:false}
}
);


messageSchema.index({
    roomId:1,createdAt:1
});


messageSchema.methods.markAsRead=function(){
    if(!this.readAt){
    this.readAt=new Date();
    }
    return this;
};


export default mongoose.model("Message",messageSchema);
