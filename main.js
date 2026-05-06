// ==========================================
// LINKS POR ZONA — solo edita esta sección
// tipo: 'video' | 'audio' | 'imagen' | 'creditos' | 'url' | 'carrusel'
// ==========================================
const zonaData = {
    'zona-historia':    { tipo: 'video',   src: 'assets/historia.webm' },
    'zona-jugadoras':   {
        tipo: 'carrusel',
        videos: [
            {
                src:       'assets/jugadora-1.webm',
                titulo:    'Nombre Jugadora 1',
                subtitulo: 'Posición · Años activa',
                thumb:     'assets/jugadora-1-thumb.jpg'
            },
            {
                src:       'assets/jugadora-2.webm',
                titulo:    'Nombre Jugadora 2',
                subtitulo: 'Posición · Años activa',
                thumb:     'assets/jugadora-2-thumb.jpg'
            },
            {
                src:       'assets/jugadora-3.webm',
                titulo:    'Nombre Jugadora 3',
                subtitulo: 'Posición · Años activa',
                thumb:     'assets/jugadora-3-thumb.jpg'
            },
        ]
    },
    'zona-azteca':      { tipo: 'video',   src: 'assets/azteca.webm' },
    'zona-futbolista':  { tipo: 'video',   src: 'assets/futbolista.webm' },
    'zona-doctora':     { tipo: 'video',   src: 'assets/doctora.webm' },
    'zona-ingeniera':   { tipo: 'imagen',  src: 'assets/ingeniera.jpg' },
    'zona-maestra':     { tipo: 'audio',   src: 'assets/maestra.mp3' },
    'zona-bombera':     { tipo: 'video',   src: 'assets/bombera.webm' },
    'zona-repartidora': { tipo: 'video',   src: 'assets/repartidora.webm' },
    'zona-nosotras':    { tipo: 'video-alpha', src: 'assets/nosotras.webm' },
    'zona-nina':        { tipo: 'nina' },
    'zona-creditos':    { tipo: 'creditos' },
};

// --- ELEMENTOS ---
const balon          = document.getElementById('balon-loader');
const grietaVerde    = document.getElementById('grieta-verde');
const modalMedia     = document.getElementById('modal-media');
const mediaContenido = document.getElementById('media-contenido');
const btnCerrarMedia = document.getElementById('cerrar-media');
const modalCreditos  = document.getElementById('modal-creditos');
const btnCerrar      = document.getElementById('cerrar-creditos');

// --- ESTADOS INICIALES ---
balon.classList.remove('girando');
modalCreditos.style.display    = 'none';
modalCreditos.style.visibility = 'hidden';
modalMedia.style.display       = 'none';
modalMedia.style.visibility    = 'hidden';
grietaVerde.style.clipPath     = 'inset(50% 0% 50% 0%)';
grietaVerde.style.opacity      = '0';

// --- AUDIO AMBIENTE ---
const audioAmbiente = new Audio('assets/ambiente.mp3');
audioAmbiente.loop   = true;
audioAmbiente.volume = 0.5;

let ambienteIniciado = false;

function iniciarAmbiente() {
    if (ambienteIniciado) return;
    audioAmbiente.play().then(() => {
        ambienteIniciado = true;
    }).catch(() => {});
}

function pausarAmbiente()   { audioAmbiente.pause(); }
function reanudarAmbiente() { if (ambienteIniciado) audioAmbiente.play().catch(() => {}); }

// Intentar autoplay al cargar
window.addEventListener('load', () => {
    audioAmbiente.play().then(() => {
        ambienteIniciado = true;
    }).catch(() => {
        // Navegador bloqueó autoplay — esperar primer clic o toque
        document.addEventListener('click',      iniciarAmbiente, { once: true });
        document.addEventListener('touchstart', iniciarAmbiente, { once: true });
    });
});


document.querySelectorAll('.zona').forEach(zona => {
    const targetId = zona.dataset.target;
    const targetEl = targetId ? document.getElementById(targetId) : null;

    function encender() {
        if (targetEl) {
            targetEl.style.animation = 'none';
            targetEl.classList.add('elemento-hover');
        }
    }
    function apagar() {
        if (targetEl) {
            targetEl.classList.remove('elemento-hover');
            targetEl.style.animation = '';
        }
    }

    zona.addEventListener('mouseenter', encender);
    zona.addEventListener('mouseleave', apagar);
    zona.addEventListener('touchstart', encender, { passive: true });
    zona.addEventListener('touchend',   apagar);
    zona.addEventListener('touchcancel',apagar);
});

