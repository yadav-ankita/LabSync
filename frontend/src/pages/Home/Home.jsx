import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ProblemSection } from "./ProblemSection";
import { SolutionSection } from "./SolutionSection";
import { ModulesSection } from "./ModulesSection";
import { RolesSection } from "./RolesSection";
import { Footer } from "./Footer";

const Home = () => {
  return (
    <div style={{ backgroundColor: "#F2F4F1", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"
      />
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <ModulesSection />
      <RolesSection />
      <Footer />
    </div>
  );
};

export default Home;