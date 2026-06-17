// Global Reload Prevention & SPA Architecture
document.addEventListener('submit', (e) => e.preventDefault(), true);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        return false;
    }
}, true);

// Pricing Data
const DATA = {
    services: [
        { id: 'man-trad', name: 'Manicure Tradicional', price: 13000, category: 'MANICURE' },
        { id: 'man-semi', name: 'Manicure Semipermanente', price: 30000, category: 'MANICURE' },
        { id: 'poly', name: 'Polygel', price: 0, category: 'POLYGEL', hasLength: true, lengths: { short: 65000, medium: 75000, long: 85000 } },
        { id: 'soft', name: 'Soft Gel', price: 0, category: 'SOFT GEL', hasLength: true, lengths: { short: 60000, medium: 70000, long: 80000 } },
        { id: 'acryl', name: 'Acrílico', price: 0, category: 'ACRÍLICO', hasLength: true, lengths: { short: 70000, medium: 85000, long: 95000 } },
        { id: 'ped-trad', name: 'Pedicura Tradicional', price: 15000, category: 'PEDICURA' },
        { id: 'ped-semi', name: 'Pedicura Semipermanente', price: 35000, category: 'PEDICURA' }
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

// Global State
let servicesState = [];

// Initialize first service
function createInitialServiceState() {
    return {
        id: Date.now() + Math.random(),
        selectedService: null,
        selectedLength: null,
        selectedDesign: 'des-none',
        selectedExtras: [],
        selectedDecorations: {},
        extraTones: 0,
        selectedRemovals: [],
        deliveryEnabled: false,
        deliveryType: 'cerca', // options: cerca, medio, lejos, custom
        customDeliveryValue: 0,
    };
}

// DOM Elements
const servicesContainer = document.getElementById('all-services-container');
const totalAmountEl = document.getElementById('total-amount');

// Initialize
function init() {
    if (servicesState.length === 0) {
        servicesState.push(createInitialServiceState());
    }
    renderAll();
}

// Rendering Logic
function renderAll() {
    servicesContainer.innerHTML = '';
    let grandTotal = 0;

    servicesState.forEach((state, index) => {
        const subtotal = calculateSubtotal(state);
        grandTotal += subtotal;

        const block = document.createElement('div');
        block.className = 'service-block';
        block.innerHTML = `
            <div class="service-block-header">
                <span class="service-block-title">Servicio #${index + 1}</span>
                ${servicesState.length > 1 ? `
                    <button type="button" class="btn-delete-service" data-action="remove-service" data-index="${index}">
                        <i data-lucide="trash-2" style="width:18px"></i>
                    </button>
                ` : ''}
            </div>
            
            <!-- 1. Servicio Principal -->
            <div class="accordion-item open" id="section-main-${index}">
                <div class="accordion-header" data-action="toggle-accordion" data-target="section-main-${index}">
                    <h2 class="section-title"><i data-lucide="sparkles"></i> 1. Servicio Principal</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="grid-cards">
                        ${DATA.services.map(s => `
                            <div class="card ${state.selectedService?.id === s.id ? 'selected' : ''}" data-action="select-service" data-index="${index}" data-id="${s.id}">
                                <h3>${s.name}</h3>
                                <p class="price">${s.price > 0 ? formatCurrency(s.price) : 'Desde ' + formatCurrency(Math.min(...Object.values(s.lengths)))}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 2. Selección de Largo -->
            <div class="accordion-item ${state.selectedService?.hasLength ? '' : 'hidden'}" id="length-section-${index}">
                <div class="accordion-header" data-action="toggle-accordion" data-target="length-section-${index}">
                    <h2 class="section-title"><i data-lucide="maximize"></i> 2. Selección de Largo</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="grid-cards">
                        ${state.selectedService?.hasLength ? renderLengthsHtml(index, state) : ''}
                    </div>
                </div>
            </div>

            <!-- 3. Extras -->
            <div class="accordion-item" id="section-extras-${index}">
                <div class="accordion-header" data-action="toggle-accordion" data-target="section-extras-${index}">
                    <h2 class="section-title"><i data-lucide="plus-circle"></i> 3. Extras</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="list-options">
                        ${DATA.extras.map(e => `
                            <div class="option-item ${state.selectedExtras.includes(e.id) ? 'selected' : ''}" data-action="toggle-extra" data-index="${index}" data-id="${e.id}">
                                <div class="option-info">
                                    <h3>${e.name}</h3>
                                    <p>+ ${formatCurrency(e.price)}</p>
                                </div>
                                <i data-lucide="${state.selectedExtras.includes(e.id) ? 'check-circle' : 'circle'}"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 4. Decoraciones -->
            <div class="accordion-item" id="section-decorations-${index}">
                <div class="accordion-header" data-action="toggle-accordion" data-target="section-decorations-${index}">
                    <h2 class="section-title"><i data-lucide="gem"></i> 4. Decoraciones</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="counters-grid">
                        ${DATA.decorations.map(d => {
                            const count = state.selectedDecorations[d.id] || 0;
                            return `
                                <div class="counter-item">
                                    <div class="counter-info">
                                        <h3>${d.name}</h3>
                                        <p>${formatCurrency(d.price)} c/u</p>
                                    </div>
                                    <div class="counter-controls">
                                        <button type="button" class="btn-counter" data-action="update-deco" data-index="${index}" data-id="${d.id}" data-change="-1"><i data-lucide="minus"></i></button>
                                        <span class="count-value">${count}</span>
                                        <button type="button" class="btn-counter" data-action="update-deco" data-index="${index}" data-id="${d.id}" data-change="1"><i data-lucide="plus"></i></button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- 5. Tonos Extra -->
            <div class="accordion-item" id="section-tones-${index}">
                <div class="accordion-header" data-action="toggle-accordion" data-target="section-tones-${index}">
                    <h2 class="section-title"><i data-lucide="droplet"></i> 5. Tonos Extra</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="counter-item">
                        <div class="counter-info">
                            <h3>Tonos Extra</h3>
                            <p>$1.000 por tono</p>
                        </div>
                        <div class="counter-controls">
                            <button type="button" class="btn-counter" data-action="update-tones" data-index="${index}" data-change="-1"><i data-lucide="minus"></i></button>
                            <span class="count-value">${state.extraTones}</span>
                            <button type="button" class="btn-counter" data-action="update-tones" data-index="${index}" data-change="1"><i data-lucide="plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 6. Retiros -->
            <div class="accordion-item" id="section-removals-${index}">
                <div class="accordion-header" data-action="toggle-accordion" data-target="section-removals-${index}">
                    <h2 class="section-title"><i data-lucide="trash-2"></i> 6. Retiros</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="list-options">
                        ${DATA.removals.map(r => `
                            <div class="option-item ${state.selectedRemovals.includes(r.id) ? 'selected' : ''}" data-action="toggle-removal" data-index="${index}" data-id="${r.id}">
                                <div class="option-info">
                                    <h3>${r.name}</h3>
                                    <p>+ ${formatCurrency(r.price)}</p>
                                </div>
                                <i data-lucide="${state.selectedRemovals.includes(r.id) ? 'check-circle' : 'circle'}"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>


            <div id="subtotal-serv-${index}" style="text-align: right; padding: 10px 15px; font-weight: 700; color: var(--gold-dark); font-size: 0.9rem;">
                Subtotal Servicio #${index + 1}: ${formatCurrency(subtotal)}
            </div>
        `;
        servicesContainer.appendChild(block);
    });

    totalAmountEl.innerText = formatCurrency(grandTotal);
    lucide.createIcons();
}

function renderLengthsHtml(index, state) {
    const s = state.selectedService;
    const lengths = [
        { id: 'short', name: 'Cortas', price: s.lengths.short },
        { id: 'medium', name: 'Medianas', price: s.lengths.medium },
        { id: 'long', name: 'Largas', price: s.lengths.long }
    ];
    return lengths.map(l => `
        <div class="card ${state.selectedLength === l.id ? 'selected' : ''}" data-action="select-length" data-index="${index}" data-id="${l.id}">
            <h3>${l.name}</h3>
            <p class="price">${formatCurrency(l.price)}</p>
        </div>
    `).join('');
}

// Logic Actions
window.addNewService = (event) => {
    if (event) event.preventDefault();
    servicesState.push(createInitialServiceState());
    renderAll();
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
};

window.removeService = (event, index) => {
    if (event) event.preventDefault();
    if (confirm('¿Eliminar este servicio?')) {
        servicesState.splice(index, 1);
        renderAll();
    }
};

window.selectService = (event, index, id) => {
    if (event) event.preventDefault();
    const service = DATA.services.find(s => s.id === id);
    const state = servicesState[index];
    state.selectedService = service;
    
    const section = document.getElementById(`section-main-${index}`);
    if (section) {
        section.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        const card = section.querySelector(`.card[data-id="${id}"]`);
        if (card) card.classList.add('selected');
    }

    const lengthSection = document.getElementById(`length-section-${index}`);
    if (service.hasLength) {
        if (!state.selectedLength) state.selectedLength = 'short';
        if (lengthSection) {
            lengthSection.classList.remove('hidden');
            const grid = lengthSection.querySelector('.grid-cards');
            if (grid) {
                grid.innerHTML = renderLengthsHtml(index, state);
                lucide.createIcons();
            }
        }
        updateSubtotal(index);
        openAccordion(`length-section-${index}`);
    } else {
        state.selectedLength = null;
        if (lengthSection) {
            lengthSection.classList.add('hidden');
            const grid = lengthSection.querySelector('.grid-cards');
            if (grid) grid.innerHTML = '';
        }
        updateSubtotal(index);
        openAccordion(`section-extras-${index}`);
    }
};

window.selectLength = (event, index, id) => {
    if (event) event.preventDefault();
    servicesState[index].selectedLength = id;
    
    const section = document.getElementById(`length-section-${index}`);
    if (section) {
        section.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        const card = section.querySelector(`.card[data-id="${id}"]`);
        if (card) card.classList.add('selected');
    }
    updateSubtotal(index);
    openAccordion(`section-extras-${index}`);
};

window.selectDesign = (event, index, id) => {
    // Hidden visual section, but keep function just in case
    if (event) event.preventDefault();
    servicesState[index].selectedDesign = id;
    updateSubtotal(index);
};

window.toggleExtra = (event, index, id) => {
    if (event) event.preventDefault();
    const state = servicesState[index];
    if (state.selectedExtras.includes(id)) {
        state.selectedExtras = state.selectedExtras.filter(e => e !== id);
    } else {
        state.selectedExtras.push(id);
    }
    
    const section = document.getElementById(`section-extras-${index}`);
    if (section) {
        const item = section.querySelector(`.option-item[data-id="${id}"]`);
        if (item) {
            const isSelected = state.selectedExtras.includes(id);
            item.classList.toggle('selected', isSelected);
            const i = item.querySelector('i, svg');
            if (i) {
                const newIcon = document.createElement('i');
                newIcon.setAttribute('data-lucide', isSelected ? 'check-circle' : 'circle');
                i.replaceWith(newIcon);
                lucide.createIcons();
            }
        }
    }
    updateSubtotal(index);
};

window.updateDeco = (event, index, id, change) => {
    if (event) event.preventDefault();
    const state = servicesState[index];
    const current = state.selectedDecorations[id] || 0;
    const newVal = Math.max(0, current + change);
    if (newVal === 0) delete state.selectedDecorations[id];
    else state.selectedDecorations[id] = newVal;
    
    const section = document.getElementById(`section-decorations-${index}`);
    if (section) {
        const btn = section.querySelector(`.btn-counter[data-id="${id}"]`);
        if (btn) {
            const span = btn.parentElement.querySelector('.count-value');
            if (span) span.innerText = newVal;
        }
    }
    updateSubtotal(index);
};

window.updateTones = (event, index, change) => {
    if (event) event.preventDefault();
    const state = servicesState[index];
    state.extraTones = Math.max(0, state.extraTones + change);
    
    const section = document.getElementById(`section-tones-${index}`);
    if (section) {
        const span = section.querySelector('.count-value');
        if (span) span.innerText = state.extraTones;
    }
    updateSubtotal(index);
};

window.toggleRemoval = (event, index, id) => {
    if (event) event.preventDefault();
    const state = servicesState[index];
    if (state.selectedRemovals.includes(id)) {
        state.selectedRemovals = state.selectedRemovals.filter(r => r !== id);
    } else {
        state.selectedRemovals.push(id);
    }
    
    const section = document.getElementById(`section-removals-${index}`);
    if (section) {
        const item = section.querySelector(`.option-item[data-id="${id}"]`);
        if (item) {
            const isSelected = state.selectedRemovals.includes(id);
            item.classList.toggle('selected', isSelected);
            const i = item.querySelector('i, svg');
            if (i) {
                const newIcon = document.createElement('i');
                newIcon.setAttribute('data-lucide', isSelected ? 'check-circle' : 'circle');
                i.replaceWith(newIcon);
                lucide.createIcons();
            }
        }
    }
    updateSubtotal(index);
};

function updateSubtotal(index) {
    const state = servicesState[index];
    const subtotal = calculateSubtotal(state);
    
    const subtotalEl = document.getElementById(`subtotal-serv-${index}`);
    if (subtotalEl) {
        subtotalEl.innerText = `Subtotal Servicio #${index + 1}: ${formatCurrency(subtotal)}`;
    }
    
    let grandTotal = 0;
    servicesState.forEach(s => grandTotal += calculateSubtotal(s));
    totalAmountEl.innerText = formatCurrency(grandTotal);
}

// Utilities
function calculateSubtotal(state) {
    let total = 0;
    if (state.selectedService) {
        if (state.selectedService.hasLength) {
            const lengthKey = state.selectedLength || 'short';
            total += state.selectedService.lengths[lengthKey];
        } else {
            total += state.selectedService.price;
        }
    }
    // const design = DATA.designs.find(d => d.id === state.selectedDesign);
    // if (design) total += design.price;
    state.selectedExtras.forEach(id => {
        const extra = DATA.extras.find(e => e.id === id);
        if (extra) total += extra.price;
    });
    for (const [id, count] of Object.entries(state.selectedDecorations)) {
        const deco = DATA.decorations.find(d => d.id === id);
        if (deco) total += (deco.price * count);
    }
    total += (state.extraTones * DATA.extraTonePrice);
    state.selectedRemovals.forEach(id => {
        const removal = DATA.removals.find(r => r.id === id);
        if (removal) total += removal.price;
    });
    return total;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(value).replace('COP', '').trim();
}

window.toggleAccordion = (event, id) => {
    if (event) event.preventDefault();
    const item = document.getElementById(id);
    if (item) {
        item.classList.toggle('open');
    }
};

function openAccordion(id) {
    const item = document.getElementById(id);
    if (item) {
        item.classList.add('open');
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

window.resetAll = (silent = false) => {
    if (silent || confirm('¿Deseas reiniciar toda la cotización?')) {
        servicesState = [createInitialServiceState()];
        renderAll();
        if (!silent) window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Modal Summary
window.showSummary = (event) => {
    if (event) event.preventDefault();
    const modal = document.getElementById('summary-modal');
    const details = document.getElementById('summary-details');
    let html = '';
    let grandTotal = 0;
    let servicesFound = false;

    servicesState.forEach((state, index) => {
        if (!state.selectedService) return;
        servicesFound = true;
        const subtotal = calculateSubtotal(state);
        grandTotal += subtotal;

        html += `<div class="ticket-service">
            <h3 style="color: var(--gold-dark); font-size: 0.9rem; margin-top: 15px; text-transform: uppercase;">#${index + 1} - ${state.selectedService.name}</h3>`;

        const servicePrice = state.selectedService.hasLength ? state.selectedService.lengths[state.selectedLength] : state.selectedService.price;
        const lengthName = state.selectedLength ? (state.selectedLength === 'short' ? 'Cortas' : state.selectedLength === 'medium' ? 'Medianas' : 'Largas') : '';
        
        html += `<div class="summary-item"><span class="item-label">${state.selectedService.name} ${lengthName ? '('+lengthName+')' : ''}</span><span class="item-price">${formatCurrency(servicePrice)}</span></div>`;

        // const design = DATA.designs.find(d => d.id === state.selectedDesign);
        // if (design && design.price > 0) html += `<div class="summary-item"><span class="item-label">Diseño: ${design.name}</span><span class="item-price">+ ${formatCurrency(design.price)}</span></div>`;

        state.selectedExtras.forEach(id => {
            const e = DATA.extras.find(x => x.id === id);
            html += `<div class="summary-item"><span class="item-label">Extra: ${e.name}</span><span class="item-price">+ ${formatCurrency(e.price)}</span></div>`;
        });

        for (const [id, count] of Object.entries(state.selectedDecorations)) {
            const d = DATA.decorations.find(x => x.id === id);
            html += `<div class="summary-item"><span class="item-label">${d.name} (x${count})</span><span class="item-price">+ ${formatCurrency(d.price * count)}</span></div>`;
        }

        if (state.extraTones > 0) html += `<div class="summary-item"><span class="item-label">Tonos Extra (x${state.extraTones})</span><span class="item-price">+ ${formatCurrency(state.extraTones * DATA.extraTonePrice)}</span></div>`;

        state.selectedRemovals.forEach(id => {
            const r = DATA.removals.find(x => x.id === id);
            html += `<div class="summary-item"><span class="item-label">${r.name}</span><span class="item-price">+ ${formatCurrency(r.price)}</span></div>`;
        });
        


        html += `<div class="summary-item" style="font-weight:700; border-top: 1px dotted var(--gold-light); margin-top: 5px; padding-top: 5px;"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div></div>`;
    });

    if (!servicesFound) {
        details.innerHTML = '<p style="text-align:center; padding: 20px;">No has seleccionado ningún servicio todavía 🌸</p>';
    } else {
        html += `<div class="summary-item total"><span>INVERSIÓN TOTAL</span><span>${formatCurrency(grandTotal)}</span></div>`;
        details.innerHTML = html;
    }
    
    modal.style.display = 'block';
    lucide.createIcons();
};

window.closeSummary = (event) => {
    if (event) event.preventDefault();
    document.getElementById('summary-modal').style.display = 'none';
};

window.copySummary = (event) => {
    if (event) event.preventDefault();
    let grandTotal = 0;
    let text = `🌸 *Miche Nails & Beauty* 🌸\n*Mi Cotización*\n---------------------------\n`;

    servicesState.forEach((state, index) => {
        if (!state.selectedService) return;
        const sub = calculateSubtotal(state);
        grandTotal += sub;
        text += `✨ *Servicio #${index+1}*: ${state.selectedService.name}\n   Subtotal: ${formatCurrency(sub)}\n`;
    });

    text += `---------------------------\n💰 *TOTAL*: ${formatCurrency(grandTotal)}\n\n¡Espero verte pronto! ✨`;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check"></i> Copiado';
        lucide.createIcons();
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            lucide.createIcons();
        }, 2000);
    });
};

window.shareWhatsApp = (event) => {
    if (event) event.preventDefault();
    let grandTotal = 0;
    let text = `Hola *Miche Nails & Beauty*! 🌸\n\nHe realizado una cotización en tu App:\n\n`;

    servicesState.forEach((state, index) => {
        if (!state.selectedService) return;
        const sub = calculateSubtotal(state);
        grandTotal += sub;
        
        const lengthName = state.selectedLength ? (state.selectedLength === 'short' ? 'Cortas' : state.selectedLength === 'medium' ? 'Medianas' : 'Largas') : '';
        
        text += `📌 *${state.selectedService.name}* ${lengthName ? '['+lengthName+']' : ''}\n`;
        
        // const design = DATA.designs.find(d => d.id === state.selectedDesign);
        // if (design && design.price > 0) text += `   - Diseño: ${design.name}\n`;
        
        state.selectedExtras.forEach(id => {
            const e = DATA.extras.find(x => x.id === id);
            text += `   - Extra: ${e.name}\n`;
        });

        for (const [id, count] of Object.entries(state.selectedDecorations)) {
            const d = DATA.decorations.find(x => x.id === id);
            text += `   - ${d.name} (x${count})\n`;
        }

        if (state.extraTones > 0) text += `   - Tonos Extra (x${state.extraTones})\n`;

        state.selectedRemovals.forEach(id => {
            const r = DATA.removals.find(x => x.id === id);
            text += `   - ${r.name}\n`;
        });
        
        text += `   *Subtotal:* ${formatCurrency(sub)}\n\n`;
    });

    text += `💎 *TOTAL ESTIMADO*: ${formatCurrency(grandTotal)}\n\n¿Tienes disponibilidad para agendar? ✨`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/573000000000?text=${encodedText}`, '_blank');
};

// API Integration
const API_URL = 'http://localhost:3000/api';

window.toggleDashboard = async (event) => {
    if (event) event.preventDefault();
    const calc = document.getElementById('main-calculator');
    const dash = document.getElementById('dashboard-view');
    const footer = document.querySelector('.sticky-footer');
    
    if (dash.classList.contains('hidden')) {
        calc.classList.add('hidden');
        footer.classList.add('hidden');
        dash.classList.remove('hidden');
        await loadDashboardStats();
    } else {
        dash.classList.add('hidden');
        calc.classList.remove('hidden');
        footer.classList.remove('hidden');
    }
};

window.saveSale = async (event) => {
    if (event) event.preventDefault();
    const btn = document.getElementById('btn-save-sale');
    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const observations = document.getElementById('observations').value;

    if (!clientName) {
        alert('Por favor ingresa el nombre de la clienta');
        return;
    }

    const saleData = {
        client: { name: clientName, phone: clientPhone },
        total: servicesState.reduce((sum, s) => sum + calculateSubtotal(s), 0),
        paymentMethod,
        observations,
        items: servicesState.filter(s => s.selectedService).map(s => ({
            name: s.selectedService.name,
            subtotal: calculateSubtotal(s),
            details: {
                length: s.selectedLength,
                design: s.selectedDesign,
                extras: s.selectedExtras,
                decorations: s.selectedDecorations,
                tones: s.extraTones,
                removals: s.selectedRemovals
            }
        }))
    };

    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader"></i> Guardando...';
    lucide.createIcons();

    try {
        const response = await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });

        if (response.ok) {
            alert('Venta registrada con éxito 🌸');
            closeSummary();
            resetAll(true);
        } else {
            throw new Error('Error en el servidor');
        }
    } catch (err) {
        console.error(err);
        alert('No se pudo conectar con el servidor. Verifica que esté corriendo.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="save"></i> Registrar Venta en DB';
        lucide.createIcons();
    }
};

async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/dashboard/stats`);
        const data = await response.json();

        document.getElementById('stat-today').innerText = formatCurrency(data.today);
        document.getElementById('stat-week').innerText = formatCurrency(data.weekly);
        document.getElementById('stat-month').innerText = formatCurrency(data.monthly);

        renderRecentSales(data.recentSales);
    } catch (err) {
        console.error('Error cargando estadísticas:', err);
    }
}

function renderRecentSales(sales) {
    const list = document.getElementById('recent-sales-list');
    if (!sales || sales.length === 0) {
        list.innerHTML = '<p style="text-align:center; opacity:0.5; padding: 20px;">No hay ventas registradas.</p>';
        return;
    }

    list.innerHTML = sales.map(sale => `
        <div class="sale-item-card">
            <div class="sale-info">
                <span class="sale-client">${sale.cliente_nombre}</span>
                <span class="sale-date">${new Date(sale.created_at).toLocaleDateString()} - ${sale.metodo_pago}</span>
            </div>
            <span class="sale-amount">${formatCurrency(sale.total)}</span>
        </div>
    `).join('');
}

// Centralized Event Master
document.addEventListener('click', async (e) => {
    const target = e.target.closest('[data-action], [id^="btn-"], .btn-close-summary');
    if (!target) return;

    e.preventDefault();
    const action = target.dataset.action;
    const index = parseInt(target.dataset.index);
    const id = target.dataset.id;

    if (action === 'toggle-accordion') toggleAccordion(null, target.dataset.target);
    else if (action === 'select-service') selectService(null, index, id);
    else if (action === 'select-length') selectLength(null, index, id);
    else if (action === 'select-design') selectDesign(null, index, id);
    else if (action === 'toggle-extra') toggleExtra(null, index, id);
    else if (action === 'update-deco') updateDeco(null, index, id, parseInt(target.dataset.change));
    else if (action === 'update-tones') updateTones(null, index, parseInt(target.dataset.change));
    else if (action === 'toggle-removal') toggleRemoval(null, index, id);
    else if (action === 'remove-service') removeService(null, index);

    else if (target.id === 'btn-toggle-dashboard' || target.id === 'btn-back-dashboard') toggleDashboard(null);
    else if (target.id === 'btn-add-service-main') addNewService(null);
    else if (target.id === 'btn-reset-main') resetAll(null);
    else if (target.id === 'btn-show-summary-main') showSummary(null);
    else if (target.classList.contains('btn-close-summary')) closeSummary(null);
    else if (target.id === 'btn-save-sale') saveSale(null);
    else if (target.id === 'btn-share-whatsapp') shareWhatsApp(null);
    else if (target.id === 'btn-copy-summary') copySummary(e); // Copy needs event for currentTarget
    else if (target.id === 'btn-print-summary') window.print();

    return false;
}, true);

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('summary-modal');
    if (event.target == modal) {
        closeSummary(null);
    }
};

// Start App
document.addEventListener('DOMContentLoaded', init);
