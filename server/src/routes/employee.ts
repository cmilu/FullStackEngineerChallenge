import express from "express";
import db from "../../db";
const router = express.Router();
// list up all the employees
router.get("/", async (req, res) => {
  const list = await db.select().from("employee");
  res.json({
    list
  });
});

export const RouterEmployee = router;
