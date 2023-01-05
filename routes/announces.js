const express = require("express");

const announces = express.Router();
announces.get("/announces", (req, res) => {
  res.json({ message: "All the announces" });
});
announces.post("/announces", (req, res) => {});
announces.get("/announce/id", (req, res) => {});
announces.put("/announce/id", (req, res) => {});
announces.delete("/announce/id", (req, res) => {});
announces.patch("/announce/id", (req, res) => {});

module.exports = announces;
