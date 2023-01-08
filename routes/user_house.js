const express = require("express");
const { sequelize } = require("../models");
const user_house = express.Router();
const userhouseServices = sequelize.models["user_house"];
const Joi = require("joi");

/* ici il faut juste définir un  endpoint qui se 
chargera de relier un user qui a postulé à une maison
et un autre qui retourne toutes les relations user_houses
*/

user_house.get("/user_house", async (req, res) => {
  try {
    const items = await userhouseServices.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

user_house.post("/user_house", async (req, res) => {
  const schema = Joi.object({
    houseId: Joi.number().required(),
    userId: Joi.number().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const { houseId, userId } = req.body;
    const user_house = {
      houseId: houseId,
      userId: userId,
    };

    await userhouseServices.create(user_house);
    res.status(200).json(user_house);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

module.exports = user_house;
