// packageController.js

const Package = require('../models/packageModel');
const Trainee = require('../models/traineeModel');

// Get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a package by ID
const updatePackage = async (req, res) => {
  const { id } = req.params;
  const { packageName, packageAmount } = req.body;

  try {
    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      { packageName, packageAmount },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Update all associated trainees with the new package details
    await Trainee.updateMany({ 'package.packageId': id }, { 'package.packageName': packageName, 'package.packageAmount': packageAmount });

    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
};

module.exports = {
  getAllPackages,
  updatePackage,
};
