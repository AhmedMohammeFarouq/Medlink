Audit

This folder contains the Audit functionality for the MEdLink project.

Purpose

The Audit system tracks important actions performed by users in the system.

It records:

- Who performed the action
- What action was performed
- Which entity was affected
- When the action occurred
- Previous and new data when applicable

Audited Actions

- Login / Logout
- Create
- Update
- Delete
- Approve / Reject
- Important data changes

Folder Structure

audit/
├── README.md
├── models/
├── controllers/
├── routes/
└── services/

Services

The Audit Service is responsible for creating and managing audit logs.

Other services or controllers can call the Audit Service whenever an important action occurs.

Notes

The Audit functionality is implemented using Services to keep the audit logic reusable and separated from the main business logic.
