import { 
    Plugin, 
    MarkdownView, 
    WorkspaceLeaf, 
    Modal, 
    Notice, 
    TFile, 
    Setting 
} from 'obsidian';

const VIEW_TYPE_ENCRYPTED = 'lean-encrypted-view';
const ENCRYPTED_EXTENSION = 'mdenc';

interface EncryptedPayload {
    leanEncrypted: boolean;
    version: number;
    salt: string;       // Base64
    iv: string;         // Base64
    ciphertext: string; // Base64
}

// --- Error Helper for Strict TypeScript ---
function getErrorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

// --- High-Performance Crypto Helpers (Web Crypto AES-256-GCM) ---

function bufferToBase64(buffer: ArrayBuffer): string {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(buffer).toString('base64');
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks to prevent stack overflow on 130k+ words
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize) as any);
    }
    return window.btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
    if (typeof Buffer !== 'undefined') {
        const buf = Buffer.from(base64, 'base64');
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 210000,
            hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptData(plaintext: string, password: string): Promise<string> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);

    const enc = new TextEncoder();
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        enc.encode(plaintext)
    );

    const payload: EncryptedPayload = {
        leanEncrypted: true,
        version: 1,
        salt: bufferToBase64(salt.buffer),
        iv: bufferToBase64(iv.buffer),
        ciphertext: bufferToBase64(ciphertextBuffer)
    };

    return JSON.stringify(payload, null, 2);
}

async function decryptData(rawFileContent: string, password: string): Promise<string> {
    let payload: EncryptedPayload;
    try {
        payload = JSON.parse(rawFileContent);
    } catch {
        // Fallback: If a file was saved as unencrypted text, display it gracefully instead of crashing
        if (rawFileContent.startsWith('---') || rawFileContent.length > 0) {
            return rawFileContent;
        }
        throw new Error('File is not a valid encrypted container.');
    }

    if (!payload.leanEncrypted || !payload.ciphertext) {
        throw new Error('Unrecognized or invalid encryption format.');
    }

    const saltBuffer = new Uint8Array(base64ToBuffer(payload.salt));
    const ivBuffer = new Uint8Array(base64ToBuffer(payload.iv));
    const ciphertextBuffer = base64ToBuffer(payload.ciphertext);

    const key = await deriveKey(password, saltBuffer);

    try {
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: ivBuffer },
            key,
            ciphertextBuffer
        );
        return new TextDecoder().decode(decryptedBuffer);
    } catch {
        throw new Error('Incorrect password or tampered ciphertext.');
    }
}

// --- Password Prompt Modal with Character Visibility Toggle ---
class PasswordPromptModal extends Modal {
    private resolve: (password: string | null) => void;
    private titleText: string;
    private isConfirm: boolean;

    constructor(app: any, titleText = 'Enter Password', isConfirm = false, resolve: (pw: string | null) => void) {
        super(app);
        this.titleText = titleText;
        this.isConfirm = isConfirm;
        this.resolve = resolve;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h3', { text: this.titleText });

        let pwInput: HTMLInputElement;
        let confirmInput: HTMLInputElement | null = null;

        new Setting(contentEl)
            .setName('Password')
            .addText(text => {
                pwInput = text.inputEl;
                text.inputEl.type = 'password';
                text.inputEl.focus();
                text.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !this.isConfirm) submit();
                });
            });

        if (this.isConfirm) {
            new Setting(contentEl)
                .setName('Confirm Password')
                .addText(text => {
                    confirmInput = text.inputEl;
                    text.inputEl.type = 'password';
                    text.inputEl.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') submit();
                    });
                });
        }

        // Toggle to show/hide actual password characters
        new Setting(contentEl)
            .setName('Show password')
            .setDesc('Reveal password characters while typing')
            .addToggle(toggle => {
                toggle.setValue(false);
                toggle.onChange(show => {
                    const newType = show ? 'text' : 'password';
                    pwInput.type = newType;
                    if (confirmInput) {
                        confirmInput.type = newType;
                    }
                });
            });

        const submit = () => {
            const pw = pwInput.value;
            if (!pw) {
                new Notice('Password cannot be empty.');
                return;
            }
            if (this.isConfirm && pw !== confirmInput?.value) {
                new Notice('Passwords do not match.');
                return;
            }
            this.resolve(pw);
            this.close();
        };

        new Setting(contentEl)
            .addButton(btn => btn
                .setButtonText(this.isConfirm ? 'Encrypt' : 'Unlock')
                .setCta()
                .onClick(submit))
            .addButton(btn => btn
                .setButtonText('Cancel')
                .onClick(() => {
                    this.resolve(null);
                    this.close();
                }));
    }

    onClose() {
        this.resolve(null);
    }
}

