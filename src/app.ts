import express from "express";
const app = express();

import authRoute from "./routes/globals/auth/auth-route";
import instituteRoute from "./routes/institute/institute-route";
import courseInstituteRoute from "./routes/institute/course/course-route";
import studentInstituteRoute from "./routes/institute/student/student-route";
import categoryInstituteRoute from "./routes/institute/category/category-route";
import teacherInstituteRoute from "./routes/institute/teacher/teacher-route";

app.use(express.json());

//AUTH ROUTE
app.use("/api", authRoute);

//INSTITUTE ROUTE
app.use("/api/institute", instituteRoute);
app.use("/api/institute/course", courseInstituteRoute);
app.use("/api/institute/student", studentInstituteRoute);
app.use("/api/institute/category", categoryInstituteRoute);
app.use("/api/institute/teacher", teacherInstituteRoute);

export default app;
