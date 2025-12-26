// ==============================================
// CONFIGURATION - THAY ĐỔI CÁC THÔNG SỐ DƯỚI ĐÂY
// ==============================================

// 1. CẤU HÌNH GOOGLE SHEETS API
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyr08wAa0vx3odkuxM05NcgZfD19QP0cqtFTuUk0q_uXpX7S2K8JF2v8Cd9Sr2pkiTQtg/exec';

// 2. CẤU HÌNH NGÀY CƯỚI (Năm, Tháng-1, Ngày, Giờ, Phút, Giây)
const WEDDING_DATE = new Date(2025, 11, 31, 14, 0, 0); // Tháng 11 là tháng 12

// 3. DỮ LIỆU ẢNH CHO GALLERY
const GALLERY_IMAGES = [
    { src: 'assets/images/gallery1.jpg', category: 'prewedding', title: 'Ảnh cưới 1' },
    { src: 'assets/images/gallery2.jpg', category: 'prewedding', title: 'Ảnh cưới 2' },
    { src: 'assets/images/gallery3.jpg', category: 'engagement', title: 'Tiệc đính hôn 1' },
    { src: 'assets/images/gallery4.jpg', category: 'engagement', title: 'Tiệc đính hôn 2' },
    { src: 'assets/images/gallery5.jpg', category: 'candid', title: 'Khoảnh khắc tự nhiên 1' },
    { src: 'assets/images/gallery6.jpg', category: 'candid', title: 'Khoảnh khắc tự nhiên 2' },
    { src: 'assets/images/gallery7.jpg', category: 'family', title: 'Cùng gia đình' },
    { src: 'assets/images/gallery8.jpg', category: 'family', title: 'Họ hàng hai bên' },
    { src: 'assets/images/gallery9.jpg', category: 'prewedding', title: 'Ảnh cưới 3' },
    { src: 'assets/images/gallery10.jpg', category: 'prewedding', title: 'Ảnh cưới 4' },
    { src: 'assets/images/gallery11.jpg', category: 'engagement', title: 'Tiệc đính hôn 3' },
    { src: 'assets/images/gallery12.jpg', category: 'candid', title: 'Khoảnh khắc tự nhiên 3' }
];

// ==============================================
// BIẾN TOÀN CỤC
// ==============================================

let currentFilter = 'all';
let visibleImages = 8;

// ==============================================
// HÀM KHỞI TẠO CHÍNH
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    // Ẩn loading screen sau 2 giây (nếu có)
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            createFloatingHearts();
        }, 2000);
    } else {
        createFloatingHearts();
    }
    
    // Khởi tạo các chức năng
    initCountdown();
    initMusicPlayer();
    initNavigation();
    initScrollEffects();
    initGallery();
    initWishForm();
    initRSVPForm();
    initScrollToTop();
    initModal();
    
    // Tải dữ liệu từ Google Sheets
    loadWishes();
    loadRSVPStats();
    
    // Thêm sự kiện cho các nút xem bản đồ
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Chức năng bản đồ đang được cập nhật!', 'info');
        });
    });
    
    // Tạo hiệu ứng confetti khi tải xong
    setTimeout(createConfetti, 2500);

    // Cập nhật năm hiện tại ở footer
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.copyright');
    yearElements.forEach(element => {
        if(element.textContent.includes('2025')) {
             // Giữ nguyên hoặc update nếu cần
        }
    });
});

// ==============================================
// COUNTDOWN - ĐẾM NGƯỢC ĐẾN NGÀY CƯỚI
// ==============================================

function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = WEDDING_DATE.getTime() - now;
    
    if (timeLeft < 0) {
        document.getElementById('days').innerHTML = '00';
        document.getElementById('hours').innerHTML = '00';
        document.getElementById('minutes').innerHTML = '00';
        document.getElementById('seconds').innerHTML = '00';
        
        const weddingTitle = document.querySelector('.wedding-title');
        if (weddingTitle) {
            weddingTitle.textContent = "Cảm ơn đã tham dự hôn lễ của chúng tôi!";
        }
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    document.getElementById('days').innerHTML = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
}

// ==============================================
// MUSIC PLAYER - NHẠC NỀN
// ==============================================

function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const weddingMusic = document.getElementById('weddingMusic');
    if (!musicToggle || !weddingMusic) return;

    let isPlaying = false;
    
    // Autoplay policy của trình duyệt thường chặn tự phát nhạc
    // Nên ta chỉ thử, nếu lỗi thì chờ người dùng click
    const playPromise = weddingMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
        }).catch(() => {
            isPlaying = false;
        });
    }
    
    musicToggle.addEventListener('click', function() {
        if (isPlaying) {
            weddingMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.style.background = 'var(--secondary-color)';
        } else {
            weddingMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
            createConfetti();
        }
        isPlaying = !isPlaying;
    });
}

