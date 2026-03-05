const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");

const isValidDate = (value) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const toDate = (value) => new Date(value);

const listSubs = async (req, res, next) => {
  try {
    const subs = await Subscription.find({ userId: req.user.id }).sort({ renewsAt: 1 });
    return res.status(200).json({ subs });
  } catch (error) {
    return next(error);
  }
};

const createSub = async (req, res, next) => {
  try {
    const {
      name,
      price,
      billingCycle = "monthly",
      isTrial = false,
      trialEndsAt,
      renewsAt,
      sharedWith = 1,
    } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Name is required." });
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0." });
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return res
        .status(400)
        .json({ message: "Billing cycle must be either monthly or yearly." });
    }

    if (!renewsAt || !isValidDate(renewsAt)) {
      return res.status(400).json({ message: "A valid renewsAt date is required." });
    }

    const parsedSharedWith = Number(sharedWith);
    if (!Number.isInteger(parsedSharedWith) || parsedSharedWith < 1) {
      return res.status(400).json({ message: "sharedWith must be at least 1." });
    }

    const trialFlag = Boolean(isTrial);
    let parsedTrialEndsAt = null;

    if (trialFlag) {
      if (!trialEndsAt || !isValidDate(trialEndsAt)) {
        return res
          .status(400)
          .json({ message: "trialEndsAt is required when isTrial is true." });
      }
      parsedTrialEndsAt = toDate(trialEndsAt);
    }

    const sub = await Subscription.create({
      userId: req.user.id,
      name: String(name).trim(),
      price: parsedPrice,
      billingCycle,
      isTrial: trialFlag,
      trialEndsAt: parsedTrialEndsAt,
      renewsAt: toDate(renewsAt),
      sharedWith: parsedSharedWith,
    });

    return res.status(201).json({ sub });
  } catch (error) {
    return next(error);
  }
};

const updateSub = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subscription id." });
    }

    const sub = await Subscription.findOne({ _id: id, userId: req.user.id });
    if (!sub) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    const payload = req.body;

    if (Object.prototype.hasOwnProperty.call(payload, "name")) {
      if (!payload.name || !String(payload.name).trim()) {
        return res.status(400).json({ message: "Name cannot be empty." });
      }
      sub.name = String(payload.name).trim();
    }

    if (Object.prototype.hasOwnProperty.call(payload, "price")) {
      const parsedPrice = Number(payload.price);
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ message: "Price must be greater than 0." });
      }
      sub.price = parsedPrice;
    }

    if (Object.prototype.hasOwnProperty.call(payload, "billingCycle")) {
      if (!["monthly", "yearly"].includes(payload.billingCycle)) {
        return res
          .status(400)
          .json({ message: "Billing cycle must be either monthly or yearly." });
      }
      sub.billingCycle = payload.billingCycle;
    }

    if (Object.prototype.hasOwnProperty.call(payload, "renewsAt")) {
      if (!payload.renewsAt || !isValidDate(payload.renewsAt)) {
        return res.status(400).json({ message: "A valid renewsAt date is required." });
      }
      sub.renewsAt = toDate(payload.renewsAt);
    }

    if (Object.prototype.hasOwnProperty.call(payload, "sharedWith")) {
      const parsedSharedWith = Number(payload.sharedWith);
      if (!Number.isInteger(parsedSharedWith) || parsedSharedWith < 1) {
        return res.status(400).json({ message: "sharedWith must be at least 1." });
      }
      sub.sharedWith = parsedSharedWith;
    }

    if (Object.prototype.hasOwnProperty.call(payload, "isTrial")) {
      sub.isTrial = Boolean(payload.isTrial);
      if (!sub.isTrial) {
        sub.trialEndsAt = null;
      }
    }

    if (Object.prototype.hasOwnProperty.call(payload, "trialEndsAt")) {
      if (payload.trialEndsAt === null || payload.trialEndsAt === "") {
        sub.trialEndsAt = null;
      } else if (!isValidDate(payload.trialEndsAt)) {
        return res.status(400).json({ message: "trialEndsAt must be a valid date." });
      } else {
        sub.trialEndsAt = toDate(payload.trialEndsAt);
      }
    }

    if (sub.isTrial && !sub.trialEndsAt) {
      return res
        .status(400)
        .json({ message: "trialEndsAt is required when isTrial is true." });
    }

    await sub.save();
    return res.status(200).json({ sub });
  } catch (error) {
    return next(error);
  }
};

const deleteSub = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid subscription id." });
    }

    const deleted = await Subscription.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    return res.status(200).json({ message: "Subscription deleted successfully." });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  listSubs,
  createSub,
  updateSub,
  deleteSub,
};
