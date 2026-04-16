// ==========================================
// 1. AGREGA TUS IMÁGENES AQUÍ
// ==========================================
const datosCarrusel = [
    // IMÁGENES WEB (Horizontales)
    {
        tipo: 'web', 
        imagen: 'Promo1_Horizontal.png',
        titulo: '¡OFERTA ÚNICA!',
        descripcion: 'Aprovecha esta oferta especial por tiempo limitado.',
        link: 'https://wa.me/56968099817?text=Hola%20quiero%20pedir%20la%20promo%20de%20$15.000'
    },
    {
        tipo: 'web',
        imagen: 'Promo2_Horizontal.png',
        titulo: '¡OFERTA ÚNICA!',
        descripcion: 'Aprovecha esta oferta especial por tiempo limitado.',
        link: 'https://wa.me/56968099817?text=Hola%20quiero%20pedir%20la%20promo%20de%20$18.000'
    },
    
    // IMÁGENES MÓVIL (Verticales)
    {
        tipo: 'movil',
        imagen: 'Promo1_vertical.jpeg',
        titulo: '¡OFERTA ÚNICA!',
        descripcion: 'Aprovecha esta oferta especial por tiempo limitado.',
        link: 'https://wa.me/56968099817?text=Hola%20quiero%20pedir%20la%20promo%20de%20$15.000' 
    },
    {
        tipo: 'movil',
        imagen: 'Promo2_vertical.jpeg',
        titulo: '¡OFERTA ÚNICA!',
        descripcion: 'Aprovecha esta oferta especial por tiempo limitado.',
        link: 'https://wa.me/56968099817?text=Hola%20quiero%20pedir%20la%20promo%20de%20$18.000'
    }
];
// ==========================================

const track = document.querySelector('.carousel-track');

// Generador Automático de HTML
const cargarImagenes = () => {
    track.innerHTML = ''; 
    
    datosCarrusel.forEach(item => {
        const claseVisibilidad = item.tipo === 'web' ? 'desktop-only' : 'mobile-only';
        
        let htmlImagen = item.link 
            ? `<a href="${item.link}" target="_blank"><img src="${item.imagen}" alt="${item.titulo || 'Promo'}" /></a>`
            : `<img src="${item.imagen}" alt="${item.titulo || 'Promo'}" />`;
            
        let htmlTexto = '';
        if(item.titulo || item.descripcion) {
            htmlTexto = `
                <div class="carousel-card-content">
                    ${item.titulo ? `<h3>${item.titulo}</h3>` : ''}
                    ${item.descripcion ? `<p>${item.descripcion}</p>` : ''}
                </div>
            `;
        }

        const article = document.createElement('article');
        article.className = `carousel-card ${claseVisibilidad}`;
        article.innerHTML = htmlImagen + htmlTexto;
        track.appendChild(article);
    });
};

cargarImagenes();

// ==========================================
// LÓGICA DEL CARRUSEL 
// ==========================================

const nextButton = document.querySelector('.carousel-button.next');
const prevButton = document.querySelector('.carousel-button.prev');
const dotsNav = document.querySelector('.carousel-dots');
let currentIndex = 0;
let autoTimer;

const getVisibleSlides = () => {
    return Array.from(track.children).filter(slide => {
        return window.getComputedStyle(slide).display !== 'none';
    });
};

const updateDots = () => {
    const visibleSlides = getVisibleSlides();
    dotsNav.innerHTML = '';
    visibleSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === currentIndex) dot.classList.add('active');
        dot.setAttribute('data-slide', index);
        dotsNav.appendChild(dot);
    });
};

const updateCarousel = index => {
    const visibleSlides = getVisibleSlides();
    if (visibleSlides.length === 0) return; 

    // SOLUCIÓN A PRUEBA DE BALAS PARA MÓVILES: 
    // En lugar de usar porcentajes que los celulares confunden, 
    // medimos exactamente cuántos píxeles mide la foto en la pantalla del usuario.
    const anchoDeUnaFoto = visibleSlides[0].getBoundingClientRect().width;
    
    // Movemos el carrusel exactamente esa cantidad de píxeles.
    track.style.transform = `translateX(-${index * anchoDeUnaFoto}px)`;

    const dots = Array.from(dotsNav.children);
    dots.forEach(dot => dot.classList.remove('active'));

    if (dots[index]) {
        dots[index].classList.add('active');
    }
};

const changeSlide = (direction) => {
    const visibleSlides = getVisibleSlides();
    if (visibleSlides.length === 0) return; 

    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % visibleSlides.length;
    } else {
        currentIndex = (currentIndex - 1 + visibleSlides.length) % visibleSlides.length;
    }
    updateCarousel(currentIndex);
};

nextButton.addEventListener('click', () => changeSlide('next'));
prevButton.addEventListener('click', () => changeSlide('prev'));

dotsNav.addEventListener('click', e => {
    if (!e.target.classList.contains('carousel-dot')) return;
    currentIndex = Number(e.target.dataset.slide);
    updateCarousel(currentIndex);
});

const autoAdvance = () => {
    const visibleSlides = getVisibleSlides();
    if (visibleSlides.length === 0) return; 
    currentIndex = (currentIndex + 1) % visibleSlides.length;
    updateCarousel(currentIndex);
};

const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(autoAdvance, 5000);
};

const initCarousel = () => {
    updateDots();
    updateCarousel(currentIndex);
};

autoTimer = setInterval(autoAdvance, 5000);

nextButton.addEventListener('click', resetAuto);
prevButton.addEventListener('click', resetAuto);
dotsNav.addEventListener('click', resetAuto);

let windowWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        currentIndex = 0; 
        initCarousel();
    }
});

// Forzar una actualización justo después de cargar para asegurar que el tamaño se calculó bien
window.addEventListener('load', () => {
    initCarousel();
});

initCarousel();