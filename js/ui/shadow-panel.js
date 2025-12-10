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
     * Update the panel with new shadow analysis
     * @param {Array} shadows - Array of shadow objects from ShadowDetector
     */
    update(shadows) {
        if (!shadows || !Array.isArray(shadows)) return;

        // Clear if empty
        if (shadows.length === 0) {
            this.container.innerHTML = '';
            this.activeShadows.clear();
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
    }

    /**
     * Sprint 4 Task 27: Create shadow card with dual-form toggle
     * Shows both suppressed (shadow) and integrated (gift) perspectives
     */
    createShadowCard(shadow) {
        const card = document.createElement('div');
        card.className = `shadow-card severity-${(shadow.severity || 'moderate').toLowerCase()}`;
        card.setAttribute('data-shadow-id', shadow.id || shadow.name);

        // ACCESSIBILITY: ARIA attributes for screen readers
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Shadow pattern: ${shadow.name || 'Unknown'}, severity: ${shadow.severity || 'moderate'}`);
        card.setAttribute('tabindex', '0');  // Make focusable for keyboard navigation

        // Icon based on severity
        const severityLower = (shadow.severity || 'moderate').toLowerCase();
        const icon = severityLower === 'critical' || severityLower === 'high' ? '⚠️' : '👁️';

        // Extract suppressed and integrated forms (from mapping-context pattern)
        const suppressedForm = shadow.suppressed || shadow.description || 'Shadow pattern detected';
        const integratedForm = shadow.integrated || shadow.gift || 'Integrated wisdom awaits discovery';
        const prescription = shadow.prescription || shadow.recommendation || '';

        card.innerHTML = `
            <div class="shadow-header">
                <span class="shadow-icon">${icon}</span>
                <span class="shadow-title">${shadow.name || 'Unknown Pattern'}</span>
                <button class="toggle-perspective" title="See the Gift">🔄 See Gift</button>
            </div>

            <div class="shadow-suppressed active">
                <div class="shadow-label">The Shadow:</div>
                <div class="shadow-message">${suppressedForm}</div>
            </div>

            <div class="shadow-integrated">
                <div class="shadow-label" style="color: #66ff99;">💡 The Gift:</div>
                <div class="shadow-message" style="color: rgba(102, 255, 153, 0.9);">${integratedForm}</div>
            </div>

            ${prescription ? `
                <div class="shadow-prescription">
                    <span style="color: #00ffcc; font-weight: 600;">Rx:</span> ${prescription}
                </div>
            ` : ''}

            <div class="shadow-meta">
                ${shadow.faceId ? `<span class="shadow-location">Face ${shadow.faceId}</span>` : ''}
                ${shadow.involvedFaces ? `<span class="shadow-location">Faces: ${shadow.involvedFaces.join(', ')}</span>` : ''}
                ${shadow.score ? `<span class="shadow-score">Intensity: ${(shadow.score * 100).toFixed(0)}%</span>` : ''}
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

        // Click interaction to focus on 3D face
        card.addEventListener('click', () => {
            this.focusOnShadow(shadow);
        });

        // ACCESSIBILITY: Keyboard support for card (Enter/Space to focus on face)
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                // Don't trigger if toggle button is focused
                if (e.target !== toggleBtn) {
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
