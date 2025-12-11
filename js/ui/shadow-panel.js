/**
 * ShadowPanel - The Conscience of the Organization
 *
 * Displays "Shadow Alerts" - hidden patterns, hypocrisies, and systemic risks.
 * Located in the bottom-right, distinct from the main dashboard.
 *
 * Design Philosophy:
 * - "Dark Mode" aesthetic (Red/Black)
 * - Slide-in animations for new alerts
 * - Interactive: Clicking an alert rotates the camera to the affected area
 * - Phase 3 Enhancement: Expandable details with logic, faces, prescription
 *
 * @version 2.1 - Enhanced UI with expandable details
 */

export class ShadowPanel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`ShadowPanel container '${containerId}' not found. Creating one.`);
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.className = 'shadow-panel-container';
            document.body.appendChild(this.container);
        }

        this.activeShadows = new Set();
    }

    /**
     * Get face name from MappingContext or Quannex state
     * @param {number} faceId - Face ID
     * @returns {string} Face name or fallback
     */
    getFaceName(faceId) {
        // Try MappingContext first
        if (window.MappingContext) {
            try {
                const ctx = window.MappingContext.getInstance();
                const face = ctx.getFace?.(faceId);
                if (face?.customName || face?.name) {
                    return face.customName || face.name;
                }
            } catch (e) { /* MappingContext not ready */ }
        }

        // Try Quannex state
        if (window.Quannex) {
            try {
                const state = window.Quannex.getState();
                const face = state?.faces?.find(f => f.id === faceId);
                if (face?.customName || face?.name || face?.baseName) {
                    return face.customName || face.name || face.baseName;
                }
            } catch (e) { /* Quannex not ready */ }
        }

        // Fallback to default face names
        const defaultFaceNames = {
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

        return defaultFaceNames[faceId] || `Face ${faceId}`;
    }

    /**
     * Update the panel with new shadow analysis
     * @param {Array} shadows - Array of shadow objects from ShadowDetector
     */
    update(shadows) {
        if (!shadows || !Array.isArray(shadows)) return;

        // Clear if empty
        if (shadows.length === 0) {
            this.container.innerHTML = '';
            this.activeShadows.clear();
            // Still show AI option for empty state if in manual mode
            this.renderAIEnhanceOption();
            return;
        }

        // Check for new shadows to animate
        const currentIds = new Set(shadows.map(s => s.name + s.faceId)); // Simple unique key

        // Render
        this.container.innerHTML = ''; // Simple re-render for now (can optimize later)

        shadows.forEach(shadow => {
            const card = this.createShadowCard(shadow);
            this.container.appendChild(card);

            // Add to active set
            this.activeShadows.add(shadow.name + shadow.faceId);
        });

        // Phase 5: Add AI enhance option for manual mode users
        this.renderAIEnhanceOption();
    }

    /**
     * Phase 5: Render AI enhancement option for manual mode users
     * Only shows if user chose manual setup path (not AI-assisted)
     */
    renderAIEnhanceOption() {
        // Check setup mode from session storage
        const setupMode = sessionStorage.getItem('quannex-setup-mode') || 'manual';

        // Only show for manual users
        if (setupMode !== 'manual') return;

        // Check if AI adapter is available
        if (!window.AIShadowAdapter) {
            console.log('[ShadowPanel] AI shadow adapter not available');
            return;
        }

        // Create the AI enhance section
        const aiSection = document.createElement('div');
        aiSection.className = 'shadow-ai-enhance';
        aiSection.innerHTML = `
            <div class="ai-enhance-divider"></div>
            <p class="ai-enhance-prompt">Want deeper AI-generated insights?</p>
            <button class="ai-enhance-btn" id="generateAIShadows">
                ✨ Generate AI Analysis
            </button>
        `;

        this.container.appendChild(aiSection);
        this.setupAIEnhanceButton();
    }

    /**
     * Phase 5: Setup AI enhancement button handler
     */
    setupAIEnhanceButton() {
        const btn = document.getElementById('generateAIShadows');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            btn.disabled = true;
            btn.textContent = '🔄 Analyzing...';

            try {
                // Get current state
                const state = window.Quannex?.getState?.();
                if (!state || !state.faces) {
                    throw new Error('No face data available');
                }

                // Create AI adapter instance
                const AIShadowAdapter = window.AIShadowAdapter;
                const aiAdapter = new AIShadowAdapter();

                // Generate AI shadows
                const aiShadows = await aiAdapter.generateAIShadowPatterns(
                    state.faces,
                    { companyName: state.companyName || 'Organization', context: state }
                );

                if (aiShadows && aiShadows.length > 0) {
                    // Update panel with AI shadows
                    this.update(aiShadows);

                    // Replace AI button with success message
                    const aiSection = btn.closest('.shadow-ai-enhance');
                    if (aiSection) {
                        aiSection.innerHTML = '<p class="ai-enhance-success">✅ AI insights generated</p>';
                    }

                    console.log(`[ShadowPanel] ✨ Generated ${aiShadows.length} AI shadow insights`);
                } else {
                    btn.textContent = '✅ No additional shadows found';
                    btn.disabled = true;
                }
            } catch (e) {
                console.warn('[ShadowPanel] AI generation failed:', e);
                btn.textContent = '❌ AI unavailable';
                btn.disabled = true;
            }
        });
    }

    /**
     * Sprint 4 Task 27: Create shadow card with dual-form toggle
     * Shows both suppressed (shadow) and integrated (gift) perspectives
     * Phase 3 Enhanced: Expandable details, face chips, severity badge, penalty display
     */
    createShadowCard(shadow) {
        const card = document.createElement('div');
        // Using shadow-card-mini to avoid CSS conflict with shadow-overlay.css
        card.className = `shadow-card-mini severity-${(shadow.severity || 'moderate').toLowerCase()}`;
        card.setAttribute('data-shadow-id', shadow.id || shadow.name);

        // ACCESSIBILITY: ARIA attributes for screen readers
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Shadow pattern: ${shadow.name || 'Unknown'}, severity: ${shadow.severity || 'moderate'}`);
        card.setAttribute('tabindex', '0');  // Make focusable for keyboard navigation

        // Icon based on severity
        const severityLower = (shadow.severity || 'moderate').toLowerCase();
        const icon = severityLower === 'critical' || severityLower === 'high' ? '⚠️' : '👁️';

        // Severity badge color
        const severityColors = {
            critical: '#ff4444',
            high: '#ff8c00',
            moderate: '#ffcc00',
            low: '#88cc88'
        };
        const severityColor = severityColors[severityLower] || severityColors.moderate;

        // Extract suppressed and integrated forms (from mapping-context pattern)
        const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
        const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
        const prescription = shadow.prescription || shadow.recommendation || '';
        const logic = shadow.logic || '';

        // Build face chips HTML
        const involvedFaces = shadow.involvedFaces || (shadow.faceId ? [shadow.faceId] : []);
        const faceChipsHtml = involvedFaces.map(faceId => {
            const faceName = this.getFaceName(faceId);
            return `<span class="face-chip" data-face-id="${faceId}" title="Face ${faceId}: ${faceName}">${faceName}</span>`;
        }).join('');

        // Penalty display
        const penaltyHtml = shadow.penalty ?
            `<span class="shadow-penalty">Impact: -${(shadow.penalty * 100).toFixed(0)}%</span>` : '';

        card.innerHTML = `
            <div class="shadow-header">
                <span class="shadow-icon">${icon}</span>
                <span class="shadow-title">${shadow.name || 'Unknown Pattern'}</span>
                <span class="shadow-severity-badge" style="background: ${severityColor};">${shadow.severity || 'moderate'}</span>
                <button class="toggle-perspective" title="See the Gift">🔄 Gift</button>
                <button class="toggle-details" title="Show Details" aria-expanded="false">▼</button>
            </div>

            <div class="shadow-suppressed active">
                <div class="shadow-label">The Shadow:</div>
                <div class="shadow-message">${suppressedForm}</div>
            </div>

            <div class="shadow-integrated">
                <div class="shadow-label" style="color: #66ff99;">💡 The Gift:</div>
                <div class="shadow-message" style="color: rgba(102, 255, 153, 0.9);">${integratedForm}</div>
            </div>

            <div class="shadow-details">
                ${logic ? `
                    <div class="shadow-detail-section">
                        <span class="detail-label">🔍 Logic:</span>
                        <span class="detail-value">${logic}</span>
                    </div>
                ` : ''}

                ${involvedFaces.length > 0 ? `
                    <div class="shadow-detail-section">
                        <span class="detail-label">📍 Impacted Faces:</span>
                        <div class="face-chips">${faceChipsHtml}</div>
                    </div>
                ` : ''}

                ${prescription ? `
                    <div class="shadow-detail-section shadow-prescription-detail">
                        <span class="detail-label">💊 Prescription:</span>
                        <span class="detail-value prescription-text">${prescription}</span>
                    </div>
                ` : ''}

                ${shadow.score || shadow.penalty ? `
                    <div class="shadow-detail-section shadow-metrics">
                        ${shadow.score ? `<span class="shadow-intensity">Intensity: ${(shadow.score * 100).toFixed(0)}%</span>` : ''}
                        ${penaltyHtml}
                    </div>
                ` : ''}
            </div>

            <div class="shadow-meta">
                ${shadow.source ? `<span class="shadow-source">${shadow.source === 'ai' ? '🤖 AI' : '📊 Pattern'}</span>` : ''}
                ${shadow.score ? `<span class="shadow-score-mini">${(shadow.score * 100).toFixed(0)}%</span>` : ''}
            </div>
        `;

        // Toggle button functionality
        const toggleBtn = card.querySelector('.toggle-perspective');
        const suppressedDiv = card.querySelector('.shadow-suppressed');
        const integratedDiv = card.querySelector('.shadow-integrated');

        // ACCESSIBILITY: Toggle button attributes
        toggleBtn.setAttribute('aria-pressed', 'false');
        toggleBtn.setAttribute('aria-label', `Toggle between shadow and gift perspectives for ${shadow.name || 'this pattern'}`);

        const performToggle = () => {
            const isShowingShadow = suppressedDiv.classList.contains('active');

            if (isShowingShadow) {
                suppressedDiv.classList.remove('active');
                integratedDiv.classList.add('active');
                toggleBtn.textContent = '🔄 See Shadow';
                toggleBtn.setAttribute('aria-pressed', 'true');
                card.classList.add('showing-gift');
            } else {
                integratedDiv.classList.remove('active');
                suppressedDiv.classList.add('active');
                toggleBtn.textContent = '🔄 See Gift';
                toggleBtn.setAttribute('aria-pressed', 'false');
                card.classList.remove('showing-gift');
            }
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            performToggle();
        });

        // ACCESSIBILITY: Keyboard support for toggle button
        toggleBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                performToggle();
            }
        });

        // Toggle details functionality (expandable section)
        const detailsBtn = card.querySelector('.toggle-details');
        const detailsDiv = card.querySelector('.shadow-details');

        if (detailsBtn && detailsDiv) {
            // ACCESSIBILITY: Details button attributes
            detailsBtn.setAttribute('aria-label', `Expand details for ${shadow.name || 'this pattern'}`);

            const performDetailsToggle = () => {
                const isExpanded = detailsDiv.classList.contains('expanded');

                if (isExpanded) {
                    detailsDiv.classList.remove('expanded');
                    detailsBtn.textContent = '▼';
                    detailsBtn.setAttribute('aria-expanded', 'false');
                    detailsBtn.setAttribute('title', 'Show Details');
                } else {
                    detailsDiv.classList.add('expanded');
                    detailsBtn.textContent = '▲';
                    detailsBtn.setAttribute('aria-expanded', 'true');
                    detailsBtn.setAttribute('title', 'Hide Details');
                }
            };

            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                performDetailsToggle();
            });

            // ACCESSIBILITY: Keyboard support for details button
            detailsBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    performDetailsToggle();
                }
            });
        }

        // Face chip click handlers - focus on that specific face
        const faceChips = card.querySelectorAll('.face-chip');
        faceChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                e.stopPropagation();
                const faceId = parseInt(chip.getAttribute('data-face-id'), 10);
                if (faceId) {
                    const event = new CustomEvent('focus-face', { detail: { faceId } });
                    window.dispatchEvent(event);
                }
            });
        });

        // Click interaction to focus on 3D face
        card.addEventListener('click', () => {
            this.focusOnShadow(shadow);
        });

        // ACCESSIBILITY: Keyboard support for card (Enter/Space to focus on face)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                // Don't trigger if toggle buttons are focused
                if (e.target !== toggleBtn && e.target !== detailsBtn) {
                    e.preventDefault();
                    this.focusOnShadow(shadow);
                }
            }
        });

        return card;
    }

    focusOnShadow(shadow) {
        console.log(`Focusing on shadow: ${shadow.name} at Face ${shadow.faceId}`);

        // Rotate camera to face
        if (window.dodecahedronViz && window.dodecahedronViz.camera) {
            // We need a helper to rotate to face. 
            // dodecahedron-viz.js has 'rotateToFace' but it might not be exposed directly.
            // But we have 'faceMeshes'.

            // Dispatch event for the main viz to handle
            const event = new CustomEvent('focus-face', { detail: { faceId: shadow.faceId } });
            window.dispatchEvent(event);
        }
    }
}
