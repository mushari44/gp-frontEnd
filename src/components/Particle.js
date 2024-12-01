import React from "react";
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.import { Particles } from "react-tsparticles";
import { Particles } from "react-tsparticles";
function Particle() {
  const particlesInit = async (main) => {
    // Loads the full tsparticles package
    await loadSlim(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              value_area: 1500,
            },
          },
          links: {
            // Updated from `line_linked`
            enable: true,
            opacity: 0.03,
          },
          move: {
            direction: "right",
            speed: 0.05,
          },
          size: {
            value: 1,
          },
          opacity: {
            animation: {
              // Updated from `anim`
              enable: true,
              speed: 1,
              minimumValue: 0.05, // Updated from `opacity_min`
            },
          },
        },
        interactivity: {
          events: {
            onClick: {
              // Updated from `onclick`
              enable: true,
              mode: "push",
            },
          },
          modes: {
            push: {
              quantity: 1, // Updated from `particles_nb`
            },
          },
        },
        retina_detect: true, // Retained as is
      }}
    />
  );
}

export default Particle;