// --- BALÓN Y GRIETA ---
function iniciarCarga(duracionEstimada = 3) {
    balon.classList.add('girando');
    grietaVerde.style.setProperty('--duracion-carga', duracionEstimada + 's');
    grietaVerde.classList.remove('ocultar', 'cargando');
    void grietaVerde.offsetWidth;
    grietaVerde.classList.add('cargando');
}

function terminarCarga() {
    balon.classList.remove('girando');
    grietaVerde.classList.remove('cargando');
    grietaVerde.classList.add('ocultar');
    setTimeout(() => {
        grietaVerde.classList.remove('ocultar');
        grietaVerde.style.clipPath = 'inset(50% 0% 50% 0%)';
        grietaVerde.style.opacity  = '0';
    }, 400);
}

// --- ABRIR SEGÚN TIPO ---
function abrirContenido(data) {
    mediaContenido.innerHTML = '';

    if (data.tipo === 'creditos') {
        abrirCreditos();
        return;
    }

    if (data.tipo === 'url') {
        window.open(data.src, '_blank');
        return;
    }

    if (data.tipo === 'carrusel') {
        iniciarCarga(4);
        abrirCarrusel(data.videos);
        return;
    }

    if (data.tipo === 'imagen') {
        iniciarCarga(1);
        const img = document.createElement('img');
        img.src = data.src;
        img.addEventListener('load', () => {
            terminarCarga();
            pausarAmbiente();
            modalMedia.style.display    = 'flex';
            modalMedia.style.visibility = 'visible';
        });
        img.addEventListener('error', () => terminarCarga());
        mediaContenido.appendChild(img);
        return;
    }

    if (data.tipo === 'video') {
        iniciarCarga(4);
        const video    = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.style.cssText = 'max-width:90%; max-height:80vh;';
        const fuente   = document.createElement('source');
        fuente.src     = data.src;
        fuente.type    = 'video/webm';
        video.appendChild(fuente);
        const inicio   = Date.now();
        video.addEventListener('canplay', () => {
            grietaVerde.style.setProperty('--duracion-carga', Math.max((Date.now() - inicio) / 1000, 0.5) + 's');
            terminarCarga();
            pausarAmbiente();
            modalMedia.style.display    = 'flex';
            modalMedia.style.visibility = 'visible';
        });
        video.addEventListener('error', () => terminarCarga());
        mediaContenido.appendChild(video);
        return;
    }

    if (data.tipo === 'video-alpha') {
        // Video WebM con canal alpha — se reproduce SOBRE el mural sin modal oscuro
        abrirVideoAlpha(data.src);
        return;
    }

    if (data.tipo === 'nina') {
        activarModoNina();
        return;
    }

    if (data.tipo === 'audio') {
        iniciarCarga(2);
        const audio    = document.createElement('audio');
        audio.controls = true;
        audio.autoplay = true;
        const fuente   = document.createElement('source');
        fuente.src     = data.src;
        fuente.type    = 'audio/mpeg';
        audio.appendChild(fuente);
        const inicio   = Date.now();
        audio.addEventListener('canplay', () => {
            grietaVerde.style.setProperty('--duracion-carga', Math.max((Date.now() - inicio) / 1000, 0.5) + 's');
            terminarCarga();
            pausarAmbiente();
            modalMedia.style.display    = 'flex';
            modalMedia.style.visibility = 'visible';
        });
        audio.addEventListener('error', () => terminarCarga());
        mediaContenido.appendChild(audio);
        return;
    }
}

// ==========================================
// --- VIDEO CON ALPHA (WebM transparente) ---
// ==========================================
let videoAlphaActivo = false;