// --- Encrypted Markdown View (Overlay-Based In-Memory Decryption) ---
class EncryptedMarkdownView extends MarkdownView {
    plugin: LeanEncryptPlugin;
    isDecrypted = false;
    currentPassword = '';
    rawDiskContent = '';
    cachedCiphertext = '';
    private lockOverlayEl: HTMLElement | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: LeanEncryptPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_ENCRYPTED;
    }

    // Intercept loading from disk
    async setViewData(data: string, clear: boolean): Promise<void> {
        this.rawDiskContent = data;

        // If file is empty (newly created)
        if (!data || data.trim().length === 0) {
            this.isDecrypted = true;
            this.hideLockScreen();
            super.setViewData('', clear);
            return;
        }

        // If already unlocked in this specific tab session
        if (this.isDecrypted && this.currentPassword) {
            this.hideLockScreen();
            super.setViewData(this.getEditorText(), clear);
            return;
        }

        // Otherwise, show lock overlay and prompt for password
        this.showLockScreen();
    }

    showLockScreen() {
        if (this.lockOverlayEl) return;

        // Ensure editor underneath is empty while locked for maximum privacy
        super.setViewData('', true);

        this.contentEl.style.position = 'relative';

        this.lockOverlayEl = this.contentEl.createDiv({ 
            cls: 'lean-encrypt-lock-overlay',
            attr: { 
                style: `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--background-primary);
                    z-index: 99;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                ` 
            } 
        });

        this.lockOverlayEl.createEl('div', { text: '🔒', attr: { style: 'font-size: 48px;' } });
        this.lockOverlayEl.createEl('h3', { text: `"${this.file?.basename}" is encrypted` });

        const unlockBtn = this.lockOverlayEl.createEl('button', { 
            text: 'Unlock Note', 
            cls: 'mod-cta',
            attr: { style: 'padding: 8px 24px; cursor: pointer;' } 
        });

        unlockBtn.onclick = () => this.promptUnlock();
        this.promptUnlock();
    }

    hideLockScreen() {
        if (this.lockOverlayEl) {
            this.lockOverlayEl.remove();
            this.lockOverlayEl = null;
        }
    }

    promptUnlock() {
        new PasswordPromptModal(this.app, `Unlock "${this.file?.basename}"`, false, async (pw) => {
            if (!pw) return;

            try {
                const plaintext = await decryptData(this.rawDiskContent, pw);
                this.currentPassword = pw;
                this.isDecrypted = true;
                this.cachedCiphertext = this.rawDiskContent;

                // 1. Remove the lock overlay to reveal the editor
                this.hideLockScreen();

                // 2. Load plaintext into the preserved CodeMirror editor
                super.setViewData(plaintext, true);
                this.editor?.focus();

                new Notice('Note decrypted.');
            } catch (err) {
                new Notice(getErrorMessage(err) || 'Decryption failed.');
            }
        }).open();
    }

    getEditorText(): string {
        try {
            return this.editor ? this.editor.getValue() : '';
        } catch {
            return '';
        }
    }

    // Intercept saving: Encrypt BEFORE calling super.save()
    async save(): Promise<void> {
        if (!this.isDecrypted || !this.currentPassword) {
            return; // Never touch the disk if locked
        }

        const plaintext = this.getEditorText();
        this.cachedCiphertext = await encryptData(plaintext, this.currentPassword);
        await super.save();
    }

    // Obsidian's serializer: NEVER return plaintext to disk!
    getViewData(): string {
        if (!this.isDecrypted || !this.cachedCiphertext) {
            return this.rawDiskContent; // Keep untouched ciphertext
        }
        return this.cachedCiphertext;
    }

    // When the tab is closed, automatically wipe password & lock the note
    async onClose() {
        if (this.isDecrypted) {
            await this.save();
        }
        this.isDecrypted = false;
        this.currentPassword = '';
        this.cachedCiphertext = '';
        this.hideLockScreen();
        await super.onClose();
    }
}

