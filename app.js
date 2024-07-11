const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const server = require('http').Server(app); //
const io = require('socket.io')(server);
const amqp = require('amqplib');

const port = 3000;
const bodyParser = require("body-parser") 
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

const router_registration = require("./routes/registration");
const router_login = require("./routes/login");
const router_notification = require("./routes/notification");
const {User} = require('./models/user');
const {notification} = require("./models/notification");

app.set('view engine', 'ejs');
const setupSwagger = require('./swagger');


const dburl = process.env.MongoURI;
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected successfully...'))
    .catch((err) => console.log('DB could not connect!\nError: ',err));


app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(bodyParser.json());

setupSwagger(app);

app.get("/:id",(req,res)=>{ // just for making user connect to socket.
  let token = req.params.id;
	if (!token)
		return res
			.status(400)
			.json({message: "Access denied, no token provided."})

	jwt.verify(token, process.env.JWTSECRET, (err, validToken) => {
		if (err) {
			return res.status(400).send({ message: "invalid token" });
		} else {
			return res.render('index',({
        userId:validToken._id,
        username:validToken.username
      }));
		}
	});
})

app.use("/api/register",router_registration);
app.use("/api/login",router_login);
app.use("/api/notification",router_notification);

server.listen(port,()=>{
    console.log(`listining at localhost:${port}`);
    receiveMessages();
})


io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('registerUser', async (userId) => {
    console.log(`User ${userId} connected`);
    await updateUserConnectionStatus(userId, true);
    socket.userId = userId;
  });

  socket.on('markAsRead', async (notificationId) => {
    console.log(`Notification ${notificationId} marked as read`);
    await notification.findByIdAndUpdate(
      notificationId,
      { $set: { read: true} },
      { new: true }
  );
    io.emit('notificationRead', notificationId);
  });

  socket.on('disconnect', async () => {
    console.log('Client disconnected');
    if (socket.userId) {
      await updateUserConnectionStatus(socket.userId, false);
    }
  });
});


const updateUserConnectionStatus = async (userId, isConnected) => {
  await User.findByIdAndUpdate(
    userId,
    { $set: { connected: isConnected} },
    { new: true }
);
return;
};


const exchange = 'notifications_exchange';

const receiveMessages = async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  await channel.assertExchange(exchange, 'fanout', { durable: false });
  const { queue } = await channel.assertQueue('', { exclusive: true });
  console.log('Waiting for messages in queue:', queue);
  await channel.bindQueue(queue, exchange, '');

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const messageContent = JSON.parse(msg.content.toString());
      console.log('Message received:', messageContent);

      // Broadcast the message to all connected clients
      io.emit('notification', messageContent);

      channel.ack(msg);
    }
  });
};