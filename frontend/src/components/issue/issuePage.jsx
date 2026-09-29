import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Pencil, Trash, Folder } from "lucide-react"
import toast from "react-hot-toast";


export default function IssuePage() {
  const { issueId } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/issue/${issueId}`);
        setIssue(res.data);
        setEditTitle(res.data.title);
        setEditDescription(res.data.description);
      } catch (err) {
        setError("Could not load this issue.");
      }
    };
    fetchIssue();
  }, [issueId]);

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editDescription.trim()) return;
    setSaving(true);
    try {
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/issue/${issueId}/update`, {
        title: editTitle,
        description: editDescription,
      });
      setIssue(res.data);
      setIsEditing(false);
      toast.success("Issue updated successfully!");

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update issue.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    setToggling(true);
    try {
      const newStatus = issue.status === "open" ? "closed" : "open";
      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/issue/${issueId}/status`, {
        status: newStatus,
      });
      setIssue(res.data);
    } catch (err) {
      setError("Failed to update issue status.");
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/issue/delete/${issueId}`);

      toast.success("Issue deleted successfully!");

      setTimeout(() => {
        navigate(`/repo/id/${issue.repository._id}`);
      }, 500)

    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete issue.");
    }
  };

  if (error) return <p className="text-red-500 px-6 py-6">{error}</p>;
  if (!issue) return <p className="text-gray-400 px-6 py-6">Loading...</p>;

  const isOpen = issue.status === "open";

  return (
    <div className="bg-[#0d1117] text-gray-200 px-6 py-6 min-h-[calc(100vh-3.9rem)]">
      <button
        onClick={() => navigate(`/repo/id/${issue.repository._id}`)}
        className="flex items-center gap-2 text-teal-400 hover:underline mb-4"
      >
        <span>&#8592;</span> Back to repository
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="sm:w-11 sm:h-11 w-9 h-9 rounded-md bg-teal-600/20 flex items-center justify-center text-teal-400">
          <Folder />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              {issue.repository.name}
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto border border-gray-700 rounded-lg overflow-hidden">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-3">
            <span
              className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border-2 shrink-0 ${isOpen
                ? "border-green-500 text-green-500"
                : "border-gray-500 text-gray-500"
                }`}
            >
              !
            </span>
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-[#0d1117] border border-gray-700 rounded-md px-3 py-1.5 text-lg font-semibold text-white w-full focus:outline-none focus:border-teal-500"
                />
              ) : (
                <h1 className=" text-lg sm:text-xl font-semibold text-white">
                  {issue.title}
                </h1>
              )}
              <span
                className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${isOpen
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-gray-200"
                  }`}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                title="Edit issue"
                className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-md bg-[#1c2333] hover:bg-[#242c40] text-gray-300"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                title="Delete issue"
                className="w-7 h-7 sm:w-9 sm:h-9  flex items-center justify-center rounded-md bg-red-900/40 border border-red-800 hover:bg-red-900/60 text-red-400"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 px-5 py-4">
          <h3 className="text-sm font-semibold text-white mb-2">
            Description
          </h3>
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={5}
              className="w-full rounded-md bg-[#0d1117] border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-y"
            />
          ) : (
            <div className="border border-gray-700 rounded-md px-4 py-3 text-sm text-gray-300 whitespace-pre-wrap">
              {issue.description}
            </div>
          )}
        </div>

        {message && (
          <p className="px-5 pb-2 text-sm text-teal-400">{message}</p>
        )}

        <div className="border-t border-gray-700 px-5 py-4 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(issue.title);
                  setEditDescription(issue.description);
                }}
                className="px-4 py-2 rounded-md bg-[#1c2333] text-gray-200 hover:bg-[#242c40]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </>
          ) : (
            <button
              onClick={handleToggleStatus}
              disabled={toggling}
              className={`px-4 py-2 rounded-md text-white disabled:opacity-50 ${isOpen
                ? "bg-[#1c2333] hover:bg-[#242c40]"
                : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {toggling ? "Updating..." : isOpen ? "Close issue" : "Reopen issue"}
              
            </button>
          )}
        </div>
      </div>
    </div>
  );
}