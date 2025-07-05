// controllers/message.controller.js
const Message = require("../models/message.model");
const { scheduleSingleMessage } = require("../utils/scheduler");
const CustomError = require("../utils/CustomError");

exports.scheduleMessage = async (req, res, next) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      return next(new CustomError("Message, day, and time are required", 400));
    }

    const scheduledAt = new Date(`${day}T${time}`);

    if (scheduledAt < new Date()) {
      return next(new CustomError("Scheduled time is in the past", 400));
    }

    const savedMessage = await Message.create({ message, scheduledAt });

    // Schedule the job
    scheduleSingleMessage(savedMessage);

    return res.status(201).json({
      success: true,
      message: "Message scheduled successfully",
      data: savedMessage,
    });
  } catch (error) {
    next(error);
  }
};
