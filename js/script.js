// Canvas Fireworks implementation
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 4 + 2; 
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2; 
        this.velocity = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.velocity.y += 0.05; 
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}

function createFirework(x, y) {
    const colors = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#ec4899', '#ffffff'];
    const pCount = 85; 
    for (let i = 0; i < pCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(new Particle(x, y, color));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.alpha > 0);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Loop Cycle - 10 Seconds
const heroContent = document.getElementById('heroContent');

function runAnimationCycle() {
    if(heroContent) {
        heroContent.className = 'hero-content animate-in';
        setTimeout(() => {
            createFirework(canvas.width / 2, canvas.height / 2);
        }, 800);
        setTimeout(() => {
            heroContent.className = 'hero-content animate-out';
        }, 4500);
    }
}

runAnimationCycle();
setInterval(runAnimationCycle, 10000);

// Full Screen Lightbox Modal
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
}
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

// Local Storage Engine for Client Ratings and Comments
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');

function loadReviews() {
    if(!reviewsList) return;
    reviewsList.innerHTML = '';
    const reviews = JSON.parse(localStorage.getItem('plumeria_reviews')) || [
        { name: "আরিফ রহমান", comment: "তাদের লিভিং রুম ডিজাইন চমৎকার লেগেছে! একদম প্রফেশনাল টিম।", rating: "5" },
        { name: "নাসরিন সুলতানা", comment: "অফিস স্পেস ডেকোরেশনটি সবাই পছন্দ করেছে। ধন্যবাদ প্লামেরিয়া টিম।", rating: "5" }
    ];
    reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        let stars = '⭐'.repeat(parseInt(r.rating));
        card.innerHTML = `<h4>${r.name}</h4><div class="review-stars">${stars}</div><p>${r.comment}</p>`;
        reviewsList.appendChild(card);
    });
}

if(reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName').value;
        const comment = document.getElementById('clientComment').value;
        const rating = document.getElementById('clientRating').value;
        
        const reviews = JSON.parse(localStorage.getItem('plumeria_reviews')) || [];
        reviews.unshift({ name, comment, rating });
        localStorage.setItem('plumeria_reviews', JSON.stringify(reviews));
        
        reviewForm.reset();
        loadReviews();
    });
}

loadReviews();

// 🔄 অটো-প্লে ইমেজ লুপ স্লাইডার ইঞ্জিন (এবাউট সেকশনের জন্য নতুন কোড)
let currentSliderIndex = 0;
const sliderTrack = document.getElementById('sliderTrack');
const sliderItems = document.querySelectorAll('.slider-item');
const totalSliderItems = sliderItems.length;

function updateSliderPosition() {
    if(!sliderTrack || totalSliderItems === 0) return;
    
    let itemsPerView = 4; // ডেস্কটপে একসাথে ৪টি করে ছবি দেখাবে
    if (window.innerWidth <= 600) {
        itemsPerView = 1; // মোবাইলে ১টি ছবি
    } else if (window.innerWidth <= 1024) {
        itemsPerView = 2; // ট্যাবলেটে ২টি ছবি
    }
    
    const maxIndex = totalSliderItems - itemsPerView;
    
    if (currentSliderIndex > maxIndex) {
        currentSliderIndex = 0; // চক্রাকারে প্রথমে ফিরে আসবে
    } else if (currentSliderIndex < 0) {
        currentSliderIndex = maxIndex;
    }
    
    const slideWidth = 100 / itemsPerView;
    sliderTrack.style.transform = `translateX(-${currentSliderIndex * slideWidth}%)`;
}

function moveSlider(direction) {
    currentSliderIndex += direction;
    updateSliderPosition();
}

// স্লাইডার ট্র্যাক ও কন্টেইনার থাকলে অটো-প্লে চালু হবে
const sliderContainer = document.querySelector('.slider-container');
if(sliderContainer && sliderTrack) {
    // প্রতি ৩ সেকেন্ড পর পর স্বয়ংক্রিয়ভাবে ঘুরবে
    let autoPlayInterval = setInterval(() => moveSlider(1), 3000);

    // মাউস স্লাইডারের ওপর নিয়ে গেলে অটো-প্লে সাময়িক বন্ধ থাকবে
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    sliderContainer.addEventListener('mouseleave', () => autoPlayInterval = setInterval(() => moveSlider(1), 3000));
    
    window.addEventListener('resize', updateSliderPosition);
    // পেজ লোড হওয়ার সাথে সাথে পজিশন ঠিক করার জন্য একবার রান করা হলো
    updateSliderPosition();
}
