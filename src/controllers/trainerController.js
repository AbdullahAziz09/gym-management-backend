const Trainer = require('../models/trainerModel');
const mongoose = require('mongoose');

// Create a new trainer
exports.createTrainer = async (req, res) => {
  try {
    const { trainerId, name, cnic, phoneNo, emailAddress, city, status } = req.body;
    const newTrainer = new Trainer({ trainerId, name, cnic, phoneNo, emailAddress, city, status });
    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (error) {
    console.error('Error creating trainer:', error);
    res.status(500).json({ message: 'Failed to create trainer' });
  }
};

// Get all trainers (with pagination)
exports.getAllTrainers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;

    let trainersQuery = Trainer.find();
    const totalTrainers = await Trainer.countDocuments();

    // Check if limit is 'All' and adjust accordingly
    if (limit === 0 || req.query.limit === 'All') {
      limit = totalTrainers; // Set limit to total trainers count
    }

    // Handle pagination with limit
    const trainers = await trainersQuery
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      trainers,
      totalPages: Math.ceil(totalTrainers / limit),
      currentPage: page,
      totalRecords: totalTrainers
    });
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Failed to fetch trainers' });
  }
};

// Delete a trainer by ID
exports.deleteTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTrainer = await Trainer.findByIdAndDelete(id);
    if (!deletedTrainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    res.json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ message: 'Failed to delete trainer' });
  }
};
// Get total count of trainers
exports.getTrainersCount = async (req, res) => {
  try {
    const totalTrainers = await Trainer.countDocuments();
    res.json({ totalTrainers });
  } catch (error) {
    console.error('Error fetching trainer count:', error);
    res.status(500).json({ message: 'Failed to fetch trainer count' });
  }
};

// Get trainers by city
exports.getTrainersByCity = async (req, res) => {
  try {
    const trainersByCity = await Trainer.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } }
    ]);
    res.json({ trainersByCity });
  } catch (error) {
    console.error('Error fetching trainers by city:', error);
    res.status(500).json({ message: 'Failed to fetch trainers by city' });
  }
};