/* ============================================
   BDS PORTFOLIO - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// GLOBAL STATE
// ============================================
let isEditMode = false;
let isAdmin = false;
let cropper = null;
let currentLightboxIndex = 0;
let currentLightboxImages = [];

// ============================================
// ADMIN AUTHENTICATION SYSTEM
// ============================================
function initAdminAuth() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');

    if (adminParam !== null) {
        const password = prompt("Enter Admin Password:");
        if (password === "1381075") {
            isAdmin = true;
            enableAdminMode();
        } else {
            alert("Wrong Password! Access Denied.");
            // Remove ?admin from URL without reload
            const newUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
}

function enableAdminMode() {
    document.body.classList.add('admin-mode');
    document.getElementById('adminBar').style.display = 'flex';

    // Show all admin-only buttons
    const adminButtons = [
        'addCertBtn', 'addGalleryBtn', 'addSectionBtn'
    ];
    adminButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.style.display = 'inline-flex';
    });

    // Enable profile image upload
    const heroWrapper = document.querySelector('.hero-image-wrapper');
    if (heroWrapper) {
        heroWrapper.style.cursor = 'pointer';
        heroWrapper.style.pointerEvents = 'auto';
        heroWrapper.addEventListener('click', function(e) {
            if (isEditMode) {
                document.getElementById('profileUpload').click();
            }
        });
    }

    // Add admin class to body for CSS targeting
    console.log("Admin mode enabled. Click 'Unlock to Edit' to make content editable.");
}

function toggleEditMode() {
    if (!isAdmin) return;

    isEditMode = !isEditMode;
    const btn = document.getElementById('editToggle');
    const heroWrapper = document.querySelector('.hero-image-wrapper');

    if (isEditMode) {
        // EDIT MODE ON
        document.querySelectorAll('h1, h2, h3, h4, p, span, li, .timeline-title, .timeline-subtitle, .timeline-date, .stat-number, .stat-label').forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });

        if (heroWrapper) {
            heroWrapper.style.pointerEvents = 'auto';
            heroWrapper.style.cursor = 'pointer';
        }

        btn.innerHTML = '<i class="fas fa-lock"></i> <span>Lock for Viewers</span>';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #f87171)';

        // Show remove buttons on dynamic sections
        document.querySelectorAll('.remove-section-btn').forEach(btn => {
            btn.style.display = 'flex';
        });
    } else {
        // VIEW MODE ON (LOCK EVERYTHING)
        document.querySelectorAll('[contenteditable="true"]').forEach(el => {
            el.setAttribute('contenteditable', 'false');
        });

        if (heroWrapper) {
            heroWrapper.style.pointerEvents = 'none';
            heroWrapper.style.cursor = 'default';
        }

        btn.innerHTML = '<i class="fas fa-unlock"></i> <span>Unlock to Edit</span>';
        btn.style.background = 'linear-gradient(135deg, var(--accent), var(--accent-light))';

        // Hide remove buttons
        document.querySelectorAll('.remove-section-btn').forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function toggleMobileNav() {
    const nav = document.getElementById('mainNav');
    const overlay = document.getElementById('mobileNavOverlay');
    const toggle = document.getElementById('mobileNavToggle');

    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    toggle.classList.toggle('active');

    const icon = toggle.querySelector('i');
    if (nav.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        document.body.style.overflow = '';
    }
}

// Close mobile nav when clicking a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMobileNav();
        }
    });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
let ticking = false;
function updateProgressBar() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    document.getElementById('progressBar').style.width = scrolled + '%';
    ticking = false;
}
window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateProgressBar); ticking = true; }
});

// ============================================
// SCROLL REVEAL - INTERSECTION OBSERVER
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
});

// ============================================
// ACTIVE NAVIGATION
// ============================================
const sections = document.querySelectorAll('section, footer');
const navLinks = document.querySelectorAll('.nav a');
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) link.classList.add('active');
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => navObserver.observe(section));

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================
// PARALLAX ORBS
// ============================================
let mouseX = 0, mouseY = 0, isMoving = false;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (!isMoving) { requestAnimationFrame(updateOrbs); isMoving = true; }
});
function updateOrbs() {
    document.querySelectorAll('.orb').forEach((orb, index) => {
        const speed = (index + 1) * 20;
        orb.style.transform = `translate(${(window.innerWidth/2 - mouseX)/speed}px, ${(window.innerHeight/2 - mouseY)/speed}px)`;
    });
    isMoving = false;
}

// ============================================
// PROFILE PICTURE CROPPER
// ============================================
const fileInput = document.getElementById('profileUpload');
const imageToCrop = document.getElementById('imageToCrop');
const cropModal = document.getElementById('cropModal');
const profileImage = document.getElementById('profileImage');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                cropModal.style.display = 'flex';
                imageToCrop.src = event.target.result;

                if (cropper) { cropper.destroy(); }

                cropper = new Cropper(imageToCrop, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 0.9,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: false,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    });
}

function closeCropModal() {
    cropModal.style.display = 'none';
    if (cropper) { cropper.destroy(); cropper = null; }
}

function saveCroppedImage() {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas({ width: 320, height: 320 });
    profileImage.src = canvas.toDataURL('image/jpeg');
    closeCropModal();
}

// ============================================
// LIGHTBOX / POPUP GALLERY
// ============================================
function openLightbox(images, index, caption) {
    currentLightboxImages = images;
    currentLightboxIndex = index;
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImage');
    const cap = document.getElementById('lightboxCaption');

    img.src = images[index].src;
    cap.textContent = caption || images[index].caption || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(e) {
    if (e) e.stopPropagation();
    document.getElementById('lightboxModal').classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction, e) {
    if (e) e.stopPropagation();
    if (currentLightboxImages.length === 0) return;

    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = currentLightboxImages.length - 1;
    if (currentLightboxIndex >= currentLightboxImages.length) currentLightboxIndex = 0;

    const img = document.getElementById('lightboxImage');
    const cap = document.getElementById('lightboxCaption');
    const item = currentLightboxImages[currentLightboxIndex];

    img.src = item.src;
    cap.textContent = item.caption || '';
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightboxModal');
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ============================================
// CASE DETAIL MODAL (Multi-Image Support)
// ============================================
const caseData = {
    1: {
        title: '[Case Title 1]',
        description: '[Detailed case description goes here. Describe the patient condition, treatment plan, procedure performed, and outcome.]',
        images: [
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+1+-+Before', caption: 'Before Treatment' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+1+-+During', caption: 'During Procedure' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+1+-+After', caption: 'After Treatment' }
        ]
    },
    2: {
        title: '[Case Title 2]',
        description: '[Detailed case description goes here. Describe the patient condition, treatment plan, procedure performed, and outcome.]',
        images: [
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+2+-+Step+1', caption: 'Initial Examination' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+2+-+Step+2', caption: 'Preparation' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+2+-+Step+3', caption: 'Procedure' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+2+-+Step+4', caption: 'Final Result' }
        ]
    },
    3: {
        title: '[Case Title 3]',
        description: '[Detailed case description goes here. Describe the patient condition, treatment plan, procedure performed, and outcome.]',
        images: [
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+3+-+Image+1', caption: 'Pre-operative View' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+3+-+Image+2', caption: 'Post-operative View' }
        ]
    },
    4: {
        title: '[Case Title 4]',
        description: '[Detailed case description goes here. Describe the patient condition, treatment plan, procedure performed, and outcome.]',
        images: [
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+4+-+Image+1', caption: 'Initial State' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+4+-+Image+2', caption: 'Mid-treatment' },
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Case+4+-+Image+3', caption: 'Completed' }
        ]
    }
};

function openCaseModal(caseId) {
    const data = caseData[caseId];
    if (!data) return;

    const modal = document.getElementById('caseModal');
    document.getElementById('caseModalTitle').textContent = data.title;
    document.getElementById('caseModalDesc').textContent = data.description;

    const grid = document.getElementById('caseImagesGrid');
    grid.innerHTML = '';

    data.images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'case-image-item';
        item.innerHTML = `
            <img src="${img.src}" alt="${img.caption}" onclick="openLightboxFromCase(${caseId}, ${index})">
            <div class="case-image-caption">${img.caption}</div>
        `;
        grid.appendChild(item);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openLightboxFromCase(caseId, imageIndex) {
    const data = caseData[caseId];
    if (!data) return;
    openLightbox(data.images, imageIndex, null);
}

function closeCaseModal(e) {
    if (e) e.stopPropagation();
    document.getElementById('caseModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// CERTIFICATE DETAIL MODAL
// ============================================
const certData = {
    1: {
        title: 'Basic Life Support (BLS)',
        org: '[Issuing Organization]',
        date: '[Year]',
        image: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=BLS+Certificate+Full'
    },
    2: {
        title: 'Advanced Cardiac Life Support (ACLS)',
        org: '[Issuing Organization]',
        date: '[Year]',
        image: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=ACLS+Certificate+Full'
    },
    3: {
        title: '[Workshop Name]',
        org: '[Organizer]',
        date: '[Year]',
        image: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Workshop+Certificate+Full'
    },
    4: {
        title: '[Conference/CME]',
        org: '[Organization]',
        date: '[Year]',
        image: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=Conference+Certificate+Full'
    }
};

function openCertModal(certId) {
    const data = certData[certId];
    if (!data) return;

    const modal = document.getElementById('certModal');
    document.getElementById('certModalImage').src = data.image;
    document.getElementById('certModalTitle').textContent = data.title;
    document.getElementById('certModalOrg').textContent = data.org;
    document.getElementById('certModalDate').innerHTML = `<i class="fas fa-calendar"></i> ${data.date}`;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
    if (e) e.stopPropagation();
    document.getElementById('certModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// ADD CERTIFICATE
// ============================================
let certCount = 4;
function addCertificate() {
    if (!isAdmin || !isEditMode) return;
    certCount++;
    const grid = document.getElementById('certGrid');
    const card = document.createElement('div');
    card.className = 'cert-card reveal delay-1';
    card.setAttribute('data-cert-id', certCount);
    card.innerHTML = `
        <div class="cert-image" onclick="openCertModal(${certCount})">
            <div class="cert-image-placeholder" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px;">
                <i class="fas fa-image" style="font-size:2.5rem;opacity:0.4;"></i>
                <p>Add Certificate Image</p>
            </div>
        </div>
        <div class="cert-content">
            <div class="cert-badge"><i class="fas fa-check-circle"></i> Verified</div>
            <h4>[Certificate Title]</h4>
            <p>[Organization]</p>
            <p class="cert-date"><i class="fas fa-calendar"></i> <span>[Year]</span></p>
        </div>
    `;
    grid.appendChild(card);
    revealObserver.observe(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// ADD GALLERY ITEM (Multi-Image Case)
// ============================================
let galleryCount = 4;
function addGalleryItem() {
    if (!isAdmin || !isEditMode) return;
    galleryCount++;
    const grid = document.getElementById('galleryGrid');
    const item = document.createElement('div');
    item.className = 'gallery-item reveal-scale delay-1';
    item.setAttribute('data-case-id', galleryCount);
    item.setAttribute('onclick', `openCaseModal(${galleryCount})`);
    item.innerHTML = `
        <div class="gallery-case-preview">
            <img src="https://via.placeholder.com/400x300/1e293b/06b6d4?text=New+Case+${galleryCount}" alt="Case ${galleryCount}">
            <div class="case-image-count"><i class="fas fa-images"></i> 1</div>
        </div>
        <div class="gallery-overlay">
            <h4>[Case Title]</h4>
            <p>[Brief description]</p>
        </div>
    `;

    // Add to caseData
    caseData[galleryCount] = {
        title: '[New Case Title]',
        description: '[Case description goes here]',
        images: [
            { src: 'https://via.placeholder.com/600x400/1e293b/06b6d4?text=New+Case', caption: 'Image 1' }
        ]
    };

    grid.appendChild(item);
    revealObserver.observe(item);
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// ADD NEW SECTION
// ============================================
let sectionCount = 0;
function addNewSection() {
    if (!isAdmin || !isEditMode) return;
    sectionCount++;
    const container = document.getElementById('dynamicSections');
    const section = document.createElement('div');
    section.className = 'dynamic-section section-wrapper';
    section.id = 'dynamic-section-' + sectionCount;
    section.innerHTML = `
        <button class="remove-section-btn" onclick="removeSection('dynamic-section-${sectionCount}')" style="display:flex;">
            <i class="fas fa-trash"></i> Remove Section
        </button>
        <div class="section-header reveal">
            <h2><i class="fas fa-folder-open"></i> <span>New Section Title</span></h2>
            <p>Section description goes here</p>
        </div>
        <div class="glass-card reveal">
            <div class="about-text">
                <p>Click here to add your content.</p>
                <p>This is a fully customizable section. Add as much content as you need.</p>
            </div>
        </div>
    `;
    container.appendChild(section);
    revealObserver.observe(section.querySelector('.section-header'));
    revealObserver.observe(section.querySelector('.glass-card'));
    section.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(-20px)';
        setTimeout(() => section.remove(), 300);
    }
}

// ============================================
// SAVE TO PDF
// ============================================
function saveToPDF() {
    if (!isAdmin) return;
    const element = document.querySelector('.main-container');
    const opt = {
        margin: 0.5,
        filename: 'Dr_Portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// ============================================
// IMAGE LOCKING (Robust Cross-Browser)
// ============================================
function lockImages() {
    // Prevent drag, selection, and right-click on all images in public view
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'false');
        img.style.webkitUserDrag = 'none';
        img.style.userSelect = 'none';
        img.style.webkitUserSelect = 'none';
        img.style.mozUserSelect = 'none';
        img.style.msUserSelect = 'none';
    });
}

function unlockImages() {
    document.querySelectorAll('img').forEach(img => {
        img.setAttribute('draggable', 'true');
        img.style.webkitUserDrag = 'auto';
        img.style.userSelect = 'auto';
        img.style.webkitUserSelect = 'auto';
        img.style.mozUserSelect = 'auto';
        img.style.msUserSelect = 'auto';
    });
}

// Prevent right-click on images in public mode
document.addEventListener('contextmenu', (e) => {
    if (!isAdmin && e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Close modals with Escape
    if (e.key === 'Escape') {
        closeLightbox();
        closeCaseModal();
        closeCertModal();
        closeCropModal();
    }
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initAdminAuth();
    lockImages();

    // Ensure profile image is locked in public mode
    const heroWrapper = document.querySelector('.hero-image-wrapper');
    if (heroWrapper && !isAdmin) {
        heroWrapper.style.pointerEvents = 'none';
        heroWrapper.style.cursor = 'default';
    }
});