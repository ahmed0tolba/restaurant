/*!
 * © 2026 Ahmed Morsy
 * All rights reserved.
 */

(function () {
    const body = document.body;
    const toggleBtn = document.getElementById('menuToggle');
    const mask = document.getElementById('pageMask');
    const sideMenu = document.getElementById('sideMenu');
    const closeInside = document.getElementById('closeXInside');

    // All expandable items (with class .expandable)
    const expandableItems = document.querySelectorAll('.menu-item.expandable');

    // ---- open / close functions ----
    function openMenu() {
        body.classList.add('menu-open');
    }

    function closeMenu() {
        body.classList.remove('menu-open');
    }

    // Toggle hamburger -> X (via body class)
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (body.classList.contains('menu-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Clicking mask closes menu
    mask.addEventListener('click', (e) => {
        closeMenu();
    });

    // Inside close (X) button
    closeInside.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMenu();
    });

    // Prevent clicks inside sideMenu from closing when interacting with menu
    sideMenu.addEventListener('click', (e) => {
        e.stopPropagation(); // stops event from reaching mask if bubble, but mask listener is on mask directly.
        // However, mask click listener only triggers when mask is clicked. So this is fine.
        // But we want to keep menu open when clicking inside menu (including expandable toggles)
        // So we stop propagation only for elements that don't need to close.
        // Actually, we want that clicking inside menu does NOT close menu. So we stop immediate propagation
        // but we still want expandable toggles to work. So we just prevent event from reaching body's listener? 
        // There's no body listener, only mask. Since mask is behind menu, clicking menu doesn't trigger mask click. Good.
        // However, mask has pointer-events: auto when menu open. But menu is above mask. Clicks on menu won't hit mask.
        // So no extra stopPropagation needed. But we keep it for safety:
        // e.stopPropagation(); // (optional, no harm)
    });

    // ---- Expandable behaviour: click on menu-row toggles expansion slowly ----
    expandableItems.forEach(item => {
        const buttonRow = item.querySelector('.menu-row'); // the button itself
        if (buttonRow) {
            buttonRow.addEventListener('click', (e) => {
                e.preventDefault();  // avoid any weirdness
                e.stopPropagation(); // stop toggling menu close (not necessary but clean)
                // toggle class 'expanded' on parent li (menu-item)
                item.classList.toggle('expanded');
            });
        }
    });

    // Blog is non-expandable – nothing to do

    // (Optional) Close menu if user presses Escape key – good practice
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMenu();
        }
    });

    // ensure submenu animation smooth: max-height transition works even with variable content.
    // additional minor: when menu closes via mask or X, we keep expanded items as they were (or reset?) 
    // spec doesn't say reset, so we keep expanded state (UX friendly).
    // but if you want all submenus collapsed on close, you could add: but not required.
    // we intentionally keep submenu state consistent.

    // Edge: if menu gets closed, we might want to keep it as is. fine.

    // Prevent default drag on toggle button
    toggleBtn.addEventListener('mousedown', (e) => e.preventDefault());
})();

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    // First hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].classList.remove("active"); // Remove active class
    }

    // Show the current slide
    slides[slideIndex - 1].style.display = "block";

    // Force a reflow to ensure animations work
    void slides[slideIndex - 1].offsetWidth;

    // Add active class to trigger animations
    slides[slideIndex - 1].classList.add("active");
}

// Optional: Auto-play slides with animation
let autoPlayInterval = setInterval(() => {
    plusSlides(1);
}, 150000);

// Pause auto-play when hovering over slideshow
document.querySelector('.slideshow-container').addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
});

document.querySelector('.slideshow-container').addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => {
        plusSlides(1);
    }, 150000);
});


document.addEventListener('DOMContentLoaded', function () {

    // Select all elements to animate
    const shakeElements = document.querySelectorAll('.shake-animate');
    const scrollElements = document.querySelectorAll('.scroll-animate');

    // Combine all elements
    const allElements = [...shakeElements, ...scrollElements];

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class when element comes into view
                entry.target.classList.add('visible');

                // IMPORTANT: Stop observing this element after it becomes visible
                observer.unobserve(entry.target);
            }
            // Remove the else block so elements don't lose the class when scrolling away
        });
    }, {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: '0px 0px -50px 0px' // Slight offset to trigger a bit earlier
    });

    // Observe all elements
    allElements.forEach(element => {
        observer.observe(element);
    });

});

