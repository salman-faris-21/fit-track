import React from "react";
import { USER_PROGRAMS } from "../assets/assets.js";
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  Shield,
  Apple as AppleIcon,
} from "lucide-react";

const Button = ({ children, className }) => (
  <button className={`rounded-md font-medium ${className}`}>{children}</button>
);

const Card = ({ children, className }) => (
  <div className={`rounded-lg border ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`px-5 pt-6 ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`px-5 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={`px-5 py-4 border-t ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>
);

const UserPrograms = () => {
  return (
    <div className="w-full pb-18 pt-10 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="bg-[#1f1f1f]/90 backdrop-blur-sm border border-[#2e2e2e] rounded-lg overflow-hidden mb-16">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#2e2e2e] bg-[#0f0f0f]/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></div>
              <span className="text-sm text-[#7c3aed] font-medium">
                Program Gallery
              </span>
            </div>
            <div className="text-sm text-[#bababd]">Featured Plans</div>
          </div>

          <div className="p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">AI-Generated </span>
              <span className="text-[#7c3aed]">Programs</span>
            </h2>
            <p className="text-lg text-[#a1a1aa] max-w-xl mx-auto mb-10">
              Explore personalized fitness plans our AI assistant has created
              for other users
            </p>

            <div className="flex items-center justify-center gap-16 mt-10 font-mono">
              <div className="flex flex-col items-center">
                <p className="text-3xl text-[#7c3aed]">500+</p>
                <p className="text-sm text-[#a1a1aa] uppercase tracking-wide mt-1">
                  PROGRAMS
                </p>
              </div>
              <div className="w-px h-12 bg-[#2e2e2e]"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-[#7c3aed]">3min</p>
                <p className="text-sm text-[#a1a1aa] uppercase tracking-wide mt-1">
                  CREATION TIME
                </p>
              </div>
              <div className="w-px h-12 bg-[#2e2e2e]"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-[#7c3aed]">100%</p>
                <p className="text-sm text-[#a1a1aa] uppercase tracking-wide mt-1">
                  PERSONALIZED
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USER_PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="bg-[#1f1f1f]/90 backdrop-blur-sm border border-[#2e2e2e] hover:border-[#7c3aed]/50 transition-colors overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#2e2e2e] bg-[#0f0f0f]/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                  <span className="text-sm text-[#7c3aed]">
                    USER.{program.id}
                  </span>
                </div>
                <div className="text-sm text-[#a1a1aa]">
                  {program.fitness_level.toUpperCase()}
                </div>
              </div>

              {/* Body */}
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border border-[#2e2e2e]">
                    <img
                      src={program.profilePic}
                      alt={program.first_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-white">
                      {program.first_name}
                      <span className="text-[#7c3aed]">.exe</span>
                    </CardTitle>
                    <div className="text-sm text-[#a1a1aa] flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      {program.age}y • {program.workout_days}d/week
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="px-3 py-1 bg-[#7c3aed]/10 rounded border border-[#7c3aed]/20 text-sm text-[#7c3aed] flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {program.fitness_goal}
                  </div>
                  <div className="text-sm text-[#a1a1aa] flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    v3.5
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              <CardContent>
                <div className="space-y-5 pt-2">
                  <div className="flex flex-col justify-between gap-2 min-h-[200px]">
                    {/* Workout Plan */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-[#7c3aed]/10 text-[#7c3aed] mt-0.5">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">
                          {program.workout_plan?.title || "Workout Plan"}
                        </h3>
                        <p className="text-sm text-[#a1a1aa] mt-2">
                          {program.equipment_access || "No equipment info"}
                        </p>
                      </div>
                    </div>

                    {/* Diet Plan */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-[#a1a1aa]/10 text-[#a1a1aa] mt-0.5">
                        <AppleIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">
                          {program.diet_plan?.title || "Diet Plan"}
                        </h3>
                        <p className="text-sm text-[#a1a1aa] mt-1">
                          System optimized nutrition
                        </p>
                      </div>
                    </div>

                    {/* AI Safety */}
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-[#7c3aed]/10 text-[#7c3aed] mt-0.5">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">
                          AI Safety Protocols
                        </h3>
                        <p className="text-sm text-[#a1a1aa] mt-1">
                          Protection systems enabled
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-5 pt-5 border-t border-[#2e2e2e]">
                    <p className="text-sm text-[#a1a1aa]">
                      <span className="text-[#7c3aed]">{"> "}</span>
                      {program.workout_plan?.description
                        ? program.workout_plan.description.substring(0, 120) +
                          "..."
                        : "No description available."}
                    </p>
                  </div>
                </div>
              </CardContent>

              {/* Footer */}
              <CardFooter>
                <a href={`/programs/${program.id}`} className="w-full">
                  <Button className="w-full bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90">
                    View Program Details
                    <ChevronRight className=" h-4 w-4 " />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a href="/generate-program">
            <Button className="bg-[#7c3aed] text-white hover:bg-[#7c3aed]/90 px-8 py-6 text-lg">
              Generate Your Program <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </a>
          <p className="text-[#a1a1aa] mt-4">
            Join 500+ users with AI-customized fitness programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPrograms;
