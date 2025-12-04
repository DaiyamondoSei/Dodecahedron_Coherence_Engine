/**
 * Demo Orchestrator Logic
 *
 * Main navigation and state management for the demo flow
 */

// Global state
const demoState = {
    currentStep: 1,
    totalSteps: 4,
    faceConfig: null,
    kpiMode: null, // 'quick' or 'full'
    kpiData: null,
    coherenceResults: null,
    completedSteps: []
};

/**
 * Initialize demo
 */
function initializeDemo() {
    console.log('🌟 Quannex Demo Orchestrator initialized');
    updateProgress();
}

/**
 * Navigate to step
 */
function goToStep(stepNumber) {
    // Validate step is accessible
    if (stepNumber > 1 && !demoState.completedSteps.includes(stepNumber - 1)) {
        alert(`Please complete Step ${stepNumber - 1} first`);
        return;
    }

    // Sprint 2 FIX: Enforce validation gate for step 2+
    // Must have all 12 faces validated before proceeding past step 1
    if (stepNumber > 1 && window.Sprint2 && window.Sprint2.validationGate) {
        const gateResult = window.Sprint2.canProceed();
        if (!gateResult.canProceed) {
            // Show empowering dialog instead of blocking alert
            showValidationBlockDialog(gateResult);
            return;
        }
    }

    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Update navigation
    document.querySelectorAll('.step-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

    // Update state
    demoState.currentStep = stepNumber;
    updateProgress();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log(`📍 Navigated to Step ${stepNumber}`);
}

/**
 * Show validation block dialog with empowering messaging
 * Sprint 2 Task 15: Red indicators + blocking
 */
function showValidationBlockDialog(gateResult) {
    const validation = window.Sprint2.validationGate.validate();
    const message = validation.message;
    const incompleteFaces = validation.faceGuidance || [];

    // Build face list with red indicators
    let faceListHtml = incompleteFaces.slice(0, 5).map(face =>
        `<div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255,100,100,0.1); border-radius: 4px; margin: 4px 0;">
            <span style="color: #ff6b6b; font-size: 16px;">⚠️</span>
            <span>Face ${face.faceId}: ${face.currentName}</span>
        </div>`
    ).join('');

    if (incompleteFaces.length > 5) {
        faceListHtml += `<div style="font-size: 12px; color: rgba(255,255,255,0.5); padding: 4px;">...and ${incompleteFaces.length - 5} more</div>`;
    }

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'validation-block-modal';
    overlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); z-index: 3000; display: flex; align-items: center; justify-content: center;">
            <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #ff6b6b; border-radius: 16px; padding: 30px; max-width: 500px; margin: 20px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 48px;">${message.icon || '🔴'}</span>
                    <h2 style="color: #ff6b6b; margin: 15px 0 10px 0; font-size: 24px;">${message.title}</h2>
                    <p style="color: rgba(255,255,255,0.8); font-size: 14px;">${message.message}</p>
                    ${message.encouragement ? `<p style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 10px;">${message.encouragement}</p>` : ''}
                </div>

                <div style="margin: 20px 0;">
                    <div style="font-size: 12px; color: #ff6b6b; margin-bottom: 8px; font-weight: 600;">
                        ⚠️ INCOMPLETE FACES (${incompleteFaces.length} remaining):
                    </div>
                    ${faceListHtml}
                </div>

                <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px;">
                    <button onclick="closeValidationModal(); focusOnIncompleteFace()"
                        style="padding: 12px 24px; background: linear-gradient(135deg, #00ffcc, #00ff88); color: #000; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Complete Faces
                    </button>
                    <button onclick="applyDefaultsAndProceed()"
                        style="padding: 12px 24px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer;">
                        Use Defaults
                    </button>
                    <button onclick="closeValidationModal()"
                        style="padding: 12px 24px; background: transparent; color: rgba(255,255,255,0.5); border: none; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

/**
 * Close validation modal
 */
function closeValidationModal() {
    const modal = document.getElementById('validation-block-modal');
    if (modal) modal.remove();
}

/**
 * Apply defaults and proceed
 */
function applyDefaultsAndProceed() {
    closeValidationModal();
    if (window.Sprint2 && window.Sprint2.validationGate) {
        window.Sprint2.validationGate.applyDefaults();
        console.log('✅ Applied defaults to incomplete faces');
        // Now try to proceed
        completeStep1();
    }
}

/**
 * Focus on first incomplete face
 */
function focusOnIncompleteFace() {
    if (window.Sprint2 && window.Sprint2.validationGate) {
        const validation = window.Sprint2.validationGate.validate();
        if (validation.faceGuidance && validation.faceGuidance.length > 0) {
            const firstIncomplete = validation.faceGuidance[0];
            const faceInput = document.querySelector(`#face-input-${firstIncomplete.faceId}`);
            if (faceInput) {
                faceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                faceInput.focus();
                // Add red highlight
                faceInput.style.borderColor = '#ff6b6b';
                faceInput.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
            }
        }
    }
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progressPercent = ((demoState.currentStep - 1) / (demoState.totalSteps - 1)) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
}

/**
 * Mark step as completed
 */
function markStepCompleted(stepNumber) {
    if (!demoState.completedSteps.includes(stepNumber)) {
        demoState.completedSteps.push(stepNumber);
    }

    // Update UI
    const stepButton = document.querySelector(`[data-step="${stepNumber}"]`);
    if (stepButton) {
        stepButton.classList.add('completed');
    }
}

/**
 * Complete Step 1: Face Definition
 */
function completeStep1() {
    // Validate faces (local check)
    const validation = validateFaces();

    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    // Save configuration first
    demoState.faceConfig = getFaceConfiguration();

    // Sprint 2 FIX: Sync faces to MappingContext BEFORE validation check
    if (window.Sprint2 && window.Sprint2.mappingContext) {
        try {
            const facesConfig = demoState.faceConfig.faces.map(face => ({
                id: face.id,
                name: face.name,
                icon: face.icon || '',
                source: 'user'
            }));
            window.Sprint2.mappingContext.setAllFaces(facesConfig);
            console.log('✅ Synced faces to MappingContext');
        } catch (err) {
            console.warn('⚠️ MappingContext sync failed:', err.message);
        }
    }

    // Sprint 2 FIX: Now check validation gate with updated data
    if (window.Sprint2 && window.Sprint2.validationGate) {
        const gateResult = window.Sprint2.canProceed();
        console.log('📋 Validation Gate:', gateResult);

        // Block if validation fails - show empowering dialog
        if (!gateResult.canProceed) {
            showValidationBlockDialog(gateResult);
            return; // Block navigation
        }
    }

    // Mark completed
    markStepCompleted(1);

    // Show success
    console.log('✅ Step 1 completed:', demoState.faceConfig);

    // Go to next step
    goToStep(2);
}

/**
 * Select KPI mode
 */
function selectMode(mode) {
    demoState.kpiMode = mode;

    // Update UI
    document.getElementById('modeQuick').classList.remove('btn-primary');
    document.getElementById('modeFull').classList.remove('btn-primary');
    document.getElementById('modeQuick').classList.add('btn-secondary');
    document.getElementById('modeFull').classList.add('btn-secondary');

    if (mode === 'quick') {
        document.getElementById('modeQuick').classList.remove('btn-secondary');
        document.getElementById('modeQuick').classList.add('btn-primary');
    } else {
        document.getElementById('modeFull').classList.remove('btn-secondary');
        document.getElementById('modeFull').classList.add('btn-primary');
    }

    // Sprint 2: Sync mode to MappingContext if available
    if (window.Sprint2 && window.Sprint2.mappingContext) {
        try {
            window.Sprint2.mappingContext.setMode(mode);
            console.log('✅ Synced mode to MappingContext:', mode);
        } catch (err) {
            console.warn('⚠️ Mode sync failed:', err.message);
        }
    }

    // Load KPI mapper
    loadKPIMapper(mode);

    // Enable next button
    document.getElementById('step2NextBtn').disabled = false;

    console.log(`✅ KPI mode selected: ${mode}`);
}

/**
 * Load KPI mapper interface
 */
function loadKPIMapper(mode) {
    const section = document.getElementById('kpiMapperSection');
    section.style.display = 'block';

    if (mode === 'quick') {
        section.innerHTML = generateQuickModeHTML();
    } else {
        section.innerHTML = generateFullModeHTML();
    }

    // Sprint 2: Auto-fill with extracted KPIs from AI story analysis
    autoFillExtractedKPIs();
}

/**
 * Auto-fill KPI fields with AI-extracted data
 */
function autoFillExtractedKPIs() {
    // Check if we have extracted KPIs from story analysis
    const extractedKPIs = window.getExtractedKPIs ? window.getExtractedKPIs() : [];
    const financials = window.getExtractedFinancials ? window.getExtractedFinancials() : {};

    if (extractedKPIs.length === 0 && Object.keys(financials).length === 0) {
        console.log('📊 No extracted KPIs to auto-fill');
        return;
    }

    console.log(`📊 Auto-filling ${extractedKPIs.length} extracted KPIs...`);

    // Fill KPIs by face
    extractedKPIs.forEach(kpi => {
        const faceId = kpi.faceId;

        // Find the input fields for this face
        const nameInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="kpiName"]`);
        const valueInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="value"]`);

        if (nameInput && kpi.name) {
            nameInput.value = kpi.name;
            nameInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
        }

        if (valueInput && kpi.value) {
            // Extract numeric value from string
            const numValue = parseFloat(kpi.value.replace(/[^0-9.-]/g, ''));
            if (!isNaN(numValue)) {
                valueInput.value = numValue;
                valueInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';

                // Trigger normalization calculation
                if (typeof calculateLiveNormalization === 'function') {
                    calculateLiveNormalization(faceId);
                }
            }
        }
    });

    // Also apply direct financial extractions as fallback
    if (financials.revenue?.value) {
        setKPIFieldValue(1, 'Revenue', financials.revenue.value);
    }
    if (financials.teamSize?.value) {
        setKPIFieldValue(3, 'Team Size', financials.teamSize.value);
    }
    if (financials.customers?.value) {
        setKPIFieldValue(5, 'Customer Count', financials.customers.value);
    }
    if (financials.runway?.value) {
        setKPIFieldValue(11, 'Runway', financials.runway.value);
    }

    // Show confirmation message
    showAutoFillNotification(extractedKPIs.length);
}