let reviewIndex = 0;
const reviews = document.querySelectorAll('.slider-item');
const totalReviews = reviews.length;

function showReview(index) {
    reviews.forEach((review, i) => {
        if (i === index) {
            review.style.display = 'block';
        } else {
            setTimeout(() => {
                review.style.display = 'none';
            }, 1000); // Delay hiding to allow animation to finish
        }

    });
}

function nextReview() {
    reviewIndex = (reviewIndex + 1) % totalReviews;
    showReview(reviewIndex);
}

// Show the first review initially
showReview(reviewIndex);

// Change review every 5 seconds
setInterval(nextReview, 9000);

(function () {
    // ---------- reusable slider class ----------
    class InfiniteSlider {
        constructor(containerId, images, direction = 'left', autoplayMs = 2000) {
            this.container = document.getElementById(containerId);
            this.track = this.container.querySelector('.slider-track');
            this.images = images;               // array of {bg, label, emoji, link}
            this.direction = direction;          // 'left' (default) or 'right'
            this.autoplayMs = autoplayMs;

            this.VISIBLE_SLIDES = 4;
            this.TOTAL_REAL_IMAGES = images.length;
            this.CLONE_FACTOR = 3;               // total cycles = 3
            this.FIRST_ORIGINAL_INDEX = this.TOTAL_REAL_IMAGES;        // 10
            this.LAST_ORIGINAL_INDEX = 2 * this.TOTAL_REAL_IMAGES - 1; // 19

            this.slides = [];
            this.slideWidth = 0;
            this.containerWidth = 0;
            this.isDragging = false;
            this.startX = 0;
            this.startTranslate = 0;
            this.currentTranslate = 0;
            this.dragOccurred = false;            // flag to distinguish click vs drag
            this.dragThreshold = 5;                // px movement to consider a drag

            this.autoplayInterval = null;
            this.isPaused = false;
            this.autoplayActive = true;

            this.init();
        }

        init() {
            this.buildSlides();
            this.updateDimensions();
            const initialTranslate = -this.FIRST_ORIGINAL_INDEX * this.slideWidth;
            this.setTranslate(initialTranslate, false);
            this.currentTranslate = initialTranslate;
            this.attachEvents();
            this.startAutoplay();
        }

        buildSlides() {
            this.track.innerHTML = '';
            const fragment = document.createDocumentFragment();

            for (let cycle = 0; cycle < this.CLONE_FACTOR; cycle++) {
                for (let i = 0; i < this.TOTAL_REAL_IMAGES; i++) {
                    const img = this.images[i];
                    const slideDiv = document.createElement('div');
                    slideDiv.className = 'slide';
                    slideDiv.dataset.originalIndex = i;

                    // clickable card (anchor)
                    const cardLink = document.createElement('a');
                    cardLink.className = 'card';
                    cardLink.href = img.link || '#';
                    cardLink.target = '_blank';    // open in new tab for demo
                    cardLink.rel = 'noopener';
                    cardLink.style.background = img.bg;

                    // inner content
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'card-content';
                    contentDiv.innerHTML = `
                        <div style="font-size:2.5rem; line-height:1;">${img.emoji}</div>
                        <span>${img.label}</span>
                    `;

                    // hover mask + icon
                    const mask = document.createElement('div');
                    mask.className = 'hover-mask';
                    const icon = document.createElement('div');
                    icon.className = 'hover-icon';
                    icon.innerHTML = '<img src="images/black-instagram-icon.svg" >';   // link icon

                    cardLink.appendChild(contentDiv);
                    cardLink.appendChild(mask);
                    cardLink.appendChild(icon);
                    slideDiv.appendChild(cardLink);
                    fragment.appendChild(slideDiv);
                }
            }
            this.track.appendChild(fragment);
            this.slides = Array.from(this.track.children);
        }

        // Determine visible slides from CSS flex-basis of a slide
        updateVisibleSlides() {
            if (this.slides.length === 0) return;
            const slideComputed = getComputedStyle(this.slides[0]);
            const flexBasis = parseFloat(slideComputed.flexBasis); // e.g., 25
            // flexBasis is a percentage string like '25%' -> 25
            if (!isNaN(flexBasis) && flexBasis > 0) {
                this.visibleSlides = Math.round(100 / flexBasis);
            } else {
                this.visibleSlides = 4; // fallback
            }
        }

        updateDimensions() {
            this.containerWidth = this.container.getBoundingClientRect().width;
            this.updateVisibleSlides();
            this.slideWidth = this.containerWidth / this.visibleSlides;
        }

        setTranslate(px, animate = false, isDraggingUpdate = false) {
            if (!animate) {
                this.track.classList.add('no-transition');
            } else {
                this.track.classList.remove('no-transition');
            }
            this.track.style.transform = `translateX(${px}px)`;
            this.currentTranslate = px;

            if (isDraggingUpdate) {
                this.seamlessJump(px);
            }
        }

        seamlessJump(currentPx) {
            const maxBoundary = -this.FIRST_ORIGINAL_INDEX * this.slideWidth;   // -10 * slideWidth
            const minBoundary = -this.LAST_ORIGINAL_INDEX * this.slideWidth;    // -19 * slideWidth
            const totalCycleWidth = this.TOTAL_REAL_IMAGES * this.slideWidth;

            let newPx = currentPx;
            if (currentPx < minBoundary) {
                newPx = currentPx + totalCycleWidth;
            } else if (currentPx > maxBoundary) {
                newPx = currentPx - totalCycleWidth;
            }

            if (newPx !== currentPx) {
                this.track.classList.add('no-transition');
                this.track.style.transform = `translateX(${newPx}px)`;
                this.currentTranslate = newPx;
                if (this.isDragging) {
                    this.startTranslate = newPx;
                }
            }
        }

        getCurrentLeftIndex() {
            if (this.slideWidth === 0) return this.FIRST_ORIGINAL_INDEX;
            return Math.round(-this.currentTranslate / this.slideWidth);
        }

        // autoplay step based on direction
        nextSlide() {
            if (this.isDragging || !this.autoplayActive || this.isPaused || this.slideWidth === 0) return;

            let currentIdx = this.getCurrentLeftIndex();
            let rawNext;

            if (this.direction === 'left') {
                // move to the right (increase index, scroll left)
                rawNext = currentIdx + 1;
                if (rawNext > this.LAST_ORIGINAL_INDEX) {
                    rawNext = this.FIRST_ORIGINAL_INDEX;
                }
            } else { // direction 'right'
                // move to the left (decrease index, scroll right)
                rawNext = currentIdx - 1;
                if (rawNext < this.FIRST_ORIGINAL_INDEX) {
                    rawNext = this.LAST_ORIGINAL_INDEX;
                }
            }

            const targetTranslate = -rawNext * this.slideWidth;
            this.setTranslate(targetTranslate, true, false);
        }

        snapToNearest() {
            if (!this.slideWidth) return;
            const rawIndex = -this.currentTranslate / this.slideWidth;
            let targetIndex = Math.round(rawIndex);

            // map into middle set (10-19)
            const originalPos = ((targetIndex % this.TOTAL_REAL_IMAGES) + this.TOTAL_REAL_IMAGES) % this.TOTAL_REAL_IMAGES;
            let newGlobalIndex = this.FIRST_ORIGINAL_INDEX + originalPos;
            const targetTranslate = -newGlobalIndex * this.slideWidth;

            this.setTranslate(targetTranslate, true, false);

            // extra safety reset after transition
            setTimeout(() => {
                if (!this.isDragging) {
                    const curr = this.currentTranslate;
                    const safeMin = -this.LAST_ORIGINAL_INDEX * this.slideWidth;
                    const safeMax = -this.FIRST_ORIGINAL_INDEX * this.slideWidth;
                    if (curr < safeMin || curr > safeMax) {
                        this.track.classList.add('no-transition');
                        let corrected = curr;
                        const cycle = this.TOTAL_REAL_IMAGES * this.slideWidth;
                        if (curr < safeMin) corrected = curr + cycle;
                        if (curr > safeMax) corrected = curr - cycle;
                        this.track.style.transform = `translateX(${corrected}px)`;
                        this.currentTranslate = corrected;
                    }
                }
            }, 400);
        }

        // ----- drag handlers with click detection -----
        onDragStart = (e) => {
            e.preventDefault();
            const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;

            this.isDragging = true;
            this.dragOccurred = false;      // reset click flag
            this.dragStartTime = Date.now();

            this.track.classList.add('no-transition');

            const style = window.getComputedStyle(this.track);
            const transform = style.transform;
            if (transform && transform !== 'none') {
                const matrix = transform.match(/matrix.*\((.+)\)/);
                if (matrix) {
                    const values = matrix[1].split(', ');
                    this.startTranslate = parseFloat(values[4]) || 0;
                } else {
                    this.startTranslate = this.currentTranslate;
                }
            } else {
                this.startTranslate = this.currentTranslate;
            }

            this.startX = clientX;
            this.container.classList.add('dragging');
        }

        onDragMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();

            const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            const deltaX = clientX - this.startX;

            // detect if drag moved beyond threshold (for click prevention)
            if (Math.abs(deltaX) > this.dragThreshold) {
                this.dragOccurred = true;
            }

            let newTranslate = this.startTranslate + deltaX;
            this.setTranslate(newTranslate, false, true);
        }

        onDragEnd = (e) => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.container.classList.remove('dragging');
            this.snapToNearest();
            this.track.classList.remove('no-transition');
        }

        // click handler for cards (prevents navigation if dragged)
        onCardClick = (e) => {
            if (this.dragOccurred) {
                e.preventDefault();
                e.stopPropagation();
            }
            // if not dragged, link works normally
        }

        attachEvents() {
            // drag events
            this.container.addEventListener('mousedown', this.onDragStart);
            window.addEventListener('mousemove', this.onDragMove);
            window.addEventListener('mouseup', this.onDragEnd);
            window.addEventListener('mouseleave', this.onDragEnd);

            this.container.addEventListener('touchstart', this.onDragStart, { passive: false });
            window.addEventListener('touchmove', this.onDragMove, { passive: false });
            window.addEventListener('touchend', this.onDragEnd);
            window.addEventListener('touchcancel', this.onDragEnd);

            // hover pause for autoplay
            this.container.addEventListener('mouseenter', () => { this.isPaused = true; });
            this.container.addEventListener('mouseleave', () => { this.isPaused = false; });

            // attach click listeners to all cards
            this.slides.forEach(slide => {
                const card = slide.querySelector('.card');
                if (card) {
                    card.addEventListener('click', this.onCardClick);
                }
            });
        }

        startAutoplay() {
            if (this.autoplayInterval) clearInterval(this.autoplayInterval);
            this.autoplayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoplayMs);
        }

        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }
    }

    // ---------- define two different image sets ----------
    // Set A (top slider) – animals / colourful
    const imagesSetA = [];
    const animalEmojis = ['🐠', '🐙', '🦊', '🐼', '🐨', '🦁', '🐧', '🐳', '🦋', '🐝'];
    for (let i = 0; i < 10; i++) {
        const hue = (i * 37) % 360;
        imagesSetA.push({
            bg: `url('images/${i + 1}.jpg') center/cover no-repeat`,
            label: '',//`img A${i + 1}`,
            emoji: '',//animalEmojis[i],
            link: `#animal-${i + 1}`   // dummy link (opens new tab but stays on page)
        });
    }

    // Set B (bottom slider) – food / treats
    const imagesSetB = [];
    const foodEmojis = ['🍎', '🍕', '🍔', '🌮', '🍣', '🍦', '🍩', '🍪', '🍫', '🍭'];
    for (let i = 0; i < 10; i++) {
        const hue = (i * 23 + 120) % 360;
        imagesSetB.push({
            bg: `url('images/${i + 1}.jpg') center/cover no-repeat`,
            label: '',// `img B${i + 1}`,
            emoji: '',// foodEmojis[i],
            link: `#food-${i + 1}`
        });
    }

    // ---------- instantiate both sliders ----------
    // top slider: direction left (default)
    const slider1 = new InfiniteSlider('slider1Container', imagesSetA, 'left', 2000);
    // bottom slider: direction right
    const slider2 = new InfiniteSlider('slider2Container', imagesSetB, 'right', 2000);

    // pause autoplay when page hidden (good practice)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            slider1.stopAutoplay();
            slider2.stopAutoplay();
        } else {
            slider1.startAutoplay();
            slider2.startAutoplay();
        }
    });
})();

/*!
 * © 2026 Ahmed Morsy
 * All rights reserved.
 */