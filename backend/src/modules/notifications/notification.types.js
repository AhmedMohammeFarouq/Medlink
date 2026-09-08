

const notification_type=Object.freeze({
    APPOINTMENT_CREATED: "appointment_created",
    APPOINTMENT_UPDATED: "appointment_updated",
    APPOINTMENT_CANCELLED: "appointment_cancelled",
    APPOINTMENT_REMINDER: "appointment_reminder",

    NEW_MESSAGE: "new_message",

    PRESCRIPTION_CREATED: "prescription_created",

    CONSENT_UPDATED: "consent_updated",

    FOLLOW_UP_SCHEDULED: "follow_up_scheduled",
    FOLLOW_UP_DUE: "follow_up_due",
});

const notification_status=Object.freeze({
    UNREAD:"unread",
    READ:"read"
});

const notification_socket_event=Object.freeze({
    NEW_NOTIFICATION:"notification:new"
});

export {
    notification_socket_event,
    notification_status,
    notification_type
}
