const express = require("express");
const applicantsRoutes = require("./routes/applicants");

// create the database connection and call all models
const db = require("./models");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/api", applicantsRoutes);

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
