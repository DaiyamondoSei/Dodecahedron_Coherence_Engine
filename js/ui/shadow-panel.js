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

    createShadowCard(shadow) {
        const card = document.createElement('div');
        card.className = `shadow-card severity-${shadow.severity.toLowerCase()}`;

        // Icon based on severity
        const icon = shadow.severity === 'High' ? '⚠️' : '👁️';

        card.innerHTML = `
            <div class="shadow-header">
                <span class="shadow-icon">${icon}</span>
                <span class="shadow-title">${shadow.name}</span>
            </div>
            <div class="shadow-message">${shadow.description}</div>
            <div class="shadow-meta">
                <span class="shadow-location">Face ${shadow.faceId}</span>
                <span class="shadow-score">Intensity: ${(shadow.score * 100).toFixed(0)}%</span>
            </div>
        `;

        // Click interaction
        card.addEventListener('click', () => {
            this.focusOnShadow(shadow);
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
