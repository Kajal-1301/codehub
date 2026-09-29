import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Folder } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateIssue() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [repo, setRepo] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch repository details

    useEffect(() => {
        const fetchRepo = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/repo/id/${id}`);
                setRepo(res.data);
            } catch (err) {
                console.error(err);
                setError("Could not load repository details.");
            }
        };

        fetchRepo();
    }, [id]);

    // Create issue

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !repo) {
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/repo/id/${id}/issue/create`,{ title, description });

            toast.success("Issue created successfully!");

            setTimeout(() => {
                navigate(`/issue/${res.data._id}`);
            }, 500);

        } catch (err) {
            console.error(err);
            setError("Failed to create issue. Please try again.");
            toast.error("Failed to create issue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-3.9rem)] bg-[#0a0e14] text-gray-200 px-6 py-4">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-teal-400 mb-6"
            >
                <span>&#8592;</span>
                Back to repository
            </button>

            {repo && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-md bg-teal-600/20 flex items-center justify-center text-teal-400">
                        <Folder size={25} />
                    </div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-white">
                            {repo.name}
                        </h2>
                        <span className="text-xs px-2 py-1 rounded-full border border-gray-600 text-gray-400">
                            {repo.visibility ? "Public" : "Private"}
                        </span>
                    </div>
                </div>
            )}

            {error && ( <p className="text-red-500 text-sm mb-4"> {error} </p> )}

            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto border border-gray-700 rounded-lg bg-[#0d1117] p-6"
            >
                <h1 className="text-xl font-bold text-white mb-1"> Create a new issue </h1>

                <p className="text-gray-400 text-sm mb-6"> Report a bug, request a feature, or ask a question. </p>

                {repo && (
                    <div className="mb-6 text-sm text-gray-400">
                        Creating issue in{" "}
                        <span className="text-teal-400 font-medium"> {repo.name} </span>
                    </div>
                )}

                <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter issue title..."
                    required
                    className="w-full mb-5 rounded-md bg-[#0a0e14] border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                />

                <label className="block text-sm font-medium mb-1">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    required
                    rows={6}
                    className="w-full mb-6 rounded-md bg-[#0a0e14] border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-y"
                />

                {error && (
                    <p className="text-red-500 text-sm mb-4"> {error} </p> )}

                <div className="flex justify-end gap-3 border-t border-gray-700 pt-5">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-md bg-[#1c2333] text-gray-200 hover:bg-[#242c40]"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !repo}
                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create issue"}
                    </button>
                </div>
            </form>
        </div>
    );
}