/**
 * Helper to set a KPI field value
 */
function setKPIFieldValue(faceId, kpiName, value) {
    const nameInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="kpiName"]`);
    const valueInput = document.querySelector(`input[data-face-id="${faceId}"][data-field="value"]`);

    if (nameInput && !nameInput.value) {
        nameInput.value = kpiName;
        nameInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
    }

    if (valueInput && !valueInput.value && value) {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (!isNaN(numValue)) {
            valueInput.value = numValue;
            valueInput.style.borderColor = 'rgba(0, 255, 204, 0.5)';
        }
    }
}

/**
 * Show notification that KPIs were auto-filled
 */
function showAutoFillNotification(count) {
    const section = document.getElementById('kpiMapperSection');
    if (!section || count === 0) return;

    // Add notification banner at the top
    const existing = document.getElementById('autoFillNotification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'autoFillNotification';
    notification.innerHTML = `
        <div style="background: rgba(0, 255, 204, 0.15); border: 1px solid rgba(0, 255, 204, 0.4);
                    border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;
                    display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">🤖</span>
            <div>
                <div style="font-weight: 600; color: #00ffcc; font-size: 14px;">
                    AI Pre-filled ${count} KPIs from your story
                </div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.6);">
                    Highlighted fields contain extracted data. Review and adjust as needed.
                </div>
            </div>
        </div>
    `;
    section.insertBefore(notification, section.firstChild);
}

/**
 * Generate Quick Mode HTML (12 KPIs) - ENHANCED with better layout
 */
function generateQuickModeHTML() {
    const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

    let html = '<div style="margin: 30px 0;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Quick Mode: 1 KPI per Face</h3>';
    html += '<div style="display: grid; gap: 20px;">';

    demoState.faceConfig.faces.forEach(face => {
        // Get KPI suggestions for this face (Earth element by default for quick mode)
        const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, 'Earth') : [];
        const datalistId = `kpi-suggestions-${face.id}`;

        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px;">
                <div style="font-size: 14px; font-weight: 600; margin-bottom: 15px; color: #00ffcc;">
                    Face ${face.id}: ${face.name}
                </div>

                <!-- Main KPI input row -->
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            KPI Name
                        </label>
                        <input
                            type="text"
                            class="face-input"
                            list="${datalistId}"
                            placeholder="Start typing..."
                            data-face-id="${face.id}"
                            data-field="kpiName"
                            onchange="autofillKPISuggestion(this, ${face.id})"
                            oninput="this.setAttribute('data-current-value', this.value)"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Current Value
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="value"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Unit
                        </label>
                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-field="unit"
                            style="cursor: pointer; font-size: 12px;"
                        >
                            ${units.map(u => `<option value="${u.value}">${u.symbol || u.label}</option>`).join('')}
                        </select>
                    </div>
                </div>

                <!-- Target ranges row -->
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Min
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="0"
                            data-face-id="${face.id}"
                            data-field="targetMin"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Target Ideal
                        </label>
                        <input
                            type="number"
                            class="face-input"
                            placeholder="100"
                            data-face-id="${face.id}"
                            data-field="targetIdeal"
                            step="any"
                            oninput="calculateLiveNormalization(${face.id})"
                        />
                    </div>
                    <div>
                        <label style="font-size: 11px; color: rgba(255, 255, 255, 0.6); display: block; margin-bottom: 5px;">
                            Direction
                        </label>
                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-field="direction"
                            style="cursor: pointer; font-size: 12px;"
                            onchange="calculateLiveNormalization(${face.id})"
                        >
                            <option value="↑">↑ Higher</option>
                            <option value="↓">↓ Lower</option>
                            <option value="Band">⊟ Sweet spot</option>
                        </select>
                    </div>
                </div>

                <!-- Live normalization preview -->
                <div id="normalization-preview-${face.id}" style="margin-top: 12px; padding: 8px; background: rgba(0, 0, 0, 0.2); border-radius: 6px; font-size: 11px; color: rgba(255, 255, 255, 0.7); display: none;">
                    <span style="color: rgba(0, 255, 204, 0.8);">→ Normalized:</span>
                    <span id="norm-value-${face.id}" style="font-weight: 600; color: #00ffcc;">--</span>
                    <span style="opacity: 0.6;">(This value goes to calculation)</span>
                </div>
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

/**
 * Generate Full Mode HTML (60 KPIs) - ENHANCED with tooltips, units, and suggestions
 */
function generateFullModeHTML() {
    const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];
    const units = window.KPILibrary ? window.KPILibrary.getUnitTypes() : [];

    let html = '<div style="margin: 30px 0;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Full Mode: 5 Elemental KPIs per Face</h3>';

    demoState.faceConfig.faces.forEach(face => {
        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div style="font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #00ffcc;">
                    Face ${face.id}: ${face.name}
                </div>
        `;

        elements.forEach(element => {
            // Get elemental wisdom
            const wisdom = window.KPILibrary ? window.KPILibrary.getElementalWisdom(element) : { icon: '✨', subtitle: element, description: '' };

            // Get KPI suggestions for this element
            const suggestions = window.KPILibrary ? window.KPILibrary.getKPISuggestions(face.name, element) : [];
            const datalistId = `kpi-suggestions-${face.id}-${element}`;

            html += `
                <div style="background: rgba(0, 0, 0, 0.2); border-radius: 6px; padding: 15px; margin-bottom: 15px; position: relative;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                        <span style="font-size: 12px; font-weight: 600; color: rgba(255, 255, 255, 0.9);">
                            ${wisdom.icon} ${element}
                        </span>
                        <span style="font-size: 10px; color: rgba(255, 255, 255, 0.6);">
                            (${wisdom.subtitle})
                        </span>
                        <span class="elemental-tooltip" style="cursor: help; font-size: 11px; color: rgba(0, 255, 204, 0.7);" title="${wisdom.description}">ℹ️</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 10px;">
                        <input
                            type="text"
                            class="face-input"
                            list="${datalistId}"
                            placeholder="KPI name"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="kpiName"
                            style="font-size: 12px;"
                            onchange="autofillElementalKPI(this, ${face.id}, '${element}')"
                        />
                        <datalist id="${datalistId}">
                            ${suggestions.map(s => `<option value="${s.name}" data-unit="${s.unit}" data-min="${s.targetMin}" data-ideal="${s.targetIdeal}">${s.description}</option>`).join('')}
                        </datalist>

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Value"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="value"
                            style="font-size: 12px;"
                            step="any"
                        />

                        <select
                            class="face-input"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="unit"
                            style="cursor: pointer; font-size: 11px;"
                        >
                            ${units.map(u => `<option value="${u.value}">${u.symbol || u.label.substring(0, 8)}</option>`).join('')}
                        </select>

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Min"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="targetMin"
                            style="font-size: 12px;"
                            step="any"
                        />

                        <input
                            type="number"
                            class="face-input"
                            placeholder="Ideal"
                            data-face-id="${face.id}"
                            data-element="${element}"
                            data-field="targetIdeal"
                            style="font-size: 12px;"
                            step="any"
                        />
                    </div>
                </div>
            `;
        });

        html += '</div>';
    });

    html += '</div>';
    return html;
}

