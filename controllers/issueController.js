const Issue = require('../models/Issue');
const User = require('../models/User');

exports.getAllIssues = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        const { search, category, status, priority, reporter, assignedTo } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) query.category = category;
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (reporter) query.reporter = reporter;
        if (assignedTo) query.assignedTo = assignedTo;

        const issues = await Issue.find(query)
            .sort({ priority: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reporter', 'name photo')
            .populate('assignedTo', 'name photo');

        const total = await Issue.countDocuments(query);

        res.status(200).json({
            issues,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalIssues: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getResolvedIssues = async (req, res) => {
    try {
        const issues = await Issue.find({
            "timeline.status": "Resolved"
        })
            .sort({ updatedAt: -1 })
            .limit(6)
            .populate('reporter', 'name photo')
            .populate('assignedTo', 'name photo');

        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createIssue = async (req, res) => {
    try {
        const user = req.user;
        const issue = new Issue(req.body);

        issue.timeline.push({
            status: 'Pending',
            message: `Issue reported by ${user.name}`,
            updatedBy: { name: user.name, role: user.role },
            date: new Date()
        });

        const result = await issue.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('reporter', 'name email photo')
            .populate('assignedTo', 'name email photo');
        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        res.status(200).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.upvoteIssue = async (req, res) => {
    const { userId } = req.body;
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        if (issue.reporter.toString() === userId) {
            return res.status(403).json({ message: 'Cannot upvote own issue' });
        }

        if (issue.upvotes.includes(userId)) {
            return res.status(400).json({ message: 'Already upvoted' });
        }

        issue.upvotes.push(userId);
        await issue.save();
        res.status(200).json({ message: 'Upvoted successfully', modifiedCount: 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateIssue = async (req, res) => {
    try {
        const { status, priority, timeline, assignedTo, ...otherData } = req.body;
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ message: 'Issue not found' });

        const user = req.user;

        // Authorization 
        if (user.role === 'citizen') {
            // Citizen can only update their own issues
            if (issue.reporter.toString() !== user._id.toString()) {
                return res.status(403).json({ message: 'Forbidden: You can only update your own issues' });
            }
            // Citizen cannot change status or assigned details
            if (status && status !== issue.status) {
                return res.status(403).json({ message: 'Forbidden: Only staff can change issue status' });
            }
            if (assignedTo) {
                return res.status(403).json({ message: 'Forbidden: Only admin can assign staff' });
            }
        }

        // Update basic fields
        if (priority) issue.priority = priority;
        if (assignedTo) issue.assignedTo = assignedTo;
        Object.assign(issue, otherData);

        // Handle Status Change with Timeline
        if (status && status !== issue.status) {
            issue.status = status;
            if (!req.body.timeline) {
                issue.timeline.push({
                    status: status,
                    message: `Issue status updated to ${status}`,
                    updatedBy: { name: user.name, role: user.role },
                    date: new Date()
                });
            }
        }

        // Handle explicit timeline entry
        if (req.body.timeline) {
            issue.timeline.push(req.body.timeline);
        }

        const updatedIssue = await issue.save();
        res.status(200).json(updatedIssue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteIssue = async (req, res) => {
    try {
        const result = await Issue.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Issue not found' });
        res.status(200).json({ message: 'Issue deleted successfully', deletedCount: 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
