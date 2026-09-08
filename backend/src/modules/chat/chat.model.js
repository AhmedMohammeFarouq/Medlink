import mongoose from "mongoose";
import { chat_room_status } from "./chat.types.js";

const chatRoomSchema= mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"patient is required"],
        index:true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"doctor is required"],
        index:true
    },
    appointmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        default:null,
        index:true
    },

    status:{
        type:String,
        enum:Object.values(chat_room_status),
        default:chat_room_status.ACTIVE,
        index:true
    },
    expiresAt: {
        type: Date,
        default: null,
    },

},
{
    timestamps:true
});

chatRoomSchema.index({
    doctorId:1,patientId:1,appointmentId:1
},
{
    unique:true,
    partialFilterExpression:{
        status:chat_room_status.ACTIVE
    }
});


chatRoomSchema.methods.isActive=function(){
    if(this.status===chat_room_status.ACTIVE){
        return true;
    }
    return false;
};

chatRoomSchema.methods.hasParticipant=function(userId){
    if(!userId){
        return false;
    }
    if(this.patientId.equals(userId) || this.doctorId.equals(userId)){
        return true;
    }
    return false;
};


export default mongoose.model("ChatRoom",chatRoomSchema);