function abrirVideoAlpha(src) {
    if (videoAlphaActivo) return;
    videoAlphaActivo = true;

    iniciarCarga(3);

    const container = document.getElementById('mural-container');

    // Crear elemento video superpuesto
    const video         = document.createElement('video');
    video.id            = 'video-alpha-overlay';
    video.autoplay      = true;
    video.playsInline   = true;
    video.style.cssText = `
        position:absolute; top:0; left:0; width:100%; height:100%;
        object-fit:contain; z-index:60; pointer-events:none;
        opacity:0; transition:opacity 0.4s ease;
    `;

    const fuente  = document.createElement('source');
    fuente.src    = src;
    fuente.type   = 'video/webm';
    video.appendChild(fuente);

    // Botón cerrar alpha
    const btnAlpha         = document.createElement('button');
    btnAlpha.id            = 'cerrar-alpha';
    btnAlpha.textContent   = 'CERRAR';
    btnAlpha.style.cssText = `
        position:absolute; top:20px; right:20px; z-index:70;
        background:red; color:#fff; border:none; padding:10px;
        cursor:pointer; font-size:0.9rem; border-radius:4px;
        display:none;
    `;

    function cerrarAlpha() {
        video.pause();
        video.remove();
        btnAlpha.remove();
        videoAlphaActivo = false;
        reanudarAmbiente();
    }

    btnAlpha.addEventListener('click', cerrarAlpha);

    video.addEventListener('canplay', () => {
        terminarCarga();
        pausarAmbiente();
        video.style.opacity = '1';
        btnAlpha.style.display = 'block';
    }, { once: true });

    video.addEventListener('ended', () => {
        video.style.opacity = '0';
        setTimeout(cerrarAlpha, 400);
    });

    video.addEventListener('error', () => {
        terminarCarga();
        videoAlphaActivo = false;
    });

    container.appendChild(video);
    container.appendChild(btnAlpha);
}

// ==========================================
// --- MODO NIÑA ---
// ==========================================
const ninaSrcs = [
    'assets/nina-1.png',
    'assets/nina-2.png',
    'assets/nina-3.png',
    'assets/nina-4.png',
    'assets/nina-5.png',
    'assets/nina-6.png',
    'assets/nina-7.png',
    'assets/nina-8.png',
];
let ninaInterval   = null;
let ninaIndex      = 0;
let ninaModoActivo = false;

// Elementos que BRILLAN (se mantienen visibles y con glow)
const elementosBrillantes = [
    'glow-doctora', 'glow-ingeniera', 'glow-maestra',
    'glow-bombera', 'glow-repartidora', 'glow-jugadoras',
    'glow-futbolista', 'glow-nina'
];

// Todos los IDs de capas del mural para oscurecer las que no brillan
const todasLasCapas = [
    'glow-jugadoras', 'glow-historia', 'glow-azteca',
    'grieta-verde',
    'glow-bombera', 'glow-doctora', 'glow-futbolista',
    'glow-ingeniera', 'glow-maestra', 'glow-repartidora',
    'glow-nosotras', 'glow-nina', 'img-creditos-btn'
];

function activarModoNina() {
    if (ninaModoActivo) return;
    ninaModoActivo = true;
    pausarAmbiente();

    // Oscurecer capas que NO están en elementosBrillantes
    todasLasCapas.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (elementosBrillantes.includes(id)) {
            // Brillo y animación de pulso
            el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
            el.style.filter     = 'brightness(1.5) drop-shadow(0 0 22px rgba(255,255,255,0.9))';
            el.style.opacity    = '1';
            el.style.animation  = 'nina-pulso 2s ease-in-out infinite';
        } else {
            // Oscurecer
            el.style.transition = 'filter 0.5s ease, opacity 0.5s ease';
            el.style.filter     = 'brightness(0.15)';
            el.style.opacity    = '0.3';
            el.style.animation  = 'none';
        }
    });

    // También oscurecer las capas sin ID (fondo, públicos, grieta negra)
    document.querySelectorAll('.layer:not([id])').forEach(el => {
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity    = '0.15';
    });

    // Mostrar botón cerrar niña
    document.getElementById('cerrar-nina').style.display = 'block';

    // Ciclar niñas
    ninaIndex = 0;
    const ninaEl  = document.getElementById('glow-nina');
    const baseSrc = 'assets/nina-base.png';

    function cambiarNina() {
        const nuevaSrc = ninaSrcs[ninaIndex % ninaSrcs.length];
        const testImg  = new Image();
        testImg.onload  = () => {
            ninaEl.src    = nuevaSrc;
            ninaEl.style.filter    = 'brightness(1.4) drop-shadow(0 0 16px rgba(255,255,255,0.8))';
            ninaEl.style.animation = 'nina-pulso 2s ease-in-out infinite';
        };
        testImg.onerror = () => { /* mantener imagen actual */ };
        testImg.src = nuevaSrc;
        ninaIndex++;
    }
    cambiarNina();
    ninaInterval = setInterval(cambiarNina, 1500);

    // Botón cerrar
    document.getElementById('cerrar-nina').onclick = () => {
        clearInterval(ninaInterval);
        ninaInterval = null;
        desactivarModoNina(ninaEl, baseSrc);
    };

    // Auto-cerrar al terminar el ciclo completo
    setTimeout(() => {
        desactivarModoNina(ninaEl, baseSrc);
    }, ninaSrcs.length * 1500 + 500);
}