// --- Main Plugin Class ---
export default class LeanEncryptPlugin extends Plugin {
    async onload() {
        // Register custom view for .mdenc files
        this.registerView(
            VIEW_TYPE_ENCRYPTED,
            (leaf: WorkspaceLeaf) => new EncryptedMarkdownView(leaf, this)
        );
        this.registerExtensions([ENCRYPTED_EXTENSION], VIEW_TYPE_ENCRYPTED);

        // Command 1: Encrypt current .md note
        this.addCommand({
            id: 'convert-to-mdenc',
            name: 'Encrypt Current Note',
            checkCallback: (checking: boolean) => {
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (view && view.file && view.file.extension === 'md') {
                    if (!checking) {
                        this.encryptActiveNote(view.file, view.editor.getValue());
                    }
                    return true;
                }
                return false;
            }
        });

        // Command 2: Decrypt active .mdenc note back to plaintext .md
        this.addCommand({
            id: 'convert-to-md',
            name: 'Decrypt Current Note',
            checkCallback: (checking: boolean) => {
                const activeView = this.app.workspace.getActiveViewOfType(EncryptedMarkdownView);
                if (activeView && activeView.file && activeView.file.extension === ENCRYPTED_EXTENSION && activeView.isDecrypted) {
                    if (!checking) {
                        this.decryptActiveNote(activeView);
                    }
                    return true;
                }
                return false;
            }
        });

        // Command 3: Lock current note immediately without closing tab
        this.addCommand({
            id: 'lock-active-note',
            name: 'Lock Current Note',
            checkCallback: (checking: boolean) => {
                const activeView = this.app.workspace.getActiveViewOfType(EncryptedMarkdownView);
                if (activeView && activeView.isDecrypted) {
                    if (!checking) {
                        activeView.save().then(() => {
                            activeView.isDecrypted = false;
                            activeView.currentPassword = '';
                            activeView.showLockScreen();
                            new Notice('Note locked.');
                        });
                    }
                    return true;
                }
                return false;
            }
        });
    }

    private encryptActiveNote(file: TFile, plaintext: string) {
        new PasswordPromptModal(this.app, `Set Password for "${file.basename}"`, true, async (pw) => {
            if (!pw) return;

            try {
                const ciphertext = await encryptData(plaintext, pw);
                const newPath = file.path.replace(/\.md$/, `.${ENCRYPTED_EXTENSION}`);

                // Write encrypted file and safely trash the unencrypted original
                await this.app.vault.create(newPath, ciphertext);
                await this.app.vault.trash(file, true);

                new Notice(`Encrypted to ${newPath}`);
                const newFile = this.app.vault.getAbstractFileByPath(newPath);
                if (newFile instanceof TFile) {
                    this.app.workspace.getLeaf(false).openFile(newFile);
                }
            } catch (err) {
                new Notice('Encryption failed: ' + getErrorMessage(err));
            }
        }).open();
    }

    private async decryptActiveNote(view: EncryptedMarkdownView) {
        if (!view.file) return;
        const file = view.file;
        const plaintext = view.getEditorText();
        const newPath = file.path.replace(new RegExp(`\\.${ENCRYPTED_EXTENSION}$`), '.md');

        try {
            await this.app.vault.create(newPath, plaintext);
            await this.app.vault.trash(file, true);
            new Notice(`Decrypted to plaintext ${newPath}`);

            const newFile = this.app.vault.getAbstractFileByPath(newPath);
            if (newFile instanceof TFile) {
                this.app.workspace.getLeaf(false).openFile(newFile);
            }
        } catch (err) {
            new Notice('Failed to decrypt note: ' + getErrorMessage(err));
        }
    }
}