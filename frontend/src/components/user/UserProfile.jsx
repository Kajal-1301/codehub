import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Mail, Calendar, Pencil, Folder, CircleDot, Check, X } from "lucide-react";
import toast from "react-hot-toast";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [repoCount, setRepoCount] = useState(0);
  const [issueCount, setIssueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, reposRes, issuesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/userProfile/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/repo/user/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/issue/user/${id}`),
        ]);

        setUser(userRes.data);
        setRepoCount(reposRes.data.repositories.length);
        setIssueCount(issuesRes.data.length);
      } catch (err) {
        console.error(err);
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const startEditing = () => {
    setUsernameInput(user.username);
    setIsEditing(true);
  };

  const saveUsername = async () => {
    if (!usernameInput.trim()) return;
    setSaving(true);
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/userProfile/${id}/update`, {
        username: usernameInput,
      });
      setUser(res.data);
      setIsEditing(false);
      toast.success("Username updated successfully!");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.error || "Failed to update username."; 
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] flex items-center justify-center">
        <p className="text-red-500 text-sm">{error || "User not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-gray-200 px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">

       
        <div className="border border-[#1e2731] rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        
          <div className="flex items-start gap-4">
            <img
              src={user.avatar || "/github-profile.avif"}
              alt="avatar"
              className="w-20 h-20 rounded-full border border-[#1e2731] shrink-0"
            />

            <div className="min-w-0 flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2 mb-2 w-full">
                  <input
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="min-w-0 flex-1 w-full bg-[#0f1620] border border-[#1e2731] rounded-md px-2 py-1 text-lg font-semibold text-white outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={saveUsername}
                    disabled={saving}
                    className="text-teal-400 hover:text-teal-300 disabled:opacity-50"
                    title="Save"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="text-gray-400 hover:text-white"
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <h1 className="text-xl font-bold text-white mb-1">{user.username}</h1>
              )}

              <p className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} /> {user.email}
              </p>
              {user.createdAt && (
                <p className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}

              {!isEditing && (
                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-md border border-[#1e2731] bg-[#0f1620] text-sm text-gray-300 hover:border-[#2a3644]"
                >
                  <Pencil size={14} /> Edit profile
                </button>
              )}
            </div>
          </div>

          {/* Right- counts */}
          
          <div className="flex items-center gap-6 sm:gap-8 sm:border-l sm:border-[#1e2731] sm:pl-6">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-white text-lg font-semibold">
                <Folder size={18} /> {repoCount}
              </div>
              <span className="text-xs text-gray-400">Repositories</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 text-white text-lg font-semibold">
                <CircleDot size={18} /> {issueCount}
              </div>
              <span className="text-xs text-gray-400">Issues</span>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={() => navigate("/repositories")}
            className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white"
          >
            Repositories
          </button>
          <button
            onClick={() => navigate("/issues")}
            className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-white"
          >
            Issues
          </button>
        </div>
      </div>
    </div>
  );
}