function desactivarModoNina(ninaEl, baseSrc) {
    if (!ninaModoActivo) return;
    clearInterval(ninaInterval);
    ninaInterval   = null;
    ninaModoActivo = false;

    // Restaurar todas las capas con ID
    todasLasCapas.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.transition = 'filter 0.6s ease, opacity 0.6s ease';
        el.style.filter     = '';
        el.style.opacity    = '';
        el.style.animation  = '';
    });

    // Restaurar capas sin ID
    document.querySelectorAll('.layer:not([id])').forEach(el => {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity    = '';
    });

    // Restaurar la niña base
    const el = ninaEl || document.getElementById('glow-nina');
    el.src = baseSrc || 'assets/nina-base.png';

    document.getElementById('cerrar-nina').style.display = 'none';
    reanudarAmbiente();
}


// ==========================================
let carruselIndex  = 0;
let carruselVideos = [];
let touchStartX    = 0;

function abrirCarrusel(videos) {
    carruselVideos = videos;
    carruselIndex  = 0;
    cargarVideoCarrusel(0);
}

function cargarVideoCarrusel(index) {
    mediaContenido.innerHTML = '';

    const total = carruselVideos.length;
    const datos = carruselVideos[index];

    // ── Wrapper principal ──────────────────────────────
    const wrapper = document.createElement('div');
    wrapper.className = 'carrusel-wrapper';

    // ── Encabezado: título + subtítulo ─────────────────
    const header = document.createElement('div');
    header.className = 'carrusel-header';

    const titulo = document.createElement('h2');
    titulo.className   = 'carrusel-titulo';
    titulo.textContent = datos.titulo || '';

    const subtitulo = document.createElement('p');
    subtitulo.className   = 'carrusel-subtitulo';
    subtitulo.textContent = datos.subtitulo || '';

    header.appendChild(titulo);
    header.appendChild(subtitulo);

    // ── Área de video ──────────────────────────────────
    const videoArea = document.createElement('div');
    videoArea.className = 'carrusel-video-area';

    // Thumbnail (se muestra hasta que el video puede reproducirse)
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'carrusel-thumb-container';

    if (datos.thumb) {
        const thumb = document.createElement('img');
        thumb.src       = datos.thumb;
        thumb.className = 'carrusel-thumb';
        thumb.alt       = datos.titulo || 'Jugadora';
        thumbContainer.appendChild(thumb);
    }

    // Ícono de play sobre el thumb
    const playIcon = document.createElement('div');
    playIcon.className   = 'carrusel-play-icon';
    playIcon.innerHTML   = '▶';
    thumbContainer.appendChild(playIcon);

    // Video
    const video    = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.className = 'carrusel-video';
    video.style.opacity = '0'; // oculto hasta canplay

    const fuente   = document.createElement('source');
    fuente.src     = datos.src;
    fuente.type    = 'video/webm';
    video.appendChild(fuente);

    // Al poder reproducir: ocultar thumb, mostrar video
    video.addEventListener('canplay', () => {
        terminarCarga();
        pausarAmbiente();
        thumbContainer.style.display = 'none';
        video.style.opacity          = '1';
        modalMedia.style.display     = 'flex';
        modalMedia.style.visibility  = 'visible';
    }, { once: true });

    // Al terminar: siguiente automático
    video.addEventListener('ended', () => {
        const siguiente = (index + 1) % total;
        carruselIndex   = siguiente;
        cargarVideoCarrusel(siguiente);
    });

    video.addEventListener('error', () => terminarCarga());

    videoArea.appendChild(thumbContainer);
    videoArea.appendChild(video);

    // ── Navegación: flechas + contador ────────────────
    const nav = document.createElement('div');
    nav.className = 'carrusel-nav';

    const btnPrev = document.createElement('button');
    btnPrev.className   = 'carrusel-btn';
    btnPrev.innerHTML   = '&#9664;';
    btnPrev.title       = 'Anterior';
    btnPrev.addEventListener('click', () => {
        const anterior  = (index - 1 + total) % total;
        carruselIndex   = anterior;
        cargarVideoCarrusel(anterior);
    });

    const contador = document.createElement('span');
    contador.className   = 'carrusel-contador';
    contador.textContent = `${index + 1} / ${total}`;

    const btnNext = document.createElement('button');
    btnNext.className   = 'carrusel-btn';
    btnNext.innerHTML   = '&#9654;';
    btnNext.title       = 'Siguiente';
    btnNext.addEventListener('click', () => {
        const siguiente = (index + 1) % total;
        carruselIndex   = siguiente;
        cargarVideoCarrusel(siguiente);
    });

    nav.appendChild(btnPrev);
    nav.appendChild(contador);
    nav.appendChild(btnNext);

    // ── Miniaturas de jugadoras (strip inferior) ───────
    const strip = document.createElement('div');
    strip.className = 'carrusel-strip';

    carruselVideos.forEach((v, i) => {
        const item = document.createElement('div');
        item.className = 'carrusel-strip-item' + (i === index ? ' activo' : '');
        item.title     = v.titulo || `Jugadora ${i + 1}`;

        if (v.thumb) {
            const img   = document.createElement('img');
            img.src     = v.thumb;
            img.alt     = v.titulo || '';
            item.appendChild(img);
        }

        const nombre = document.createElement('span');
        nombre.textContent = v.titulo ? v.titulo.split(' ')[0] : `#${i + 1}`;
        item.appendChild(nombre);

        item.addEventListener('click', () => {
            carruselIndex = i;
            cargarVideoCarrusel(i);
        });

        strip.appendChild(item);
    });

    // ── Dots indicadores ───────────────────────────────
    const dots = document.createElement('div');
    dots.className = 'carrusel-dots';

    for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        dot.className = 'carrusel-dot' + (i === index ? ' activo' : '');
        dot.addEventListener('click', () => {
            carruselIndex = i;
            cargarVideoCarrusel(i);
        });
        dots.appendChild(dot);
    }

    // ── Ensamblar ──────────────────────────────────────
    wrapper.appendChild(header);
    wrapper.appendChild(videoArea);
    wrapper.appendChild(nav);
    wrapper.appendChild(strip);
    wrapper.appendChild(dots);

    mediaContenido.appendChild(wrapper);
}

