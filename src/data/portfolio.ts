export type SectionId = 'about' | 'skills' | 'projects' | 'experience' | null;

export interface PortfolioSection {
  id: SectionId;
  title: string;
  description: string;
  content: string[];
  position: [number, number, number];
  color: string;
}

export const portfolioData: Record<Exclude<SectionId, null>, PortfolioSection> = {
  about: {
    id: 'about',
    title: 'About Me',
    description: 'The Origin Story.',
    content: [
      "I am Javin Trivedi, a Computer Science student at SRM University (CGPA: 9.3/10).",
      "Based in Chennai, India, pursuing my B.Tech degree (Expected 2027).",
      "Passionate about software engineering, cloud architecture, and crafting engaging user experiences.",
      "Always eager to build, scale, and explore the next technical horizon."
    ],
    position: [-3, 1, 2], // Left, slightly up, slightly forward
    color: '#00ffff' // Cyan
  },
  skills: {
    id: 'skills',
    title: 'Skills & Tech',
    description: 'The Constellation of Capabilities.',
    content: [
      "• Languages: Python, C, C++, JavaScript, Swift, HTML5, CSS3, SQL",
      "• DevOps & Cloud: Terraform, Ansible, Docker, Kubernetes, AWS, GitHub Actions",
      "• Frameworks: Flask, SwiftUI, UIKit, Prometheus, Grafana, Vercel",
      "• Libraries: Pandas, NumPy, Scikit-learn, CNNs (ResNet50, VGG16)",
      "• Certs: AWS Developer Associate, Intro to Gen AI with AWS (Udacity), Oracle Fusion Cloud ERP, Oracle Foundations Associate"
    ],
    position: [3, 2, -1], // Right, up, slightly back
    color: '#ff00ff' // Magenta
  },
  projects: {
    id: 'projects',
    title: 'Projects Gallery',
    description: 'The Artifacts.',
    content: [
      "1. Campus Compass: Automated Node.js deployment via Terraform, Ansible & K3s.",
      "2. EchoSaath: SwiftUI safety app with CoreLocation tracking & SOS broadcasting.",
      "3. Advik Creations: Responsive commercial site optimized for SEO and performance.",
      "4. Lung Cancer Prediction: CNN diagnostic system using ResNet50 and VGG16.",
      "5. Hospital Management System: Flask portal with SQLite for secure record persistence.",
      "6. KickStart: Startup launchpad and resource aggregator platform.",
      "7. HackMate: Team matching and collaboration platform for hackathons."
    ],
    position: [2, -2, 2], // Right, down, forward
    color: '#ffaa00' // Orange/Gold
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    description: 'The Timeline.',
    content: [
      "Jan - Apr 2026: UI/UX Designer @ Pachplus Wellness Pvt. Ltd.",
      "Apr 2025 - Present: Corporate Lead @ SQAC, SRMIST (Managed Mineverse & 200+ participant Hackathons)",
      "2025: Finalist @ Designathon 2025 (Recognized for innovative product design)",
      "Technical Community: Member of the Institution of Engineers (India)"
    ],
    position: [-2, -1.5, -2], // Left, down, back
    color: '#00ff88' // Green/Teal
  }
};
