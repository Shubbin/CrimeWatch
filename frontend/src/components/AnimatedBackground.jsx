import Particles from "react-tsparticles";

const AnimatedBackground = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 animate-gradient bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-[length:400%_400%]" />
      <Particles
        options={{
          fpsLimit: 60,
          particles: {
            number: { value: 40 },
            color: { value: "#22c55e" },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: 3 },
            move: { enable: true, speed: 1 },
            links: { enable: true, distance: 150, color: "#22c55e", opacity: 0.3 },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" } },
          },
        }}
      />
      <style>{`
        @keyframes gradient {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
