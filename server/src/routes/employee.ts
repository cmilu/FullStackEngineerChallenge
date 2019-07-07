import express from "express";
import db from "../../db";
import { check, validationResult } from "express-validator";
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
router.post(
  "/employees",
  [
    check("name").isLength({ min: 1, max: 50 }),
    check("employee_id").isLength({ min: 1, max: 10 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
);

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
