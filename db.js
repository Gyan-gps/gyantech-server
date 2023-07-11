
const mongoose = require("mongoose");

const db_URL =
  "mongodb+srv://gyantech:gyantech@cluster0.94vxbla.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(db_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => console.log(err));