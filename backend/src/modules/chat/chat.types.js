const chat_room_status=Object.freeze({
    ACTIVE:"active",
    CLOSED:"closed",
    EXPIRED:"expired"
});


const message_type=Object.freeze({
    TEXT:"text",
    IMAGE:"image",
    FILE:"file",
    SYSTEM:"system"
});

const chat_socket_event=Object.freeze({
     // client
    JOIN_ROOM: "chat:joinRoom",
    LEAVE_ROOM: "chat:leaveRoom",
    SEND_MESSAGE: "chat:sendMessage",
    TYPING_START: "chat:typingStart",
    TYPING_STOP: "chat:typingStop",
    MARK_READ: "chat:markRead",

     // server
    NEW_MESSAGE: "chat:newMessage",
    MESSAGE_READ: "chat:messageRead",
    USER_TYPING: "chat:userTyping",
    USER_STOPPED_TYPING: "chat:userStoppedTyping",
    USER_ONLINE: "chat:userOnline",
    USER_OFFLINE: "chat:userOffline",
    ROOM_JOINED: "chat:roomJoined",
    ROOM_CLOSED: "chat:roomClosed",
    ERROR: "chat:error",
})

export { chat_room_status, message_type, chat_socket_event };
