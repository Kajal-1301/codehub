const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitId) {
  const repoPath = path.resolve(process.cwd(), ".git");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitId);
    const files = await fs.readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      await fs.copyFile(
        path.join(commitDir, file),
        path.join(parentDir, file)
      );
    }

    console.log(`Commit ${commitId} reverted successfully!`);
  } catch (err) {
    console.error("Unable to revert : ", err);
  }
}

module.exports = { revertRepo };