import express from "express";
import bodyParser from "body-parser";
import { RouterAdmin } from "./routes";

const app = express();

app.use(bodyParser.json());
app.use("/admin/v1", RouterAdmin);

app.listen(8081);
