# NYT Books API - Lisandro Rodriguez

## Descripción
Aplicación web que consume múltiples endpoints de la **NYT Books API** para mostrar best sellers, buscar por título o autor, ver categorías y consultar detalles de libros. Incluye interfaz responsive y soporte **PWA** (instalable en celular).

## Características
- Best sellers por categoría
- Búsqueda por título y por autor
- Listado de categorías disponibles
- Vista de detalle del libro
- Manejo de errores y estados de carga
- Diseño responsive
- PWA instalable (manifest + service worker)

---

## Tecnologías Usadas
- **HTML5** (estructura)
- **CSS3** (estilos)
- **JavaScript ES6+** (lógica)
- **NYT Books API v3** (datos)
- **PWA** (manifest + service worker)

## Tecnologías NO Usadas
No se usan ni se requieren:
- TypeScript
- Java
- Maven
- Node.js
- Frameworks (React, Angular, Vue)

---

## Estructura del Proyecto
```
/
├── index.html
├── styles.css
├── script.js
├── manifest.webmanifest
├── service-worker.js
├── icons/
│   ├── icon.svg
│   ├── maskable-icon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── README.md
```

---

## Requisitos
**Obligatorios (para usar la app):**
- Navegador moderno (Chrome, Brave, Edge o Firefox)
- Conexión a Internet

**Opcionales (para desarrollo local):**
- Editor de código (VS Code recomendado)
- Servidor local (ej. Python)

---

## Instalación Local (Paso a Paso)
1. Abre la carpeta del proyecto en tu editor.
2. Levanta un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
3. Abre en el navegador:
   ```
   http://localhost:8000
   ```

---

## Despliegue en Vercel (Paso a Paso)
**Opción 1: Con GitHub (recomendada)**
1. Sube este proyecto a un repositorio en GitHub.
2. Entra a Vercel y haz clic en `New Project`.
3. Conecta GitHub y selecciona tu repo.
4. En `Framework Preset` elige `Other`.
5. Deja vacío `Build Command` y `Output Directory`.
6. Haz clic en `Deploy`.
7. Vercel te dará una URL tipo:
   `https://tu-proyecto.vercel.app`

**Opción 2: Con Vercel CLI**
1. Instala la CLI: `npm i -g vercel`
2. En la carpeta del proyecto ejecuta: `vercel`
3. Sigue las instrucciones y al final tendrás la URL pública.

---

## Instalación en Celular (PWA)
Para que aparezca **“Instalar app”** o **“Agregar a pantalla principal”**:
1. Abre la **URL HTTPS** del despliegue (Vercel).
2. Espera 10–20 segundos en la página.
3. En Android:
   - Chrome/Brave → Menú ⋮ → **“Instalar app”** o **“Agregar a pantalla principal”**.

**Si no aparece la opción:**
1. Borra datos del sitio en el navegador.
2. Cierra y vuelve a abrir el navegador.
3. Entra de nuevo a la URL.

---

## Endpoints Utilizados (Según el código)
1. **Best Sellers (Young Adult Hardcover)**
   - `GET /lists/current/young-adult-hardcover.json`
   - Función: `handleBestsellers1()`

2. **Best Sellers (Hardcover Fiction)**
   - `GET /lists/current/hardcover-fiction.json`
   - Función: `handleBestsellers2()`

3. **Best Sellers (Hardcover Nonfiction)**
   - `GET /lists/current/hardcover-nonfiction.json`
   - Función: `handleBestsellers3()`

4. **Overview (para búsquedas y categorías)**
   - `GET /lists/overview.json`
   - Funciones:
     - `handleSearchBook()`
     - `handleSearchAuthor()`
     - `handleCategories()`
     - `handleCategoryBooks()`
     - `handleReviews()` (busca ISBN dentro del overview)

---

## Configuración de API Key
La API Key ya está configurada en `script.js`:
- Se usa automáticamente en cada petición
- Límite de 500 requests/día (plan gratuito)

---

## Notas Importantes
- Requiere conexión a Internet para consumir la NYT API.
- Para PWA en celular se necesita HTTPS.
- Si cambias el manifest o el service worker, limpia el caché del navegador.
