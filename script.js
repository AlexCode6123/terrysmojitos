// Selecciona el contenedor que mueve los slides horizontalmente.
const track = document.querySelector('.carousel-track');

// Obtiene todos los elementos hijos del track: cada slide del carrusel.
let slides = Array.from(track.children);

// Botones para avanzar y retroceder manualmente.
const nextButton = document.querySelector('.carousel-button.next');
const prevButton = document.querySelector('.carousel-button.prev');

// Contenedor de los puntos de navegación del carrusel.
const dotsNav = document.querySelector('.carousel-dots');

// Índice de la slide actualmente visible.
let currentIndex = 0;

// Función para obtener los slides visibles según el dispositivo
const getVisibleSlides = () => {
    return Array.from(track.children).filter(slide => {
        const style = window.getComputedStyle(slide);
        return style.display !== 'none';
    });
};

// Función para actualizar los puntos de navegación
const updateDots = () => {
    const visibleSlides = getVisibleSlides();
    dotsNav.innerHTML = '';

    visibleSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', index);
        dotsNav.appendChild(dot);
    });
};

// Actualiza la posición del carrusel y el estado de los puntos.
const updateCarousel = index => {
    const visibleSlides = getVisibleSlides();
    // Mueve el track al slide correspondiente usando transform translateX.
    track.style.transform = `translateX(-${index * 100}%)`;

    // Quita la clase activa de todos los puntos.
    const dots = Array.from(dotsNav.children);
    dots.forEach(dot => dot.classList.remove('active'));

    // Marca el punto correspondiente al slide actual.
    if (dots[index]) {
        dots[index].classList.add('active');
    }
};

// Función que maneja el cambio de slides
const changeSlide = (direction) => {
    const visibleSlides = getVisibleSlides();
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % visibleSlides.length;
    } else {
        currentIndex = (currentIndex - 1 + visibleSlides.length) % visibleSlides.length;
    }
    updateCarousel(currentIndex);
};

// Al hacer clic en "Siguiente"
nextButton.addEventListener('click', () => changeSlide('next'));

// Al hacer clic en "Anterior"
prevButton.addEventListener('click', () => changeSlide('prev'));

// Al hacer clic en un punto de navegación
dotsNav.addEventListener('click', e => {
    if (!e.target.classList.contains('carousel-dot')) return;
    currentIndex = Number(e.target.dataset.slide);
    updateCarousel(currentIndex);
});

// Función que avanza el carrusel automáticamente
const autoAdvance = () => {
    const visibleSlides = getVisibleSlides();
    currentIndex = (currentIndex + 1) % visibleSlides.length;
    updateCarousel(currentIndex);
};

// Función para reiniciar el temporizador automático
const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(autoAdvance, 5000);
};

// Inicia la configuración inicial
const initCarousel = () => {
    updateDots();
    updateCarousel(0);
};

// Inicia la rotación automática del carrusel cada 5 segundos.
let autoTimer = setInterval(autoAdvance, 5000);

// Si el usuario usa los controles manuales, reiniciamos el temporizador.
nextButton.addEventListener('click', resetAuto);
prevButton.addEventListener('click', resetAuto);
dotsNav.addEventListener('click', resetAuto);

// Detecta cambios de tamaño de pantalla para actualizar los slides
window.addEventListener('resize', () => {
    currentIndex = 0; // Reinicia al primer slide
    initCarousel();
});

// Inicializa el carrusel
initCarousel();