/**
 * Complete Step 2: KPI Mapping
 */
function completeStep2() {
    // Collect KPI data from form
    demoState.kpiData = collectKPIData();

    // Validate
    if (!demoState.kpiData || demoState.kpiData.length === 0) {
        alert('Please enter at least one KPI');
        return;
    }

    // Mark completed
    markStepCompleted(2);

    console.log('✅ Step 2 completed:', demoState.kpiData);

    // Go to calculation
    goToStep(3);

    // Auto-run calculation
    runCalculation();
}

/**
 * Autofill KPI suggestion (Quick Mode)
 */
function autofillKPISuggestion(inputElement, faceId) {
    const kpiName = inputElement.value.trim();
    const datalistOptions = inputElement.list?.options;

    console.log(`🔧 Autofill triggered for Face ${faceId}, KPI name: "${kpiName}"`);

    if (!kpiName) {
        console.log(`   ⚠️ No KPI name entered`);
        return;
    }

    if (!datalistOptions) {
        console.log(`   ⚠️ No datalist options found`);
        return;
    }

    // Ensure the input value is set (sometimes datalist doesn't persist)
    inputElement.value = kpiName;
    inputElement.setAttribute('value', kpiName);

    // Find matching option
    let matched = false;
    for (let option of datalistOptions) {
        if (option.value === kpiName) {
            // Autofill unit, min, and ideal if available
            const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);

            faceInputs.forEach(input => {
                const field = input.getAttribute('data-field');

                if (field === 'unit' && option.dataset.unit) {
                    input.value = option.dataset.unit;
                }
                if (field === 'targetMin' && option.dataset.min && !input.value) {
                    input.value = option.dataset.min;
                }
                if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                    input.value = option.dataset.ideal;
                }
            });

            matched = true;
            console.log(`✅ Autofilled KPI: ${kpiName}`);
            break;
        }
    }

    if (!matched) {
        console.log(`   ℹ️ No matching suggestion found (custom KPI: "${kpiName}")`);
    }

    // Trigger live normalization after autofill
    setTimeout(() => calculateLiveNormalization(faceId), 100);
}

