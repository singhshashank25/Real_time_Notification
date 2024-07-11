const auth = require("../middleware/auth");
const router = require("express").Router();
const amqp = require('amqplib');
const {notification} = require("../models/notification");



router.get("/",auth,async(req,res)=>{
    const data = await notification.find({userId:req.user._id});
    if(!data)return res.status(200).json({msg:"There is no message"});
    let lis = []
    console.log(data);
    data.forEach((data)=>{
        lis.push(data.message);
    })
    return res.json(lis);
})



router.get("/:id",auth,async(req,res)=>{
    const data = await notification.find({_id:req.params.id});
    if(!data)return res.status(200).json({msg:"There is no message with this id"});
    return res.send(200).json(data);
})

router.put("/:id",auth,async(req,res)=>{
    const updatedUser = await notification.findByIdAndUpdate(
        req.params.id,
        { $set: { read: true} },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
})

router.post("/",auth, async(req,res)=>{
    const message = req.body.message;
    const userId = req.user._id;

    const new_notification = await new notification({
        ...req.body
    })

    await new_notification.save();

    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    console.log(req.user);
    const exchange = 'notifications_exchange';

    // await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertExchange(exchange, 'fanout', { durable: false });

    channel.publish(exchange, '', Buffer.from(JSON.stringify(new_notification)));

    console.log(`Message sent to user ${userId}:`, message);

    await channel.close();
    await connection.close();

    return res.status(200).json({new_notification});
})

module.exports = router;