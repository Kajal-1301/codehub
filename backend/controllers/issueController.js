const Issue = require("../models/issueModel");
const Repository = require("../models/repoModel");

// Create an issue   --------------

async function createIssue(req, res) {

    const { title, description } = req.body
    const { id } = req.params

    try {
        const issue = new Issue({ title, description, repository: id })
        await issue.save()
        res.status(201).json(issue)

    } catch (err) {

        console.error("Error during issue creation:", err.message)
        res.status(500).json({ error: "Server error" })
    }
}

// Update issue title/description  -----------------

async function updateIssue(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        if (title !== undefined) issue.title = title;
        if (description !== undefined) issue.description = description;

        const updatedIssue = await issue.save();
        const populatedIssue = await updatedIssue.populate("repository");

        res.status(200).json(populatedIssue);

    } catch (err) {
        console.error("Error during issue update:", err.message);
        res.status(500).json({ error: "Server error" });
    }
}

// Update issue status (open/closed)  -----------------

async function updateIssueStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (!["open", "closed"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value!" });
        }

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }

        issue.status = status;
        const updatedIssue = await issue.save();
        const populatedIssue = await updatedIssue.populate("repository");

        res.status(200).json(populatedIssue);

    } catch (err) {
        console.error("Error during issue status update:", err.message);
        res.status(500).json({ error: "Server error" });
    }
}

// Delete an issue  -----------------

async function deleteIssueById(req, res) {
    const { id } = req.params;
    try {
        const issue = await Issue.findByIdAndDelete(id)
        if (!issue) {
            return res.status(404).json({
                error: "Issue not found!",
            });
        }
        res.status(200).json({
            message: "Issue deleted successfully"
        })

    } catch (err) {

        console.error("Error during issue deletion:", err.message);
        res.status(500).json({
            error: "Server error"
        })
    }
}

//  Get a single issue by id ---------------

async function getIssueById(req, res) {
    const { id } = req.params;
    try {
        const issue = await Issue.findById(id).populate("repository")
        if (!issue) {
            return res.status(404).json({
                error: "Issue not found!",
            });
        }
        res.status(200).json(issue);
    } catch (err) {

        console.error("Error during issue fetching:", err.message);
        res.status(500).json({
            error: "Server error"
        });
    }
}

async function getAllIssuesForUser(req, res) {
    const { userId } = req.params;

    try {
        // Find all repos owned by this user
        const repos = await Repository.find({ owner: userId });
        const repoIds = repos.map((repo) => repo._id);

        // Find all issues belonging to those repos
        const issues = await Issue.find({ repository: { $in: repoIds } })
            .populate("repository")
            .sort({ _id: -1 }); // newest first

        res.status(200).json(issues);

    } catch (err) {
        console.error("Error during fetching all issues:", err.message);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    createIssue,
    updateIssue,
    updateIssueStatus,
    deleteIssueById,
    getIssueById,
    getAllIssuesForUser
}