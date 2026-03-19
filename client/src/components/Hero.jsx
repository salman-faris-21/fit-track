import React from "react";
import heroImg from "../assets/Hero-image-ft.png";

const Hero = () => {
  return (
    <div
      className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-no-repeat bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      <p className="bg-primary/50 px-4 py-2 rounded-full mt-20 text-sm md:text-base">
        ACHIEVE YOUR FITNESS GOALS
      </p>

      <h1 className="font-playfair text-3xl md:text-5xl font-extrabold max-w-xl mt-4 leading-tight">
        TRANSFORM YOUR BODY, TRANSFORM YOUR LIFE
      </h1>

      <p className="max-w-xl mt-4 text-sm md:text-base text-foreground">
        Track your workouts, monitor your progress, and stay motivated with
        personalized fitness plans. Start your fitness journey with us today!
      </p>
    </div>
  );
};

export default Hero;
