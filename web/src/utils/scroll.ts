export const handleScroll = (id: string) => {
  // Find the resume section and scroll to it
  const resumeSection = document.getElementById(id);
  if (resumeSection) {
    resumeSection.scrollIntoView({ behavior: 'smooth' });
  }
};