/**
 * Autofill elemental KPI suggestion (Full Mode)
 */
function autofillElementalKPI(inputElement, faceId, element) {
    const kpiName = inputElement.value;
    const datalistOptions = inputElement.list?.options;

    if (!datalistOptions) return;

    // Find matching option
    for (let option of datalistOptions) {
        if (option.value === kpiName) {
            // Autofill unit, min, and ideal if available
            const faceInputs = document.querySelectorAll(`[data-face-id="${faceId}"][data-element="${element}"]`);

            faceInputs.forEach(input => {
                const field = input.getAttribute('data-field');

                if (field === 'unit' && option.dataset.unit) {
                    input.value = option.dataset.unit;
                }
                if (field === 'targetMin' && option.dataset.min && !input.value) {
                    input.value = option.dataset.min;
                }
                if (field === 'targetIdeal' && option.dataset.ideal && !input.value) {
                    input.value = option.dataset.ideal;
                }
            });

            console.log(`✅ Autofilled ${element} KPI: ${kpiName}`);
            break;
        }
    }
}

/**
 * Calculate live normalization for a KPI (Quick Mode)
 */
function calculateLiveNormalization(faceId) {
    // Get all inputs for this face
    const inputs = document.querySelectorAll(`[data-face-id="${faceId}"]`);
    const kpiData = {};

    inputs.forEach(input => {
        const field = input.getAttribute('data-field');
        kpiData[field] = input.value;
    });

    // Get values
    const value = parseFloat(kpiData.value);
    const targetMin = parseFloat(kpiData.targetMin);
    const targetIdeal = parseFloat(kpiData.targetIdeal);
    const direction = kpiData.direction || '↑';

    // Show/hide preview
    const previewDiv = document.getElementById(`normalization-preview-${faceId}`);
    const normValueSpan = document.getElementById(`norm-value-${faceId}`);

    // Only show if we have all required values
    if (isNaN(value) || isNaN(targetMin) || isNaN(targetIdeal)) {
        previewDiv.style.display = 'none';
        return;
    }

    // Calculate normalized score based on direction
    let normalized = 0;

    if (direction === '↑') {
        // Higher is better
        normalized = (value - targetMin) / (targetIdeal - targetMin);
    } else if (direction === '↓') {
        // Lower is better
        normalized = (targetMin - value) / (targetMin - targetIdeal);
    } else if (direction === 'Band') {
        // Sweet spot (band target)
        const midpoint = (targetMin + targetIdeal) / 2;
        const range = Math.abs(targetIdeal - targetMin) / 2;
        const distance = Math.abs(value - midpoint);
        normalized = Math.max(0, 1 - (distance / range));
    }

    // Clamp between 0 and 1
    normalized = Math.max(0, Math.min(1, normalized));

    // Display
    const percentage = (normalized * 100).toFixed(1);
    normValueSpan.textContent = `${percentage}%`;

    // Color code
    if (normalized >= 0.7) {
        normValueSpan.style.color = '#00ff88';
    } else if (normalized >= 0.4) {
        normValueSpan.style.color = '#ffcc00';
    } else {
        normValueSpan.style.color = '#ff6666';
    }

    previewDiv.style.display = 'block';
}

