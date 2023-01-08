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
  const schema = Joi.object({
    status: Joi.boolean().required(),
    userId: Joi.number().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) res.status(400).json(error.details[0].message);
  try {
    const { status, userId } = req.body;
    const announce = { status: status, userId: userId };
    await announcesServices.create(announce);
    res.status(200).json(announce);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

announces.get("/announce/:id", async (req, res) => {
  try {
    const announce = await announcesServices.findByPk(req.params.id);
    if (!announce) return res.status(404).json("Annonce non trouvée");
    res.status(200).json(announce);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

announces.put("/announce/:id", (req, res) => {});
announces.delete("/announce/:id", (req, res) => {});

announces.patch("/announce/:id", async (req, res) => {
  try {
    let announce = await announcesServices.findByPk(req.params.id);
    if (!announce) return res.status(404).json("Annonce non trouvée");
    await announcesServices.update(
      { status: !announce.status },
      { where: { id: req.params.id } }
    );
    announce = await announcesServices.findByPk(req.params.id);
    res.status(200).json(announce);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = announces;
