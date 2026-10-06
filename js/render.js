import { siteData } from './content.js';

export function renderContent() {
    const grid = document.querySelector('#home-section .grid');
    const mainContainer = document.querySelector('main.container');
    
    if (!grid || !mainContainer || !siteData.filesystem) return;

    // Clear existing grid contents if any
    grid.innerHTML = '';

    // Remove old dynamic sections to avoid duplication
    document.querySelectorAll('.dynamic-section').forEach(el => el.remove());

    Object.entries(siteData.filesystem).forEach(([dirName, dirData]) => {
        if (dirData.type !== 'directory') return;

        // 1. Generate Card
        const card = document.createElement('div');
        card.className = 'card fade-in visible'; // Added animation classes optionally
        
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header';
        
        const pathSpan = document.createElement('span');
        pathSpan.className = 'path';
        pathSpan.textContent = `/${dirName}/`;
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'icon';
        iconSpan.textContent = dirData.icon || '📁';
        
        cardHeader.appendChild(pathSpan);
        cardHeader.appendChild(iconSpan);
        card.appendChild(cardHeader);
        
        const cardPreview = document.createElement('div');
        cardPreview.className = 'card-preview';
        const asciiArt = document.createElement('div');
        asciiArt.className = 'ascii-art';
        asciiArt.style.color = 'var(--color-primary)';
        asciiArt.textContent = `[ ${dirData.icon || '📁'} ]`;
        cardPreview.appendChild(asciiArt);
        card.appendChild(cardPreview);
        
        const h3 = document.createElement('h3');
        h3.textContent = dirData.title || dirName;
        card.appendChild(h3);
        
        const pSubtitle = document.createElement('p');
        pSubtitle.className = 'subtitle';
        pSubtitle.textContent = dirData.subtitle || '';
        card.appendChild(pSubtitle);
        
        const aBtn = document.createElement('a');
        aBtn.href = `#${dirName}`;
        aBtn.className = 'btn';
        aBtn.textContent = '[Enter Hub]';
        card.appendChild(aBtn);
        
        grid.appendChild(card);

        // 2. Generate Content Section
        const section = document.createElement('section');
        section.id = `${dirName}-section`;
        section.className = 'content-section dynamic-section terminal-block';
        
        const termHeader = document.createElement('div');
        termHeader.className = 'terminal-header';
        termHeader.innerHTML = '<span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>';
        section.appendChild(termHeader);

        const termBody = document.createElement('div');
        termBody.className = 'terminal-body';
        termBody.style.height = 'auto'; // Let content dictate height
        termBody.style.minHeight = '400px';

        const sectionHeading = document.createElement('h2');
        sectionHeading.className = 'section-heading';
        sectionHeading.textContent = `/${dirName} `;
        const headingSubtitle = document.createElement('span');
        headingSubtitle.className = 'section-heading-subtitle';
        headingSubtitle.textContent = `— ${dirData.title || ''}`;
        sectionHeading.appendChild(headingSubtitle);
        termBody.appendChild(sectionHeading);
        
        const sectionContent = document.createElement('div');
        sectionContent.className = 'section-content';
        
        if (dirData.children && Object.keys(dirData.children).length > 0) {
            Object.entries(dirData.children).forEach(([fileName, fileData]) => {
                const fileBlock = document.createElement('div');
                fileBlock.className = 'file-block';
                
                const fileTitle = document.createElement('h3');
                fileTitle.className = 'file-title';
                fileTitle.textContent = `${fileData.title || fileName} `;
                const fileSub = document.createElement('span');
                fileSub.className = 'file-subtitle';
                fileSub.textContent = fileData.subtitle || '';
                fileTitle.appendChild(fileSub);
                fileBlock.appendChild(fileTitle);
                
                const synopsis = document.createElement('p');
                synopsis.className = 'file-synopsis';
                synopsis.textContent = fileData.synopsis || '';
                fileBlock.appendChild(synopsis);
                
                if (fileData.url && fileData.url !== '#') {
                    const viewRes = document.createElement('a');
                    viewRes.href = fileData.url;
                    viewRes.target = '_blank';
                    viewRes.className = 'file-link';
                    viewRes.textContent = '[ View Resource ]';
                    fileBlock.appendChild(viewRes);
                }
                
                sectionContent.appendChild(fileBlock);
            });
        } else {
            const noFiles = document.createElement('p');
            noFiles.textContent = 'No files found.';
            sectionContent.appendChild(noFiles);
        }
        
        termBody.appendChild(sectionContent);
        section.appendChild(termBody);
        
        mainContainer.appendChild(section);
    });
}
