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

/**
 * @swagger
 * /api/notification:
 *   get:
 *     summary: Get all notifications for a user
 *     security:
 *       - BearerAuth: []
 *     tags: [Notification]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   message:
 *                     type: string
 *                   read:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: No notifications found
 */

router.get("/:id",auth,async(req,res)=>{
    const data = await notification.find({_id:req.params.id});
    if(!data)return res.status(400).json({msg:"There is no message with this id"});
    return res.status(200).json(data);
})

/**
 * @swagger
 * /api/notification/{id}:
 *   get:
 *     summary: Get a notification by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Notification]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 message:
 *                   type: string
 *                 read:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Notification not found
 */

router.put("/:id",auth,async(req,res)=>{
    const updatedUser = await notification.findByIdAndUpdate(
        req.params.id,
        { $set: { read: true} },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
})

/**
 * @swagger
 * /api/notification/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     security:
 *       - BearerAuth: []
 *     tags: [Notification]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */

router.post("/",auth, async(req,res)=>{
    const message = req.body.message;
    const userId = req.user._id;

    const new_notification = await new notification({
        message:message,
        userId:userId
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


/**
 * @swagger
 * /api/notification:
 *   post:
 *     summary: Create a new notification
 *     security:
 *       - BearerAuth: []
 *     tags: [Notification]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification created successfully
 */

module.exports = router;