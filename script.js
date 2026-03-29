// ==================== APLICACIÓN NYT BOOKS API AVANZADA ====================
// Aplicación que consume múltiples endpoints de la API de libros del New York Times
// Usa 6 endpoints diferentes para funcionalidades 

// ==================== CONFIGURACIÓN ====================

// API Key de NYT - Tu clave está aquí
const API_KEY = 'fJBLJL91V1RXOwcCuWViQf5xpggT8wQ8hkepHgAbCHAL99Ib';

// URL base de la API
const BASE_URL = 'https://api.nytimes.com/svc/books/v3';

// Proxy CORS para evitar problemas de CORS
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

/**
 * Función helper para realizar fetches con soporte CORS
 * @param {string} url - URL a hacer fetch
 * @returns {Promise} - Respuesta del fetch
 */
async function fetchWithCORS(url) {
    try {
        if (!navigator.onLine) {
            throw new Error('Sin conexión a internet. Intenta de nuevo cuando tengas conexión.');
        }
        // Intentar primero sin proxy
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
        // Si falla, usar proxy
        throw new Error('Intentando con proxy...');
    } catch (error) {
        try {
            // Usar proxy de CORS
            const proxyURL = CORS_PROXY + encodeURIComponent(url);
            const response = await fetch(proxyURL);
            const data = await response.json();
            // El proxy devuelve {contents: <json>}, así que extraer contents
            return JSON.parse(data.contents);
        } catch (proxyError) {
            console.error('Error de CORS:', proxyError);
            throw new Error('No se pudo conectar a la API. Verifica tu conexión a internet.');
        }
    }
}

// Endpoints disponibles:
// 1. Best sellers list (actual)
// 2. Search (buscar libros)
// 3. Best sellers list names (categorías)
// 4. Book revitews
// 5. Best sellers history
// 6. Reviews by ISBN

// ==================== VARIABLES GLOBALES ====================

let currentBooks = [];
let currentView = 'menu';

// Elementos del DOM
const mainMenu = document.getElementById('mainMenu');
const booksContainer = document.getElementById('booksContainer');
const bookDetails = document.getElementById('bookDetails');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const offlineMessage = document.getElementById('offlineMessage');

// Elementos de formularios
const searchForm = document.getElementById('searchForm');
const searchAuthorForm = document.getElementById('searchAuthorForm');
const categoriesForm = document.getElementById('categoriesForm');

// Inputs
const titleInput = document.getElementById('titleInput');
const authorInput = document.getElementById('authorInput');

/**
 * Muestra un formulario específico y oculta los demás
 * @param {string} formType - Tipo de formulario a mostrar
 */
