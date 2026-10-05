export const siteData = {
  user: { name: "Lampros Trifyllis", role: "Computational Physicist (PhD)", focus: "Symbolic Calculations, Automation, Linux", email: "contact@example.com", github: "https://github.com/nullsequitur", linkedin: "https://linkedin.com/in/example" },
  skills: { languages: ["Python", "Bash", "C++", "Mathematica"], tools: ["Git", "Docker", "LaTeX"], os: ["Arch Linux", "Debian"] },
  filesystem: {
    "research": {
      type: "directory",
      children: {
        "smeftFR": { type: "file", title: "smeftFR", subtitle: "HEP Software / Mathematica", synopsis: "Automated generator for beyond-Standard-Model effective field theories.", url: "https://github.com/nullsequitur/smeftFR" },
        "lino2019": { type: "file", title: "Lindau Nobel Laureate Meeting", subtitle: "LINO2019", synopsis: "Selected participant for the 69th Lindau Nobel Laureate Meeting.", url: "#" },
        "papers": { type: "file", title: "Publications", subtitle: "Research Papers", synopsis: "List of theoretical physics publications and preprints.", url: "#" }
      }
    },
    "linux": {
      type: "directory",
      children: {
        "arch-install": { type: "file", title: "Arch Ecosystem", subtitle: "Bash Automation / System Config", synopsis: "Automated hardware detection and configuration scripts for Arch Linux.", url: "https://github.com/nullsequitur" },
        "dotfiles": { type: "file", title: "Dotfiles", subtitle: "System Configuration", synopsis: "Personal dotfiles for window managers, terminals, and editors.", url: "https://github.com/nullsequitur" }
      }
    },
    "teaching": {
      type: "directory",
      children: {
        "qit-notes": { type: "file", title: "qit-notes", subtitle: "Quantum Information Material", synopsis: "Lecture notes and interactive materials for quantum information theory.", url: "#" }
      }
    },
    "projects": {
      type: "directory",
      children: {
        "homepage": { type: "file", title: "nullsequitur Homepage", subtitle: "Vanilla JS / Terminal UI", synopsis: "Personal portfolio site featuring an interactive terminal emulator.", url: "https://github.com/nullsequitur" }
      }
    },
    "about": {
      type: "directory",
      children: {
        "bio": { type: "file", title: "Biography", subtitle: "About Me", synopsis: "Computational physicist with a focus on automation and symbolic calculations.", url: "#" }
      }
    }
  }
};
