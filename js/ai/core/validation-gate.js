/**
 * ========================================
 * VALIDATION GATE - Empowering Progress
 * ========================================
 *
 * Validates mapping completion with empowering messaging.
 * Uses heart-coherent language that invites expansion rather than blocking.
 *
 * Empowering Messaging (from Solar Chakra Master):
 * Instead of blocking: "Error: Face 3 incomplete. Cannot proceed."
 * Use inviting expansion: "Eleven faces are singing - one more joins the chorus."
 *
 * @module ValidationGate
 * @version Sprint 2 - Task 15
 */

import { MappingContext } from './mapping-context.js';

// PHI-derived completion thresholds
const COMPLETION_THRESHOLDS = {
    MINIMAL: 0.236,     // 3 faces (baseline)
    PARTIAL: 0.5,       // 6 faces (halfway)
    SUBSTANTIAL: 0.618, // 7-8 faces (golden ratio)
    NEAR_COMPLETE: 0.764, // 9 faces (mastery threshold)
    COMPLETE: 1.0       // 12 faces (full coherence)
};

// Empowering messages for different completion states
const EMPOWERING_MESSAGES = {
    empty: {
        title: 'The Canvas Awaits',
        message: 'Twelve faces wait to tell your story. Each one a window into a different dimension of your organization.',
        cta: 'Begin the Journey',
        icon: '✨'
    },
    starting: {
        title: 'The First Light',
        message: 'You have begun naming your faces. Each name brings clarity to your organizational mirror.',
        encouragement: 'Keep going - momentum is building.',
        icon: '🌅'
    },
    partial: {
        title: 'Gathering Strength',
        message: '{completed} faces are now visible. {remaining} more await discovery.',
        encouragement: 'You are past the halfway point - the pattern is emerging.',
        icon: '🌤️'
    },
    substantial: {
        title: 'The Pattern Emerges',
        message: 'With {completed} faces named, your organizational portrait is taking shape.',
        encouragement: 'Only {remaining} more to complete the picture.',
        icon: '🌈'
    },
    nearComplete: {
        title: 'Almost There',
        message: '{completed} of 12 faces are singing - {remaining} more {verb} the chorus.',
        encouragement: 'You can feel the coherence building.',
        icon: '🎵'
    },
    complete: {
        title: 'Full Coherence',
        message: 'All twelve faces are named and visible. Your organizational dodecahedron is complete.',
        celebration: 'The mirror is ready to reflect your truth.',
        icon: '💎'
    }
};

// Individual face encouragement templates
const FACE_ENCOURAGEMENTS = [
    'This domain holds hidden potential.',
    'What would you name the heart of this area?',
    'This face is ready to reveal itself.',
    'Consider what energy flows through here.',
    'This domain shapes how you move forward.'
];

/**
 * ValidationGate - Validates completion with empowering feedback
 */
class ValidationGate {
    constructor(options = {}) {
        this.context = MappingContext.getInstance();
        this.onValidationChange = options.onValidationChange || (() => {});
        this._lastValidation = null;

        // Subscribe to context changes
        this._unsubscribe = this.context.subscribe((event) => {
            if (['FACE_NAMED', 'ALL_FACES_UPDATED', 'FACE_UPDATED'].includes(event.type)) {
                this._validate();
            }
        });
    }

    // ========================================
    // VALIDATION
    // ========================================

    /**
     * Perform validation and generate empowering feedback
     */
    _validate() {
        const state = this.context.getValidationState();
        const { completedFaces, invalidFaces, errors } = state;

        const percentage = completedFaces / 12;
        const stage = this._getCompletionStage(percentage);
        const message = this._generateMessage(stage, completedFaces, 12 - completedFaces);

        this._lastValidation = {
            isComplete: state.isComplete,
            completedFaces,
            remainingFaces: 12 - completedFaces,
            invalidFaceIds: invalidFaces,
            percentage: Math.round(percentage * 100),
            stage,
            message,
            faceGuidance: this._generateFaceGuidance(invalidFaces),
            errors,
            timestamp: Date.now()
        };

        this.onValidationChange(this._lastValidation);
        return this._lastValidation;
    }

    /**
     * Get completion stage based on percentage
     */
    _getCompletionStage(percentage) {
        if (percentage === 0) return 'empty';
        if (percentage < COMPLETION_THRESHOLDS.MINIMAL) return 'starting';
        if (percentage < COMPLETION_THRESHOLDS.PARTIAL) return 'partial';
        if (percentage < COMPLETION_THRESHOLDS.SUBSTANTIAL) return 'partial';
        if (percentage < COMPLETION_THRESHOLDS.NEAR_COMPLETE) return 'substantial';
        if (percentage < COMPLETION_THRESHOLDS.COMPLETE) return 'nearComplete';
        return 'complete';
    }

