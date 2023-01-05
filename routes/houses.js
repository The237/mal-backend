const express = require("express");

const houses = express.Router();
houses.get("/houses", (req, res) => {
  res.json({ message: "All the houses" });
});
houses.post("/houses", (req, res) => {});
houses.get("/house/id", (req, res) => {});
houses.put("/house/id", (req, res) => {});
houses.delete("/house/id", (req, res) => {});
houses.patch("/house/id", (req, res) => {});

module.exports = houses;
