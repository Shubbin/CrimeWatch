import mongoose from "mongoose";

const updateHistorySchema = new mongoose.Schema(
  {
    updatedBy: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "police", "sub-admin", "admin"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const criminalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    crimeCommitted: { type: String, required: true },
    dateOfCrime: { type: Date, required: true },
    address: { type: String },
    arrestingOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Police",
    },
    phoneNumber: { type: String },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    nextOfKin: { type: String },
    nextOfKinRelationship: {
      type: String,
      enum: ["family", "friend", "partner", "colleague", "other"],
    },
    category: {
      type: String,
      enum: ["wanted", "dangerous", "normal"],
      default: "normal",
    },
    type: {
      type: String,
      enum: [
        "rape",
        "homicide",
        "fraud",
        "assault",
        "robbery",
        "kidnap",
        "other",
      ],
      required: true,
    },
    custodyStatus: {
      type: String,
      enum: [
        "in custody",
        "escaped",
        "on bail",
        "released",
        "convicted",
        "detained",
      ],
      default: "in custody",
    },
    description: { type: String, default: "" }, 

    dateOfArrest: { type: Date },
    dateReleased: { type: Date },

    nextOfKinAddress: { type: String },
    nextOfKinPhoneNumber: { type: String },
    mugshotUrl: { type: String },
    updateHistory: [updateHistorySchema],
  },
  { timestamps: true }
);

export const Criminal = mongoose.model("Criminal", criminalSchema);
