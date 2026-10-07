export const siteData = {
  user: { name: "Lampros Trifyllis", role: "AI Engineer | Systems Developer | Theoretical Physicist", focus: "Agentic Workflows, RAG, Formal Verification", email: ['info', 'nullsequitur.com'].join('@'), github: "https://github.com/nullsequitur", linkedin: "https://www.linkedin.com/in/lampros-trifyllis-5ab79a413/" },
  skills: { 
    ai: ["RAG Architecture", "Agentic Harnesses", "Vector Embeddings", "LLMs"],
    sys: ["Docker", "Kubernetes", "Arch Linux", "Git/GitHub", "Bash", "Lua", "Nix"],
    academic: ["Theoretical Physics", "Wolfram Mathematica", "LaTeX", "Lean4", "Qiskit"],
    languages: ["Python", "C", "Bash", "Go", "Lua", "SQL", "JavaScript"]
  },
  filesystem: {
    "ai_ml": {
      type: "directory", icon: "🧠", title: "AI Engineering", subtitle: "Machine Learning & Agents",
      children: {
        "niki_digital": { type: "file", title: "AI Engineer @ NIKI", subtitle: "NIKI Digital Engineering", synopsis: "Harness engineer, RAG architecture, Agentic workflows.", url: "#" },
        "agents": { type: "file", title: "Agentic Systems", subtitle: "Autonomous Workflows", synopsis: "Developing and orchestrating multi-agent architectures.", url: "#" }
      }
    },
    "sys_infra": {
      type: "directory", icon: "🐧", title: "Systems & Infrastructure", subtitle: "DevOps & Linux",
      children: {
        "nvimx": { type: "file", title: "nvimx", subtitle: "Neovim Config", synopsis: "Deep, Lua-based Neovim configuration project.", url: "#" },
        "archlinux": { type: "file", title: "Archlinux Scripts", subtitle: "Dotfiles", synopsis: "Deep system configuration and automation scripts.", url: "#" },
        "docker_k8s": { type: "file", title: "Containerization", subtitle: "Docker & K8s", synopsis: "Infrastructure deployment and orchestration.", url: "#" }
      }
    },
    "academic": {
      type: "directory", icon: "📚", title: "Academic & Research", subtitle: "Physics & Teaching",
      children: {
        "uoi_lecturer": { type: "file", title: "Adjunct Lecturer", subtitle: "University of Ioannina (UoI)", synopsis: "Teaching New Technologies (Python, Git, Linux, AI-assisted dev) and QIT.", url: "#" },
        "kedima": { type: "file", title: "KEDIMA", subtitle: "Center for Teaching", synopsis: "Involvement in the university's center for teaching and learning.", url: "#" },
        "phd": { type: "file", title: "PhD Theoretical Physics", subtitle: "UoI Research", synopsis: "SMEFT, Mathematica (SmeftFR), Formal Verification.", url: "https://inspirehep.net/authors/1674064" },
        "qit_notes": { type: "file", title: "QIT Notes", subtitle: "Quantum Info Theory", synopsis: "Project notes for teaching quantum information.", url: "#" },
        "colab_tech": { type: "file", title: "New Technologies Colab", subtitle: "UoI Project", synopsis: "Colab project for new technologies in natural science education.", url: "#" }
      }
    }
  }
};
