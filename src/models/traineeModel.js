// traineeModel.js

const mongoose = require('mongoose');
const moment = require('moment');

const traineeSchema = new mongoose.Schema({
  traineeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cnic: { type: String, required: true },
  phoneNo: { type: String, required: true },
  emailAddress: { type: String, required: true },
  city: { type: String, required: true },
  status: { type: String, required: true },
  package: {
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    packageName: { type: String },
    packageAmount: { type: Number }
  },
  datetime: {
    type: String,
    default: () => moment().format('D-MMMM-YYYY HH:mm'),
  },
  operator: { type: String, default: 'system' }
});

const Trainee = mongoose.model('Trainee', traineeSchema);

module.exports = Trainee;