// ==============================================
// NAVIGATION - ĐIỀU HƯỚNG
// ==============================================

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainNav = document.getElementById('mainNav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });
}

// ==============================================
// SCROLL EFFECTS - HIỆU ỨNG CUỘN
// ==============================================

function initScrollEffects() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const checkFade = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    window.addEventListener('scroll', checkFade);
    window.addEventListener('load', checkFade);
    checkFade();
}

// ==============================================
// GALLERY - ALBUM ẢNH
// ==============================================

function initGallery() {
    renderGallery();
    setupGalleryFilter();
    setupViewMore();
}

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    // Lọc ảnh theo category
    const filteredImages = currentFilter === 'all' 
        ? GALLERY_IMAGES 
        : GALLERY_IMAGES.filter(img => img.category === currentFilter);
    
    // Hiển thị số lượng ảnh tối đa
    const imagesToShow = filteredImages.slice(0, visibleImages);
    
    // Tạo HTML cho từng ảnh
    imagesToShow.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in visible'; // Thêm visible để hiện ngay
        galleryItem.setAttribute('data-category', image.category);
        
        galleryItem.innerHTML = `
            <a href="${image.src}" data-fancybox="gallery" data-caption="${image.title}">
                <img src="${image.src}" alt="${image.title}">
            </a>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
    
    // Khởi tạo fancybox (nếu thư viện đã load)
    if (typeof $ !== 'undefined' && $.fancybox) {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: ["zoom", "slideShow", "fullScreen", "close"],
            loop: true,
            protect: true
        });
    }
    
    // Cập nhật nút "Xem thêm"
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if (viewMoreBtn) {
        if (visibleImages >= filteredImages.length) {
            viewMoreBtn.style.display = 'none';
        } else {
            viewMoreBtn.style.display = 'inline-block';
        }
    }
}

function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            visibleImages = 8;
            renderGallery();
        });
    });
}

function setupViewMore() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', function() {
            visibleImages += 4;
            renderGallery();
            
            // Cuộn đến phần tử gần cuối
            const galleryItems = document.querySelectorAll('.gallery-item');
            if (galleryItems.length > 0) {
                // Scroll nhẹ để user thấy ảnh mới
            }
        });
    }
}

// ==============================================
// WISH FORM - FORM GỬI LỜI CHÚC
// ==============================================

function initWishForm() {
    const wishForm = document.getElementById('wishForm');
    
    if (!wishForm) return;
    
    wishForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('wishName');
        const messageInput = document.getElementById('wishMessage');
        const name = nameInput.value.trim();
        const message = messageInput.value.trim();
        
        if (!name || !message) {
            showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        // --- KỸ THUẬT OPTIMISTIC UI (HIỆN NGAY LẬP TỨC) ---
        
        // 1. Tạo đối tượng lời chúc tạm thời
        const tempWish = {
            name: name,
            message: message,
            date: new Date().toISOString(),
            timestamp: new Date().getTime()
        };

        // 2. Xóa thông báo "chưa có lời chúc" nếu có
        const wishesScroll = document.getElementById('wishesScroll');
        const noWishes = wishesScroll.querySelector('.no-wishes');
        if (noWishes) noWishes.remove();

        // 3. Tạo HTML cho lời chúc mới
        const wishItem = document.createElement('div');
        wishItem.className = 'wish-item new-item'; // Thêm class new-item để có hiệu ứng
        wishItem.style.animation = 'slideDown 0.5s ease-out';
        
        const dateDisplay = formatFriendlyDate(tempWish.date);
        
        wishItem.innerHTML = `
            <div class="wish-author">
                <i class="fas fa-user-circle"></i>
                <span class="author-name">${escapeHtml(name)}</span>
            </div>
            <div class="wish-text">"${escapeHtml(message)}"</div>
            <div class="wish-date"><i class="far fa-clock"></i> Vừa xong</div>
        `;

        // 4. Chèn lên đầu danh sách ngay lập tức
        wishesScroll.insertBefore(wishItem, wishesScroll.firstChild);
        
        // 5. Reset form ngay lập tức
        wishForm.reset();
        
        // 6. Hiệu ứng confetti chúc mừng
        createConfetti();
        showNotification('Cảm ơn bạn đã gửi lời chúc!', 'success');

        // --- SAU ĐÓ MỚI GỬI NGẦM VỀ SERVER ---
        const submitBtn = wishForm.querySelector('.submit-btn');
        submitBtn.disabled = true; // Chỉ disable nút để tránh spam

        try {
            // Gửi dữ liệu đi (người dùng không cần chờ bước này)
            await saveToGoogleSheets('wish', {
                name: name,
                message: message
            });
            
            // Sau khi gửi thành công, có thể tải lại danh sách thật để đồng bộ thời gian
            // Nhưng để tránh giật lag, ta có thể bỏ qua bước loadWishes() ngay lúc này
            // hoặc update thầm lặng. Ở đây tôi sẽ giữ nguyên giao diện đã render.
            
        } catch (error) {
            console.error('Error:', error);
            // Nếu lỗi thật sự, có thể hiện thông báo nhỏ, nhưng thường thì ít khi lỗi
        } finally {
            submitBtn.disabled = false;
        }
    });
}
// ==============================================
// RSVP FORM - FORM XÁC NHẬN THAM DỰ
// ==============================================

function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    if (!rsvpForm) return;
    
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const guests = document.getElementById('guests').value;
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const message = document.getElementById('message').value.trim();
        
        if (!name || !phone) {
            showNotification('Vui lòng điền họ tên và số điện thoại!', 'error');
            return;
        }
        
        if (!/^\d{10,11}$/.test(phone.replace(/\D/g, ''))) {
            showNotification('Số điện thoại không hợp lệ!', 'error');
            return;
        }
        
        // Hiển thị loading
        const submitBtn = rsvpForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
        submitBtn.disabled = true;
        
        try {
            const success = await saveToGoogleSheets('rsvp', {
                name: name,
                phone: phone,
                guests: guests,
                attendance: attendance,
                message: message
            });
            
            if (success) {
                if (thankYouMessage) {
                    thankYouMessage.style.display = 'block';
                    thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                rsvpForm.reset();
                createConfetti();
                loadRSVPStats();
                
                setTimeout(() => {
                    if (thankYouMessage) thankYouMessage.style.display = 'none';
                }, 10000);
                
                showNotification('Cảm ơn bạn đã xác nhận tham dự!', 'success');
            } else {
                showNotification('Có lỗi xảy ra. Vui lòng thử lại!', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Có lỗi kết nối. Vui lòng thử lại!', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==============================================
// GOOGLE SHEETS API FUNCTIONS - ĐÃ SỬA LỖI
// ==============================================

/**
 * Gửi dữ liệu lên Google Sheets
 * QUAN TRỌNG: Sử dụng content-type text/plain để tránh lỗi CORS Preflight
 */
async function saveToGoogleSheets(type, data) {
    try {
        console.log('Sending data to Google Sheets...', { type, data });
        
        const url = GOOGLE_SCRIPT_URL;
        
        const payload = {
            type: type,
            ...data
        };
        
        // SỬA LỖI QUAN TRỌNG TẠI ĐÂY:
        // 1. Dùng method POST
        // 2. Headers là text/plain để tránh preflight check của trình duyệt
        // 3. Body là chuỗi JSON
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            mode: 'cors', // Chắc chắn muốn nhận phản hồi
            redirect: 'follow',
            body: JSON.stringify(payload)
        });
        
        // Đọc phản hồi
        const responseText = await response.text();
        console.log('Response:', responseText);
        
        // Cố gắng parse JSON
        try {
            const result = JSON.parse(responseText);
            return result.success === true;
        } catch (e) {
            // Nếu trả về text mà có chữ success hoặc true thì coi như thành công
            return responseText.includes('success') || responseText.includes('true');
        }
        
    } catch (error) {
        console.error('Error in saveToGoogleSheets:', error);
        return false;
    }
}

// Tải danh sách lời chúc từ Google Sheets
async function loadWishes() {
    const wishesScroll = document.getElementById('wishesScroll');
    if (!wishesScroll) return;
    
    try {
        wishesScroll.innerHTML = '<div class="loading-wishes"><i class="fas fa-spinner fa-spin"></i> Đang tải lời chúc...</div>';
        
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getWishes&t=${new Date().getTime()}`);
        const result = await response.json();
        
        if (result.success && result.wishes) {
            renderWishes(result.wishes);
        } else {
            renderWishes(getSampleWishes()); // Fallback nếu lỗi
        }
    } catch (error) {
        console.error('Error loading wishes:', error);
        renderWishes(getSampleWishes());
    }
}

