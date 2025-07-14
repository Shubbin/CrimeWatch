import { Criminal } from "../models/criminal.model.js";
import fs from "fs";

// Create Criminal
export const createCriminal = async (req, res) => {
  try {
    const {
      name,
      crimeCommitted,
      dob,
      gender,
      dateOfCrime,
      dateOfArrest,
      dateReleased,
      address,
      arrestingOfficer,
      status,
      phoneNumber,
      maritalStatus,
      nextOfKin,
      nextOfKinRelationship,
      nextOfKinRelationshipOther,
      nextOfKinAddress,
      nextOfKinPhoneNumber,
      category,
      type,
      custodyStatus,
      description
    } = req.body;

    if (!name || !crimeCommitted || !dateOfCrime || !type) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const finalRelationship =
      nextOfKinRelationship === "others"
        ? nextOfKinRelationshipOther
        : nextOfKinRelationship;

    const criminal = new Criminal({
      name,
      crimeCommitted,
      dob,
      gender,
      dateOfCrime,
      dateOfArrest,
      dateReleased,
      address,
      arrestingOfficer,
      status,
      phoneNumber,
      maritalStatus,
      nextOfKin,
      nextOfKinRelationship: finalRelationship,
      nextOfKinAddress,
      nextOfKinPhoneNumber,
      category,
      type,
      custodyStatus,
      mugshotUrl: req.file ? `uploads/${req.file.filename}` : null,
      createdBy: req.userId, 
      description
    });

    await criminal.save();
    res.status(201).json({ success: true, data: criminal });
  } catch (error) {
    console.error("Create Criminal Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all criminals
export const getCriminals = async (req, res) => {
  try {
    const criminals = await Criminal.find();
    res.status(200).json({ success: true, data: criminals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Criminal
export const updateCriminal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.mugshotUrl = `uploads/${req.file.filename}`;
    }

    // Handle nextOfKinRelationship "other" logic on update if needed
    if (updates.nextOfKinRelationship === "other" && updates.nextOfKinRelationshipOther) {
      updates.nextOfKinRelationship = updates.nextOfKinRelationshipOther;
      delete updates.nextOfKinRelationshipOther;
    }

    const criminal = await Criminal.findByIdAndUpdate(id, updates, { new: true });

    if (!criminal) {
      return res.status(404).json({ success: false, message: "Criminal record not found." });
    }

    res.status(200).json({ success: true, data: criminal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Criminal
export const deleteCriminal = async (req, res) => {
  try {
    const { id } = req.params;
    const criminal = await Criminal.findByIdAndDelete(id);

    if (!criminal) {
      return res.status(404).json({ success: false, message: "Criminal record not found." });
    }

    // Corrected: Delete image file if exists
    if (criminal.mugshotUrl && fs.existsSync(criminal.mugshotUrl)) {
      fs.unlinkSync(criminal.mugshotUrl);
    }

    res.status(200).json({ success: true, message: "Criminal record deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
