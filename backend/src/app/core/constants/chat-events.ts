// These strings must stay identical to backend/src/modules/chat/chat.types.js
// (chat_socket_event). If the backend renames an event, this file has to
// change too, or the socket messages will silently stop matching.
export const CHAT_SOCKET_EVENTS = {
  // client -> server
  JOIN_ROOM: 'chat:joinRoom',
  LEAVE_ROOM: 'chat:leaveRoom',
  SEND_MESSAGE: 'chat:sendMessage',
  TYPING_START: 'chat:typingStart',
  TYPING_STOP: 'chat:typingStop',
  MARK_READ: 'chat:markRead',

  // server -> client
  NEW_MESSAGE: 'chat:newMessage',
  MESSAGE_READ: 'chat:messageRead',
  USER_TYPING: 'chat:userTyping',
  USER_STOPPED_TYPING: 'chat:userStoppedTyping',
  USER_ONLINE: 'chat:userOnline',
  USER_OFFLINE: 'chat:userOffline',
  ROOM_JOINED: 'chat:roomJoined',
  ROOM_CLOSED: 'chat:roomClosed',
  ERROR: 'chat:error',
} as const;
