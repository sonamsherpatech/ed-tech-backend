import express from "express";
import cors from "cors";
const app = express();

import authRoute from "./routes/globals/auth/auth-route";
import instituteRoute from "./routes/institute/institute-route";
import courseInstituteRoute from "./routes/institute/course/course-route";
import studentInstituteRoute from "./routes/institute/student/student-route";
import categoryInstituteRoute from "./routes/institute/category/category-route";
import teacherInstituteRoute from "./routes/institute/teacher/teacher-route";
import teacherRoute from "./routes/teacher/teacher-route";

app.use(express.json());

//CORS CONFIG
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

//AUTH ROUTE
app.use("/api/auth", authRoute);

//INSTITUTE ROUTE
app.use("/api/institute", instituteRoute);
app.use("/api/institute/course", courseInstituteRoute);
app.use("/api/institute/student", studentInstituteRoute);
app.use("/api/institute/category", categoryInstituteRoute);
app.use("/api/institute/teacher", teacherInstituteRoute);

//TEACHER ROUTE
app.use("/api/teacher", teacherRoute);

export default app;
