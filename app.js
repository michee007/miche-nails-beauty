// Pricing Data
const DATA = {
    services: [
        { id: 'man-trad', name: 'Manicure Tradicional', price: 13000, category: 'MANICURE' },
        { id: 'man-semi', name: 'Manicure Semipermanente', price: 30000, category: 'MANICURE' },
        { id: 'poly', name: 'Polygel', price: 0, category: 'POLYGEL', hasLength: true, lengths: { short: 65000, medium: 75000, long: 85000 } },
        { id: 'soft', name: 'Soft Gel', price: 0, category: 'SOFT GEL', hasLength: true, lengths: { short: 60000, medium: 70000, long: 80000 } },
        { id: 'acryl', name: 'Acrílico', price: 0, category: 'ACRÍLICO', hasLength: true, lengths: { short: 70000, medium: 85000, long: 95000 } },
        { id: 'ped-trad', name: 'Pedicura Tradicional', price: 15000, category: 'PEDICURA' },
        { id: 'ped-semi', name: 'Pedicura Semipermanente', price: 30000, category: 'PEDICURA' }
    ],
    designs: [
        { id: 'des-none', name: 'Sin diseño', price: 0 },
        { id: 'des-simple', name: 'Sencillo', price: 8000 },
        { id: 'des-medium', name: 'Medio', price: 13000 },
        { id: 'des-complete', name: 'Completo', price: 22000 }
    ],
    extras: [
        { id: 'ext-french', name: 'Francesa', price: 10000 },
        { id: 'ext-stones', name: 'Piedritas', price: 5000 },
        { id: 'ext-effects', name: 'Efectos', price: 9000 },
        { id: 'ext-shape', name: 'Cambio de forma', price: 1000 }
    ],
    decorations: [
        { id: 'dec-mirror', name: 'Espejo', price: 500 },
        { id: 'dec-aurora', name: 'Aurora', price: 500 },
        { id: 'dec-sweater', name: 'Suéter', price: 500 },
        { id: 'dec-pearl', name: 'Corona de perlas', price: 500 },
        { id: 'dec-carey', name: 'Carey', price: 500 },
        { id: 'dec-bloom', name: 'Blooming', price: 500 },
        { id: 'dec-cat', name: 'Ojo de gato', price: 500 },
        { id: 'dec-relief', name: 'Relieve', price: 500 },
        { id: 'dec-3d', name: '3D', price: 1000 },
        { id: 'dec-art-sim', name: 'Nail art simple', price: 1000 },
        { id: 'dec-art-adv', name: 'Nail art avanzado', price: 5000 }
    ],
    removals: [
        { id: 'rem-semi', name: 'Retiro Semipermanente', price: 5000 },
        { id: 'rem-other', name: 'Retiro Otros Sistemas', price: 10000 }
    ],
    extraTonePrice: 1000
};

// Current State
let state = {
    selectedService: null,
    selectedLength: null,
    selectedDesign: 'des-none',
    selectedExtras: [],
    selectedDecorations: {}, // { id: count }
    extraTones: 0,
    selectedRemovals: []
};

// DOM Elements
const servicesGrid = document.getElementById('services-grid');
const lengthSection = document.getElementById('length-section');
const lengthGrid = document.getElementById('length-grid');
const designGrid = document.getElementById('design-grid');
const extrasList = document.getElementById('extras-list');
const decorationsList = document.getElementById('decorations-list');
const removalsList = document.getElementById('removals-list');
const totalAmount = document.getElementById('total-amount');
const tonesCount = document.getElementById('tones-count');

// Initialize UI
function init() {
    renderServices();
    renderDesigns();
    renderExtras();
    renderDecorations();
    renderRemovals();
    updateTotal();
    lucide.createIcons();
}

function renderServices() {
    servicesGrid.innerHTML = DATA.services.map(s => `
        <div class="card ${state.selectedService?.id === s.id ? 'selected' : ''}" onclick="selectService('${s.id}')">
            <h3>${s.name}</h3>
            <p class="price">${s.price > 0 ? formatCurrency(s.price) : 'Desde ' + formatCurrency(Math.min(...Object.values(s.lengths)))}</p>
        </div>
    `).join('');
}

function renderDesigns() {
    designGrid.innerHTML = DATA.designs.map(d => `
        <div class="card ${state.selectedDesign === d.id ? 'selected' : ''}" onclick="selectDesign('${d.id}')">
            <h3>${d.name}</h3>
            <p class="price">${d.price > 0 ? '+' + formatCurrency(d.price) : 'Gratis'}</p>
        </div>
    `).join('');
}