function showMenu(formType) {
    // Ocultar todo
    mainMenu.style.display = 'none';
    searchForm.style.display = 'none';
    searchAuthorForm.style.display = 'none';
    categoriesForm.style.display = 'none';
    booksContainer.innerHTML = '';
    bookDetails.style.display = 'none';
    errorMessage.style.display = 'none';
    loadingMessage.style.display = 'none';

    // Limpiar inputs
    titleInput.value = '';
    authorInput.value = '';

    // Mostrar el formulario solicitado
    switch(formType) {
        case 'search':
            searchForm.style.display = 'block';
            setTimeout(() => titleInput.focus(), 100);
            break;
        case 'searchAuthor':
            searchAuthorForm.style.display = 'block';
            setTimeout(() => authorInput.focus(), 100);
            break;
        case 'categories':
            categoriesForm.style.display = 'block';
            break;
    }

    currentView = formType;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Vuelve al menú principal
 */
function backToMenu() {
    mainMenu.style.display = 'block';
    searchForm.style.display = 'none';
    searchAuthorForm.style.display = 'none';
    categoriesForm.style.display = 'none';
    booksContainer.innerHTML = '';
    bookDetails.style.display = 'none';
    errorMessage.style.display = 'none';
    loadingMessage.style.display = 'none';
    currentView = 'menu';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== FUNCIONES DE CARGA Y ERROR ====================

/**
 * Muestra el mensaje de carga
 * @param {string} text - Texto del mensaje
 */
function showLoading(text = 'Cargando...') {
    loadingMessage.style.display = 'block';
    document.getElementById('loadingText').textContent = text;
    booksContainer.innerHTML = '';
    bookDetails.style.display = 'none';
    errorMessage.style.display = 'none';
}

/**
 * Oculta el mensaje de carga
 */
function hideLoading() {
    loadingMessage.style.display = 'none';
}

/**
 * Muestra un mensaje de error con contexto
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    hideLoading();
    document.getElementById('errorText').textContent = message;
    errorMessage.style.display = 'block';
    booksContainer.innerHTML = '';
    booksContainer.style.display = 'none';
    mainMenu.style.display = 'none';
    searchForm.style.display = 'none';
    searchAuthorForm.style.display = 'none';
    categoriesForm.style.display = 'none';
    bookDetails.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== ENDPOINT 1: BEST SELLERS YOUNG ADULT ====================

/**
 * Endpoint 1: Obtiene best sellers de Young Adult Hardcover
 * Endpoint: /lists/current/young-adult-hardcover.json
 */
async function handleBestsellers1() {
    showLoading('📊 Cargando: Young Adult Hardcover...');

    try {
        const url = `${BASE_URL}/lists/current/young-adult-hardcover.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        currentBooks = data.results.books;
        hideLoading();

        if (currentBooks.length === 0) {
            showError('❌ No se encontraron libros en esta categoría');
            return;
        }

        displayBooks(currentBooks, 'bestsellers');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error: ${error.message}`);
    }
}

// ==================== ENDPOINT 2: BEST SELLERS FICTION ====================

/**
 * Endpoint 2: Obtiene best sellers de Hardcover Fiction
 * Endpoint: /lists/current/hardcover-fiction.json
 */
async function handleBestsellers2() {
    showLoading('📖 Cargando: Hardcover Fiction...');

    try {
        const url = `${BASE_URL}/lists/current/hardcover-fiction.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        currentBooks = data.results.books;
        hideLoading();

        if (currentBooks.length === 0) {
            showError('❌ No se encontraron libros en esta categoría');
            return;
        }

        displayBooks(currentBooks, 'bestsellers');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error: ${error.message}`);
    }
}

// ==================== ENDPOINT 3: BEST SELLERS NONFICTION ====================

/**
 * Endpoint 3: Obtiene best sellers de Hardcover Nonfiction
 * Endpoint: /lists/current/hardcover-nonfiction.json
 */
async function handleBestsellers3() {
    showLoading('📚 Cargando: Hardcover Nonfiction...');

    try {
        const url = `${BASE_URL}/lists/current/hardcover-nonfiction.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        currentBooks = data.results.books;
        hideLoading();

        if (currentBooks.length === 0) {
            showError('❌ No se encontraron libros en esta categoría');
            return;
        }

        displayBooks(currentBooks, 'bestsellers');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error: ${error.message}`);
    }
}

// ==================== ENDPOINT 4: BÚSQUEDA DE LIBROS ====================

/**
 * Busca libros por título en los bestsellers actuales
 * Usa /lists/overview.json y filtra los resultados
 */
async function handleSearchBook() {
    const title = titleInput.value.trim();

    if (!title) {
        showError('⚠️ Por favor ingresa un título de libro para buscar');
        return;
    }

    if (title.length < 2) {
        showError('⚠️ El título debe tener al menos 2 caracteres');
        return;
    }

    showLoading(`🔍 Buscando: "${title}" en bestsellers...`);

    try {
        const url = `${BASE_URL}/lists/overview.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        // Buscar en todas las listas
        const allBooks = [];
        if (data.results && data.results.lists) {
            data.results.lists.forEach(list => {
                if (list.books) {
                    allBooks.push(...list.books);
                }
            });
        }

        // Filtrar por título (búsqueda case-insensitive)
        const searchLower = title.toLowerCase();
        currentBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchLower)
        );

        hideLoading();

        if (currentBooks.length === 0) {
            showError(`❌ No se encontraron libros con el título: "${title}"\n\nIntenta con otro título o navega por categorías.`);
            return;
        }

        displayBooks(currentBooks, 'search');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error en la búsqueda: ${error.message}\n\nIntenta de nuevo.`);
    }
}

// ==================== ENDPOINT 5: BÚSQUEDA POR AUTOR ====================

/**
 * Busca libros por autor en los bestsellers actuales
 * Usa /lists/overview.json y filtra por autor
 */
