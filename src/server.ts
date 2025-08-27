import express from "express";
import cors from "cors";
import router from "./routes";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
configDotenv();

const app = express();

app.use(
  cors({
    origin: /* process.env.DEPLOY_VERCEL_URL */ 'https://vos-front.vercel.app',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("api/auth/logout", cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.listen(process.env.PORT || 4200, () => {
  console.log(`server is running on port ${process.env.PORT || 4200}`);
});


export default app