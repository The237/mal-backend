const express = require("express");
const { sequelize } = require("../models");
const houses = express.Router();
const housesServices = sequelize.models["house"];
const Joi = require("joi");
const customJoiJson = require("../consts/customJoiJson");

houses.get("/houses", async (req, res) => {
  try {
    const items = await housesServices.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});
houses.post("/houses", async (req, res) => {
  const schema = Joi.object({
    description: Joi.string().min(30).max(500).required(),
    superficie: Joi.number().positive().required(),
    adresse: Joi.string().required(),
    type: Joi.number().valid(1, 2, 3, 4).required(),
    categorie: Joi.number().valid(1, 2, 3, 4).required(),
    prix: Joi.number().positive().required(),
    parking: Joi.boolean().required(),
    cloture: Joi.boolean().required(),
    region: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).required(),
    departement: Joi.number().positive().required(),
    arrondissement: Joi.number().positive().required(),
    quartier: Joi.string().required(),
    lieuDit: Joi.string(),
    nbMoisDde: Joi.number().positive().required(),
    images: customJoiJson.array().when("infected", {
      is: true,
      then: customJoiJson.array().min(1).required(),
    }),
    pieces: customJoiJson.array().when("infected", {
      is: true,
      then: customJoiJson.array().min(1).required(),
    }),
    deleted: Joi.boolean(),
    userId: Joi.number().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    const {
      description,
      superficie,
      adresse,
      type,
      categorie,
      prix,
      parking,
      cloture,
      region,
      departement,
      arrondissement,
      quartier,
      lieuDit,
      nbMoisDde,
      images,
      pieces,
      deleted,
      userId,
    } = req.body;

    const house = {
      description: description,
      superficie: superficie,
      adresse: adresse,
      type: type,
      categorie: categorie,
      prix: prix,
      parking: parking,
      cloture: cloture,
      region: region,
      departement: departement,
      arrondissement: arrondissement,
      quartier: quartier,
      lieuDit: lieuDit,
      nbMoisDde: nbMoisDde,
      images: images,
      pieces: pieces,
      deleted: deleted,
      userId: userId,
    };

    await housesServices.create(house);

    res.status(200).json(house);
  } catch (error) {
    res.status(500).json(error.details[0].message);
  }
});

houses.get("/house/:id", async (req, res) => {
  try {
    const house = await housesServices.findByPk(req.params.id);
    if (!house) return res.status(404).json("Maison non trouvée");
    res.status(200).json(house);
  } catch (error) {
    res.status(500).json(error.details[0].message);
  }
});

houses.put("/house/:id", async (req, res) => {
  const schema = Joi.object({
    description: Joi.string().min(30).max(500).required(),
    superficie: Joi.number().positive().required(),
    adresse: Joi.string().required(),
    type: Joi.number().valid(1, 2, 3, 4).required(),
    categorie: Joi.number().valid(1, 2, 3, 4).required(),
    prix: Joi.number().positive().required(),
    parking: Joi.boolean().required(),
    cloture: Joi.boolean().required(),
    region: Joi.number().valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).required(),
    departement: Joi.number().positive().required(),
    arrondissement: Joi.number().positive().required(),
    quartier: Joi.string().required(),
    lieuDit: Joi.string(),
    nbMoisDde: Joi.number().positive().required(),
    images: customJoiJson.array().when("infected", {
      is: true,
      then: customJoiJson.array().min(1).required(),
    }),
    pieces: customJoiJson.array().when("infected", {
      is: true,
      then: customJoiJson.array().min(1).required(),
    }),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    let house = await housesServices.findByPk(req.params.id);
    if (!house) return res.status(404).json("Maison non trouvée");

    const {
      description,
      superficie,
      adresse,
      type,
      categorie,
      prix,
      parking,
      cloture,
      region,
      departement,
      arrondissement,
      quartier,
      lieuDit,
      nbMoisDde,
      images,
      pieces,
    } = req.body;

    await housesServices.update(
      {
        description: description,
        superficie: superficie,
        adresse: adresse,
        type: type,
        categorie: categorie,
        prix: prix,
        parking: parking,
        cloture: cloture,
        region: region,
        departement: departement,
        arrondissement: arrondissement,
        quartier: quartier,
        lieuDit: lieuDit,
        nbMoisDde: nbMoisDde,
        images: images,
        pieces: pieces,
      },
      { where: { id: req.params.id } }
    );
    house = await housesServices.findByPk(req.params.id);
    res.status(200).json(house);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

houses.patch("/house/:id", async (req, res) => {
  try {
    let house = await housesServices.findByPk(req.params.id);
    if (!house) return res.status(404).json("Maison non trouvée ...");
    await housesServices.update(
      { deleted: !house.deleted },
      { where: { id: req.params.id } }
    );
    house = await housesServices.findByPk(req.params.id);
    res.status(200).json(house);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});
houses.delete("/house/:id", (req, res) => {});
module.exports = houses;
