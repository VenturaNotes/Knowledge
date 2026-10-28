import { 
    Plugin, 
    MarkdownView, 
    FileView, 
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

interface FileSession {
    filePath: string;
    password: string;
    plaintext: string;
    views: Set<EncryptedMarkdownView>;
    lastCiphertext: string;
}

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
    const chunkSize = 0x8000;
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

// --- Password Prompt Modal ---
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
                text.inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        if (!this.isConfirm) {
                            submit();
                        } else if (confirmInput) {
                            confirmInput.focus();
                        }
                    }
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

        // Reliable auto-focus on input field
        setTimeout(() => {
            pwInput?.focus();
            pwInput?.select();
        }, 50);
    }

    onClose() {
        this.resolve(null);
    }
}

// --- Encrypted Markdown View ---
class EncryptedMarkdownView extends MarkdownView {
    plugin: LeanEncryptPlugin;
    isDecrypted = false;
    currentPassword = '';
    rawDiskContent = '';
    cachedCiphertext = '';
    decryptedPlaintext = ''; // In-memory source of truth
    private lockOverlayEl: HTMLElement | null = null;
    private unlockModal: PasswordPromptModal | null = null;

    constructor(leaf: WorkspaceLeaf, plugin: LeanEncryptPlugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType(): string {
        return VIEW_TYPE_ENCRYPTED;
    }

    async setViewData(data: string, clear: boolean): Promise<void> {
        this.rawDiskContent = data;

        // Force container to use Obsidian's native full-bleed markdown layout
        this.containerEl.setAttribute('data-type', 'markdown');
        this.containerEl.addClass('lean-encrypted-view');

        const filePath = this.file?.path;
        if (filePath) {
            const session = this.plugin.getSession(filePath);
            if (session) {
                this.isDecrypted = true;
                this.currentPassword = session.password;
                this.decryptedPlaintext = session.plaintext;
                this.cachedCiphertext = session.lastCiphertext;
                this.plugin.registerViewToSession(filePath, this);

                this.hideLockScreen();
                super.setViewData(session.plaintext, clear);
                this.attachEditorSync();
                return;
            }
        }

        if (!data || data.trim().length === 0) {
            this.isDecrypted = true;
            this.hideLockScreen();
            super.setViewData('', clear);
            return;
        }

        if (this.isDecrypted && this.currentPassword) {
            this.hideLockScreen();
            super.setViewData(this.getEditorText(), clear);
            this.attachEditorSync();
            return;
        }

        // Default: Show lock screen and automatically prompt for password
        this.showLockScreen(true);
    }

    showLockScreen(autoPrompt = true) {
        if (this.lockOverlayEl) {
            if (autoPrompt) this.promptUnlock();
            return;
        }

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

        if (autoPrompt) {
            setTimeout(() => {
                if (!this.isDecrypted) {
                    this.promptUnlock();
                }
            }, 60);
        }
    }

    hideLockScreen() {
        if (this.unlockModal) {
            this.unlockModal.close();
            this.unlockModal = null;
        }
        if (this.lockOverlayEl) {
            this.lockOverlayEl.remove();
            this.lockOverlayEl = null;
        }
    }

    promptUnlock() {
        if (!this.file || this.unlockModal || this.isDecrypted) return;

        this.unlockModal = new PasswordPromptModal(this.app, `Unlock "${this.file.basename}"`, false, async (pw) => {
            this.unlockModal = null;
            if (!pw || !this.file) return;

            try {
                const plaintext = await decryptData(this.rawDiskContent, pw);
                const filePath = this.file.path;

                const session = this.plugin.createSession(filePath, pw, plaintext, this.rawDiskContent, this);

                this.currentPassword = pw;
                this.isDecrypted = true;
                this.decryptedPlaintext = plaintext;
                this.cachedCiphertext = this.rawDiskContent;

                this.hideLockScreen();
                super.setViewData(plaintext, true);
                this.attachEditorSync();
                this.editor?.focus();

                this.plugin.unlockAllViewsForFile(filePath, session);

                new Notice('Note decrypted.');
            } catch (err) {
                new Notice(getErrorMessage(err) || 'Decryption failed.');
            }
        });

        this.unlockModal.open();
    }

    attachEditorSync() {
        const cm = (this.editor as any)?.cm;
        if (!cm || cm._encryptedSyncAttached) return;
        cm._encryptedSyncAttached = true;

        const originalDispatch = cm.dispatch.bind(cm);
        const self = this;

        cm.dispatch = function(...args: any[]) {
            originalDispatch(...args);

            if (self.plugin.isBroadcasting || !self.isDecrypted) {
                return;
            }

            const filePath = self.file?.path;
            if (!filePath) return;
            const session = self.plugin.getSession(filePath);
            if (!session) return;

            let changesToBroadcast: any = null;
            for (const arg of args) {
                if (!arg) continue;
                if (arg.changes && (arg.changes.empty === false || typeof arg.changes === 'object')) {
                    changesToBroadcast = arg.changes;
                    break;
                }
            }

            if (changesToBroadcast) {
                const updatedText = cm.state.doc.toString();
                session.plaintext = updatedText;
                self.decryptedPlaintext = updatedText;

                self.plugin.broadcastChanges(filePath, changesToBroadcast, updatedText, self);
            }
        };
    }

    getEditorText(): string {
        if (this.getMode() === 'preview') {
            return this.decryptedPlaintext;
        }
        try {
            const val = this.editor ? this.editor.getValue() : '';
            return val || this.decryptedPlaintext;
        } catch {
            return this.decryptedPlaintext;
        }
    }

    async save(): Promise<void> {
        if (!this.isDecrypted || !this.currentPassword) {
            return;
        }

        const plaintext = this.getEditorText();

        if (this.decryptedPlaintext.length > 0 && plaintext.length === 0) {
            console.warn('Prevented auto-saving empty text over decrypted content.');
            return;
        }

        this.decryptedPlaintext = plaintext;
        const filePath = this.file?.path;
        const session = filePath ? this.plugin.getSession(filePath) : null;
        if (session) {
            session.plaintext = plaintext;
        }

        this.cachedCiphertext = await encryptData(plaintext, this.currentPassword);
        if (session) {
            session.lastCiphertext = this.cachedCiphertext;
        }

        await super.save();
    }

    getViewData(): string {
        const filePath = this.file?.path;
        const session = filePath ? this.plugin.getSession(filePath) : null;
        if (session && session.lastCiphertext) {
            return session.lastCiphertext;
        }
        if (!this.isDecrypted || !this.cachedCiphertext) {
            return this.rawDiskContent;
        }
        return this.cachedCiphertext;
    }

    async onClose() {
        const filePath = this.file?.path;
        if (filePath) {
            await this.plugin.unregisterViewFromSession(filePath, this);
        }

        this.isDecrypted = false;
        this.currentPassword = '';
        this.cachedCiphertext = '';
        this.decryptedPlaintext = '';
        this.hideLockScreen();
        await super.onClose();
    }
}

// --- Main Plugin Class ---
export default class LeanEncryptPlugin extends Plugin {
    activeSessions: Map<string, FileSession> = new Map();
    isBroadcasting = false;

