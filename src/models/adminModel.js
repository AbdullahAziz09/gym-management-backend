const mongoose = require('mongoose');
const moment = require('moment');

const adminSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  adminId: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  password: { type: String, required: true },
  entryDate: {
    type: String,
    default: () => moment().format('D-MMMM-YYYY HH:mm'), 
  },
  operator: { type: String, default: 'system' }
});

// Add pagination fields
adminSchema.statics.paginateQuery = function(page, limit) {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;
  return this.find().skip(skip).limit(limit);
};


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