async function handleSearchAuthor() {
    const author = authorInput.value.trim();

    if (!author) {
        showError('⚠️ Por favor ingresa el nombre de un autor');
        return;
    }

    if (author.length < 2) {
        showError('⚠️ El nombre debe tener al menos 2 caracteres');
        return;
    }

    showLoading(`🔍 Buscando libros del autor: "${author}"...`);

    try {
        const url = `${BASE_URL}/lists/overview.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        // Buscar en todas las listas
        const allBooks = [];
        if (data.results && data.results.lists) {
            data.results.lists.forEach(list => {
                if (list.books) {
                    allBooks.push(...list.books);
                }
            });
        }

        // Filtrar por autor (búsqueda case-insensitive)
        const authorLower = author.toLowerCase();
        currentBooks = allBooks.filter(book => {
            const bookAuthor = (book.author || '').toLowerCase();
            const contributor = (book.contributor || '').toLowerCase();
            return bookAuthor.includes(authorLower) || contributor.includes(authorLower);
        });

        hideLoading();

        if (currentBooks.length === 0) {
            showError(`❌ No se encontraron libros del autor: "${author}"\n\nIntenta con otro nombre o verifica la ortografía.`);
            return;
        }

        displayBooks(currentBooks, 'author');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error en la búsqueda por autor: ${error.message}\n\nIntenta de nuevo.`);
    }
}

// ==================== ENDPOINT 6: CATEGORÍAS DISPONIBLES ====================

/**
 * Obtiene la lista de categorías disponibles
 * Usa /lists/overview.json para extraer todas las categorías
 */
async function handleCategories() {
    showLoading('📂 Cargando categorías disponibles...');

    try {
        const url = `${BASE_URL}/lists/overview.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        const categories = (data.results && data.results.lists) ? data.results.lists : [];
        hideLoading();

        if (categories.length === 0) {
            showError('❌ No se encontraron categorías disponibles');
            return;
        }

        displayCategories(categories);

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error al obtener categorías: ${error.message}\n\nIntenta de nuevo.`);
    }
}

/**
 * Muestra las categorías disponibles
 */
function displayCategories(categories) {
    booksContainer.innerHTML = '';
    booksContainer.style.display = 'block';
    mainMenu.style.display = 'none';
    searchForm.style.display = 'none';
    searchAuthorForm.style.display = 'none';
    categoriesForm.style.display = 'none';
    bookDetails.style.display = 'none';
    errorMessage.style.display = 'none';
    
    if (categories.length === 0) {
        booksContainer.innerHTML = '<p class="no-results">No hay categorías disponibles</p>';
        return;
    }

    const categoryHTML = categories.map(cat => `
        <div class="book-card" style="cursor: default;">
            <div class="book-card-content">
                <h3>📂 ${cat.display_name}</h3>
                <p><strong>ID:</strong> ${cat.list_name}</p>
                <p>${cat.description}</p>
                <p style="color: #16a34a; font-size: 0.9rem; margin-top: 1rem;">
                    ⟳ ${cat.updated}
                </p>
            </div>
        </div>
    `).join('');

    // Instrucción opcional al principio
    let html = '<p class="instruction">📂 Categorías disponibles</p>';

    // Agregar botón de volver al menú al final
    const backButton = `<div class="back-wrapper">
        <button onclick="backToMenu()" class="back-btn">← Volver al Menú</button>
    </div>`;

    booksContainer.innerHTML = html + `<div class="cards-wrapper">${categoryHTML}</div>` + backButton;
}

// ==================== ENDPOINT 5: LIBROS POR CATEGORÍA ====================

/**
 * Obtiene los libros de una categoría específica
 * Filtra desde /lists/overview.json
 */
async function handleCategoryBooks() {
    const category = categoryInput.value.trim();

    if (!category) {
        showError('⚠️ Por favor ingresa un nombre de categoría\n\nUsa: "Combined Print", "Young Adult", etc.');
        return;
    }

    showLoading(`📚 Buscando libros de: "${category}"...`);

    try {
        const url = `${BASE_URL}/lists/overview.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        // Buscar la categoría que coincida
        const categoryLower = category.toLowerCase();
        const matchedList = data.results.lists.find(list => 
            list.display_name.toLowerCase().includes(categoryLower) ||
            list.list_name.toLowerCase().includes(categoryLower)
        );

        if (!matchedList) {
            hideLoading();
            showError(`❌ No se encontró la categoría: "${category}"\n\nUsa la opción "Ver Categorías" para ver las opciones disponibles.`);
            return;
        }

        currentBooks = matchedList.books || [];
        hideLoading();

        if (currentBooks.length === 0) {
            showError(`❌ No se encontraron libros en: "${category}"`);
            return;
        }

        displayBooks(currentBooks, 'category');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error: ${error.message}\n\nIntenta de nuevo.`);
    }
}

