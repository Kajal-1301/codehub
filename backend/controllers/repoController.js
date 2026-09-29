const Repository = require("../models/repoModel");
const mongoose = require("mongoose")


// Create repository ----------------

async function createRepository(req, res) {

  const { name, description, visibility, owner } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({ name, description, visibility, owner });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    })

  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).send("Server error");
  }
}

// Get repo by id---------------

async function fetchRepositoryById(req, res) {

  const { id } = req.params

  try {

    const repository = await Repository.findById(id)

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    res.json(repository)

  } catch (err) {

    console.error("Error during fetching repository:", err.message);

    res.status(500).json({
      error: "Server error",
    });

  }
}


// Get repo for current user  ----------------

async function fetchRepositoriesForCurrentUser(req, res) {

  const { userId } = req.params;

  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: "Invalid User ID!",
      });
    }

    const repositories = await Repository.find({ owner: userId });

    res.json({
      message: "Repositories found!",
      repositories,
    })

  } catch (err) {

    console.error("Error during fetching user repositories:", err.message)

    res.status(500).json({
      error: "Server error",
    });

  }
}

// Update repo ---

async function updateRepositoryById(req, res) {
  console.log("UPDATE ROUTE HIT");
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Repository ID!",
      });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    if (name !== undefined) {
      repository.name = name;
    }

    if (description !== undefined) {
      repository.description = description;
    }

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });

  } catch (err) {
    console.error("Error during updating repository:", err.message);

    res.status(500).json({
      error: "Server error",
    });
  }
}


// Delete repo by id ---------------

async function deleteRepositoryById(req, res) {

  const { id } = req.params;

  try {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Repository ID!",
      });
    }

    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    res.json({
      message: "Repository deleted successfully!",
    })

  } catch (err) {

    console.error("Error during deleting repository:", err.message);

    res.status(500).json({
      error: "Server error",
    });

  }
}


module.exports = {
  createRepository,
  fetchRepositoryById,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById
}


