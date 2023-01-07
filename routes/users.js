const express = require("express");
const { sequelize } = require("../models");
const users = express.Router();
const usersServices = sequelize.models["user"];
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
require("dotenv").config();

const custom = Joi.extend({
  type: "array",
  base: Joi.array(),
  coerce: {
    from: "string",
    method(value, helpers) {
      if (
        typeof value !== "string" ||
        (value[0] !== "[" && !/^\s*\[/.test(value))
      ) {
        return;
      }
      try {
        return { value: JSON.parse(value) };
      } catch (ignoreErr) {}
    },
  },
});

users.get("/users", async (req, res) => {
  try {
    const items = await usersServices.findAll();
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});
users.post("/user/signin", async (req, res) => {
  const schema = Joi.object({
    nom: Joi.string().min(3).max(30).required(),
    prenom: Joi.string().min(3).max(30),
    sexe: Joi.valid(0, 1).required(),
    telephone: Joi.string()
      .pattern(new RegExp("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$"))
      .messages({
        "string.pattern.base": `Veuillez saisir un numéro valide`,
      })
      .required(),
    email: Joi.string().email().required(),
    adress: Joi.string().required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"))
      .required()
      .messages({
        "string.pattern.base": `Le mot de passe doit avoir entre
      8 et 30 caractères et avoir des majuscules, des caractères
      spéciaux et des chiffres`,
        "string.empty": `Le mot de passe ne peut être vide`,
        "any.required": `Le mot de passe est obligatoire`,
      }),
    repeatMdp: Joi.string().valid(req.body.repeatMdp).required().messages({
      "an.only": `Les mots de passe sont differents`,
      "any.required": `Veuillez de nouveau saisir le mot de passe`,
    }),
    roles: custom.array().when("infected", {
      is: true,
      then: custom.array().min(1).required(),
    }),
    deleted: Joi.boolean(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  try {
    let user = await usersServices.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (user) {
      return res
        .status(400)
        .send(`Cet adresse email est déjà utilisée sur ce site ...`);
    }
    const {
      nom,
      prenom,
      sexe,
      telephone,
      email,
      adress,
      password,
      roles,
      deleted,
    } = req.body;
    user = {
      nom: nom,
      prenom: prenom,
      sexe: sexe,
      telephone: telephone,
      email: email,
      adress: adress,
      password: password,
      roles: roles,
      deleted: deleted,
    };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await usersServices.create(user);
    const secretKey = await process.env.SECRET_KEY;

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        sexe: user.sexe,
        telephone: user.telephone,
        email: user.email,
        adress: user.adress,
        roles: user.roles,
        deleted: deleted,
      },
      secretKey
    );
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error.message);
  }
});
users.get("/user/:id", async (req, res) => {
  try {
    const user = await usersServices.findByPk(req.params.id);
    if (!user) return res.status(404).json("Utilisateur non trouvé ...");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

users.put("/user/:id", async (req, res) => {
  const schema = Joi.object({
    nom: Joi.string().min(3).max(30).required(),
    prenom: Joi.string().min(3).max(30),
    sexe: Joi.valid(0, 1).required(),
    telephone: Joi.string()
      .pattern(new RegExp("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$"))
      .messages({
        "string.pattern.base": `Veuillez saisir un numéro valide`,
      })
      .required(),
    email: Joi.string().email().required(),
    adress: Joi.string().required(),
    roles: custom.array().when("infected", {
      is: true,
      then: custom.array().min(1).required(),
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);
  try {
    let user = await usersServices.findByPk(req.params.id);
    if (!user) return res.status(404).json("Utilisateur non trouvé ...");

    const {
      nom,
      prenom,
      sexe,
      telephone,
      email,
      adress,
      password,
      roles,
      deleted,
    } = req.body;

    await usersServices.update(
      {
        nom: nom,
        prenom: prenom,
        sexe: sexe,
        telephone: telephone,
        email: email,
        adress: adress,
        password: password,
        roles: roles,
        deleted: deleted,
      },
      { where: { id: req.params.id } }
    );
    user = await usersServices.findByPk(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});
users.patch("/user/:id", async (req, res) => {
  try {
    let user = await usersServices.findByPk(req.params.id);
    if (!user) return res.status(404).json("Utilisateur non trouvé ...");
    await usersServices.update(
      { deleted: !user.deleted },
      { where: { id: req.params.id } }
    );
    user = await usersServices.findByPk(req.params.id);
    res.status(200).json(user);
  } catch (error) {}
});
users.delete("/user/:id", (req, res) => {});

module.exports = users;
