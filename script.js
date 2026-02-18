document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. DÉFILEMENT INFINI DES COMMENTAIRES ---
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        // On clone le contenu pour que l'animation boucle sans coupure
        const content = marqueeContent.innerHTML;
        marqueeContent.innerHTML = content + content;
    }

    // --- 2. NAVBAR INTELLIGENTE & MENU BURGER ---
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const backToTop = document.querySelector('.to-top');

    // Gestion du menu burger mobile
    if (burger) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });

        // Fermer le menu quand on clique sur un lien
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                burger.classList.remove('toggle');
            });
        });
    }

    // Scroll Logic
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Fond flou navbar
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Rétractation navbar (cache en descendant)
        if (currentScroll > lastScroll && currentScroll > 300) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        
        // Bouton retour haut
        if (backToTop) {
            if (currentScroll > 600) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }

        lastScroll = currentScroll;
    });

    // --- 3. ANIMATIONS D'APPARITION (REVEAL) ---
    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- 4. LOGIQUE MULTI-SLIDERS AVANT/APRÈS ---
    const initComparisons = () => {
        const containers = document.querySelectorAll(".img-comp-container");

        containers.forEach(container => {
            const overlayImg = container.querySelector(".img-comp-overlay");
            const baseImg = container.querySelector(".img-comp-img:not(.img-comp-overlay) img"); // Image du dessous
            const overlayImgElem = overlayImg.querySelector("img"); // Image du dessus
            const handle = container.querySelector(".slider-handle");
            
            let active = false;

            // Fonction pour ajuster la largeur de l'image overlay
            const compareImages = (e) => {
                if (!active) return;
                
                let xPos = getCursorPos(e);
                
                // Limites
                if (xPos < 0) xPos = 0;
                if (xPos > container.offsetWidth) xPos = container.offsetWidth;
                
                // Modification CSS
                overlayImg.style.width = xPos + "px";
                handle.style.left = xPos + "px";
            };

            const getCursorPos = (e) => {
                const rect = container.getBoundingClientRect();
                let x = 0;
                
                if (e.changedTouches) {
                    x = e.changedTouches[0].pageX - rect.left - window.pageXOffset;
                } else {
                    x = e.pageX - rect.left - window.pageXOffset;
                }
                return x;
            };

            const startSlide = (e) => {
                // Empêche la sélection ou le scroll natif mobile quand on touche le slider
                if(e.type === 'touchstart') e.preventDefault(); 
                active = true;
            };

            const endSlide = () => {
                active = false;
            };

            // Fonction pour redimensionner correctement les images internes
            // pour qu'elles "matchent" toujours la taille du conteneur parent
            const setImgWidths = () => {
                const w = container.offsetWidth;
                if (baseImg) baseImg.style.width = w + "px";
                if (overlayImgElem) overlayImgElem.style.width = w + "px";
            }

            // Écouteurs Souris
            container.addEventListener("mousedown", startSlide);
            window.addEventListener("mouseup", endSlide);
            container.addEventListener("mousemove", compareImages);

            // Écouteurs Tactiles (Mobile)
            container.addEventListener("touchstart", startSlide, {passive: false});
            window.addEventListener("touchend", endSlide);
            container.addEventListener("touchmove", compareImages);
            
            // Initialisation
            setImgWidths();
            window.addEventListener('resize', () => {
                setImgWidths();
                // Reset position handle au centre en cas de resize violent
                overlayImg.style.width = (container.offsetWidth / 2) + "px";
                handle.style.left = (container.offsetWidth / 2) + "px";
            });
        });
    };

    // Lancer les sliders
    initComparisons();
});