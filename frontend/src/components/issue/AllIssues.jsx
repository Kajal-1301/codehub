import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CircleDot, CheckCircle2, Search } from "lucide-react";

export default function AllIssues() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/issue/user/${userId}`);
        setIssues(res.data);
      } catch (err) {
        console.error(err);
        setError("Could not load issues.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [userId]);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-gray-200 px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">All Issues</h1>
            <p className="text-sm text-gray-500">
              Track and manage issues across all your repositories.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 rounded-md border border-[#1e2731] bg-[#0f1620] px-3 py-2 w-full sm:w-64">
              <Search size={16} className="text-gray-500 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search issues..."
                className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-[#1e2731] bg-[#0f1620] px-2 py-2 text-sm text-gray-300 outline-none"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* States */}

        {loading && <p className="text-gray-400 text-sm">Loading issues...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!loading && !error && (
          <div className="border border-[#1e2731] rounded-lg overflow-hidden">

            <div className="px-5 py-3 text-sm text-gray-400 border-b border-[#1e2731]">
              {filteredIssues.length} issue{filteredIssues.length !== 1 ? "s" : ""}
            </div>

            {filteredIssues.length === 0 ? (
              <p className="text-gray-400 text-sm px-5 py-6">No issues found.</p>
            ) : (
              <div className="divide-y divide-[#1e2731]">
                {filteredIssues.map((issue) => {
                  const isOpen = issue.status === "open";
                  return (
                    <button
                      key={issue._id}
                      onClick={() => navigate(`/issue/${issue._id}`)}
                      className="flex items-start gap-3 w-full text-left px-5 py-4 hover:bg-[#0f1620] transition"
                    >
                      {isOpen ? (
                        <CircleDot size={18} className="text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <CheckCircle2 size={18} className="text-blue-500 mt-0.5 shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <h2 className="text-white font-medium truncate">
                            {issue.title}
                          </h2>
                          <span
                            className={`text-xs px-2 py-1 rounded-full text-white shrink-0 ${
                              isOpen ? "bg-green-600" : "bg-blue-600"
                            }`}
                          >
                            {isOpen ? "Open" : "Closed"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {issue.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {issue.repository?.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}