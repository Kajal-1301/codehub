import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


function CreateRepository() {
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);             // true - public, false - private

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Repository name is required!");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/repo/create", { name, description, visibility, owner: userId });

      const repoId = res.data.repositoryID;

      toast.success("Repository created successfully!");
      setTimeout(() => {
        navigate(`/repo/id/${repoId}`);
      })

    } catch (err) {
      console.error("Error creating repository:", err);
      const errorMessage =  err.response?.data?.error || "Something went wrong. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-white px-6 py-2">

      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 pt-4"
      >
        <span>&larr;</span> Back to dashboard
      </button>

      {/* Card */}
      <div className="max-w-2xl mx-auto bg-[#0d1117] border border-gray-800 rounded-lg p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-teal-900/40 p-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Create a new repository</h1>
            <p className="text-gray-400 text-sm mt-1">
              A repository contains all project files, including the revision
              history. You can share it with others or keep it private.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">  Repository name * </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. my-awesome-project"
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-md px-4 py-2.5
                         text-sm placeholder-gray-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of your project..."
              rows={2}
              className="w-full bg-[#0a0e14] border border-gray-700 rounded-md px-4 py-2.5
                         text-sm placeholder-gray-500 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Visibility
            </label>

            <div className="space-y-3">
              {/* Public option */}
              <label
                className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer
                  ${visibility
                    ? "border-teal-400 bg-teal-900/10"
                    : "border-gray-700"
                  }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === true}
                  onChange={() => setVisibility(true)}
                  className="accent-teal-400"
                />
                <span className="text-teal-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <path
                      strokeWidth={2}
                      d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
                    />
                  </svg>
                </span>
                <div>
                  <p className="font-medium">Public</p>
                  <p className="text-xs text-gray-400">
                    Anyone can view this repository.
                  </p>
                </div>
              </label>

              {/* Private option */}
              <label
                className={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer
                  ${!visibility
                    ? "border-teal-400 bg-teal-900/10"
                    : "border-gray-700"
                  }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === false}
                  onChange={() => setVisibility(false)}
                  className="accent-teal-400"
                />
                <span className="text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <rect x="5" y="11" width="14" height="9" rx="2" strokeWidth={2} />
                    <path strokeWidth={2} d="M8 11V7a4 4 0 018 0v4" />
                  </svg>
                </span>
                <div>
                  <p className="font-medium">Private</p>
                  <p className="text-xs text-gray-400">
                    Only you can view this repository.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          {/* Actions */}
          
          <div className="flex justify-end gap-3 pt-2 ">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-md text-sm bg-[#161b22] border border-gray-700
                         hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm bg-green-600 hover:bg-green-700
                         disabled:opacity-50 font-medium"
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRepository;