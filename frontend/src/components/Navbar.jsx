import { useState } from "react";
import RepoPickerModal from "./RepoPickerModal";
import { useNavigate } from "react-router-dom";
import { Menu, X, Search, Plus, ChevronDown, Home, CircleDot, GitPullRequest, Folder, LayoutGrid, MessageSquare, Terminal, Bot, LogOut, Book } from "lucide-react";
import { useSearch } from "./SeachContext";
import { useAuth } from "../authContext";
import toast from "react-hot-toast";


const functionalItems = [
  { key: "home", icon: Home, label: "Home", path: "/dashboard" },
  { key: "issues", icon: CircleDot, label: "All issues", path: "/issues" },
  { key: "repos", icon: Folder, label: "All repositories", path: "/repositories" },
];


const staticItemsTop = [
  { icon: GitPullRequest, label: "All pull requests" },
  { icon: LayoutGrid, label: "Projects" },
  { icon: MessageSquare, label: "Discussions" },
  { icon: Terminal, label: "Codespaces" },
  { icon: Bot, label: "Copilot" },
];

export default function Navbar() {

  const [showRepoPicker, setShowRepoPicker] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const { setCurrentUser } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setCurrentUser(null)
    setMenuOpen(false);
    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 500);

  };

  const userId = localStorage.getItem("userId");

  return (
    <>
      <header className="flex items-center justify-between gap-4 border-b border-[#1e2731] bg-[#0a0e14] px-4 py-3 sm:px-6">

        {/*--------------- Left section ---------------------*/}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-400 hover:text-white"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md ">
              <img src="/github-mark-white.svg" alt="logo" />
            </div>
            <span className=" text-md sm:text-lg font-semibold text-white">CodeHub</span>
          </div>
        </div>

        {/*----------------- Right Section ------------------ */}

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-[#1e2731] bg-[#0f1620] px-3 py-2 sm:flex sm:w-56 md:w-64">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories..."
              className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
          </div>

          {/* Search icon only, for small screens */}

          <button className="text-gray-400 hover:text-white sm:hidden" aria-label="Search">
            <Search size={18} />
          </button>


          <div className="relative">

            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="flex items-center gap-2 rounded-md border border-[#1e2731] px-1.5 py-1.5 sm:px-3 sm:py-2 text-gray-300 hover:border-[#2a3644] hover:text-white"
            >
              <Plus size={16} />
            </button>

            {/* Dropdown */}

            {isCreateOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-lg border border-[#30363d] bg-[#0d1117] py-2 shadow-xl">

                {/* New Issue */}
                
                <button
                  onClick={() => {
                    setIsCreateOpen(false);
                    setShowRepoPicker(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-[#161b22] text-sm font-semibold"
                >
                  <CircleDot size={18} />
                  <span>New issue</span>
                </button>



                {/* New Repository */}

                <button
                  onClick={() => {
                    setIsCreateOpen(false);
                    navigate("/repo/create");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-[#161b22] text-sm font-semibold"
                >
                  <Book size={18} />
                  <span>New repository</span>
                </button>

              </div>
            )}
          </div>

          <div
            onClick={() => navigate(`/userProfile/${userId}`)}
            className="flex items-center gap-2 cursor-pointer">
            <img src="/github-profile.avif" alt="avatar" className="h-8 w-8 rounded-full" />
          </div>

        </div>
      </header>

      {/* Hamburger drawer */}

      {menuOpen && (
        <div className="fixed left-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/60" onClick={() => setMenuOpen(false)} />

          {/* Panel */}
          <div className="flex h-full w-72 flex-col rounded-md gap-1 border-r border-[#1e2731] bg-[#0d1117] p-4">
            <div className="mb-3 flex items-center justify-between">
              <img src="github-profile.avif" className="h-8 w-8 rounded-full" alt="avatar" />
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {functionalItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavigate(item.path)}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-gray-200 hover:bg-[#161d27]"
                  >
                    <Icon size={16} className="text-teal-400" />
                    {item.label}
                  </button>
                );
              })}

              {staticItemsTop.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex cursor-default items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400"
                  >
                    <Icon size={16} className="text-gray-500" />
                    {item.label}
                  </div>
                );
              })}

              <div className="my-2 border-t border-[#1e2731]" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-red-400 hover:bg-[#161d27]"
              >
                <LogOut size={16} /> Logout </button>
            </nav>
          </div>
        </div>
      )}
      {
        showRepoPicker && (
          <RepoPickerModal onClose={() => setShowRepoPicker(false)} />
        )
      }
    </>
  );




}
