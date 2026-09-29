import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronDown, Star, PlusSquare, GitBranch, Monitor, AlertCircle, Bug, Bot, FilePlus, Code2, GitMerge, SlidersHorizontal, Send, Plus, Folder, } from "lucide-react";
import { useSearch } from "../SeachContext";
import { useAuth } from "../../authContext";
import RepoPickerModal from "../RepoPickerModal";


const activity = [
  { icon: Plus, title: "You created a repository", detail: "portfolio", time: "2 hours ago" },
  { icon: AlertCircle, title: "You opened an issue", detail: "Navbar not responsive", time: "5 hours ago" },
  { icon: Monitor, title: "You pushed commits", detail: "portfolio", time: "Yesterday" },
  { icon: GitBranch, title: "You updated a repository", detail: "country-website", time: "2 days ago" },
];

const stats = [
  { icon: Monitor, label: "Repositories", value: 3 },
  { icon: AlertCircle, label: "Open issues", value: 2 },
  { icon: Star, label: "Stars", value: 6 },
  { icon: GitBranch, label: "Commits", value: 12 },
];

const quickActions = [
  { icon: Bug, label: "Debug" },
  { icon: Bot, label: "Agent" },
  { icon: FilePlus, label: "Create issue", key: "create-issue" },
  { icon: Code2, label: "Write code" },
  { icon: GitMerge, label: "Git" },
  { icon: SlidersHorizontal, label: "Pull requests" },
];

const trendingRepos = [
  {
    id: "t1",
    owner: "ayghri",
    name: "i-have-adhd",
    avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    description: "A skill to stop your coding agent from burying the answer. ADHD-friendly output.",
    language: "Python",
    languageColor: "bg-blue-500",
    stars: "38.8k",
  },
  {
    id: "t2",
    owner: "bilawalsidhu",
    name: "gods-eye-view",
    avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    description:
      "A spy satellite simulator in your browser, except the data is real. Live open source spatial intelligence on a photorealistic 3D globe.",
    language: "JavaScript",
    languageColor: "bg-yellow-400",
    stars: "24.7k",
  },
];

function RepoRow({ repo }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border border-[#1e2731] bg-[#0f1620] p-4">
      <div className="flex items-center gap-3">
        <Folder size={18} className="text-teal-400" />

        <span
          onClick={() => navigate(`/repo/id/${repo._id}`)}
          className="cursor-pointer font-medium text-gray-100 hover:underline"
        >
          {repo.name}
        </span>

        <span className="rounded-full border border-[#1e2731] px-2 py-0.5 text-xs text-gray-400">
          {repo.isPrivate ? "Private" : "Public"}
        </span>
      </div>

      <p className="mt-2 text-sm text-gray-400">
        {repo.description || "No description provided."}
      </p>
    </div>
  );
}

