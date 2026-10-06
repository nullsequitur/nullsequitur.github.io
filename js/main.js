import { initTerminal } from './terminal.js';
import { renderContent } from './render.js';
import { initSections } from './sections.js';

document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    initSections();
    initTerminal();

    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });
});
