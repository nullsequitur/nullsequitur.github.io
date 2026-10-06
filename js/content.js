export const siteData = {
  user: { name: "Lampros Trifyllis", role: "AI Engineer | Agentic Systems Developer", focus: "Agentic Workflows, RAG", email: ['info', 'nullsequitur.com'].join('@'), github: "https://github.com/nullsequitur", linkedin: "https://www.linkedin.com/in/lampros-trifyllis-5ab79a413/" },
  skills: { languages: ["Python", "JavaScript/React", "SQL", "Bash", "C++"], tools: ["Docker", "RAG", "Claude Code", "Antigravity CLI", "pi harness", "Nix", "tmux/nvim"], os: ["Arch Linux", "Debian", "Home Server"] },
  filesystem: {
    "physics": {
      type: "directory", icon: "⚛", title: "Theoretical Physics", subtitle: "Research / SMEFT",
      children: {
        "smeftFR": { type: "file", title: "smeftFR", subtitle: "HEP Software / Mathematica", synopsis: "Automated generator for beyond-Standard-Model effective field theories.", url: "https://github.com/nullsequitur/smeftFR" },
        "publications": { type: "file", title: "Publications", subtitle: "InspireHEP Profile", synopsis: "Theoretical physics publications and preprints.", url: "https://inspirehep.net/authors/1674064" }
      }
    },
    "ai": {
      type: "directory", icon: "🧠", title: "Artificial Intelligence", subtitle: "Agentic Systems",
      children: {
        "agents": { type: "file", title: "Agentic Workflows", subtitle: "Autonomous Systems", synopsis: "Developing and orchestrating multi-agent systems.", url: "#" },
        "rag": { type: "file", title: "RAG Systems", subtitle: "Retrieval-Augmented Generation", synopsis: "Building robust vector-based retrieval architectures.", url: "#" }
      }
    },
    "linux": {
      type: "directory", icon: "🐧", title: "Linux Systems", subtitle: "SysAdmin & Dotfiles",
      children: {
        "nvimx": { type: "file", title: "Neovim Config", subtitle: "nvimx", synopsis: "Highly customized, Lua-based Neovim configuration.", url: "#" },
        "docker": { type: "file", title: "Docker Infrastructure", subtitle: "Containers", synopsis: "Containerized environments and deployment pipelines.", url: "#" }
      }
    },
    "teaching": {
      type: "directory", icon: "📚", title: "Teaching", subtitle: "Academic Resources",
      children: {
        "kedima": { type: "file", title: "KEDIMA", subtitle: "Educational Material", synopsis: "Resources and lectures for theoretical physics courses.", url: "#" },
        "qit-notes": { type: "file", title: "QIT Notes", subtitle: "Quantum Information Theory", synopsis: "Lecture notes and materials for Quantum Information Theory.", url: "#" }
      }
    },
    "projects": {
      type: "directory", icon: "💻", title: "Open Source", subtitle: "Software Projects",
      children: {
        "github": { type: "file", title: "GitHub Profile", subtitle: "nullsequitur", synopsis: "Personal portfolio of open-source projects, dotfiles, and system automation scripts.", url: "https://github.com/nullsequitur" }
      }
    },
    "career": {
      type: "directory", icon: "💼", title: "Professional Career", subtitle: "LinkedIn / Resume",
      children: {
        "linkedin": { type: "file", title: "LinkedIn", subtitle: "Lampros Trifyllis", synopsis: "Professional network and career updates.", url: "https://www.linkedin.com/in/lampros-trifyllis-5ab79a413/" }
      }
    }
  }
};