// Tải thống kê RSVP
async function loadRSVPStats() {
    const statsContainer = document.getElementById('rsvpStats');
    if (!statsContainer) return;
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getRSVPStats&t=${new Date().getTime()}`);
        const result = await response.json();
        
        if (result.success && result.stats) {
            renderRSVPStats(result.stats);
        }
    } catch (error) {
        console.error('Error loading RSVP stats:', error);
    }
}

function renderWishes(wishesArray) {
    const wishesScroll = document.getElementById('wishesScroll');
    if (!wishesScroll) return;
    
    // Nếu là load lần đầu thì xóa nội dung cũ
    // Nếu đang thêm mới thì không xóa (để xử lý logic bên dưới)
    if (wishesScroll.querySelector('.loading-wishes') || wishesScroll.querySelector('.no-wishes')) {
        wishesScroll.innerHTML = '';
    }
    
    if (!Array.isArray(wishesArray) || wishesArray.length === 0) {
        if (wishesScroll.children.length === 0) {
            wishesScroll.innerHTML = '<div class="no-wishes">Chưa có lời chúc nào. Hãy là người đầu tiên!</div>';
        }
        return;
    }
    
    // Sắp xếp mới nhất lên đầu
    wishesArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    // Lấy tối đa 20 lời chúc
    const wishesToShow = wishesArray.slice(0, 20);
    
    // Xóa danh sách cũ để render lại cho chuẩn (hoặc có thể tối ưu hơn nhưng cách này an toàn nhất)
    wishesScroll.innerHTML = '';

    wishesToShow.forEach(wish => {
        const wishItem = document.createElement('div');
        wishItem.className = 'wish-item fade-in visible'; 
        
        const name = wish.name || 'Ẩn danh';
        const message = wish.message || '';
        // SỬ DỤNG HÀM FORMAT THỜI GIAN MỚI Ở ĐÂY
        const dateDisplay = formatFriendlyDate(wish.date);
        
        wishItem.innerHTML = `
            <div class="wish-author">
                <i class="fas fa-user-circle"></i>
                <span class="author-name">${escapeHtml(name)}</span>
            </div>
            <div class="wish-text">"${escapeHtml(message)}"</div>
            <div class="wish-date"><i class="far fa-clock"></i> ${dateDisplay}</div>
        `;
        
        wishesScroll.appendChild(wishItem);
    });
}

// Render Thống kê RSVP
function renderRSVPStats(stats) {
    const statsContainer = document.getElementById('rsvpStats');
    if (!statsContainer) return;
    
    const statsHTML = `
        <div class="rsvp-stats fade-in visible">
            <h3>Thống kê tham dự</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${stats.totalResponses || 0}</div>
                    <div class="stat-label">Phản hồi</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.totalGuests || 0}</div>
                    <div class="stat-label">Khách</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${(stats.attendanceCount && stats.attendanceCount.yes) || 0}</div>
                    <div class="stat-label">Tham dự</div>
                </div>
            </div>
        </div>
    `;
    
    statsContainer.innerHTML = statsHTML;
}

// Lời chúc mẫu (dùng khi không load được)
function getSampleWishes() {
    return [
        { 
            name: 'Hệ thống', 
            message: 'Chào mừng bạn đến với sổ lưu bút của Nam & Hiền!', 
            date: 'Hôm nay',
            timestamp: new Date().getTime()
        }
    ];
}

// ==============================================
// UTILITY FUNCTIONS - HÀM TIỆN ÍCH
// ==============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    if (!container) return;
    
    // Xóa tim cũ để tránh quá tải
    container.innerHTML = '';
    
    const heartCount = 15;
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        const left = Math.random() * 100;
        const size = Math.random() * 15 + 10;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        
        const colors = ['#e8c9c1', '#d4a5a5', '#f8c8dc', '#d4af37'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(heart);
    }
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    if (!container) return;
    
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const left = Math.random() * 100;
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 1;
        
        confetti.style.left = `${left}%`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.position = 'absolute'; // Đảm bảo position
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = ['#e8c9c1', '#d4a5a5', '#f8c8dc'][Math.floor(Math.random() * 3)];
        confetti.style.animation = `confettiFall ${duration}s ease-in ${delay}s forwards`;
        
        container.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
        }, (duration + delay) * 1000);
    }
}

function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initModal() {
    const modal = document.getElementById('mapModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (!modal || !closeModal) return;
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) modal.style.display = 'none';
    });
}
// Hàm chuyển đổi thời gian ISO sang dạng thân thiện
// Ví dụ: "2025-12-25T17:00:00.000Z" -> "17:00 - 25/12/2025"
function formatFriendlyDate(isoString) {
    if (!isoString) return 'Vừa xong';
    
    try {
        const date = new Date(isoString);
        
        // Kiểm tra nếu date không hợp lệ
        if (isNaN(date.getTime())) return isoString;

        // Lấy giờ và phút
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        // Lấy ngày tháng năm
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes} - ${day}/${month}/${year}`;
    } catch (e) {
        return isoString;
    }
}
