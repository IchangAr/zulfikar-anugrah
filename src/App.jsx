import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './sections/Hero/Hero';
import GlobalBackground from './components/layout/GlobalBackground';
import Cursor from './components/layout/Cursor';
import About from './sections/About/About';
import ExperienceSection from './sections/Experience/ExperienceSection';
import Projects from './sections/Projects/Projects';
import Achievements from './sections/Achievements/Achievements';
import Certificates from './sections/Certificates/Certificates';
import Contact from './sections/Contact/Contact';
import Footer from './sections/Footer/Footer';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <GlobalBackground />
      <Cursor />
      
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Hero />
              <About />
              <ExperienceSection />
              <Projects />
              <Achievements />
              <Certificates />
              <Contact />
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