function TrendingRepoRow({ repo }) {
  return (
    <div className="rounded-lg border border-[#1e2731] bg-[#0f1620] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src={repo.avatar} alt={repo.owner} className="h-5 w-5 rounded-full" />
          <span className="font-medium text-gray-100">
            {repo.owner}/{repo.name}
          </span>
        </div>

        <button className="flex items-center gap-1 rounded-md border border-[#1e2731] px-3 py-1.5 text-xs text-gray-300 hover:border-[#2a3644]">
          <Star size={12} />
          Star
          <ChevronDown size={12} />
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-400">{repo.description}</p>

      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${repo.languageColor}`} />
          {repo.language}
        </span>
        <span className="flex items-center gap-1">
          <Star size={12} />
          {repo.stars}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {

  const { searchQuery } = useSearch();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState([]);
  const [showRepoPicker, setShowRepoPicker] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!currentUser) return; 

    const fetchRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/user/${userId}`);
        setRepositories(response.data.repositories || []);
      } catch (err) {
        console.error("Error while fetching user repositories: ", err);
        setRepositories([]);
      }
    };

    fetchRepositories();
  }, [currentUser]);


  const topRepos = searchQuery.trim() === ""
    ? repositories
    : repositories.filter((repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const lastRepo = repositories.length
    ? repositories[repositories.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-[#0a0e14] text-gray-200">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr_320px]">

      {/*--------- Left section  --------------*/}
      
        <aside className="order-2 lg:order-1 lg:border-r lg:border-[#1e2731] lg:pr-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-md font-semibold text-gray-200">Top repositories</h2>
            <a href="/repositories" className="text-xs text-teal-400 hover:underline"> View all → </a>
          </div>
          <ul className="space-y-4">
            {topRepos.map((repo) => (
              <li key={repo._id}>
                <p
                  onClick={() => navigate(`/repo/id/${repo._id}`)}
                  className="cursor-pointer text-sm font-medium text-gray-100 hover:underline"
                >
                  {repo.name}
                </p>
                <p className="text-xs text-gray-500">
                  {repo.description || "No description provided."}
                </p>
              </li>
            ))}
            {topRepos.length === 0 && (
              <p className="text-xs text-gray-500">
                {searchQuery.trim() === "" ? "You haven't created a repository yet." : "No repositories match your search."}
              </p>
            )}
          </ul>
        </aside>

        {/* Main content */}

        <main className="order-1 lg:order-2">
          <h1 className="mb-4 text-2xl font-semibold text-white">Home</h1>

          <div className="mb-4 rounded-lg border border-[#1e2731] bg-[#0f1620] p-4">
            <input
              type="text"
              placeholder="Ask anything or type @ to add context"
              className="w-full bg-transparent text-sm text-gray-300 placeholder-gray-500 outline-none"
            />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button className="rounded-md border border-[#1e2731] px-3 py-1.5 text-xs text-gray-300 hover:border-[#2a3644]">
                Ask
              </button>
              <button
                onClick={() => navigate("/repositories")}
                className="rounded-md border border-[#1e2731] px-3 py-1.5 text-xs text-gray-300 hover:border-[#2a3644]">
                All repositories
              </button>
              <button className="rounded-md border border-[#1e2731] p-1.5 text-gray-300 hover:border-[#2a3644]">
                <PlusSquare size={14} />
              </button>
              <button className="ml-auto rounded-md bg-teal-400 p-1.5 text-black hover:bg-teal-300">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => {
                    if (action.key === "create-issue") {
                      setShowRepoPicker(true);
                    } else if (action.path) {
                      navigate(action.path);
                    }
                  }}
                  className="flex items-center gap-2 rounded-md border border-[#1e2731] bg-[#0f1620] px-3 py-2 text-xs text-gray-300 hover:border-[#2a3644]"
                >
                  <Icon size={14} className="text-teal-400" />
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Latest repository  */}

          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-200">Your latest repository</h2>
              <button
                onClick={() => navigate("/repo/create")}
                className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-500"
              >
                <PlusSquare size={16} />
               <span className="hidden sm:inline">New repository</span> 
              </button>
            </div>
            {lastRepo ? (
              <RepoRow repo={lastRepo} />
            ) : (
              <p className="rounded-lg border border-[#1e2731] bg-[#0f1620] p-4 text-sm text-gray-500">
                You haven't created a repository yet.
              </p>
            )}
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-200">Feed</h2>
            <button className="flex items-center gap-2 rounded-md border border-[#1e2731] px-3 py-1.5 text-xs text-gray-300 hover:border-[#2a3644]">
              <SlidersHorizontal size={12} />
              Filter
            </button>
          </div>

          <div className="mb-2 flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp size={14} />
            <span>Trending repositories</span>
            <span className="text-gray-600">·</span>
            <button className="text-teal-400 hover:underline">See more</button>
          </div>

          <div className="space-y-4">
            {trendingRepos.map((repo) => (
              <TrendingRepoRow key={repo.id} repo={repo} />
            ))}
          </div>
        </main>

        {/* Right sidebar  */}

        <aside className="order-3 space-y-6">
          <div className="rounded-lg border border-[#1e2731] bg-[#0f1620] p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-100">Your activity</h2>
            <ul className="space-y-4">
              {activity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#131b25] text-teal-400">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-200">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.detail}</p>
                      <p className="text-xs text-gray-600">{item.time}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-lg border border-[#1e2731] bg-[#0f1620] p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-100">Developer stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <Icon size={16} className="text-teal-400" />
                    <div>
                      <p className="text-sm font-semibold text-white">{s.value}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {
        showRepoPicker && (
          <RepoPickerModal onClose={() => setShowRepoPicker(false)} />
        )
      }

    </div>
  );
}