/**
 * Collect KPI data from form - ENHANCED with units and default to 0 for empty values
 */
function collectKPIData() {
    const kpis = [];

    console.log('📊 Collecting KPI data...');
    console.log('   Mode:', demoState.kpiMode);
    console.log('   Faces:', demoState.faceConfig.faces.length);

    if (demoState.kpiMode === 'quick') {
        // Collect 12 KPIs (one per face)
        demoState.faceConfig.faces.forEach(face => {
            const inputs = document.querySelectorAll(`[data-face-id="${face.id}"]`);
            const kpiData = {};

            inputs.forEach(input => {
                const field = input.getAttribute('data-field');
                // Check both value and data-current-value (in case of datalist issues)
                const currentValue = input.getAttribute('data-current-value') || input.value;
                kpiData[field] = field === 'kpiName' ? currentValue.trim() : input.value;

                // Debug: Show what we're capturing
                if (field === 'kpiName') {
                    console.log(`      🔍 Input value: "${input.value}", data-current-value: "${input.getAttribute('data-current-value')}"`);
                }
            });

            console.log(`   Face ${face.id} (${face.name}):`, kpiData);

            // Only require kpiName - value defaults to 0 if empty
            if (kpiData.kpiName && kpiData.kpiName.length > 0) {
                const kpiEntry = {
                    faceId: face.id,
                    faceName: face.name,
                    id: `F${face.id}_K1`,
                    name: kpiData.kpiName,
                    value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                    unit: kpiData.unit || 'number',
                    direction: kpiData.direction || '↑',
                    targetMin: parseFloat(kpiData.targetMin) || 0,
                    targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                    element: 'Earth' // Default for quick mode
                };
                kpis.push(kpiEntry);
                console.log(`      ✅ Added KPI:`, kpiEntry);
            } else {
                console.log(`      ⚠️ Skipped (no KPI name entered for this face)`);
            }
        });
    } else {
        // Collect 60 KPIs (5 per face)
        const elements = ['Earth', 'Water', 'Fire', 'Air', 'Ether'];

        demoState.faceConfig.faces.forEach(face => {
            elements.forEach((element, eIndex) => {
                const inputs = document.querySelectorAll(`[data-face-id="${face.id}"][data-element="${element}"]`);
                const kpiData = {};

                inputs.forEach(input => {
                    const field = input.getAttribute('data-field');
                    kpiData[field] = input.value;
                });

                // Only require kpiName - value defaults to 0 if empty
                if (kpiData.kpiName) {
                    const kpiEntry = {
                        faceId: face.id,
                        faceName: face.name,
                        id: `F${face.id}_K${eIndex + 1}`,
                        name: kpiData.kpiName,
                        value: parseFloat(kpiData.value) || 0, // ✅ Default to 0
                        unit: kpiData.unit || 'number',
                        direction: '↑',
                        targetMin: parseFloat(kpiData.targetMin) || 0,
                        targetIdeal: parseFloat(kpiData.targetIdeal) || 100,
                        element: element
                    };
                    kpis.push(kpiEntry);
                    console.log(`      ✅ Added ${element} KPI:`, kpiEntry);
                }
            });
        });
    }

    console.log(`📊 Total KPIs collected: ${kpis.length}`);
    return kpis;
}

/**
 * Run coherence calculation
 */
async function runCalculation() {
    showLoading('Calculating coherence...');

    // Simulate calculation delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        console.log('🔬 Running calculation...');

        // ========================================
        // 🔄 TRANSFORMATION LAYER
        // ========================================
        // Transform UI data to Engine format using DataTransformer
        let companyData;

        if (typeof window.DataTransformer !== 'undefined') {
            console.log('   🔄 Using Data Transformation Layer');

            // Prepare data for transformation
            const demoData = {
                faceConfig: demoState.faceConfig,
                kpiMode: demoState.kpiMode,
                kpiData: demoState.kpiData
            };

            // Validate before transforming
            const validation = window.DataTransformer.validate(demoData);
            console.log('   📋 Validation:', validation);

            if (!validation.valid) {
                throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
            }

            if (validation.warnings.length > 0) {
                console.warn('   ⚠️ Warnings:', validation.warnings);
            }

            // Transform to engine format
            companyData = window.DataTransformer.transform(demoData);
            console.log('   ✅ Data transformed successfully');
        } else {
            console.warn('   ⚠️ DataTransformer not loaded - using raw format');

            // Fallback: Use raw format (may cause issues)
            companyData = {
                name: demoState.faceConfig.templateName,
                kpis: demoState.kpiData
            };
        }

        console.log('   Company name:', companyData.name);
        console.log('   KPIs count:', companyData.kpis.length);
        console.log('   Sample KPI:', companyData.kpis[0]);

        // ========================================
        // 🧮 CALCULATION ENGINE
        // ========================================
        // Check if Quannex engine is loaded
        if (typeof window.quannexEngine !== 'undefined') {
            console.log('   ✅ Using Quannex Engine');

            // Use real engine
            await window.quannexEngine.initializeWithCompany(companyData);
            const engineState = window.quannexEngine.getState();

            console.log('   ✅ Engine calculation complete');

            // Transform results back to UI format
            if (typeof window.DataTransformer !== 'undefined') {
                demoState.coherenceResults = window.DataTransformer.transformResults(engineState);
            } else {
                demoState.coherenceResults = engineState;
            }

            console.log('   ✅ Results ready for display:', demoState.coherenceResults);
        } else {
            console.log('   ⚠️ Quannex Engine not loaded - using fallback calculation');

            // Fallback: Simple calculation (works with UI format)
            demoState.coherenceResults = calculateSimpleCoherence(demoState.kpiData);

            console.log('   ✅ Fallback calculation completed:', demoState.coherenceResults);
        }

        // Display results
        displayCalculationResults();

        hideLoading();
    } catch (error) {
        console.error('❌ Calculation failed:', error);
        console.error('   Error details:', error.message);
        console.error('   Stack:', error.stack);
        hideLoading();
        alert(`Calculation failed: ${error.message}\n\nPlease check console for details.`);
    }
}

