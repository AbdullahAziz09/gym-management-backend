const Payment = require('../models/paymentModel');
const Trainee = require('../models/traineeModel');

// Create a new payment
exports.createPayment = async (req, res) => {
  const { traineeId, amount, monthYear } = req.body;

  try {
    // Find trainee by traineeId to get trainee _id
    const trainee = await Trainee.findById(traineeId);
    if (!trainee) {
      return res.status(404).json({ message: 'Trainee not found' });
    }

    // Validate if amount is not less than package amount
    if (trainee.package && amount < trainee.package.packageAmount) {
      return res.status(400).json({ message: 'Payment amount cannot be less than package amount' });
    }

    // Check if the trainee has already made a payment for the same month
    const existingPayment = await Payment.findOne({
      trainee: trainee._id,
      monthYear: { $regex: new RegExp(`^${monthYear.split('-')[1]}`) },
    });
    if (existingPayment) {
      return res.status(400).json({ message: 'Trainee has already made a payment for this month' });
    }

    // Create a new Payment instance
    const newPayment = new Payment({
      trainee: trainee._id,
      amount,
      monthYear,
    });

    // Save the new payment
    const savedPayment = await newPayment.save();

    // Populate the saved payment with trainee details
    const populatedPayment = await Payment.findById(savedPayment._id).populate('trainee', 'name traineeId');

    res.status(201).json(populatedPayment);
  } catch (error) {
    console.error('Error making payment:', error.message);
    res.status(500).json({ error: 'Failed to make payment' });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('trainee', 'traineeId name');
    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error.message);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Delete payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(id);
    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error.message);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

// Get monthly payments totals
exports.getMonthlyTotals = async (req, res) => {
  try {
    const monthlyTotals = await Payment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%B", // Format to return full month name (e.g., January, February)
              date: { $toDate: "$monthYear" } // Convert monthYear to Date object
            }
          },
          totalAmount: { $sum: "$amount" } // Calculate total amount per month
        }
      },
      {
        $project: {
          _id: 0, // Exclude MongoDB generated _id
          month: "$_id", // Rename _id to month
          totalAmount: 1 // Include totalAmount in the output
        }
      }
    ]);

    res.json({ monthlyTotals });
  } catch (error) {
    console.error('Error fetching monthly payment totals:', error);
    res.status(500).json({ error: 'Failed to fetch monthly payment totals' });
  }
};