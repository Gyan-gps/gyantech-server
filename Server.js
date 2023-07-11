const express = require("express");

const app = express();
const axios = require("axios");
const cors = require("cors");

// ?import
const db = require("./db");
const userSchema = require("./Schema/UserSchema");
const messageSchema = require("./Schema/MessagesSchema");
const RoomSchema = require("./Schema/RoomSchema");
const { default: mongoose } = require("mongoose");

// ?middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send({
    status: 200,
    message: "Welcome",
  });
});

app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { userName, userNumber, userEmail, userPassword } = req.body;
  // const userSchema = new UserSchema()
  try {
    const find = await userSchema.findOne({ userEmail: req.body.userEmail });
    console.log(find);
    if (find) {
      return res.send({
        status: 400,
        message: "User Already exist signup",
        data: find,
      });
    } else {
      try {
        const user = new userSchema({
          userName,
          userNumber,
          userEmail,
          userPassword,
          userStatus: true,
        });
        const data = await user.save();
        console.log(data);
        return res.send({
          status: 200,
          data,
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }

  res.send({
    status: 400,
    message: "Signup failed",
  });
});

app.post("/user/update", async (req, res) => {
  const { userEmail, name, value } = req.body;
  console.log(userEmail, name, value);
  try {
    const data = await userSchema.findOneAndUpdate(
      { userEmail },
      { [name]: value }
    );
    // console.log(data);
    return res.send({
      status: 200,
      message: "Updated Successfully",
      data: data,
    });
  } catch (err) {
    // console.log(err)
    return res.send({
      status: 400,
      message: "DB error",
    });
  }
});

app.get("/activeUsers", async (req, res) => {
  try {
    const data = await userSchema.find({ userStatus: true });
    // console.log("users", data);
    res.send({
      status: 200,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.send({
      status: 400,
      message: "db error",
    });
  }
});

app.post("/sendMessage", async (req, res) => {
  console.log(req.body.message);
  const { me, you, sender, message } = req.body;
  let newMessage = new messageSchema({
    message: message,
    me,
    you,
    sender,
    createdAt: Date.now(),
  });
  try {
    const data = await newMessage.save();
    res.send({ status: 200, data });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
});
app.get("/getAllMessage", async (req, res) => {
    const {me,you} = req.query;
    console.log(req.query)
    try{

        const messages = await messageSchema.find({$or:[{you,me},{you:me,me:you}]}).sort({ createdAt: 1 });
        console.log("messages",messages)
      
        res.send({ status: 200, data:messages });
    }catch(err){
        res.send({
            status:400,
            data:res
        })
    }
});

app.post("/createRoom", async (req, res) => {
  const { roomName, roomOwner } = req.body;
  console.log(req.body, roomName, roomOwner);
  const newRoom = new RoomSchema({
    roomName,
    roomOwner,
    createdAt: Date.now(),
  });

  try {
    const data = await newRoom.save();
    console.log(data);
    res.send({
      status: 200,
      message: "Room created successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    res.send({ status: 400 });
  }
});

app.get("/activeRooms", async (req, res) => {
  try {
    const data = await RoomSchema.find();
    res.send({
      status: 200,
      data,
    });
  } catch (err) {
    res.send({
      status: 400,
      data: err,
    });
  }
});

const server = app.listen(8000, () => {
  console.log("App listen at port 8000");
});

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// let user = 1;

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("sendMessage", (message) => {
    console.log(message);
    io.emit("getMessage", message);
  });
  socket.on("disconnect", () => {
    console.log("disconnect", socket);
  });
});