// ==================== ENDPOINT 6: BUSCAR POR ISBN ====================

/**
 * Busca un libro específico por su ISBN
 * Los ISBNs están disponibles en los dados de bestsellers
 */
async function handleReviews() {
    const isbn = reviewISBN.value.trim();

    if (!isbn) {
        showError('⚠️ Por favor ingresa un ISBN válido\n\nEl ISBN debe tener 13 dígitos (Ej: 9780747573258)');
        return;
    }

    if (!/^\d{13}$/.test(isbn)) {
        showError('⚠️ ISBN inválido\n\nDebe contener exactamente 13 dígitos sin guiones.\n\nEjemplo: 9780747573258');
        return;
    }

    showLoading(`🔍 Buscando libro con ISBN: ${isbn}...`);

    try {
        const url = `${BASE_URL}/lists/overview.json?api-key=${API_KEY}`;
        const data = await fetchWithCORS(url);

        if (data.status !== 'OK') {
            throw new Error('La API devolvió un estado incorrecto');
        }

        // Buscar en todas las listas
        let foundBook = null;
        if (data.results && data.results.lists) {
            for (const list of data.results.lists) {
                if (list.books) {
                    foundBook = list.books.find(book =>
                        book.primary_isbn13 === isbn || 
                        (book.isbns && book.isbns.some(isbn_obj => isbn_obj.isbn13 === isbn))
                    );
                    if (foundBook) break;
                }
            }
        }

        hideLoading();

        if (!foundBook) {
            showError(`❌ No se encontró libro con ISBN: ${isbn}\n\nIntenta con otro ISBN o usa la búsqueda por título.`);
            return;
        }

        // Mostrar el libro encontrado en la vista de detalles
        currentBooks = [foundBook];
        displayBooks(currentBooks, 'search');

    } catch (error) {
        console.error('Error:', error);
        showError(`❌ Error al buscar: ${error.message}\n\nIntenta de nuevo.`);
    }
}

/**
 * Muestra las reseñas
 */
function displayReviews(reviews) {
    booksContainer.innerHTML = '';
    
    const reviewsHTML = reviews.map(review => {
        const fecha = new Date(review.publication_dt).toLocaleDateString('es-ES');
        const link = review.link ? `<p style="margin-top: 1rem;"><a href="${review.link.url}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">→ Leer reseña completa en NYT</a></p>` : '';
        
        return `
            <div class="book-card" style="cursor: default;">
                <div class="book-card-content">
                    <h3>📖 ${review.book_title}</h3>
                    <p><strong>✍️ Autor:</strong> ${review.book_author}</p>
                    <p><strong>👤 Crítico:</strong> ${review.byline}</p>
                    <p><strong>📅 Fecha:</strong> ${fecha}</p>
                    <p><strong>📝 Reseña:</strong></p>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: #374151;">${review.summary}</p>
                    ${link}
                </div>
            </div>
        `;
    }).join('');

    booksContainer.innerHTML = reviewsHTML;
}

// ==================== FUNCIONES DE VISUALIZACIÓN ====================

/**
 * Muestra los libros en la interfaz
 * @param {Array} books - Array de libros
 * @param {string} type - Tipo de búsqueda
 */
