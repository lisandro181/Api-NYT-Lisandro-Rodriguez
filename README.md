# Pagina Web - NYT Books API Avanzada

## Descripción
Esta es una aplicación web completa que consume múltiples endpoints de la **API de libros del New York Times (NYT Books API)**. Permite realizar diferentes tipos de consultas, búsquedas y obtener información detallada sobre libros, autores, categorías y reseñas.

**Características principales:**
- ✅ 6 endpoints diferentes de la NYT API
- ✅ Entrada de datos del usuario configurable
- ✅ Búsqueda avanzada (título, autor, categoría)
- ✅ Manejo robusto de errores
- ✅ Interfaz moderna y responsive

---

## Estructura del Proyecto
```
/
├── index.html      # Estructura HTML con menú e interfaces
├── styles.css      # Estilos CSS modernos y responsive
├── script.js       # Lógica JavaScript con 6+ endpoints
└── README.md       # Esta documentación
```

---

## Endpoints Utilizados (6+)

### 1. **Best Sellers List - Current** 
```
GET /lists/current/{list-name}.json
```
**Función:** `handleBestsellers()`
- **Descripción:** Obtiene la lista actual de libros más vendidos
- **Parámetros de entrada:** Nombre de lista (Young Adult Hardcover, Hardcover Fiction, etc.)
- **Respuesta:** Array de libros con ranking, portada, autor, editorial

### 2. **Search** 
```
GET /search.json?query={title}
```
**Función:** `handleSearchBook()`
- **Descripción:** Busca libros por título
- **Parámetros de entrada:** Título del libro
- **Respuesta:** Array de libros que coinciden con la búsqueda

### 3. **Search by Author** 
```
GET /search.json?author={author}
```
**Función:** `handleSearchAuthor()`
- **Descripción:** Busca libros por autor
- **Parámetros de entrada:** Nombre del autor
- **Respuesta:** Array de libros del autor

### 4. **Lists Names** 
```
GET /lists/names.json
```
**Función:** `handleCategories()`
- **Descripción:** Obtiene todas las categorías/listas disponibles
- **Parámetros de entrada:** Ninguno
- **Respuesta:** Array con nombres, descripciones y estado de actualización

### 5. **Best Sellers by Category** 
```
GET /lists/current/{list-name}.json
```
**Función:** `handleCategoryBooks()`
- **Descripción:** Obtiene libros de una categoría específica
- **Parámetros de entrada:** Nombre de categoría
- **Respuesta:** Array de libros de esa categoría

### 6. **Book Reviews** 
```
GET /reviews.json?isbn={isbn}
```
**Función:** `handleReviews()`
- **Descripción:** Obtiene reseñas de libros por ISBN
- **Parámetros de entrada:** ISBN del libro
- **Respuesta:** Array de reseñas con autor, fecha y resumen

---

## Cómo Ejecutar

### Paso 1: Servidor Local
La aplicación ya está configurada para ejecutarse en el servidor local:
```bash
python3 -m http.server 8000
```

### Paso 2: Acceso en el Navegador
Abre tu navegador y ve a:
```
http://localhost:8000
```

### Paso 3: Usar la Aplicación
1. Se abrirá el **menú principal** con 6 opciones
2. Selecciona la opción deseada
3. Ingresa los datos solicitados (título, autor, categoría, ISBN, etc.)
4. Haz clic en **Buscar** para obtener resultados
5. Haz clic en un libro para ver sus **detalles completos**

---

## Funcionalidades Implementadas

### 1. Menú Principal
6 botones interactivos para acceder a diferentes consultas:
- Best Sellers
- Buscar Libro
- Buscar por Autor
- Categorías
- Libros por Categoría
- Reseñas de Libros

### 2. Entrada de Datos
Cada opción solicita al usuario los parámetros necesarios:
- **Best Sellers:** Selecciona lista (dropdown)
- **Buscar Libro:** Ingresa título (input text)
- **Buscar Autor:** Ingresa autor (input text)
- **Libros por Categoría:** Ingresa categoría (input text)
- **Reseñas:** Ingresa ISBN (input text)

