export const initScrollReveal = () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.scroll-reveal');
  elements.forEach(element => observer.observe(element));
};

export const smoothScroll = (targetId: string) => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export const initScrollSnap = () => {
  const sections = document.querySelectorAll('.scroll-snap-section');
  sections.forEach(section => {
    section.addEventListener('wheel', (e: Event) => {
      e.preventDefault();
      const wheelEvent = e as WheelEvent;
      const delta = Math.sign(wheelEvent.deltaY);
      const currentSection = e.currentTarget as HTMLElement;
      
      if (delta > 0) {
        // Scroll down
        const nextSection = currentSection.nextElementSibling as HTMLElement;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Scroll up
        const prevSection = currentSection.previousElementSibling as HTMLElement;
        if (prevSection) {
          prevSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}; 