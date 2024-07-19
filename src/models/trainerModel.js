const mongoose = require('mongoose');
const moment = require('moment');

const trainerSchema = new mongoose.Schema({
  trainerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cnic: { type: Number, required: true },
  phoneNo: { type: Number, required: true },
  emailAddress: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, required: true },
  datetime: {
    type: String,
    default: () => moment().format('D-MMMM-YYYY HH:mm'), 
  },
  operator: { type: String, default: 'system' }
});

// Add pagination fields
trainerSchema.statics.paginateQuery = function(page, limit) {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const skip = (page - 1) * limit;
  return this.find().skip(skip).limit(limit);
};


const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