function renderExtras() {
    extrasList.innerHTML = DATA.extras.map(e => `
        <div class="option-item ${state.selectedExtras.includes(e.id) ? 'selected' : ''}" onclick="toggleExtra('${e.id}')">
            <div class="option-info">
                <h3>${e.name}</h3>
                <p>+ ${formatCurrency(e.price)}</p>
            </div>
            <i data-lucide="${state.selectedExtras.includes(e.id) ? 'check-circle' : 'circle'}"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderDecorations() {
    decorationsList.innerHTML = DATA.decorations.map(d => {
        const count = state.selectedDecorations[d.id] || 0;
        return `
            <div class="counter-item">
                <div class="counter-info">
                    <h3>${d.name}</h3>
                    <p>${formatCurrency(d.price)} c/u</p>
                </div>
                <div class="counter-controls">
                    <button class="btn-counter" onclick="updateDeco('${d.id}', -1, event)"><i data-lucide="minus"></i></button>
                    <span class="count-value">${count}</span>
                    <button class="btn-counter" onclick="updateDeco('${d.id}', 1, event)"><i data-lucide="plus"></i></button>
                </div>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}

function renderRemovals() {
    removalsList.innerHTML = DATA.removals.map(r => `
        <div class="option-item ${state.selectedRemovals.includes(r.id) ? 'selected' : ''}" onclick="toggleRemoval('${r.id}')">
            <div class="option-info">
                <h3>${r.name}</h3>
                <p>+ ${formatCurrency(r.price)}</p>
            </div>
            <i data-lucide="${state.selectedRemovals.includes(r.id) ? 'check-circle' : 'circle'}"></i>
        </div>
    `).join('');
    lucide.createIcons();
}

// Logic Actions
window.selectService = (id) => {
    const service = DATA.services.find(s => s.id === id);
    state.selectedService = service;
    
    if (service.hasLength) {
        lengthSection.classList.remove('hidden');
        // Default to 'short' if no length is selected yet
        if (!state.selectedLength) {
            state.selectedLength = 'short';
        }
        renderLengths(service);
        openAccordion('length-section');
    } else {
        lengthSection.classList.add('hidden');
        state.selectedLength = null;
    }
    
    renderServices();
    updateTotal();
};

function renderLengths(service) {
    const lengths = [
        { id: 'short', name: 'Cortas', price: service.lengths.short },
        { id: 'medium', name: 'Medianas', price: service.lengths.medium },
        { id: 'long', name: 'Largas', price: service.lengths.long }
    ];
    
    lengthGrid.innerHTML = lengths.map(l => `
        <div class="card ${state.selectedLength === l.id ? 'selected' : ''}" onclick="selectLength('${l.id}')">
            <h3>${l.name}</h3>
            <p class="price">${formatCurrency(l.price)}</p>
        </div>
    `).join('');
}

window.selectLength = (id) => {
    state.selectedLength = id;
    renderLengths(state.selectedService);
    updateTotal();
};

window.selectDesign = (id) => {
    state.selectedDesign = id;
    renderDesigns();
    updateTotal();
};

window.toggleExtra = (id) => {
    if (state.selectedExtras.includes(id)) {
        state.selectedExtras = state.selectedExtras.filter(e => e !== id);
    } else {
        state.selectedExtras.push(id);
    }
    renderExtras();
    updateTotal();
};

window.updateDeco = (id, change, event) => {
    if (event) event.stopPropagation();
    const current = state.selectedDecorations[id] || 0;
    const newVal = Math.max(0, current + change);
    if (newVal === 0) {
        delete state.selectedDecorations[id];
    } else {
        state.selectedDecorations[id] = newVal;
    }
    renderDecorations();
    updateTotal();
};

window.updateTones = (change, event) => {
    if (event) event.stopPropagation();
    state.extraTones = Math.max(0, state.extraTones + change);
    tonesCount.innerText = state.extraTones;
    updateTotal();
};

window.toggleRemoval = (id) => {
    if (state.selectedRemovals.includes(id)) {
        state.selectedRemovals = state.selectedRemovals.filter(r => r !== id);
    } else {
        state.selectedRemovals.push(id);
    }
    renderRemovals();
    updateTotal();
};

// Accordion Logic
window.toggleAccordion = (id) => {
    const item = document.getElementById(id);
    const isOpen = item.classList.contains('open');
    
    // Close all others if you want a true accordion (optional)
    // document.querySelectorAll('.accordion-item').forEach(el => el.classList.remove('open'));
    
    if (isOpen) {
        item.classList.remove('open');
    } else {
        item.classList.add('open');
    }
};

function openAccordion(id) {
    const item = document.getElementById(id);
    if (item) item.classList.add('open');
}

// Calculations
function updateTotal() {
    let total = 0;
    
    // 1. Service
    if (state.selectedService) {
        if (state.selectedService.hasLength) {
            // Ensure we have a length if the service requires it
            const lengthKey = state.selectedLength || 'short';
            const price = state.selectedService.lengths[lengthKey];
            if (price) total += price;
        } else {
            total += (state.selectedService.price || 0);
        }
    }
    
    // 2. Design
    const design = DATA.designs.find(d => d.id === state.selectedDesign);
    if (design) total += design.price;
    
    // 3. Extras
    state.selectedExtras.forEach(id => {
        const extra = DATA.extras.find(e => e.id === id);
        if (extra) total += extra.price;
    });
    
    // 4. Decorations
    for (const [id, count] of Object.entries(state.selectedDecorations)) {
        const deco = DATA.decorations.find(d => d.id === id);
        if (deco) total += (deco.price * count);
    }
    
    // 5. Extra Tones
    total += (state.extraTones * DATA.extraTonePrice);
    
    // 6. Removals
    state.selectedRemovals.forEach(id => {
        const removal = DATA.removals.find(r => r.id === id);
        if (removal) total += removal.price;
    });
    
    totalAmount.innerText = formatCurrency(total);
}

// Helpers
function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value).replace('COP', '').trim();
}

