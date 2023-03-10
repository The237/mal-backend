const express = require("express");
const announcesRoutes = require("./routes/announces");
const housesRoutes = require("./routes/houses");
const usersRoutes = require("./routes/users");
const user_housesRoutes = require("./routes/user_house");
const cors = require("cors");

// create the database connection and call all models
const db = require("./models");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/api", announcesRoutes);
app.use("/api", housesRoutes);
app.use("/api", usersRoutes);
app.use("/api/", user_housesRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World !" });
});

db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, async () => {
    console.log(
      `Server is running on port ${PORT} and database connection established`
    );
  });
});
