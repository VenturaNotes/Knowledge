const { Modal } = require('obsidian');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class SoundBoardModal extends Modal {
    constructor(app) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // Modal Title
        contentEl.createEl('h2', { 
            text: '🔊 macOS Sound Board',
            attr: { style: 'margin-bottom: 8px;' }
        });

        contentEl.createEl('p', {
            text: 'Click a sound button below to play it.',
            attr: { style: 'color: var(--text-muted); margin-bottom: 16px; font-size: 13px;' }
        });

        const soundsDir = '/System/Library/Sounds';
        let soundFiles = [];

        // Dynamically discover all system audio files on this Mac
        try {
            if (fs.existsSync(soundsDir)) {
                soundFiles = fs.readdirSync(soundsDir)
                    .filter(file => file.endsWith('.aiff') || file.endsWith('.aif'))
                    .map(file => path.basename(file, path.extname(file)));
            }
        } catch (err) {
            console.error('[SoundBoard] Failed to scan system sounds:', err);
        }

        // Fallback default list if scanning directory fails
        if (soundFiles.length === 0) {
            soundFiles = [
                'Basso', 'Blow', 'Bottle', 'Frog', 'Funk', 
                'Glass', 'Hero', 'Morse', 'Ping', 'Pop', 
                'Purr', 'Sosumi', 'Submarine', 'Tink'
            ];
        }

        // Sort alphabetically
        soundFiles.sort();

        // Responsive grid layout
        const grid = contentEl.createDiv({
            attr: {
                style: `
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: 10px;
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 4px;
                `
            }
        });

        // Generate a button for each sound
        soundFiles.forEach(soundName => {
            const btn = grid.createEl('button', {
                text: soundName,
                attr: {
                    style: `
                        padding: 10px 8px;
                        font-size: 13px;
                        font-weight: 500;
                        cursor: pointer;
                        border-radius: 6px;
                        transition: transform 0.08s ease;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    `
                }
            });

            btn.addEventListener('click', () => {
                // Subtle press animation
                btn.style.transform = 'scale(0.93)';
                setTimeout(() => btn.style.transform = 'scale(1)', 100);

                // Play the sound via macOS command line player
                const soundPath = path.join(soundsDir, `${soundName}.aiff`);
                exec(`afplay "${soundPath}"`, (err) => {
                    if (err) {
                        // Retry with .aif extension if .aiff wasn't found
                        const altPath = path.join(soundsDir, `${soundName}.aif`);
                        exec(`afplay "${altPath}"`);
                    }
                });
            });
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Entry point required by your ScriptRunner plugin
module.exports = function({ app, obsidian }) {
    new SoundBoardModal(app).open();
};