window.resetAll = () => {
    state = {
        selectedService: null,
        selectedLength: null,
        selectedDesign: 'des-none',
        selectedExtras: [],
        selectedDecorations: {},
        extraTones: 0,
        selectedRemovals: []
    };
    lengthSection.classList.add('hidden');
    tonesCount.innerText = '0';
    
    // Close all accordions except the first one
    document.querySelectorAll('.accordion-item').forEach((el, index) => {
        if (index === 0) el.classList.add('open');
        else el.classList.remove('open');
    });
    
    init();
};

// Modal Summary
window.showSummary = () => {
    const modal = document.getElementById('summary-modal');
    const details = document.getElementById('summary-details');
    
    let html = '';
    let total = 0;
    
    // Service
    if (state.selectedService) {
        const price = state.selectedService.hasLength && state.selectedLength 
            ? state.selectedService.lengths[state.selectedLength] 
            : state.selectedService.price;
        const name = state.selectedService.name + (state.selectedLength ? ` (${state.selectedLength})` : '');
        html += `<div class="summary-item"><span>${name}</span><span>${formatCurrency(price)}</span></div>`;
        total += price;
    }
    
    // Design
    const design = DATA.designs.find(d => d.id === state.selectedDesign);
    if (design && design.price > 0) {
        html += `<div class="summary-item"><span>Diseño: ${design.name}</span><span>${formatCurrency(design.price)}</span></div>`;
        total += design.price;
    }
    
    // Extras
    state.selectedExtras.forEach(id => {
        const extra = DATA.extras.find(e => e.id === id);
        html += `<div class="summary-item"><span>Extra: ${extra.name}</span><span>${formatCurrency(extra.price)}</span></div>`;
        total += extra.price;
    });
    
    // Decorations
    for (const [id, count] of Object.entries(state.selectedDecorations)) {
        const deco = DATA.decorations.find(d => d.id === id);
        html += `<div class="summary-item"><span>${deco.name} (x${count})</span><span>${formatCurrency(deco.price * count)}</span></div>`;
        total += (deco.price * count);
    }
    
    // Tones
    if (state.extraTones > 0) {
        html += `<div class="summary-item"><span>Tonos Extra (x${state.extraTones})</span><span>${formatCurrency(state.extraTones * DATA.extraTonePrice)}</span></div>`;
        total += (state.extraTones * DATA.extraTonePrice);
    }
    
    // Removals
    state.selectedRemovals.forEach(id => {
        const removal = DATA.removals.find(r => r.id === id);
        html += `<div class="summary-item"><span>${removal.name}</span><span>${formatCurrency(removal.price)}</span></div>`;
        total += removal.price;
    } );
    
    html += `<div class="summary-item total"><span>TOTAL ESTIMADO</span><span>${formatCurrency(total)}</span></div>`;
    
    details.innerHTML = html || '<p>No se han seleccionado servicios aún.</p>';
    modal.style.display = 'block';
};

window.closeSummary = () => {
    document.getElementById('summary-modal').style.display = 'none';
};

window.copySummary = () => {
    const details = document.getElementById('summary-details');
    const text = `🌸 Miche Nails & Beauty - Cotización 🌸\n\n` + 
        Array.from(details.querySelectorAll('.summary-item'))
        .map(item => {
            const spans = item.querySelectorAll('span');
            return `${spans[0].innerText}: ${spans[1].innerText}`;
        })
        .join('\n') + 
        `\n\n¡Espero verte pronto! ✨`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Resumen copiado para compartir 🌸');
    });
};

// Start App
document.addEventListener('DOMContentLoaded', init);
