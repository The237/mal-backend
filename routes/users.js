const express = require("express");
const { sequelize } = require("../models");
const users = express.Router();
const usersServices = sequelize.models["user"];
const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const customJoiJson = require("../consts/customJoiJson");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    email: Joi.string().min(3).max(200).email().required(),
    password: Joi.string()
      .min(8)
      .max(200)
      .pattern(new RegExp("^(?=.*d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$"))
      .required()
      .messages({
        "string.pattern.base": `Le mot de passe doit avoir entre
      8 et 30 caractères et avoir des majuscules, des caractères
      spéciaux et des chiffres`,
        "string.empty": `Le mot de passe ne peut être vide`,
        "any.required": `Le mot de passe est obligatoire`,
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let user = await usersServices.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) return res.status(400).json("Invalid email or password ...");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword)
      return res.status(400).send("Invalid email or password ...");

    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        sexe: user.sexe,
        telephone: user.telephone,
        email: user.email,
        adresse: user.adresse,
        role: user.role,
        deleted: user.deleted,
      },
      secretKey
    );
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json(error.message);
    console.log(error);
  }
});

users.post("/user/signup", async (req, res) => {
  const schema = Joi.object({
    nom: Joi.string().min(3).max(30).required().messages({
      "string.empty": "Le nom ne peut être vide",
      "string.min": "Le nom doit avoir au moins 3 caractères",
      "string.max": "Le nom doit avoir maximum 30 caractères",
    }),
    prenom: Joi.string().min(0).max(30).messages({
      "string.max": "Le prénom doit avoir maximum 3 caractères",
    }),
    sexe: Joi.valid("Masculin", "Féminin"),
    telephone: Joi.string()
      .pattern(new RegExp("[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$"))
      .messages({
        "string.pattern.base": `Veuillez saisir un numéro valide`,
      })
      .required(),
    email: Joi.string().min(3).max(200).email().required(),
    adresse: Joi.string().required(),
    password: joiPassword
      .string()
      .min(8)
      .max(200)
      .minOfSpecialCharacters(1)
      .minOfLowercase(3)
      .minOfNumeric(1)
      .minOfUppercase(1)
      .noWhiteSpaces()
      .messages({
        "password.minOfUppercase":
          "Le mot de passe doit contenir au moins {#min} lettres majuscules",
        "password.minOfSpecialCharacters":
          "Le mot de passe doit contenir au moins {#min} caractères spéciaux (#, @, ...)",
        "password.minOfLowercase":
          "Le mot de passe doit contenir au moins {#min} lettres minuscules",
        "password.minOfNumeric":
          "Le mot de passe doit contenir au moins {#min} chiffres",
        "password.noWhiteSpaces":
          "Le mot de passe ne doit contenir aucun espace",
      }),
    repeatMdp: Joi.any().valid(Joi.ref("password")).required().messages({
      "string.ref":
        "Le mot de passe et sa confirmation doivent être similaires",
    }),
    role: Joi.valid("tenant", "landlord", "admin", "superadmin"),
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
        .json(`Cet adresse email est déjà utilisée sur ce site ...`);
    }
    const {
      nom,
      prenom,
      sexe,
      telephone,
      email,
      adresse,
      password,
      role,
      deleted,
    } = req.body;
    user = {
      nom: nom,
      prenom: prenom,
      sexe: sexe,
      telephone: telephone,
      email: email,
      adresse: adresse,
      password: password,
      role: role,
      deleted: deleted,
    };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await usersServices.create(user);
    const secretKey = process.env.SECRET_KEY;

    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        sexe: user.sexe,
        telephone: user.telephone,
        email: user.email,
        adresse: user.adresse,
        role: user.role,
        deleted: user.deleted,
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
    adresse: Joi.string().required(),
    role: customJoiJson.array().when("infected", {
      is: true,
      then: customJoiJson.array().min(1).required(),
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
      adresse,
      password,
      role,
      deleted,
    } = req.body;

    await usersServices.update(
      {
        nom: nom,
        prenom: prenom,
        sexe: sexe,
        telephone: telephone,
        email: email,
        adresse: adresse,
        password: password,
        role: role,
        deleted: deleted,
      },
      { where: { id: req.params.id } }
    );
    user = await usersServices.findByPk(req.params.id);
    res.status(200).json(user);
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});
users.delete("/user/:id", (req, res) => {});

module.exports = users;
