const express = require("express");

const proprietaries = express.Router();
proprietaries.get("/proprietaries", (req, res) => {
  res.json({ message: "All the proprietaries" });
});
proprietaries.post("/proprietaries", (req, res) => {});
proprietaries.get("/proprietary/id", (req, res) => {});
proprietaries.put("/proprietary/id", (req, res) => {});
proprietaries.delete("/proprietary/id", (req, res) => {});
proprietaries.patch("/proprietary/id", (req, res) => {});

module.exports = proprietaries;
