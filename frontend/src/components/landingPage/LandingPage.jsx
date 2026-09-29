import { Package, Bug, GitCommit, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "./AnimatedBackground";
import { Link } from "react-router-dom"

const features = [
  { icon: Package, title: "Unlimited repos", subtitle: "Public or private" },
  { icon: Bug, title: "Issue tracking", subtitle: "Stay on top of bugs" },
  { icon: GitCommit, title: "Commits", subtitle: "Track every change" },
  { icon: Users, title: "Team collaboration", subtitle: "Review and merge together" },
];

export default function LandingPage() {

  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f16] text-white">

      <AnimatedBackground />

      {/*----------------- Navbar -------------------------*/}

      <nav className="sticky top-0 z-20 flex items-center justify-between  px-4 py-3 sm:px-20 backdrop-blur-lg bg-[#0a0f16]30">
        <div className="flex items-center gap-2">
          <img src="github-mark-white.svg" alt="CodeHub logo" className="h-7 w-7" />
          <span className="text-base font-semibold sm:text-lg">CodeHub</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/login")}
            className="rounded-md border border-slate-700 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 sm:px-4 sm:text-sm">
            Sign in
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="rounded-md bg-teal-400 px-3 py-2 text-xs font-semibold text-[#04342c] hover:bg-teal-300 sm:px-4 sm:text-sm">
            Sign up
          </button>
        </div>
      </nav>

      {/*-------------   Hero  ---------------*/}

      <div className="relative mx-auto max-w-2xl px-4 pt-10 pb-12 text-center sm:px-6 sm:pt-16 sm:pb-16">
        <img src="github-mark-white.svg" alt="CodeHub logo" className="mx-auto mb-6 h-12 w-12 shrink-0" />

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Where developers
        </h1>

        <h1 className="text-3xl font-bold leading-tight text-teal-400 sm:text-4xl md:text-5xl">
          build together
        </h1>

        <p className="mt-6 text-sm text-slate-400 sm:text-base md:text-lg">
          Create repositories, track issues, and collaborate with
          your team.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/signup")}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-teal-400 px-5 py-3 text-sm font-semibold text-[#04342c] hover:bg-teal-300 sm:w-auto">
            Get started free
            <ArrowRight className="h-4 w-4" />
          </button>

          <button className="w-full rounded-md border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 sm:w-auto">
            Learn more
          </button>
        </div>

      </div>

      {/*-------------------- Feature bar ---------------------*/}

      <div className="relative mx-auto mb-8 max-w-5xl px-4 sm:px-6">
        <div className="feature-card grid grid-cols-1 gap-8 rounded-xl px-6 py-8 sm:grid-cols-2 sm:px-8 sm:py-10 md:grid-cols-4">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="text-center">
              <Icon className="mx-auto mb-2 h-6 w-6 text-teal-400" />
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
