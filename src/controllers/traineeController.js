const Trainee = require('../models/traineeModel');
const Package = require('../models/packageModel');

// Create a new trainee
exports.createTrainee = async (req, res) => {
  try {
    const { traineeId, name, cnic, phoneNo, emailAddress, city, status, packageId } = req.body;

    const packageDetails = await Package.findById(packageId);
    if (!packageDetails) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const newTrainee = new Trainee({
      traineeId,
      name,
      cnic,
      phoneNo,
      emailAddress,
      city,
      status,
      package: {
        packageId: packageDetails._id,
        packageName: packageDetails.packageName,
        packageAmount: packageDetails.packageAmount,
      }
    });

    await newTrainee.save();
    res.status(201).json(newTrainee);
  } catch (error) {
    console.error('Error creating trainee:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all trainees (with pagination)
exports.getAllTrainees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const forDropdown = req.query.forDropdown === 'true';
    let limit = parseInt(req.query.limit) || 5;

    const totalTrainees = await Trainee.countDocuments();

    // If the request is for dropdown, set limit to total trainees
    if (forDropdown) {
      limit = totalTrainees;
    } else if (req.query.limit === 'All') {
      limit = totalTrainees;
    }

    const trainees = await Trainee.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      trainees,
      totalPages: Math.ceil(totalTrainees / limit),
      currentPage: page,
      totalRecords: totalTrainees,
    });
  } catch (error) {
    console.error('Error fetching trainees:', error);
    res.status(500).json({ message: 'Failed to fetch trainees' });
  }
};


// Delete a trainee by ID
exports.deleteTraineeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrainee = await Trainee.findByIdAndDelete(id);
    if (!deletedTrainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }
    res.json({ message: 'Trainee deleted successfully' });
  } catch (error) {
    console.error('Error deleting trainee:', error);
    res.status(500).json({ message: 'Failed to delete trainee' });
  }
};

// Get total count of trainees
exports.getTraineesCount = async (req, res) => {
  try {
    const totalTrainees = await Trainee.countDocuments();
    res.json({ totalTrainees });
  } catch (error) {
    console.error('Error fetching trainee count:', error);
    res.status(500).json({ message: 'Failed to fetch trainee count' });
  }
};

// Update package details and propagate to associated trainees
exports.updatePackage = async (req, res) => {
  const { packageId, newName, newAmount } = req.body;

  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      packageId,
      { packageName: newName, packageAmount: newAmount },
      { new: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const traineesToUpdate = await Trainee.find({ 'package.packageId': packageId });

    await Promise.all(traineesToUpdate.map(async (trainee) => {
      trainee.package.packageName = newName;
      trainee.package.packageAmount = newAmount;
      await trainee.save();
    }));

    res.json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package and trainees:', error);
    res.status(500).json({ message: 'Failed to update package and trainees' });
  }
};
// Get trainees by city
exports.getTraineesByCity = async (req, res) => {
  try {
    const traineesByCity = await Trainee.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } }
    ]);
    res.json({ traineesByCity });
  } catch (error) {
    console.error('Error fetching trainees by city:', error);
    res.status(500).json({ message: 'Failed to fetch trainees by city' });
  }
};