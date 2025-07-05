const Policy = require("../models/policy.model");
const User = require("../models/user.model");
const CustomError = require("../utils/CustomError");
const Category = require("../models/category.model");
const Carrier = require("../models/carrier.model");

exports.getPolicyByUser = async (req, res, next) => {
  try {
    const { username } = req.query;

    if (!username) {
      return next(new CustomError("Username is required", 400));
    }

    const user = await User.findOne({ firstName: username });

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    const policies = await Policy.find({ userId: user._id })
      .populate("policyCategory", "categoryName")
      .populate("policyCarrier", "companyName")
      .populate("userId");

    return res.status(200).json({
      success: true,
      message: "Policy Info fetched successfully",
      data: policies,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPolicyAggregation = async (req, res, next) => {
  try {
    const result = await Policy.aggregate([
      {
        $group: {
          _id: "$userId",
          totalPolicies: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          user: "$userDetails.firstName",
          totalPolicies: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Policy aggregation fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