/**
 * Simple coherence calculation (fallback)
 */
function calculateSimpleCoherence(kpis) {
    console.log('🧮 Starting simple coherence calculation...');
    console.log('   Input KPIs:', kpis.length);

    const faceEnergies = {};

    // Group KPIs by face
    kpis.forEach(kpi => {
        if (!faceEnergies[kpi.faceId]) {
            faceEnergies[kpi.faceId] = {
                id: kpi.faceId,
                name: kpi.faceName,
                kpis: [],
                energy: 0
            };
        }

        // Normalize KPI based on direction
        let normalized = 0;

        if (kpi.direction === '↑') {
            // Higher is better
            normalized = (kpi.value - kpi.targetMin) / (kpi.targetIdeal - kpi.targetMin);
        } else if (kpi.direction === '↓') {
            // Lower is better
            normalized = (kpi.targetMin - kpi.value) / (kpi.targetMin - kpi.targetIdeal);
        } else if (kpi.direction === 'Band') {
            // Sweet spot (band target)
            const midpoint = (kpi.targetMin + kpi.targetIdeal) / 2;
            const range = Math.abs(kpi.targetIdeal - kpi.targetMin) / 2;
            const distance = Math.abs(kpi.value - midpoint);
            normalized = Math.max(0, 1 - (distance / range));
        }

        const score = Math.max(0, Math.min(1, normalized));

        console.log(`   KPI: ${kpi.name} = ${kpi.value} → ${(score * 100).toFixed(1)}%`);

        faceEnergies[kpi.faceId].kpis.push({
            ...kpi,
            normalizedScore: score
        });
    });

    // Calculate face energies
    Object.values(faceEnergies).forEach(face => {
        if (face.kpis.length > 0) {
            const avgScore = face.kpis.reduce((sum, kpi) => sum + kpi.normalizedScore, 0) / face.kpis.length;
            face.energy = avgScore;
            console.log(`   Face ${face.id} (${face.name}): ${face.kpis.length} KPIs → ${(face.energy * 100).toFixed(1)}%`);
        } else {
            face.energy = 0;
            console.log(`   Face ${face.id} (${face.name}): No KPIs → 0%`);
        }
    });

    // Calculate global coherence
    const faces = Object.values(faceEnergies);
    const globalCoherence = faces.length > 0
        ? faces.reduce((sum, face) => sum + face.energy, 0) / faces.length
        : 0;

    console.log(`🧮 Calculation complete:`);
    console.log(`   Global Coherence: ${(globalCoherence * 100).toFixed(1)}%`);
    console.log(`   Status: ${getCoherenceStatus(globalCoherence)}`);

    return {
        globalCoherence: globalCoherence,
        coherenceStatus: getCoherenceStatus(globalCoherence),
        faces: faces
    };
}

/**
 * Get coherence status label
 */
function getCoherenceStatus(coherence) {
    if (coherence >= 0.9) return 'Radiant';
    if (coherence >= 0.8) return 'Excellent';
    if (coherence >= 0.7) return 'Healthy';
    if (coherence >= 0.6) return 'Moderate';
    if (coherence >= 0.5) return 'Fair';
    if (coherence >= 0.4) return 'Concerning';
    if (coherence >= 0.3) return 'Critical';
    return 'Crisis';
}

/**
 * Display calculation results
 */
function displayCalculationResults() {
    const resultDiv = document.getElementById('calculationResult');
    const scoreDiv = document.getElementById('coherenceScore');

    const coherence = demoState.coherenceResults.globalCoherence;
    const status = demoState.coherenceResults.coherenceStatus;

    scoreDiv.textContent = `Global Coherence: ${(coherence * 100).toFixed(1)}% (${status})`;
    resultDiv.style.display = 'block';

    // Show calculation breakdown
    displayCalculationTransparency();

    // Identify nervous endpoints
    identifyNervousEndpoints();

    // 🔧 FIX: Update sessionStorage immediately after calculation
    // This allows users to recalculate and see updates in already-open 3D views
    updateSessionStorage();
}

/**
 * Update sessionStorage with latest data
 */
function updateSessionStorage() {
    if (demoState.kpiData && demoState.kpiData.length > 0) {
        const customCompanyData = {
            id: 'custom',
            name: 'Custom Analysis',
            description: 'User-generated data from Orchestrator',
            kpis: demoState.kpiData,
            faceConfig: demoState.faceConfig,
            coherenceResults: demoState.coherenceResults,
            isCustomData: true,
            timestamp: new Date().toISOString() // Fresh timestamp on each update
        };

        sessionStorage.setItem('customCompanyData', JSON.stringify(customCompanyData));
        sessionStorage.setItem('selectedCompanyId', 'custom');
        console.log('💾 Updated sessionStorage with latest data (timestamp:', customCompanyData.timestamp, ')');
    }
}

/**
 * Display calculation transparency
 */
