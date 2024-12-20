require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Fetch all student's
app.get("/students", async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Error fetching students" });
  }
});

// Create a new student
app.post("/students", async (req, res) => {
  try {
    const { name, cohort, courses, date_joined, last_login, status } = req.body;
    
    // Check that required fields are provided
    if (!name || !cohort) {
      return res.status(400).json({ error: "Name and cohort are required." });
    }

    const newStudent = await prisma.student.create({
      data: {
        name,
        cohort,
        courses: courses || [], // Ensure courses is an array (even if empty)
        date_joined: date_joined || new Date(),
        last_login: last_login || new Date(),
        status: status || "offline", // Default to 'offline' if not provided
      },
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Error creating student" });
  }
});


app.put("/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cohort, courses, date_joined, last_login, status } = req.body;

    // Validate that required fields are provided
    if (!name || !cohort) {
      return res.status(400).json({ error: "Name and cohort are required." });
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { name, cohort, courses, date_joined, last_login, status },
    });

    res.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ error: "Error updating student." });
  }
});


app.delete("/students/:id", async (req, res) => {
  try {
    const { id } = req.params; // The id from the request will be a string (UUID)
    const deletedStudent = await prisma.student.delete({
      where: {
        id: id, // Directly use the string ID since it's a UUID
      },
    });

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
