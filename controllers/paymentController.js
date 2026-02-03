const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        const result = await payment.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPaymentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
