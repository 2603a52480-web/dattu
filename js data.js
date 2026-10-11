const PORTFOLIO_DATA = {
  personal: {
    name: "Govindhu Keshava Dattu",
    shortName: "G. Keshava Dattu",
    initials: "GKD",
    brand: "Govindhu Keshava Dattu — Developer Portfolio",
    handle: "govindhu-kd",
    role: "Aspiring Software Developer & AI/ML Student",
    titles: [
      "Aspiring Software Developer",
      "AI & Machine Learning Student",
      "Python Developer",
      "Creative Problem Solver",
      "Future Full-Stack Developer"
    ],
    statusLabel: "AVAILABLE FOR LEARNING, COLLABORATIONS & OPPORTUNITIES",
    statusState: "Always Learning & Building",
    educationLevel: "First-Year B.Tech Undergraduate",
    degree: "B.Tech in Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
    location: "Telangana, India",
    timezone: "Asia/Kolkata",
    email: "govindhu.keshava@example.com",
    github: "https://github.com/govindhu-kd",
    linkedin: "https://linkedin.com/in/govindhu-kd",
    resumeUrl: "assets/Govindhu_Keshava_Dattu_Resume.pdf"
  },

  projects: [
    {
      id: "chronova-watches",
      title: "DATTU HUB",
      category: "web",
      categoryLabel: "Web Development / E-Commerce",
      status: "Completed",
      badge: "FEATURED FLAGSHIP",
      shortDescription: "A modern luxury horology web application featuring interactive 3D mouse parallax tilt physics, synthesized tactile Web Audio acoustic sound effects, and a dynamic slide-over cart drawer.",
      technologies: ["React", "Tailwind CSS", "Vite", "Web Audio API", "HTML5", "JavaScript (ES6+)"],
      githubUrl: "https://github.com/govindhu-kd/chronova-watches"
    },
    {
      id: "student-performance-analyzer",
      title: "Student Performance Analyzer",
      category: "aiml",
      categoryLabel: "AI & Machine Learning / Python Data",
      status: "Completed",
      badge: "DATA & ANALYTICS",
      shortDescription: "A comprehensive analytical system designed to ingest multi-semester academic records, calculate cumulative GPA trajectories, and predict at-risk students using trend slope heuristics.",
      technologies: ["Python 3", "Pandas", "Matplotlib", "Statistical Modeling", "HTML5", "CSS3"],
      githubUrl: "https://github.com/govindhu-kd/student-performance-analyzer"
    }
  ],

  timeline: [
    {
      period: "2026 — 2030",
      title: "Academic Project Lead — Student Performance Analyzer",
      organization: "B.Tech CSE (AI & ML) Project Sprint",
      description: "Spearheaded the development of a predictive grade analysis tool using Python and responsive web technology to detect student academic trends early."
    },
    {
      period: "2026 — 2030",
      title: "Smart Campus Hackathon Preparation & Ideation",
      organization: "College Tech Fest & Collaborative Sprints",
      description: "Collaborated with peers to design a student resource routing system prototype, defining workflow specifications and frontend dashboard wireframes."
    },
    {
      period: "2026 — 2030",
      title: "Foundational Systems Programming in C",
      organization: "Computer Science Core Curriculum",
      description: "Implemented standard algorithms and dynamic memory data structures (Linked Lists, Binary Trees, Stacks) in native C with zero memory leaks verified via GDB."
    },
    {
      period: "2026 — 2030",
      title: "Frontend Engineering & Web Craftsmanship",
      organization: "Self-Directed Practical Engineering",
      description: "Mastered semantic HTML5, advanced CSS3 Grid/Flexbox layouts, and client-side JavaScript to engineer responsive, futuristic interfaces like DATTU HUB."
    }
  ],

  education: [
    {
      degree: "Bachelor of Technology (B.Tech)",
      specialization: "Computer Science and Engineering (Artificial Intelligence and Machine Learning)",
      institution: "Engineering College, Telangana, India",
      institutionNote: "Affiliated with State Technical University",
      startYear: "2026",
      graduationYear: "2030 (Expected)",
      status: "First-Year Undergraduate Student"
    },
    {
      degree: "Higher Secondary Education (Class XII)",
      specialization: "Mathematics, Physics, and Chemistry (MPC)",
      institution: "Junior College, Telangana, India",
      startYear: "2022",
      graduationYear: "2024",
      status: "Completed"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PORTFOLIO_DATA;
}