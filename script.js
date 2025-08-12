document.addEventListener('DOMContentLoaded', function () {
    // Слайдер блюд
    const slides = document.querySelectorAll('.dish-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    let slideInterval = setInterval(nextSlide, 5000);

    nextBtn.addEventListener('click', () => {
        nextSlide();
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    });

    showSlide(0);

    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const today = new Date().getDay();

    const todaySlide = Array.from(slides).findIndex(slide =>
        slide.getAttribute('data-day') === days[today]
    );

    if (todaySlide !== -1) {
        showSlide(todaySlide);
    }

    // Модальное окно для галереи
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(img => {
        img.addEventListener('click', function () {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        });
    });

    const span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
        modal.style.display = "none";
    }

    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });

    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const body = document.body;

    if (mobileMenuToggle && mobileMenu && menuOverlay) {
        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.classList.toggle('menu-open');

            // Анимация бургера
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        menuOverlay.addEventListener('click', closeMenu);

        // Закрытие при клике на ссылки
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    function closeMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        body.classList.remove('menu-open');

        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});