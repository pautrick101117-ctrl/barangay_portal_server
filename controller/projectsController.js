const Project = require("../db/model/Project");
const User = require("../db/model/User");

// Helper: Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Helper: Check and update project statuses based on time
const updateProjectStatuses = async () => {
  const currentMonth = getCurrentMonth();
  
  // Move active projects to past if month has ended
  await Project.updateMany(
    { status: "active", monthPosted: { $lt: currentMonth } },
    { status: "past" }
  );
  
  // Move upcoming projects to active on the 1st day of the month
  const now = new Date();
  if (now.getDate() === 1) {
    await Project.updateMany(
      { status: "upcoming", monthPosted: currentMonth },
      { status: "active" }
    );
  }
};

// 📥 Get all projects (with vote counts)
const getProjects = async (req, res) => {
  try {
    await updateProjectStatuses(); // Update statuses before fetching
    
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get active projects only (for voting)
const getActiveProjects = async (req, res) => {
  try {
    await updateProjectStatuses();
    
    const projects = await Project.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📥 Get user's vote status
const getUserVoteStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).populate('votedProjectId');
    const currentMonth = getCurrentMonth();

    // Check if user has voted this month
    const hasVoted = user.lastVoteMonth === currentMonth;

    res.json({
      hasVoted,
      votedProject: hasVoted ? user.votedProjectId : null,
      currentMonth
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add new project
const addProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = getCurrentMonth();

    // Determine status based on posting date
    let status = "upcoming";
    if (currentDay === 1) {
      status = "active"; // If posted on 1st day, make it active immediately
    }

    const newProject = await Project.create({ 
      title, 
      description,
      status,
      monthPosted: currentMonth
    });

    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗳️ Vote for a project
// 🗳️ Vote or Cancel vote for a project
const voteProject = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!projectId) return res.status(400).json({ message: "Project ID required" });

    await updateProjectStatuses();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const currentMonth = getCurrentMonth();

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.status !== "active") {
      return res.status(400).json({ message: "This project is not available for voting" });
    }

    // If user already voted for this project this month, cancel vote
    if (user.lastVoteMonth === currentMonth && user.votedProjectId?.toString() === projectId) {
      project.votes = Math.max(0, project.votes - 1);
      project.votedUsers = project.votedUsers.filter(id => id.toString() !== userId);
      await project.save();

      user.votedProjectId = null;
      user.lastVoteMonth = null;
      await user.save();

      return res.json({ message: "Vote cancelled", project, cancelled: true });
    }

    // If user has voted for another project this month, block them
    if (user.lastVoteMonth === currentMonth && user.votedProjectId) {
      return res.status(400).json({ message: "You have already voted this month" });
    }

    // Add new vote
    project.votes += 1;
    if (!project.votedUsers.includes(userId)) {
      project.votedUsers.push(userId);
    }
    await project.save();

    // Update user's vote record
    user.votedProjectId = projectId;
    user.lastVoteMonth = currentMonth;
    await user.save();

    res.json({ message: "Vote recorded successfully", project, cancelled: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❌ Delete project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Remove this project from users who voted for it
    await User.updateMany(
      { votedProjectId: id },
      { $unset: { votedProjectId: "" } }
    );

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
  getProjects, 
  getActiveProjects,
  getUserVoteStatus,
  addProject, 
  voteProject,
  deleteProject 
};