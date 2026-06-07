import dotenv from "dotenv";
import express from "express";
import { wechatRouter } from "./routes/wechat";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(
  express.text({
    type: ["text/xml", "application/xml", "*/xml"],
    limit: "1mb"
  })
);

app.get("/", (_req, res) => {
  res.type("text/plain").send("WeChat AI Bot starter is running. Configure /wechat in WeChat.");
});

app.use("/wechat", wechatRouter);

app.listen(port, () => {
  console.log(`WeChat AI Bot starter listening on http://localhost:${port}`);
});
