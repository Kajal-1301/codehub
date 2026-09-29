import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Folder, Search } from "lucide-react";

export default function AllRepositories() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/repo/user/${userId}`);
        setRepos(res.data.repositories);
      } catch (err) {
        console.error(err);
        setError("Could not load repositories.");
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [userId]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-gray-200 px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">All repositories</h1>
            <p className="text-sm text-gray-500">Your repositories on CodeHub.</p>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-[#1e2731] bg-[#0f1620] px-3 py-2 w-full sm:w-64">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search repositories..."
              className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
          </div>
        </div>

        {/* States */}
        
        {loading && <p className="text-gray-400 text-sm">Loading repositories...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && !error && filteredRepos.length === 0 && (
          <p className="text-gray-400 text-sm">No repositories found.</p>
        )}

        {/* Repo list */}
        <div className="border border-[#1e2731] rounded-lg divide-y divide-[#1e2731]">
          {filteredRepos.map((repo) => (
            <button
              key={repo._id}
              onClick={() => navigate(`/repo/id/${repo._id}`)}
              className="flex items-start gap-4 w-full text-left px-5 py-4 hover:bg-[#0f1620] transition"
            >
              <div className="w-11 h-11 rounded-md bg-teal-600/20 flex items-center justify-center text-teal-400 shrink-0">
                <Folder size={22} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-white font-semibold">{repo.name}</h2>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      repo.visibility === "private"
                        ? "border-gray-600 text-gray-400"
                        : "border-teal-600 text-teal-400"
                    }`}
                  >
                     {repo.visibility ? "Public" : "Private"}
                  </span>
                </div>
                {repo.description && (
                  <p className="text-sm text-gray-400 mt-1 truncate">
                    {repo.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}