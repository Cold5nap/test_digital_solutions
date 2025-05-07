// import * as functions from "firebase-functions";
// import * as admin from "firebase-admin";
import express from "express";
import apiRouter from "./routers/apiRouter";
import cors from "cors";
import morgan from "morgan";
import path from "path";

// admin.initializeApp();

const app = express();
const port = 3001;

app.use(cors());
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
app.use(morgan("dev"));
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "..", "dist")));
// Для всех остальных маршрутов отдаём index.html (SPA роутинг)
app.get("*path", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});
// export const expApp = functions.https.onRequest(app);
