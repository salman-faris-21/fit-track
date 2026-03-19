import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRight } from "lucide-react";
import Ai from "../assets/login-img.png";
import TerminalOverlay from "../components/TerminalOverlay";
import UserPrograms from "../components/UserProgram";

const CallPage = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          toast.error("No token, please login again.");
          navigate("/login");
          return;
        }

        const { data } = await axios.get("/api", {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Welcome to the Fit-Track community!");
      } catch (error) {
        toast.error("Error fetching data, please try again later.");
        console.error("CallPage error:", error);
      }
    };

    fetchData();
  }, [token, navigate]);
  return (
    <div className="relative w-screen min-h-screen ">
      <div className="absolute inset-0 bg-cyan-950 " />
      <div className="absolute inset-0 animated-grid" />
      {/* background layers */}
      <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
        <section className="relative z-10 py-24 flex-grow">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
              <div className="absolute -top-10 left-0 w-40 h-40 border-l-2 border-t-2" />

              {/* LEFT SIDE */}
              <div className="lg:col-span-7 space-y-8 relative">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  <div>
                    <span className="text-foreground">Transform</span>
                  </div>
                  <div>
                    <span className="text-primary">Your Body</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-foreground">With Advanced</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-foreground">AI</span>
                    <span className="text-primary"> Technology</span>
                  </div>
                </h1>

                <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                <p className="text-xl text-muted-foreground w-2/3">
                  Talk to our AI assistant and get personalized diet plans and
                  workout routines designed just for you
                </p>

                <div className="flex items-center gap-10 py-6 font-mono">
                  <div className="flex flex-col">
                    <div className="text-2xl text-primary">500+</div>
                    <div className="text-xs uppercase tracking-wider">
                      ACTIVE USERS
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                  <div className="flex flex-col">
                    <div className="text-2xl text-primary">3min</div>
                    <div className="text-xs uppercase tracking-wider">
                      GENERATION
                    </div>
                  </div>
                  <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                  <div className="flex flex-col">
                    <div className="text-2xl text-primary">100%</div>
                    <div className="text-xs uppercase tracking-wider">
                      PERSONALIZED
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <a
                    href="/generate-program"
                    className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-mono font-medium rounded inline-flex items-center"
                  >
                    Build Your Program
                    <ArrowRight className="ml-2 size-5" />
                  </a>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-4 pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
                </div>

                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="relative overflow-hidden rounded-lg bg-black">
                    <img
                      src={Ai}
                      alt="AI Fitness Coach"
                      className="w-full h-full object-cover object-bottom"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />
                      <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                      <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                      <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                      <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  </div>

                  <TerminalOverlay />
                </div>
              </div>
            </div>
          </div>
        </section>

        <UserPrograms />
      </div>
    </div>
  );
};

export default CallPage;
