import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";
import patientRouter from "../modules/patients/patient.routes.js"
import medicalRecordRouter from "../modules/medical-records/medicalRecord.routes.js"
import encounterRouter from "../modules/encounters/encounter.routes.js"

const router = Router();

router.use("/v1/auth", authRouter);
router.use("/v1/users", userRoutes);
router.use("/v1/medical-records", medicalRecordRouter);
router.use("/v1/patients", patientRouter);
router.use("/v1/encounters", encounterRouter);


export default router;
