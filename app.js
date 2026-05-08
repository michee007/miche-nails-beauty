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
        selectedRemovals: []
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
                    <button class="btn-delete-service" onclick="removeService(${index})">
                        <i data-lucide="trash-2" style="width:18px"></i>
                    </button>
                ` : ''}
            </div>
            
            <!-- 1. Servicio Principal -->
            <div class="accordion-item open" id="section-main-${index}">
                <div class="accordion-header" onclick="toggleAccordion('section-main-${index}')">
                    <h2 class="section-title"><i data-lucide="sparkles"></i> 1. Servicio Principal</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="grid-cards">
                        ${DATA.services.map(s => `
                            <div class="card ${state.selectedService?.id === s.id ? 'selected' : ''}" onclick="selectService(${index}, '${s.id}')">
                                <h3>${s.name}</h3>
                                <p class="price">${s.price > 0 ? formatCurrency(s.price) : 'Desde ' + formatCurrency(Math.min(...Object.values(s.lengths)))}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 2. Selección de Largo -->
            <div class="accordion-item ${state.selectedService?.hasLength ? '' : 'hidden'}" id="length-section-${index}">
                <div class="accordion-header" onclick="toggleAccordion('length-section-${index}')">
                    <h2 class="section-title"><i data-lucide="maximize"></i> 2. Selección de Largo</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="grid-cards">
                        ${state.selectedService?.hasLength ? renderLengthsHtml(index, state) : ''}
                    </div>
                </div>
            </div>

            <!-- 3. Diseño -->
            <div class="accordion-item" id="section-design-${index}">
                <div class="accordion-header" onclick="toggleAccordion('section-design-${index}')">
                    <h2 class="section-title"><i data-lucide="palette"></i> 3. Diseño</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="grid-cards">
                        ${DATA.designs.map(d => `
                            <div class="card ${state.selectedDesign === d.id ? 'selected' : ''}" onclick="selectDesign(${index}, '${d.id}')">
                                <h3>${d.name}</h3>
                                <p class="price">${d.price > 0 ? '+' + formatCurrency(d.price) : 'Gratis'}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 4. Extras -->
            <div class="accordion-item" id="section-extras-${index}">
                <div class="accordion-header" onclick="toggleAccordion('section-extras-${index}')">
                    <h2 class="section-title"><i data-lucide="plus-circle"></i> 4. Extras</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="list-options">
                        ${DATA.extras.map(e => `
                            <div class="option-item ${state.selectedExtras.includes(e.id) ? 'selected' : ''}" onclick="toggleExtra(${index}, '${e.id}')">
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

            <!-- 5. Decoraciones -->
            <div class="accordion-item" id="section-decorations-${index}">
                <div class="accordion-header" onclick="toggleAccordion('section-decorations-${index}')">
                    <h2 class="section-title"><i data-lucide="gem"></i> 5. Decoraciones</h2>
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
                                        <button class="btn-counter" onclick="updateDeco(${index}, '${d.id}', -1)"><i data-lucide="minus"></i></button>
                                        <span class="count-value">${count}</span>
                                        <button class="btn-counter" onclick="updateDeco(${index}, '${d.id}', 1)"><i data-lucide="plus"></i></button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <!-- 6. Tonos Extra -->
            <div class="accordion-item" id="section-tones-${index}">
                <div class="accordion-header" onclick="toggleAccordion('section-tones-${index}')">
                    <h2 class="section-title"><i data-lucide="droplet"></i> 6. Tonos Extra</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="counter-item">
                        <div class="counter-info">
                            <h3>Tonos Extra</h3>
                            <p>$1.000 por tono</p>
                        </div>
                        <div class="counter-controls">
                            <button class="btn-counter" onclick="updateTones(${index}, -1)"><i data-lucide="minus"></i></button>
                            <span class="count-value">${state.extraTones}</span>
                            <button class="btn-counter" onclick="updateTones(${index}, 1)"><i data-lucide="plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 7. Retiros -->
            <div class="accordion-item" id="section-removals-${index}">
                <div class="accordion-header" onclick="toggleAccordion('section-removals-${index}')">
                    <h2 class="section-title"><i data-lucide="trash-2"></i> 7. Retiros</h2>
                    <i data-lucide="chevron-down" class="chevron"></i>
                </div>
                <div class="accordion-content">
                    <div class="list-options">
                        ${DATA.removals.map(r => `
                            <div class="option-item ${state.selectedRemovals.includes(r.id) ? 'selected' : ''}" onclick="toggleRemoval(${index}, '${r.id}')">
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

            <div style="text-align: right; padding: 10px 15px; font-weight: 700; color: var(--gold-dark); font-size: 0.9rem;">
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
        <div class="card ${state.selectedLength === l.id ? 'selected' : ''}" onclick="selectLength(${index}, '${l.id}')">
            <h3>${l.name}</h3>
            <p class="price">${formatCurrency(l.price)}</p>
        </div>
    `).join('');
}

// Logic Actions
window.addNewService = () => {
    servicesState.push(createInitialServiceState());
    renderAll();
    // Scroll to new service
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
};

window.removeService = (index) => {
    if (confirm('¿Eliminar este servicio?')) {
        servicesState.splice(index, 1);
        renderAll();
    }
};

window.selectService = (index, id) => {
    const service = DATA.services.find(s => s.id === id);
    const state = servicesState[index];
    state.selectedService = service;
    
    if (service.hasLength) {
        if (!state.selectedLength) state.selectedLength = 'short';
        renderAll();
        openAccordion(`length-section-${index}`);
    } else {
        state.selectedLength = null;
        renderAll();
        // Skip length and open design
        openAccordion(`section-design-${index}`);
    }
};

window.selectLength = (index, id) => {
    servicesState[index].selectedLength = id;
    renderAll();
    openAccordion(`section-design-${index}`);
};

window.selectDesign = (index, id) => {
    servicesState[index].selectedDesign = id;
    renderAll();
};

window.toggleExtra = (index, id) => {
    const state = servicesState[index];
    if (state.selectedExtras.includes(id)) {
        state.selectedExtras = state.selectedExtras.filter(e => e !== id);
    } else {
        state.selectedExtras.push(id);
    }
    renderAll();
};

window.updateDeco = (index, id, change) => {
    const state = servicesState[index];
    const current = state.selectedDecorations[id] || 0;
    const newVal = Math.max(0, current + change);
    if (newVal === 0) delete state.selectedDecorations[id];
    else state.selectedDecorations[id] = newVal;
    renderAll();
};

window.updateTones = (index, change) => {
    const state = servicesState[index];
    state.extraTones = Math.max(0, state.extraTones + change);
    renderAll();
};

window.toggleRemoval = (index, id) => {
    const state = servicesState[index];
    if (state.selectedRemovals.includes(id)) {
        state.selectedRemovals = state.selectedRemovals.filter(r => r !== id);
    } else {
        state.selectedRemovals.push(id);
    }
    renderAll();
};

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
    const design = DATA.designs.find(d => d.id === state.selectedDesign);
    if (design) total += design.price;
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

window.toggleAccordion = (id) => {
    const item = document.getElementById(id);
    if (item) {
        const isOpen = item.classList.contains('open');
        // Close others in same service block if needed? No, better keep current flow.
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

window.resetAll = () => {
    if (confirm('¿Deseas reiniciar toda la cotización?')) {
        servicesState = [createInitialServiceState()];
        renderAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// Modal Summary
window.showSummary = () => {
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

        const design = DATA.designs.find(d => d.id === state.selectedDesign);
        if (design && design.price > 0) html += `<div class="summary-item"><span class="item-label">Diseño: ${design.name}</span><span class="item-price">+ ${formatCurrency(design.price)}</span></div>`;

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

window.closeSummary = () => {
    document.getElementById('summary-modal').style.display = 'none';
};

window.copySummary = () => {
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

window.shareWhatsApp = () => {
    let grandTotal = 0;
    let text = `Hola *Miche Nails & Beauty*! 🌸\n\nHe realizado una cotización en tu App:\n\n`;

    servicesState.forEach((state, index) => {
        if (!state.selectedService) return;
        const sub = calculateSubtotal(state);
        grandTotal += sub;
        
        const lengthName = state.selectedLength ? (state.selectedLength === 'short' ? 'Cortas' : state.selectedLength === 'medium' ? 'Medianas' : 'Largas') : '';
        
        text += `📌 *${state.selectedService.name}* ${lengthName ? '['+lengthName+']' : ''}\n`;
        
        const design = DATA.designs.find(d => d.id === state.selectedDesign);
        if (design && design.price > 0) text += `   - Diseño: ${design.name}\n`;
        
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
    window.open(`https://wa.me/573000000000?text=${encodedText}`, '_blank'); // Replace with actual number if provided
};

// Close modal when clicking outside
window.onclick = (event) => {
    const modal = document.getElementById('summary-modal');
    if (event.target == modal) {
        closeSummary();
    }
};

// Start App
document.addEventListener('DOMContentLoaded', init);
