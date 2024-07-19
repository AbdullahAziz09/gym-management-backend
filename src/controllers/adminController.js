const Admin = require('../models/adminModel');

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { adminName, adminId, city, password } = req.body;
    const newAdmin = new Admin({ adminName, adminId, city, password });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
};

// Get all admins (with pagination)
exports.getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;

    let adminsQuery = Admin.find();
    const totalAdmins = await Admin.countDocuments();

    // Check if limit is 'All' and adjust accordingly
    if (limit === 0 || req.query.limit === 'All') {
      limit = totalAdmins; // Set limit to total admins count
    }

    // Handle pagination with limit
    const admins = await adminsQuery
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({
      admins,
      totalPages: Math.ceil(totalAdmins / limit),
      currentPage: page,
      totalRecords: totalAdmins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
};

// Delete an admin by ID
exports.deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
};

// Get total count of admins
exports.getAdminsCount = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    res.json({ totalAdmins });
  } catch (error) {
    console.error('Error fetching admin count:', error);
    res.status(500).json({ message: 'Failed to fetch admin count' });
  }
};

// Fetch admins count grouped by city
exports.getAdminsByCity = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];

    const adminsByCity = await Admin.aggregate(pipeline);
    res.json({ adminsByCity });
  } catch (error) {
    console.error('Error fetching admins by city:', error);
    res.status(500).json({ message: 'Failed to fetch admins by city' });
  }
};