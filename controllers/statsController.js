const Issue = require('../models/Issue');
const Payment = require('../models/Payment');
const User = require('../models/User');

exports.getAdminStats = async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments();
        const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
        const pendingIssues = await Issue.countDocuments({ status: 'Pending' });
        const closedIssues = await Issue.countDocuments({ status: 'Closed' });

        const totalPayments = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalUsers = await User.countDocuments({ role: 'citizen' });
        const totalStaff = await User.countDocuments({ role: 'staff' });

        const latestIssues = await Issue.find().sort({ createdAt: -1 }).limit(5).populate('reporter', 'name');
        const latestPayments = await Payment.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');
        const latestUsers = await User.find({ role: 'citizen' }).sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            counts: {
                totalIssues,
                resolvedIssues,
                pendingIssues,
                closedIssues,
                totalPayments: totalPayments[0]?.total || 0,
                totalUsers,
                totalStaff
            },
            latestIssues,
            latestPayments,
            latestUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStaffStats = async (req, res) => {
    try {
        const { staffId } = req.params;
        const totalAssigned = await Issue.countDocuments({ assignedTo: staffId });
        const resolvedCount = await Issue.countDocuments({ assignedTo: staffId, status: 'Resolved' });
        const pendingCount = await Issue.countDocuments({ assignedTo: staffId, status: 'Pending' });
        const workingCount = await Issue.countDocuments({ assignedTo: staffId, status: 'Working' });

        const latestTasks = await Issue.find({ assignedTo: staffId })
            .sort({ priority: 1, updatedAt: -1 })
            .limit(5);

        res.status(200).json({
            stats: {
                totalAssigned,
                resolvedCount,
                pendingCount,
                workingCount
            },
            latestTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
