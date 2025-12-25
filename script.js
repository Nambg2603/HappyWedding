// Dữ liệu ảnh cho gallery
const galleryImages = [
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

// Dữ liệu lời chúc mẫu
const sampleWishes = [
    { name: 'Minh Anh', message: 'Chúc hai em trăm năm hạnh phúc! Tình yêu đẹp như mơ sẽ mãi bền lâu.', date: '10.10.2023' },
    { name: 'Quang Huy', message: 'Chúc mừng hạnh phúc của hai bạn! Mong rằng tình yêu của hai bạn sẽ ngày càng đơm hoa kết trái.', date: '09.10.2023' },
    { name: 'Thu Hà', message: 'Thật hạnh phúc khi được chứng kiến tình yêu của hai bạn. Chúc các bạn mãi mãi bên nhau!', date: '08.10.2023' }
];

// Biến toàn cục
let currentFilter = 'all';
let visibleImages = 8;
let map, modalMap;
let wishes = [...sampleWishes];

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Ẩn loading screen sau 2 giây
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        // Tạo hiệu ứng trái tim bay
        createFloatingHearts();
    }, 2000);
    
    // Khởi tạo các chức năng
    initCountdown();
    initMusicPlayer();
    initNavigation();
    initScrollEffects();
    initGallery();
    initRSVPForm();
    initWishForm();
    initScrollToTop();
    initMap();
    initModal();
    
    // Thêm sự kiện cho các nút xem bản đồ
    document.querySelectorAll('.map-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const location = this.getAttribute('data-location').split(',');
            openMapModal(parseFloat(location[0]), parseFloat(location[1]));
        });
    });
    
    // Tạo hiệu ứng confetti khi tải xong
    setTimeout(createConfetti, 2500);
});

// Countdown đến ngày cưới
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    // Đặt ngày cưới của bạn ở đây (năm, tháng-1, ngày, giờ, phút, giây)
    const weddingDate = new Date(2023, 9, 15, 14, 0, 0).getTime();
    const now = new Date().getTime();
    const timeLeft = weddingDate - now;
    
    if (timeLeft < 0) {
        // Nếu ngày cưới đã qua
        document.getElementById('days').innerHTML = '00';
        document.getElementById('hours').innerHTML = '00';
        document.getElementById('minutes').innerHTML = '00';
        document.getElementById('seconds').innerHTML = '00';
        
        // Cập nhật tiêu đề nếu ngày cưới đã qua
        const weddingTitle = document.querySelector('.wedding-title');
        if (weddingTitle) {
            weddingTitle.textContent = "Cảm ơn đã tham dự hôn lễ của chúng tôi!";
        }
        
        return;
    }
    
    // Tính toán ngày, giờ, phút, giây
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Cập nhật DOM
    document.getElementById('days').innerHTML = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerHTML = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerHTML = seconds < 10 ? '0' + seconds : seconds;
}

// Xử lý nhạc nền
function initMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const weddingMusic = document.getElementById('weddingMusic');
    let isPlaying = false;
    
    // Thử phát nhạc tự động (bị chặn trên nhiều trình duyệt)
    const playPromise = weddingMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
        }).catch(() => {
            // Tự động phát bị chặn, để người dùng bật thủ công
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
            // Tạo hiệu ứng confetti khi bật nhạc
            createConfetti();
        }
        isPlaying = !isPlaying;
    });
}

// Navigation
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mainNav = document.getElementById('mainNav');
    
    // Toggle menu mobile
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Đóng menu khi click vào link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Cập nhật active state
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Thay đổi style nav khi scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    });
}

// Hiệu ứng scroll fade-in
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
    
    // Kiểm tra ngay khi tải trang
    checkFade();
}

// Gallery
function initGallery() {
    renderGallery();
    setupGalleryFilter();
    setupViewMore();
}

function renderGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    galleryGrid.innerHTML = '';
    
    // Lọc ảnh theo category
    const filteredImages = currentFilter === 'all' 
        ? galleryImages 
        : galleryImages.filter(img => img.category === currentFilter);
    
    // Hiển thị số lượng ảnh tối đa
    const imagesToShow = filteredImages.slice(0, visibleImages);
    
    // Tạo HTML cho từng ảnh
    imagesToShow.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item fade-in';
        galleryItem.setAttribute('data-category', image.category);
        
        galleryItem.innerHTML = `
            <a href="${image.src}" data-fancybox="gallery" data-caption="${image.title}">
                <img src="${image.src}" alt="${image.title}">
            </a>
            <div class="gallery-item-overlay">
                <h4>${image.title}</h4>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
    });
    
    // Khởi tạo fancybox
    $('[data-fancybox="gallery"]').fancybox({
        buttons: [
            "zoom",
            "share",
            "slideShow",
            "fullScreen",
            "download",
            "thumbs",
            "close"
        ],
        loop: true,
        protect: true
    });
    
    // Cập nhật nút "Xem thêm"
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    if (visibleImages >= filteredImages.length) {
        viewMoreBtn.style.display = 'none';
    } else {
        viewMoreBtn.style.display = 'inline-block';
    }
    
    // Kích hoạt hiệu ứng fade-in cho ảnh mới
    setTimeout(() => {
        const newItems = document.querySelectorAll('.gallery-item:not(.visible)');
        newItems.forEach(item => {
            const elementTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                item.classList.add('visible');
            }
        });
    }, 100);
}

function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Cập nhật active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Cập nhật filter và render lại gallery
            currentFilter = this.getAttribute('data-filter');
            visibleImages = 8; // Reset về 8 ảnh
            renderGallery();
        });
    });
}

function setupViewMore() {
    const viewMoreBtn = document.getElementById('viewMoreBtn');
    
    viewMoreBtn.addEventListener('click', function() {
        visibleImages += 4;
        renderGallery();
        
        // Cuộn đến phần tử cuối cùng
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            galleryItems[galleryItems.length - 1].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    });
}

// RSVP Form
function initRSVPForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    if (!rsvpForm) return;
    
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            guests: document.getElementById('guests').value,
            attendance: document.querySelector('input[name="attendance"]:checked').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Lưu vào localStorage
        saveRSVPToLocalStorage(formData);
        
        // Hiển thị thông báo cảm ơn
        thankYouMessage.style.display = 'block';
        rsvpForm.reset();
        
        // Tạo hiệu ứng confetti
        createConfetti();
        
        // Cuộn đến thông báo
        thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ẩn thông báo sau 10 giây
        setTimeout(() => {
            thankYouMessage.style.display = 'none';
        }, 10000);
    });
}

function saveRSVPToLocalStorage(formData) {
    let rsvpList = JSON.parse(localStorage.getItem('weddingRSVP')) || [];
    rsvpList.push(formData);
    localStorage.setItem('weddingRSVP', JSON.stringify(rsvpList));
    console.log('RSVP đã được lưu:', formData);
}

// Wish Form
function initWishForm() {
    const wishForm = document.getElementById('wishForm');
    const wishesScroll = document.querySelector('.wishes-scroll');
    
    // Tải lời chúc từ localStorage
    const savedWishes = JSON.parse(localStorage.getItem('weddingWishes'));
    if (savedWishes && savedWishes.length > 0) {
        wishes = [...sampleWishes, ...savedWishes];
    }
    
    // Hiển thị lời chúc
    renderWishes();
    
    if (!wishForm) return;
    
    wishForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('wishName').value.trim();
        const message = document.getElementById('wishMessage').value.trim();
        
        if (!name || !message) return;
        
        // Tạo lời chúc mới
        const newWish = {
            name: name,
            message: message,
            date: new Date().toLocaleDateString('vi-VN')
        };
        
        // Thêm vào mảng và lưu
        wishes.unshift(newWish);
        saveWishesToLocalStorage();
        
        // Hiển thị lại
        renderWishes();
        
        // Reset form
        wishForm.reset();
        
        // Tạo hiệu ứng
        createConfetti();
        
        // Thông báo
        alert('Cảm ơn bạn đã gửi lời chúc!');
    });
}

function renderWishes() {
    const wishesScroll = document.querySelector('.wishes-scroll');
    if (!wishesScroll) return;
    
    wishesScroll.innerHTML = '';
    
    // Hiển thị tối đa 10 lời chúc
    const wishesToShow = wishes.slice(0, 10);
    
    wishesToShow.forEach(wish => {
        const wishItem = document.createElement('div');
        wishItem.className = 'wish-item';
        
        wishItem.innerHTML = `
            <div class="wish-author">
                <i class="fas fa-user-circle"></i>
                ${wish.name}
            </div>
            <div class="wish-text">"${wish.message}"</div>
            <div class="wish-date">${wish.date}</div>
        `;
        
        wishesScroll.appendChild(wishItem);
    });
}

function saveWishesToLocalStorage() {
    // Chỉ lưu những lời chúc không phải mẫu
    const userWishes = wishes.filter(wish => 
        !sampleWishes.some(sample => 
            sample.name === wish.name && sample.message === wish.message
        )
    );
    
    localStorage.setItem('weddingWishes', JSON.stringify(userWishes));
}

// Scroll to top
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Bản đồ
function initMap() {
    // Kiểm tra xem Google Maps API đã được tải chưa
    if (typeof google === 'undefined') {
        console.warn('Google Maps API không khả dụng');
        return;
    }
    
    // Tọa độ mặc định (khách sạn InterContinental)
    const defaultLocation = { lat: 21.037365, lng: 105.809149 };
    
    // Khởi tạo bản đồ chính
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: defaultLocation,
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#5a4a42' }]
            },
            {
                featureType: 'poi',
                elementType: 'all',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Thêm marker
    new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: 'Địa điểm tiệc cưới',
        icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
        }
    });
    
    // Khởi tạo bản đồ cho modal
    modalMap = new google.maps.Map(document.getElementById('modalMap'), {
        zoom: 16,
        center: defaultLocation,
        styles: [
            {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#5a4a42' }]
            }
        ]
    });
}

function openMapModal(lat, lng) {
    const modal = document.getElementById('mapModal');
    const location = { lat: lat, lng: lng };
    
    // Cập nhật vị trí bản đồ modal
    if (modalMap) {
        modalMap.setCenter(location);
        modalMap.setZoom(16);
        
        // Xóa marker cũ và thêm marker mới
        new google.maps.Marker({
            position: location,
            map: modalMap,
            title: 'Địa điểm',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
            }
        });
    }
    
    // Hiển thị modal
    modal.style.display = 'flex';
}

// Modal
function initModal() {
    const modal = document.getElementById('mapModal');
    const closeModal = document.querySelector('.close-modal');
    
    // Đóng modal khi click vào nút đóng
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Đóng modal khi click bên ngoài nội dung
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Đóng modal khi nhấn phím ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
        }
    });
}

// Tạo hiệu ứng trái tim bay
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const heartCount = 20;
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        
        // Random vị trí và kích thước
        const left = Math.random() * 100;
        const size = Math.random() * 20 + 10;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;
        
        // Random màu
        const colors = ['#e8c9c1', '#d4a5a5', '#f8c8dc', '#d4af37'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.color = color;
        
        container.appendChild(heart);
        
        // Xóa heart sau khi animation kết thúc
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, (duration + delay) * 1000);
    }
    
    // Tiếp tục tạo hearts mới
    setTimeout(createFloatingHearts, 2000);
}

// Tạo hiệu ứng confetti
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random vị trí, kích thước và màu
        const left = Math.random() * 100;
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        confetti.style.left = `${left}%`;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.animation = `confettiFall ${duration}s ease-in ${delay}s forwards`;
        
        container.appendChild(confetti);
        
        // Xóa confetti sau khi rơi xong
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, (duration + delay) * 1000);
    }
    
    // Thêm CSS animation cho confetti
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Thêm năm hiện tại vào footer
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('.copyright');
yearElements.forEach(element => {
    element.textContent = element.textContent.replace('2023', currentYear);
});