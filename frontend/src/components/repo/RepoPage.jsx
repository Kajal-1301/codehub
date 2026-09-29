import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Search, Code2, GitBranch, CircleDot, GitPullRequest, Play, Settings, Star, GitFork, ChevronDown, Pencil, Trash2, Check, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const TABS = [
  { name: "Code", icon: Code2, path: "#" },
  { name: "Pull requests", icon: GitPullRequest, path: "#" },
  { name: "Actions", icon: Play, path: "#" },
  { name: "Settings", icon: Settings, path: "#" },
];

export default function RepoPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("Code");

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
  
    const fetchRepo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/repo/id/${id}`);
        setRepo(res.data);
      } catch (err) {
        console.error("Failed to load repo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  const handleTabClick = (tab) => {
    setActiveTab(tab.name);
    navigate(tab.path);
  };

  const startEditing = () => {
    setNameInput(repo?.name || "");
    setDescInput(repo?.description || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveEditing = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/repo/update/${id}`, {
        name: nameInput,
        description: descInput,
      });
      setRepo(res.data.repository);
      setIsEditing(false);
      toast.success("Repository updated successfully!");
    } catch (err) {
      console.error("Failed to update repo:", err);
      toast.error(err.response?.data?.error || "Failed to update repository.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this repository? This can't be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/repo/delete/${id}`);

      toast.success("Repository deleted successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500)

    } catch (err) {
      console.error("Failed to delete repo:", err);
      toast.error(err.response?.data?.error || "Failed to delete repository.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-white flex items-center justify-center">
        <p className="text-white/50 text-sm">Loading repository...</p>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-white flex items-center justify-center">
        <p className="text-white/50 text-sm">Repository not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-white">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm mb-4 pt-4 px-4"
      >
        <ChevronLeft className="w-4 h-4" /> Back to dashboard
      </button>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Repo header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-12 h-12 shrink-0 rounded-lg bg-teal-400/10 border border-teal-400/40 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-teal-400" />
            </div>


            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-lg font-semibold outline-none focus:border-teal-400"
                    placeholder="Repository name"
                  />
                  <textarea
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-sm text-white/70 outline-none focus:border-teal-400 resize-none"
                    placeholder="Short description"
                    rows={2}
                  />
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={saveEditing}
                      disabled={saving}
                      className="flex items-center gap-1 bg-teal-400/10 border border-teal-400 text-teal-400 rounded-md px-3 py-1 text-sm disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex items-center gap-1 border border-white/10 rounded-md px-3 py-1 text-sm"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-semibold truncate">{repo.name}</h1>
                    <button
                      onClick={startEditing}
                      title="Edit name and description"
                      className="text-white/50 hover:text-teal-400 shrink-0"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white/50 text-sm mt-1">
                    {repo.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/50 mt-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <GitBranch className="w-4 h-4" /> main
                    </span>
                    <span className="flex items-center gap-1">
                      <CircleDot className="w-4 h-4" /> 0 issues
                    </span>
                    <span>Updated recently</span>
                  </div>
                </>
              )}
            </div>
          </div>


          <div className="flex items-center gap-2 flex-wrap self-start">
            <button className="flex items-center gap-1 border border-white/10 rounded-md px-3 py-1.5 text-sm">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Star</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 border border-white/10 rounded-md px-3 py-1.5 text-sm">
              <GitFork className="w-4 h-4" />
              <span className="hidden sm:inline">Fork</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete repository"
              className="flex items-center gap-1 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md px-3 py-1.5 text-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{deleting ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>


        <div className="flex items-center gap-6 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`flex items-center gap-2 pb-3 text-sm border-b-2 -mb-px transition-colors whitespace-nowrap cursor-pointer shrink-0 ${isActive
                  ? "border-teal-400 text-teal-400"
                  : "border-transparent text-white/60 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline"> {tab.name} </span>
                <span className="text-xs bg-white/10 rounded-full px-1.5">{tab.count}</span>
              </button>
            );
          })}
        </div>


        <div className="border border-white/10 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2 border-b border-white/10 bg-white/2">
            <button className="flex items-center gap-1 text-sm border border-white/10 rounded-md px-2 py-1 w-fit">
              <GitBranch className="w-4 h-4" /> main <ChevronDown className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-2 py-1">
              <Search className="w-4 h-4 text-white/40" />
              <input
                placeholder="Search files..."
                className="bg-transparent outline-none text-xs placeholder:text-white/40 w-full sm:w-32"
              />
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Code2 className="w-4 h-4" /> README.md
            </div>

            <h2 className="text-teal-400 font-semibold text-lg mb-3">
              Quick setup — if you've done this kind of thing before
            </h2>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <button className="border border-white/10 rounded-md px-3 py-1.5 text-sm">
                Set up in desktop
              </button>
              <span className="text-white/40 text-sm">or</span>
              <button className="bg-teal-400/10 border border-teal-400 text-teal-400 rounded-md px-3 py-1.5 text-sm">
                HTTPS
              </button>
              <button className="border border-white/10 rounded-md px-3 py-1.5 text-sm">
                SSH
              </button>
            </div>

            <pre className="bg-black/40 border border-white/10 rounded-md p-3 text-sm text-white/70 mb-4 overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal">
              git clone https://github.com/{repo.owner?.username || "Username"}/{repo.name}.git
            </pre>

            <p className="text-sm text-white/60">
              Get started by creating a new file or{" "}
              <span className="text-teal-400 underline cursor-pointer">upload a file</span>.
              We recommend every repository include a README, LICENSE, and .gitignore.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}