    /**
     * Generate empowering message for current state
     */
    _generateMessage(stage, completed, remaining) {
        const template = EMPOWERING_MESSAGES[stage];
        if (!template) return { title: 'Keep Going', message: '' };

        const verb = remaining === 1 ? 'joins' : 'join';

        return {
            title: template.title,
            message: template.message
                .replace('{completed}', completed)
                .replace('{remaining}', remaining)
                .replace('{verb}', verb),
            encouragement: template.encouragement
                ?.replace('{completed}', completed)
                .replace('{remaining}', remaining),
            cta: template.cta,
            celebration: template.celebration,
            icon: template.icon
        };
    }

    /**
     * Generate guidance for incomplete faces
     */
    _generateFaceGuidance(invalidFaceIds) {
        return invalidFaceIds.map((faceId, index) => {
            const face = this.context.getFace(faceId);
            const encouragement = FACE_ENCOURAGEMENTS[index % FACE_ENCOURAGEMENTS.length];

            return {
                faceId,
                currentName: face?.name || `Face ${faceId}`,
                isDefault: face?.source === 'default',
                encouragement,
                breathAxis: this.context.getBreathAxisForFace(faceId)
            };
        });
    }

    // ========================================
    // PUBLIC API
    // ========================================

    /**
     * Get current validation state
     */
    validate() {
        return this._validate();
    }

    /**
     * Check if mapping can proceed (with warnings)
     */
    canProceed() {
        const validation = this._lastValidation || this._validate();

        return {
            canProceed: validation.completedFaces >= 12, // Full dodecahedron required for coherence
            isComplete: validation.isComplete,
            warning: validation.completedFaces < 12
                ? `${validation.remainingFaces} face${validation.remainingFaces > 1 ? 's' : ''} still need naming`
                : null
        };
    }

    /**
     * Get progress data for UI
     */
    getProgress() {
        const validation = this._lastValidation || this._validate();

        return {
            completed: validation.completedFaces,
            total: 12,
            percentage: validation.percentage,
            stage: validation.stage,
            isComplete: validation.isComplete
        };
    }

    /**
     * Get encouraging message for current state
     */
    getMessage() {
        const validation = this._lastValidation || this._validate();
        return validation.message;
    }

    /**
     * Get guidance for next steps
     */
    getGuidance() {
        const validation = this._lastValidation || this._validate();

        if (validation.isComplete) {
            return {
                status: 'complete',
                message: 'Your mapping is complete. Ready to explore the analysis.',
                nextStep: 'View Analysis'
            };
        }

        const nextFace = validation.faceGuidance[0];
        return {
            status: 'incomplete',
            message: `Consider naming Face ${nextFace?.faceId}: ${nextFace?.currentName}`,
            encouragement: nextFace?.encouragement,
            nextStep: 'Complete Face'
        };
    }

    /**
     * Get visual state for progress indicators
     */
    getVisualState() {
        const validation = this._lastValidation || this._validate();

        // Generate state for each face
        const faceStates = [];
        for (let i = 1; i <= 12; i++) {
            const face = this.context.getFace(i);
            const isComplete = face?.isComplete || false;

            faceStates.push({
                faceId: i,
                isComplete,
                state: isComplete ? 'complete' : 'pending',
                glowIntensity: isComplete ? 1.0 : 0.3,
                pulseRate: isComplete ? 0 : 1 // Pending faces pulse
            });
        }

        return {
            faceStates,
            overallGlow: validation.percentage / 100,
            stage: validation.stage,
            icon: validation.message.icon
        };
    }

    // ========================================
    // DIALOG HELPERS
    // ========================================

    /**
     * Get dialog content for incomplete mapping
     */
    getIncompleteDialog() {
        const validation = this._lastValidation || this._validate();

        if (validation.isComplete) {
            return null;
        }

        return {
            title: validation.message.title,
            body: validation.message.message,
            encouragement: validation.message.encouragement,
            icon: validation.message.icon,
            options: [
                { id: 'complete', label: 'Complete Mapping', primary: true },
                { id: 'defaults', label: 'Use Defaults', secondary: true },
                { id: 'later', label: 'Remind Me Later', tertiary: true }
            ],
            incompleteFaces: validation.faceGuidance
        };
    }

    /**
     * Apply default names to remaining faces
     */
    applyDefaults() {
        const validation = this._lastValidation || this._validate();

        validation.invalidFaceIds.forEach(faceId => {
            const defaults = this.context._faces.get(faceId);
            // Face already has default - mark as intentionally using default
            this.context.updateFace(faceId, {
                source: 'default-accepted',
                validated: true
            });
        });

        return this._validate();
    }

    // ========================================
    // CLEANUP
    // ========================================

    /**
     * Cleanup subscriptions
     */
    destroy() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
}

// ========================================
// EXPORTS
// ========================================

export {
    ValidationGate,
    COMPLETION_THRESHOLDS,
    EMPOWERING_MESSAGES
};

// Export for browser global
if (typeof window !== 'undefined') {
    window.ValidationGate = ValidationGate;
}
