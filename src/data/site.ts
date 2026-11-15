export const SITE = {
  name: "ASADULLAH",
  title: "Video Editor & Motion Designer",
  email: "asadiftekhar76@gmail.com",
  mailto: "mailto:asadiftekhar76@gmail.com",
  driveFolder:
    "https://drive.google.com/drive/folders/1STQU4LJDmdE0U2t2NDnQ3mzhDkfB1BOv",
  description:
    "Professional video editing, cinematic storytelling, and motion design for brands, creators, and businesses.",
  /**
   * Social links are intentionally empty until real profiles are supplied.
   * Add entries like { label: "Instagram", href: "https://instagram.com/..." }
   * and they will appear in the footer automatically.
   */
  socials: [] as { label: string; href: string }[],
};

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
] as const;