// ── Swipe en móvil ────────────────────────────────────
modalMedia.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

modalMedia.addEventListener('touchend', e => {
    const diff  = touchStartX - e.changedTouches[0].clientX;
    const total = carruselVideos.length;
    if (Math.abs(diff) < 40 || !total) return;

    if (diff > 0) {
        carruselIndex = (carruselIndex + 1) % total;
    } else {
        carruselIndex = (carruselIndex - 1 + total) % total;
    }
    cargarVideoCarrusel(carruselIndex);
});

// --- AUDIO CRÉDITOS ---
const audioCreditos = new Audio('assets/creditos.mp3');
audioCreditos.loop = false;

// --- ABRIR CRÉDITOS ---
function abrirCreditos() {
    iniciarCarga(2);
    const img = document.getElementById('img-creditos-panel');

    function mostrarCreditos() {
        terminarCarga();
        pausarAmbiente();
        audioCreditos.currentTime = 0;
        audioCreditos.play().catch(() => {});
        modalCreditos.style.display    = 'flex';
        modalCreditos.style.visibility = 'visible';
    }

    if (img.complete) {
        mostrarCreditos();
    } else {
        img.addEventListener('load', mostrarCreditos, { once: true });
    }
}

// --- CERRAR ---
function cerrarMedia() {
    const media = mediaContenido.querySelector('video, audio');
    if (media) media.pause();
    mediaContenido.innerHTML    = '';
    carruselVideos              = [];
    carruselIndex               = 0;
    modalMedia.style.display    = 'none';
    modalMedia.style.visibility = 'hidden';
    reanudarAmbiente();
}

btnCerrarMedia.addEventListener('click', cerrarMedia);
btnCerrar.addEventListener('click', () => {
    modalCreditos.style.display    = 'none';
    modalCreditos.style.visibility = 'hidden';
    reanudarAmbiente();
});

// --- CONECTAR ZONAS ---
Object.keys(zonaData).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => abrirContenido(zonaData[id]));
});

// --- DETECTOR ORIENTACIÓN CELULAR ---
const rotateOverlay = document.getElementById('rotate-overlay');

function verificarOrientacion() {
    if (!rotateOverlay) return;
    const esMovil    = window.innerWidth <= 900 || window.innerHeight <= 600;
    const esPortrait = window.innerHeight > window.innerWidth;

    if (esMovil && esPortrait) {
        rotateOverlay.style.display = 'flex';
    } else {
        rotateOverlay.style.display = 'none';
    }
}

// Verificar al cargar y al cambiar tamaño/orientación
verificarOrientacion();
window.addEventListener('resize',            verificarOrientacion);
window.addEventListener('orientationchange', () => {
    // Pequeño delay para que el navegador actualice las dimensiones
    setTimeout(verificarOrientacion, 300);
});