function displayCalculationTransparency() {
    const section = document.getElementById('calculationTransparency');

    let html = '<div style="margin-top: 30px;">';
    html += '<h3 style="font-size: 16px; margin-bottom: 20px; color: rgba(255, 255, 255, 0.8);">Calculation Breakdown</h3>';

    demoState.coherenceResults.faces.forEach(face => {
        const energy = face.energy || face.faceEnergy || 0;
        const percentage = (energy * 100).toFixed(1);
        const color = energy >= 0.7 ? '#00ff88' : energy >= 0.4 ? '#ffcc00' : '#ff6666';

        html += `
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 14px; font-weight: 600; color: #fff;">Face ${face.id}: ${face.name}</div>
                        <div style="font-size: 11px; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                            ${face.kpis ? face.kpis.length : 0} KPIs analyzed
                        </div>
                    </div>
                    <div style="font-size: 24px; font-weight: 600; color: ${color};">
                        ${percentage}%
                    </div>
                </div>
                <div style="margin-top: 10px; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: ${color}; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    section.innerHTML = html;
}

/**
 * Complete Step 3: Calculation
 */
function completeStep3() {
    markStepCompleted(3);
    goToStep(4);

    // Initialize Portrait View when entering Step 4
    initializePortraitView();
}

// Portrait View instance holder
let portraitViewInstance = null;

/**
 * Initialize Portrait View with current coherence data
 */
function initializePortraitView() {
    if (!demoState.coherenceResults) {
        console.warn('[PortraitView] No coherence results available');
        return;
    }

    // Wait for PortraitView to be available (it's a module)
    const waitForPortraitView = () => {
        if (typeof window.PortraitView === 'undefined') {
            console.log('[PortraitView] Waiting for module to load...');
            setTimeout(waitForPortraitView, 100);
            return;
        }

        console.log('[PortraitView] Initializing with coherence data');

        // Transform coherence results to Portrait View format
        const portraitData = transformToPortraitData(demoState.coherenceResults);

        // Create or update the Portrait View
        if (!portraitViewInstance) {
            portraitViewInstance = new window.PortraitView('portrait-view-container', {
                size: 380,
                showLabels: true,
                interactive: true
            });
        }

        portraitViewInstance.update(portraitData);
        console.log('[PortraitView] Updated with:', portraitData);
    };

    waitForPortraitView();
}

/**
 * Transform coherence results to Portrait View data format
 */
function transformToPortraitData(coherenceResults) {
    const faces = {};

    // Get face-level octaves if available
    let faceOctavesMap = {};
    if (typeof window.getFaceOctaves === 'function') {
        faceOctavesMap = window.getFaceOctaves();
    }

    // Detect overall octave from face-wizard or default
    let overallOctave = 'O3';
    if (typeof window.getOverallOctave === 'function') {
        overallOctave = window.getOverallOctave() || 'O3';
    } else if (Object.keys(faceOctavesMap).length > 0) {
        // Fallback: get from face octaves map
        const octaveValues = Object.values(faceOctavesMap).map(f => f.octave || 'O3');
        overallOctave = octaveValues[0] || 'O3';
    }

    // Transform each face
    coherenceResults.faces.forEach(face => {
        // Extract elemental breakdown if available
        const elements = extractElementalData(face);

        // Get face-specific octave or fallback to overall
        const faceOctaveInfo = faceOctavesMap[face.id];
        const faceOctave = faceOctaveInfo?.octave || face.targetOctave || overallOctave;

        faces[face.id] = {
            name: face.name || `Face ${face.id}`,
            coherence: face.energy || face.faceEnergy || 0.5,
            targetOctave: faceOctave,
            elements: elements,
            kpis: face.kpis || [],
            warnings: []
        };

        // Add warnings for low coherence
        if (faces[face.id].coherence < 0.382) {
            faces[face.id].warnings.push('Critical: coherence below PHI²');
        } else if (faces[face.id].coherence < 0.5) {
            faces[face.id].warnings.push('Attention needed: developing coherence');
        }
    });

    // Ensure all 12 faces exist
    for (let i = 1; i <= 12; i++) {
        if (!faces[i]) {
            faces[i] = {
                name: getDefaultFaceName(i),
                coherence: 0,
                targetOctave: overallOctave,
                elements: getDefaultElements(),
                kpis: [],
                warnings: ['No data available']
            };
        }
    }

    return {
        overallCoherence: coherenceResults.globalCoherence || 0.5,
        octave: overallOctave,
        faces: faces
    };
}

/**
 * Extract elemental breakdown from face data
 */
function extractElementalData(face) {
    // If face has explicit elemental data, use it
    if (face.elements) return face.elements;

    // Otherwise, derive from KPIs if they have element tags
    const elements = {
        earth: { value: 0.5, label: 'Foundation' },
        water: { value: 0.5, label: 'Flow' },
        fire: { value: 0.5, label: 'Energy' },
        air: { value: 0.5, label: 'Communication' },
        ether: { value: 0.5, label: 'Purpose' }
    };

    if (face.kpis && face.kpis.length > 0) {
        // Try to extract from elemental KPIs (Full Mode)
        const elementalKpis = {
            earth: face.kpis.filter(k => k.element === 'earth' || k.element === 'Earth'),
            water: face.kpis.filter(k => k.element === 'water' || k.element === 'Water'),
            fire: face.kpis.filter(k => k.element === 'fire' || k.element === 'Fire'),
            air: face.kpis.filter(k => k.element === 'air' || k.element === 'Air'),
            ether: face.kpis.filter(k => k.element === 'ether' || k.element === 'Ether')
        };

        Object.keys(elementalKpis).forEach(element => {
            const kpis = elementalKpis[element];
            if (kpis.length > 0) {
                const avgScore = kpis.reduce((sum, k) => sum + (k.normalizedScore || 0.5), 0) / kpis.length;
                elements[element] = {
                    value: avgScore,
                    label: kpis[0]?.label || kpis[0]?.name || element
                };
            }
        });
    }

    return elements;
}

/**
 * Get default elements structure
 */
function getDefaultElements() {
    return {
        earth: { value: 0, label: 'Foundation' },
        water: { value: 0, label: 'Flow' },
        fire: { value: 0, label: 'Energy' },
        air: { value: 0, label: 'Communication' },
        ether: { value: 0, label: 'Purpose' }
    };
}

/**
 * Get default face name
 */
function getDefaultFaceName(faceId) {
    const defaultNames = {
        1: 'Financial Capital',
        2: 'Intellectual Capital',
        3: 'Human Capital',
        4: 'Structural Capital',
        5: 'Market Resonance',
        6: 'Community & Partners',
        7: 'Brand & Reputation',
        8: 'Core Operations',
        9: 'Regenerative Flow',
        10: 'Foundational Values',
        11: 'Funding Pipeline',
        12: 'Risk & Resilience'
    };
    return defaultNames[faceId] || `Face ${faceId}`;
}

/**
 * Identify nervous endpoints
 */
function identifyNervousEndpoints() {
    const section = document.getElementById('nervousEndpoints');

    // Find faces with energy < 0.5 or missing data
    // We check all 12 faces to ensure structural gaps are caught
    const allFaceIds = Array.from({ length: 12 }, (_, i) => i + 1);
    const criticalFaces = [];

    allFaceIds.forEach(id => {
        const face = demoState.coherenceResults.faces.find(f => f.id === id);
        const energy = face ? (face.energy || face.faceEnergy || 0) : 0;
        const kpiCount = face && face.kpis ? face.kpis.length : 0;

        // Critical if energy is low OR if no data present (Structural Immaturity)
        if (energy < 0.5) {
            criticalFaces.push({
                id: id,
                name: face ? face.name : `Face ${id}`,
                energy: energy,
                reason: kpiCount === 0 ? "Structural Immaturity (No Data)" : "Low Coherence"
            });
        }
    });

    criticalFaces.sort((a, b) => a.energy - b.energy);

    if (criticalFaces.length === 0) {
        section.innerHTML = '<p style="color: rgba(255, 255, 255, 0.6); text-align: center;">✅ No critical issues detected. All faces are healthy!</p>';
        return;
    }

    let html = '<div style="display: grid; gap: 15px;">';

    criticalFaces.forEach(face => {
        const percentage = (face.energy * 100).toFixed(1);
        // Red for critical, Orange for warning
        const color = face.energy < 0.3 ? '#ff6666' : '#ffcc00';

        html += `
            <div style="background: rgba(255, 100, 100, 0.1); border-left: 3px solid ${color}; padding: 12px; border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff; font-weight: 600;">Face ${face.id}: ${face.name}</span>
                    <span style="color: ${color}; font-weight: bold;">${percentage}%</span>
                </div>
                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">
                    ⚠️ ${face.reason}
                </div>
            </div>
        `;
    });

    html += '</div>';
    section.innerHTML = html;
}

/**
 * Launch visualization view with custom data
 */
function launchView(viewName) {
    const viewUrls = {
        'dodecahedron': 'dodecahedron-3d.html',
        'calculations': 'calculations.html',
        'breath': 'breath-analysis.html',
        'dna': 'octave-dna.html',
        'simulator': 'simulator.html'
    };

    // 🔧 Always update sessionStorage before launching (ensure fresh data)
    updateSessionStorage();

    const url = viewUrls[viewName];
    if (url) {
        window.open(url, '_blank');
        console.log(`🚀 Launched view: ${viewName}`);
    }
}

/**
 * Export report
 */
function exportReport() {
    alert('PDF export feature coming soon!\n\nFor now, you can:\n• Screenshot the visualizations\n• Save the configuration JSON\n• Copy the coherence data');
}

function saveConfiguration() {
    const fullConfig = {
        faceConfig: demoState.faceConfig,
        kpiMode: demoState.kpiMode,
        kpiData: demoState.kpiData,
        coherenceResults: demoState.coherenceResults,
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `quannex-demo-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log('✅ Configuration saved');
}

/**
 * Start over
 */
function startOver() {
    if (confirm('Start a new analysis? This will clear all current data.')) {
        location.reload();
    }
}

/**
 * Show help
 */
function showHelp() {
    window.open('DEMO_GUIDE.md', '_blank');
}

/**
 * Show loading overlay
 */
function showLoading(message = 'Processing...') {
    document.getElementById('loadingText').textContent = message;
    document.getElementById('loadingOverlay').classList.add('active');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Expose to window
window.goToStep = goToStep;
window.completeStep1 = completeStep1;
window.selectMode = selectMode;
window.completeStep2 = completeStep2;
window.completeStep3 = completeStep3;
window.launchView = launchView;
window.exportReport = exportReport;
window.saveConfiguration = saveConfiguration;
window.startOver = startOver;
window.showHelp = showHelp;
window.autofillKPISuggestion = autofillKPISuggestion;
window.autofillElementalKPI = autofillElementalKPI;
window.calculateLiveNormalization = calculateLiveNormalization;
// Sprint 2: Validation gate modal functions
window.showValidationBlockDialog = showValidationBlockDialog;
window.closeValidationModal = closeValidationModal;
window.applyDefaultsAndProceed = applyDefaultsAndProceed;
window.focusOnIncompleteFace = focusOnIncompleteFace;

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeDemo);

console.log('✅ Demo Orchestrator Logic loaded');
