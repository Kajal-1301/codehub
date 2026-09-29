import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X, Folder } from "lucide-react";

function RepoPickerModal({ onClose }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/repo/user/${userId}`);
                setRepos(res.data.repositories);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRepos();
    }, [userId]);

    const handleSelect = (repoId) => {
        onClose();
        navigate(`/repo/id/${repoId}/issue/create`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#0d1117] border border-gray-700 rounded-lg w-full max-w-md p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-white font-semibold text-sm">
                        Select a repository
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={18} />
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-400 text-sm">Loading repositories...</p>
                ) : repos.length === 0 ? (
                    <p className="text-gray-400 text-sm">No repositories found.</p>
                ) : (
                    <div className="max-h-72 overflow-y-auto flex flex-col gap-1">
                        {repos.map((repo) => (
                            <button
                                key={repo._id}
                                onClick={() => handleSelect(repo._id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#161b22] text-left text-gray-200 text-sm"
                            >
                                <Folder size={16} className="text-teal-400" />
                                {repo.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RepoPickerModal;