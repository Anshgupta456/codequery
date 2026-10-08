import Navbar from '../../components/public/Navbar';
import HeroSection from '../../components/public/HeroSection';
import WorkSection from '../../components/public/WorkSection';
import SkillsSection from '../../components/public/SkillsSection';
import AboutSection from '../../components/public/AboutSection';
import ExperienceSection from '../../components/public/ExperienceSection';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/public/Footer';

export default function Home() {
  return (
    <div className="home-page">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Projects Section */}
        <WorkSection />

        {/* About & Education Section */}
        <AboutSection />

        {/* Work Experience Section */}
        <ExperienceSection />

        {/* Technical Skills Section */}
        <SkillsSection />

        {/* Contact Details Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