function displayBooks(books, type) {
    booksContainer.innerHTML = '';
    booksContainer.style.display = 'block';
    mainMenu.style.display = 'none';
    searchForm.style.display = 'none';
    searchAuthorForm.style.display = 'none';
    categoriesForm.style.display = 'none';
    bookDetails.style.display = 'none';
    errorMessage.style.display = 'none';

    if (books.length === 0) {
        booksContainer.innerHTML = '<p class="no-results">No se encontraron resultados</p>';
        return;
    }

    // Agregar instrucción al principio
    let html = '<p class="instruction">👆 Haz clic en un libro para ver detalles completos</p>';

    const booksHTML = books.map((book, index) => {
        const imageUrl = book.book_image || 'https://via.placeholder.com/150x220?text=No+Image';
        const rank = book.rank ? `#${book.rank} en ranking` : 'Sin ranking';
        const author = book.author || book.contributor || 'Autor desconocido';
        const title = book.title || 'Sin título';
        const publisher = book.publisher || 'Editorial desconocida';
        const description = truncateText(book.description || 'Sin descripción disponible', 100);

        return `
            <div class="book-card" onclick="showBookDetail(this, '${escapeHTML(title)}', '${escapeHTML(author)}', '${escapeHTML(publisher)}', '${escapeHTML(book.description || 'Sin descripción')}', '${imageUrl}', '${rank}')">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='https://via.placeholder.com/150x220?text=No+Image'">
                <div class="book-card-content">
                    <h3>${title}</h3>
                    <p><strong>✍️ ${author}</strong></p>
                    <p style="font-size: 0.9rem; color: #6b7280;">${publisher}</p>
                    ${book.rank ? `<span class="book-rank">🏆 Rank: ${rank}</span>` : ''}
                    <p class="description">${description}</p>
                    <p style="margin-top: 0.75rem; color: #2563eb; font-weight: 600; cursor: pointer;">Ver más →</p>
                </div>
            </div>
        `;
    }).join('');

    // Agregar botón de volver al menú al final
    const backButton = `<div class="back-wrapper">
        <button onclick="backToMenu()" class="back-btn">← Volver al Menú</button>
    </div>`;

    // envolver los libros en un contenedor que use grid
    booksContainer.innerHTML = html + `<div class="cards-wrapper">${booksHTML}</div>` + backButton;
}

/**
 * Muestra el detalle de un libro
 */
function showBookDetail(element, title, author, publisher, description, imageUrl, rank) {
    document.getElementById('detailTitle').textContent = title;
    document.getElementById('detailAuthor').textContent = author;
    document.getElementById('detailPublisher').textContent = publisher;
    document.getElementById('detailDescription').textContent = description || 'No hay descripción disponible';
    document.getElementById('detailRank').textContent = rank;
    document.getElementById('detailImage').src = imageUrl;
    document.getElementById('detailImage').alt = title;

    mainMenu.style.display = 'none';
    searchForm.style.display = 'none';
    searchAuthorForm.style.display = 'none';
    categoriesForm.style.display = 'none';
    booksContainer.style.display = 'none';
    bookDetails.style.display = 'block';
    errorMessage.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Trunca un texto a una longitud máxima
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Escapa caracteres HTML especiales
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Muestra el aviso de modo offline
 */
function showOffline() {
    if (offlineMessage) {
        offlineMessage.style.display = 'block';
    }
}

/**
 * Oculta el aviso de modo offline
 */
function hideOffline() {
    if (offlineMessage) {
        offlineMessage.style.display = 'none';
    }
}

/**
 * Registra el Service Worker para habilitar PWA
 */
function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    const isSecure = location.protocol === 'https:';

    if (!isSecure && !isLocalhost) {
        console.warn('⚠️ Service Worker requiere HTTPS o localhost.');
        return;
    }

    navigator.serviceWorker.register('./service-worker.js')
        .then((registration) => {
            console.log('%c✅ Service Worker registrado', 'color: green; font-size: 12px;', registration.scope);
        })
        .catch((error) => {
            console.warn('⚠️ No se pudo registrar el Service Worker:', error);
        });
}

// ==================== INICIALIZACIÓN ====================

/**
 * Función que se ejecuta cuando carga la página
 */
function initApp() {
    console.log('%c🚀 Aplicación inicializada', 'color: green; font-size: 14px; font-weight: bold;');
    console.log('%c📡 API Base URL:', 'color: blue; font-size: 12px;', BASE_URL);
    
    if (API_KEY === 'fJBLJL91V1RXOwcCuWViQf5xpggT8wQ8hkepHgAbCHAL99Ib') {
        console.log('%c✅ API Key configurada correctamente', 'color: green; font-size: 12px;');
    } else {
        console.warn('%c⚠️ ADVERTENCIA: Verifica que tu API Key sea válida', 'color: orange; font-size: 12px;');
    }

    // Mostrar menú principal
    mainMenu.style.display = 'block';
    
    // Agregar event listeners para Enter en inputs
    titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearchBook();
    });
    
    authorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearchAuthor();
    });
    
    categoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCategoryBooks();
    });
    
    reviewISBN.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleReviews();
    });

    if (!navigator.onLine) showOffline();
    window.addEventListener('offline', showOffline);
    window.addEventListener('online', hideOffline);

    registerServiceWorker();
}

// Ejecutar cuando carga el DOM
document.addEventListener('DOMContentLoaded', initApp);
