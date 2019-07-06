import express from "express";
import { RouterEmployee } from "./routes";

const app = express();

app.use("/employees", RouterEmployee);

app.listen(8081);
