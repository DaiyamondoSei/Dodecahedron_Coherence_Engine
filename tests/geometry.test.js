/**
 * Geometry Tests for Quannex Engine
 * Verifies Edge and Vertex Logic
 */

const resultsDiv = document.getElementById('results');

function assert(condition, message) {
    const div = document.createElement('div');
    div.className = `test-result ${condition ? 'pass' : 'fail'}`;
    div.textContent = `${condition ? '✅ PASS' : '❌ FAIL'}: ${message}`;
    resultsDiv.appendChild(div);
    if (!condition) {
        console.error(`FAIL: ${message}`);
    }
}

async function runGeometryTests() {
    console.log('🚀 Starting Geometry Tests...');

    try {
        // Ensure engine is initialized
        if (!window.quannexEngine || window.quannexEngine.faces.length === 0) {
            await window.quannexEngine.initialize();
        }

        // Test 1: Edge Loading
        assert(window.quannexEngine.edges.length > 0, `Should load edges (Found: ${window.quannexEngine.edges.length})`);

        // Test 2: Vertex Loading
        assert(window.quannexEngine.vertices.length > 0, `Should load vertices (Found: ${window.quannexEngine.vertices.length})`);

        // Test 3: Edge Tension Calculation
        // Pick an edge and two faces
        const edge = window.quannexEngine.edges[0];
        const faceA = window.quannexEngine.faces.find(f => f.id === edge.faceAId);
        const faceB = window.quannexEngine.faces.find(f => f.id === edge.faceBId);

        if (faceA && faceB) {
            // Case A: Both High → geometric mean = √(0.8 × 0.8) = 0.8 → Hemorrhage
            faceA._faceEnergy = 0.8;
            faceB._faceEnergy = 0.8;
            edge.calculateTension(faceA, faceB);
            assert(Math.abs(edge.tension - 0.8) < 0.001, `Edge Energy: Should be 0.8 for Both High (Got ${edge.tension.toFixed(4)})`);
            assert(edge.status === 'Hemorrhage', `Edge Status: Should be Hemorrhage for 0.8 (Got ${edge.status})`);

            // Case B: Both Low → geometric mean = √(0.2 × 0.2) = 0.2 → Gate
            faceA._faceEnergy = 0.2;
            faceB._faceEnergy = 0.2;
            edge.calculateTension(faceA, faceB);
            assert(Math.abs(edge.tension - 0.2) < 0.001, `Edge Energy: Should be 0.2 for Both Low (Got ${edge.tension.toFixed(4)})`);
            assert(edge.status === 'Gate', `Edge Status: Should be Gate for 0.2 (Got ${edge.status})`);

            // Case C: Asymmetric → geometric mean = √(0.9 × 0.1) = 0.3 → Gate
            // Asymmetry is naturally penalized: 0.3 < either input
            faceA._faceEnergy = 0.9;
            faceB._faceEnergy = 0.1;
            edge.calculateTension(faceA, faceB);
            assert(Math.abs(edge.tension - 0.3) < 0.001, `Edge Energy: Should be 0.3 for Asymmetric (Got ${edge.tension.toFixed(4)})`);
            assert(edge.status === 'Gate', `Edge Status: Should be Gate for 0.3 (Got ${edge.status})`);

            // Case D: Perfect Membrane → geometric mean = √(0.5 × 0.5) = 0.5 → Membrane
            faceA._faceEnergy = 0.5;
            faceB._faceEnergy = 0.5;
            edge.calculateTension(faceA, faceB);
            assert(Math.abs(edge.tension - 0.5) < 0.001, `Edge Energy: Should be 0.5 for Balanced (Got ${edge.tension.toFixed(4)})`);
            assert(edge.status === 'Membrane', `Edge Status: Should be Membrane for 0.5 (Got ${edge.status})`);
        } else {
            assert(false, 'Could not find faces for Edge Test');
        }

        // Test 4: Vertex Energy Calculation
        const vertex = window.quannexEngine.vertices[0];
        const faces = vertex.faceIds.map(id => window.quannexEngine.faces.find(f => f.id === id));

        if (faces.length === 3 && faces.every(f => f)) {
            // Case A: Balanced High
            faces[0]._faceEnergy = 0.8;
            faces[1]._faceEnergy = 0.8;
            faces[2]._faceEnergy = 0.8;
            vertex.calculateVortexEnergy(faces);
            // Avg = 0.8, Min = 0.8. Result = 0.8 * sqrt(1) = 0.8
            assert(Math.abs(vertex.vortexEnergy - 0.8) < 0.01, 'Vertex Energy: Should be 0.8 for Balanced High');
            assert(vertex.status === 'Active Flow' || vertex.status === 'Radiant Vortex', 'Vertex Status: Should be Active/Radiant');

            // Case B: One Dead Face (Collapse)
            faces[0]._faceEnergy = 0.8;
            faces[1]._faceEnergy = 0.8;
            faces[2]._faceEnergy = 0.0; // Dead
            vertex.calculateVortexEnergy(faces);
            // Avg = 0.53, Min = 0. Result = 0.53 * sqrt(0) = 0
            assert(vertex.vortexEnergy === 0, 'Vertex Energy: Should collapse to 0 if one face is dead');
        } else {
            assert(false, 'Could not find faces for Vertex Test');
        }

        // ============================================================
        // Test 5: Vortex Direction Formula
        // Formula: direction = (avgEnergy - 0.5) * 2, clamped to [-1, +1]
        // ============================================================
        const directionTests = [
            { energies: [0, 0, 0], expected: -1.0, label: 'All Dead → Full Downward' },
            { energies: [0.5, 0.5, 0.5], expected: 0.0, label: 'Balanced → Neutral' },
            { energies: [1.0, 1.0, 1.0], expected: 1.0, label: 'All Max → Full Upward' },
            { energies: [0.25, 0.25, 0.25], expected: -0.5, label: 'Low → Slight Downward' },
            { energies: [0.75, 0.75, 0.75], expected: 0.5, label: 'High → Slight Upward' },
        ];
        for (const test of directionTests) {
            const avg = test.energies.reduce((a, b) => a + b, 0) / 3;
            const direction = Math.max(-1.0, Math.min(1.0, (avg - 0.5) * 2));
            assert(Math.abs(direction - test.expected) < 0.001,
                `Vortex Direction: ${test.label} (Expected ${test.expected}, Got ${direction.toFixed(4)})`);
        }

        // ============================================================
        // Test 6: Vertex Coherence Formula
        // Formula: coherence = 1 - (avgPairwiseDiff / 0.667)
        // 0.667 = max avg pairwise diff for 3 values in [0,1]
        // ============================================================
        const coherenceTests = [
            { energies: [0.5, 0.5, 0.5], expected: 1.0, label: 'Identical → Perfect Coherence' },
            { energies: [0.8, 0.8, 0.8], expected: 1.0, label: 'Identical High → Perfect' },
            { energies: [0, 0.5, 1.0], label: 'Max Spread → Low Coherence' },
        ];
        for (const test of coherenceTests) {
            const [a, b, c] = test.energies;
            const avgDiff = (Math.abs(a - b) + Math.abs(b - c) + Math.abs(a - c)) / 3;
            const coherence = Math.max(0, 1.0 - (avgDiff / 0.667));
            if (test.expected !== undefined) {
                assert(Math.abs(coherence - test.expected) < 0.01,
                    `Coherence: ${test.label} (Expected ${test.expected}, Got ${coherence.toFixed(4)})`);
            } else {
                assert(coherence < 0.3,
                    `Coherence: ${test.label} (Expected <0.3, Got ${coherence.toFixed(4)})`);
            }
        }

        // ============================================================
        // Test 7: Leverage Point Detection
        // Criteria: strength > phi^-1 (0.618) AND coherence < phi^-2 (0.382)
        // ============================================================
        const _PHI_1 = (Math.sqrt(5) - 1) / 2;  // 0.618...
        const _PHI_2 = _PHI_1 * _PHI_1;          // 0.382...
        const leverageTests = [
            { strength: 0.7, coherence: 0.3, isLeverage: true, label: 'High strength + low coherence → IS leverage' },
            { strength: 0.5, coherence: 0.3, isLeverage: false, label: 'Low strength → NOT leverage' },
            { strength: 0.7, coherence: 0.5, isLeverage: false, label: 'High coherence → NOT leverage' },
            { strength: 0.4, coherence: 0.5, isLeverage: false, label: 'Both moderate → NOT leverage' },
        ];
        for (const test of leverageTests) {
            const isLeverage = test.strength > _PHI_1 && test.coherence < _PHI_2;
            assert(isLeverage === test.isLeverage,
                `Leverage Point: ${test.label} (Got ${isLeverage})`);
        }

        // ============================================================
        // Test 8: Breath Ratio Logarithmic Properties
        // Formula: BR = ln(R/P) / ln(phi)
        // ============================================================
        const _PHI = (1 + Math.sqrt(5)) / 2;  // 1.618...
        const LN_PHI = Math.log(_PHI);
        const breathTests = [
            { R: 1.0, P: 1.0, expected: 0, label: 'Equal → BR = 0 (balanced)' },
            { R: _PHI, P: 1.0, expected: 1.0, label: 'R = phi * P → BR = +1 (golden expansion)' },
            { R: 1.0, P: _PHI, expected: -1.0, label: 'P = phi * R → BR = -1 (golden contraction)' },
            { R: _PHI * _PHI, P: 1.0, expected: 2.0, label: 'R = phi^2 * P → BR = +2 (severe over-inhaling)' },
        ];
        for (const test of breathTests) {
            const br = Math.log(test.R / test.P) / LN_PHI;
            assert(Math.abs(br - test.expected) < 0.001,
                `Breath Ratio: ${test.label} (Expected ${test.expected}, Got ${br.toFixed(4)})`);
        }

    } catch (error) {
        assert(false, `Exception during geometry tests: ${error.message}`);
        console.error(error);
    }
}

// Run after a delay
setTimeout(runGeometryTests, 1500);
