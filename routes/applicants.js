const express = require("express");

const applicants = express.Router();
applicants.get("/applicants", (req, res) => {
  res.json({ message: "All the applicants" });
});
applicants.post("/applicants", (req, res) => {});
applicants.get("/applicant/id", (req, res) => {});
applicants.put("/applicant/id", (req, res) => {});
applicants.delete("/applicant/id", (req, res) => {});
applicants.patch("/applicant/id", (req, res) => {});

module.exports = applicants;