### 3. Peticiones HTTP
Todas las peticiones incluyen:
- URL correcta del endpoint
- Parámetros de búsqueda codificados
- API Key en cada request
- Manejo de respuestas JSON

### 4. Procesamiento de Respuesta
Se extraen y muestran:
- Título del libro
- Autor
- Editorial
- Ranking (si existe)
- Descripción
- Imagen de portada (o genérica)

### 5. Visualización
- **Grid responsive** de tarjetas de libros
- **Click en libro** para ver detalles completos
- **Botón volver** para regresar al menú
- **Imagen genérica** si no hay portada

### 6. Manejo de Errores
-  Libro no encontrado
-  Parámetros vacíos
-  Error de conexión
-  Error HTTP
-  Respuesta inválida de API
-  Mensajes claros para cada error

---

## Ejemplo de Respuesta JSON

### Best Sellers Response:
```json
{
  "status": "OK",
  "results": {
    "list_name": "Young Adult Hardcover",
    "books": [
      {
        "rank": 1,
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
        "publisher": "HarperCollins",
        "description": "A gripping dystopian novel...",
        "book_image": "https://...",
        "weeks_on_list": 52
      }
    ]
  }
}
```

### Search Response:
```json
{
  "status": "OK",
  "results": [
    {
      "title": "The Hunger Games",
      "author": "Suzanne Collins",
      "book_image": "https://...",
      "description": "A young woman discovers..."
    }
  ]
}
```

### Reviews Response:
```json
{
  "status": "OK",
  "results": [
    {
      "book_title": "The Hunger Games",
      "book_author": "Suzanne Collins",
      "byline": "Reviewer Name",
      "publication_dt": "2024-03-10",
      "summary": "Excellent book...",
      "link": { "url": "https://..." }
    }
  ]
}
```

---

## Configuración de API Key

Tu API Key está **ya configurada**:
- Se encuentra en el archivo `script.js` línea 9
- Se incluye automáticamente en cada petición
- Tiene límite de 500 llamadas por día (plan gratuito)

---

## Tecnologías Utilizadas

- **HTML5:** Estructura semántica
- **CSS3:** Diseño moderno con gradientes y animaciones
- **JavaScript ES6+:** Async/await, fetch API, manipulación del DOM
- **NYT Books API v3:** API REST de The New York Times

---

## Información Mostrada de Cada Libro

En la **vista de grid:**
-  Título
- Autor
- Editorial
- Ranking (si existe)
- Imagen de portada
- Descripción (truncada)

En la **vista de detalles:**
- Título completo
- Autor
- Editorial
- Imagen grande de portada
- Descripción completa
- Ranking

---

##  Notas Importantes

1. **Conexión a Internet:** Requerida para acceder a la API
2. **CORS:** La API de NYT permite requests desde navegadores
3. **Límite de API:** 500 requests/día en plan gratuito
4. **ISBN Format:** Para búsqueda de reseñas, usar ISBN válido (13 dígitos)
5. **Nombre de Categorías:** Verificar en la opción "Categorías" para nombres exactos

---

## Estructura de Código

### Script JavaScript
```javascript
// Configuración
const API_KEY = '...';
const BASE_URL = '...';

// Navegación
showMenu(formType)
backToMenu()

// Endpoints (6 funciones)
handleBestsellers()      // Endpoint 1
handleSearchBook()       // Endpoint 2
handleSearchAuthor()     // Endpoint 3
handleCategories()       // Endpoint 4
handleCategoryBooks()    // Endpoint 5
handleReviews()          // Endpoint 6

// Visualización
displayBooks(books)
displayCategories(categories)
displayReviews(reviews)
showBookDetail()

// Utilidades
showLoading()
showError()
truncateText()
escapeHTML()
```

---


