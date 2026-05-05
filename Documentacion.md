# 💅 Documentación Técnica: Miche Nails & Beauty - Calculadora

**Versión:** 1.0.0  
**Desarrollado con:** Antigravity (IA)  
**Propósito:** Cotizador interactivo para servicios de belleza, optimizado para dispositivos móviles y fácil de compartir con clientes.

---

## 🛠 Tecnologías Utilizadas

La aplicación es una herramienta web estática (SPA - Single Page Application) que no requiere servidor ni base de datos externa.

- **HTML5:** Estructura semántica.
- **CSS3 Vanilla:** Diseño responsivo con estética "Beauty/Premium". Uso de variables CSS para paleta de colores (Nude, Oro, Blanco).
- **JavaScript (ES6):** Lógica de cálculo, gestión de estado local y manipulación dinámica del DOM.
- **Lucide Icons:** Iconografía vectorial moderna cargada vía CDN.
- **Google Fonts:** Tipografías *Outfit* y *Playfair Display* para un look editorial.

---

## 📂 Estructura de Archivos

```text
nyb/
│
├── index.html       # Estructura principal, secciones de acordeón y modales.
├── style.css        # Diseño visual, animaciones y estilos responsivos.
├── app.js           # Lógica de precios, cálculos y renderizado de componentes.
├── README.md        # Descripción general del proyecto.
└── Documentacion.md # Este archivo con detalles técnicos.
```

---

## ⚙️ Lógica de Negocio (app.js)

### 1. Estructura de Datos (`DATA`)
Toda la configuración de precios se encuentra centralizada en el objeto `DATA`. Esto facilita la actualización de precios sin tocar la lógica del programa.
- **Servicios:** Manicure, Pedicure y Sistemas (Acrílico, Polygel, etc.).
- **Largo:** Precios variables según el tamaño seleccionado para sistemas.
- **Diseño:** Cuatro niveles de complejidad (Sin diseño, Sencillo, Medio, Completo).
- **Extras:** Servicios adicionales fijos (Francesa, Piedras, Efectos).
- **Decoraciones:** Cobro por unidad (uñas decoradas individualmente).

### 2. Gestión de Estado (`state`)
La aplicación mantiene un objeto `state` que rastrea todas las selecciones de la usuaria en tiempo real. Cada interacción (clic) actualiza este estado y dispara una nueva renderización y recálculo del total.

### 3. Cálculos Dinámicos
La función `updateTotal()` recorre el estado actual y suma los valores correspondientes del objeto `DATA`. El resultado se formatea automáticamente a moneda colombiana (COP) usando `Intl.NumberFormat`.

---

## ✨ Funcionalidades Destacadas

### Accordion Navigation
Para mejorar la experiencia en pantallas pequeñas, las secciones están organizadas en acordeones que permiten a la usuaria enfocarse en un paso a la vez.

### Resumen de Cotización
Al finalizar, se genera un resumen detallado en un modal que desglosa cada ítem seleccionado.

### Compartir en WhatsApp
La función `copySummary()` toma los datos del resumen, les añade emojis y formato, y los copia al portapapeles. Esto permite a la manicurista pegar la cotización directamente en una conversación de WhatsApp de forma profesional.

### Impresión / PDF
Utiliza el motor de impresión nativo del navegador, optimizado vía CSS (`@media print`) para generar un documento limpio y profesional.

---

## 🚀 Despliegue en GitHub Pages

Dado que el proyecto es 100% estático, es ideal para **GitHub Pages**:
1. El código se aloja en un repositorio de GitHub.
2. En la configuración del repositorio, se activa "Pages" apuntando a la rama `main`.
3. GitHub proporciona una URL pública segura (HTTPS) para acceder desde cualquier lugar.

---
*Desarrollado para Miche Nails & Beauty*
