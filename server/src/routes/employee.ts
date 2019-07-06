import express from "express";
import db from "../../db";
const router = express.Router();

// list up all the employees
router.get("/employees", async (req, res) => {
  const list = await db("employee").select();
  res.json({
    list,
    total: list.length
  });
});

// add new employee
router.post("/employees", async (req, res) => {
  const newEmployee = {
    name: req.body.name,
    employee_id: req.body.employee_id
  };
  const result = await db("employee").insert({
    ...newEmployee,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  res.json({
    ...newEmployee,
    id: result[0]
  });
});

// get an employee
router.get("/employee/:id", async (req, res) => {
  const [employee] = await db("employee")
    .where("id", req.params.id)
    .limit(1);
  res.json({
    id: employee.id,
    name: employee.name,
    employee_id: employee.employee_id
  });
});

// remove an employee
router.delete("/employee/:id", async (req, res) => {
  const result = await db("employee")
    .where("id", req.params.id)
    .delete();
  res.header(200);
});

export const RouterEmployee = router;
