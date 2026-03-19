import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left */}
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()}{" "}
          <span className="text-slate-200 font-medium">
            Fit<span className="text-indigo-400">Track</span>
          </span>
          . All rights reserved.
        </div>

        {/* Right */}
        <div className="text-sm text-slate-500">
          Built with <span className="text-slate-300 font-medium">React</span>
          {" & "}
          <span className="text-slate-300 font-medium">Node.js</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
