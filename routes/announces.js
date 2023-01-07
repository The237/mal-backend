const express = require("express");
const { sequelize } = require("../models");
const announces = express.Router();
const announcesServices = sequelize.models["announce"];
const Joi = require("joi");

announces.get("/announces", async (req, res) => {
  try {
    // get all the announces in the database
    const items = await announcesServices.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
announces.post("/announces", async (req, res) => {
  const data = req.body();
  const schema = Joi.object({
    nom: Joi.string().min(3).max(50).required,
  });
  try {
  } catch (error) {}
});
announces.get("/announce/:id", (req, res) => {});
announces.put("/announce/:id", (req, res) => {});
announces.delete("/announce/:id", (req, res) => {});
announces.patch("/announce/:id", (req, res) => {});

module.exports = announces;