    async onload() {
        this.registerView(
            VIEW_TYPE_ENCRYPTED,
            (leaf: WorkspaceLeaf) => new EncryptedMarkdownView(leaf, this)
        );
        this.registerExtensions([ENCRYPTED_EXTENSION], VIEW_TYPE_ENCRYPTED);

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', (leaf) => {
                if (leaf?.view instanceof EncryptedMarkdownView && leaf.view.isDecrypted) {
                    leaf.view.attachEditorSync();
                }
            })
        );

        // Command 1: Encrypt current .md note
        this.addCommand({
            id: 'convert-to-mdenc',
            name: 'Encrypt Current Note',
            checkCallback: (checking: boolean) => {
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (view && view.file && view.file.extension === 'md') {
                    if (!checking) {
                        const file = view.file;
                        view.save().then(async () => {
                            const diskContent = await this.app.vault.read(file);
                            this.encryptActiveNote(file, diskContent);
                        });
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

        // Command 3: Lock current note immediately across all tabs
        this.addCommand({
            id: 'lock-active-note',
            name: 'Lock Current Note',
            checkCallback: (checking: boolean) => {
                const activeView = this.app.workspace.getActiveViewOfType(EncryptedMarkdownView);
                if (activeView && activeView.file && activeView.isDecrypted) {
                    if (!checking) {
                        this.lockFileSession(activeView.file.path).then(() => {
                            new Notice('Note locked across all tabs.');
                        });
                    }
                    return true;
                }
                return false;
            }
        });
    }

    // --- Session Management Methods ---

    getSession(filePath: string): FileSession | undefined {
        return this.activeSessions.get(filePath);
    }

    createSession(filePath: string, password: string, plaintext: string, ciphertext: string, view: EncryptedMarkdownView): FileSession {
        let session = this.activeSessions.get(filePath);
        if (!session) {
            session = {
                filePath,
                password,
                plaintext,
                lastCiphertext: ciphertext,
                views: new Set()
            };
            this.activeSessions.set(filePath, session);
        } else {
            session.password = password;
            session.plaintext = plaintext;
            session.lastCiphertext = ciphertext;
        }
        session.views.add(view);
        return session;
    }

    registerViewToSession(filePath: string, view: EncryptedMarkdownView) {
        const session = this.activeSessions.get(filePath);
        if (session) {
            session.views.add(view);
        }
    }

    async unregisterViewFromSession(filePath: string, view: EncryptedMarkdownView) {
        const session = this.activeSessions.get(filePath);
        if (!session) return;

        session.views.delete(view);

        if (session.views.size === 0) {
            if (view.isDecrypted) {
                await view.save();
            }
            this.activeSessions.delete(filePath);
            session.password = '';
            session.plaintext = '';
            session.lastCiphertext = '';
        }
    }

    unlockAllViewsForFile(filePath: string, session: FileSession) {
        this.app.workspace.iterateAllLeaves(leaf => {
            if (leaf.view instanceof EncryptedMarkdownView && leaf.view.file?.path === filePath) {
                const v = leaf.view;
                if (!v.isDecrypted) {
                    v.currentPassword = session.password;
                    v.isDecrypted = true;
                    v.decryptedPlaintext = session.plaintext;
                    v.cachedCiphertext = session.lastCiphertext;
                    session.views.add(v);

                    v.hideLockScreen();
                    (v as any).setViewData(session.plaintext, true);
                    v.attachEditorSync();
                }
            }
        });
    }

    broadcastChanges(filePath: string, changes: any, fullText: string, sourceView: EncryptedMarkdownView) {
        const session = this.activeSessions.get(filePath);
        if (!session) return;

        for (const view of session.views) {
            if (view === sourceView) continue;

            view.decryptedPlaintext = fullText;
            const siblingCm = (view.editor as any)?.cm;

            if (siblingCm) {
                try {
                    this.isBroadcasting = true;
                    siblingCm.dispatch({ changes: changes });
                } catch {
                    try {
                        siblingCm.dispatch({
                            changes: {
                                from: 0,
                                to: siblingCm.state.doc.length,
                                insert: fullText
                            }
                        });
                    } catch {
                        view.editor?.setValue(fullText);
                    }
                } finally {
                    this.isBroadcasting = false;
                }
            }
        }
    }

    async lockFileSession(filePath: string) {
        const session = this.activeSessions.get(filePath);
        if (!session) return;

        const firstView = session.views.values().next().value as EncryptedMarkdownView | undefined;
        if (firstView) {
            await firstView.save();
        }

        for (const view of session.views) {
            view.isDecrypted = false;
            view.currentPassword = '';
            view.decryptedPlaintext = '';
            view.cachedCiphertext = '';
            // Pass false so the lock overlay shows without immediately popping the prompt back up
            view.showLockScreen(false);
        }

        session.password = '';
        session.plaintext = '';
        session.lastCiphertext = '';
        this.activeSessions.delete(filePath);
    }

    // --- File Encrypt/Decrypt Conversions ---

    private encryptActiveNote(file: TFile, plaintext: string) {
        if (file.stat.size > 0 && plaintext.trim().length === 0) {
            new Notice('Aborted: Attempted to encrypt an empty buffer over an existing note.');
            return;
        }

        new PasswordPromptModal(this.app, `Set Password for "${file.basename}"`, true, async (pw) => {
            if (!pw) return;

            try {
                const ciphertext = await encryptData(plaintext, pw);
                const oldPath = file.path;
                const newPath = oldPath.replace(/\.md$/, `.${ENCRYPTED_EXTENSION}`);

                await this.app.vault.create(newPath, ciphertext);
                await this.app.vault.trash(file, true);

                new Notice(`Encrypted to ${newPath}`);

                this.app.workspace.iterateAllLeaves(leaf => {
                    if (leaf.view instanceof FileView && leaf.view.file?.path === oldPath) {
                        leaf.setViewState({
                            type: VIEW_TYPE_ENCRYPTED,
                            state: { file: newPath }
                        });
                    }
                });
            } catch (err) {
                new Notice('Encryption failed: ' + getErrorMessage(err));
            }
        }).open();
    }

    private async decryptActiveNote(view: EncryptedMarkdownView) {
        if (!view.file) return;
        const file = view.file;
        const plaintext = view.getEditorText();
        const oldPath = file.path;
        const newPath = oldPath.replace(new RegExp(`\\.${ENCRYPTED_EXTENSION}$`), '.md');

        try {
            await this.app.vault.create(newPath, plaintext);
            await this.app.vault.trash(file, true);

            this.activeSessions.delete(oldPath);

            new Notice(`Decrypted to plaintext ${newPath}`);

            this.app.workspace.iterateAllLeaves(leaf => {
                if (leaf.view instanceof FileView && leaf.view.file?.path === oldPath) {
                    leaf.setViewState({
                        type: 'markdown',
                        state: { file: newPath }
                    });
                }
            });
        } catch (err) {
            new Notice('Failed to decrypt note: ' + getErrorMessage(err));
        }
    }
}