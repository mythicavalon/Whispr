/**
 * Whispr - Hide Encrypted Messages in Images
 * Complete JavaScript implementation with LSB steganography and AES-GCM encryption
 */

class WhisprApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDarkMode();
        this.setupTabs();
    }

    // =================
    // UI SETUP
    // =================

    setupEventListeners() {
        // Tab switching
        document.getElementById('encodeTab').addEventListener('click', () => this.switchTab('encode'));
        document.getElementById('decodeTab').addEventListener('click', () => this.switchTab('decode'));

        // File uploads - Encode
        const encodeDropZone = document.getElementById('encodeDropZone');
        const encodeImageInput = document.getElementById('encodeImageInput');
        
        encodeDropZone.addEventListener('click', () => encodeImageInput.click());
        encodeDropZone.addEventListener('dragover', this.handleDragOver);
        encodeDropZone.addEventListener('drop', (e) => this.handleFileDrop(e, 'encode'));
        encodeImageInput.addEventListener('change', (e) => this.handleFileSelect(e, 'encode'));

        // File uploads - Decode
        const decodeDropZone = document.getElementById('decodeDropZone');
        const decodeImageInput = document.getElementById('decodeImageInput');
        
        decodeDropZone.addEventListener('click', () => decodeImageInput.click());
        decodeDropZone.addEventListener('dragover', this.handleDragOver);
        decodeDropZone.addEventListener('drop', (e) => this.handleFileDrop(e, 'decode'));
        decodeImageInput.addEventListener('change', (e) => this.handleFileSelect(e, 'decode'));

        // Message input monitoring
        document.getElementById('secretMessage').addEventListener('input', () => this.updateCapacityInfo());

        // Action buttons
        document.getElementById('generateBtn').addEventListener('click', () => this.generateSecretImage());
        document.getElementById('revealBtn').addEventListener('click', () => this.revealMessage());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadImage());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyImageToClipboard());
        document.getElementById('copyMessageBtn').addEventListener('click', () => this.copyMessageToClipboard());

        // Alert close buttons
        document.getElementById('closeError').addEventListener('click', () => this.hideAlert('error'));
        document.getElementById('closeSuccess').addEventListener('click', () => this.hideAlert('success'));

        // Dark mode toggle
        document.getElementById('darkModeToggle').addEventListener('click', () => this.toggleDarkMode());
    }

    setupDarkMode() {
        // Check for saved dark mode preference or default to light mode
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }

    setupTabs() {
        // Default to encode tab
        this.switchTab('encode');
    }

    switchTab(tab) {
        const encodeTab = document.getElementById('encodeTab');
        const decodeTab = document.getElementById('decodeTab');
        const encodeSection = document.getElementById('encodeSection');
        const decodeSection = document.getElementById('decodeSection');

        // Update tab buttons
        encodeTab.classList.toggle('active', tab === 'encode');
        decodeTab.classList.toggle('active', tab === 'decode');

        // Update sections
        encodeSection.classList.toggle('hidden', tab !== 'encode');
        decodeSection.classList.toggle('hidden', tab !== 'decode');

        // Hide any previous results
        document.getElementById('encodeResult').classList.add('hidden');
        document.getElementById('decodeResult').classList.add('hidden');
    }

    toggleDarkMode() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', isDark.toString());
    }

    // =================
    // FILE HANDLING
    // =================

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileDrop(e, type) {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processImageFile(files[0], type);
        }
    }

    handleFileSelect(e, type) {
        const file = e.target.files[0];
        if (file) {
            this.processImageFile(file, type);
        }
    }

    async processImageFile(file, type) {
        try {
            // Validate file
            if (!this.validateImageFile(file)) {
                return;
            }

            this.showLoading();

            // Read file
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const dataURL = await this.readFileAsDataURL(file);

            // Create image element
            const img = new Image();
            img.onload = () => {
                this.displayImagePreview(img, file, type);
                this.hideLoading();
                
                if (type === 'encode') {
                    this.currentEncodeImage = { file, img, arrayBuffer, dataURL };
                    this.updateCapacityInfo();
                } else {
                    this.currentDecodeImage = { file, img, arrayBuffer, dataURL };
                }
            };
            img.onerror = () => {
                this.showError('Failed to load image. Please try a different file.');
                this.hideLoading();
            };
            img.src = dataURL;

        } catch (error) {
            this.showError('Error processing image: ' + error.message);
            this.hideLoading();
        }
    }

    validateImageFile(file) {
        // Check file type
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            this.showError('Please select a PNG or JPEG image.');
            return false;
        }

        // Check file size (4MB limit)
        if (file.size > 4 * 1024 * 1024) {
            this.showError('Image file is too large. Please select an image under 4MB.');
            return false;
        }

        return true;
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    displayImagePreview(img, file, type) {
        const previewContainer = document.getElementById(`${type}ImagePreview`);
        const previewImg = document.getElementById(`${type}PreviewImg`);
        const imageInfo = document.getElementById(`${type}ImageInfo`);

        previewImg.src = img.src;
        previewContainer.classList.remove('hidden');

        const fileSizeKB = Math.round(file.size / 1024);
        imageInfo.textContent = `${img.width}×${img.height} pixels, ${fileSizeKB} KB`;
    }

    updateCapacityInfo() {
        const messageInput = document.getElementById('secretMessage');
        const messageLength = document.getElementById('messageLength');
        const capacityInfo = document.getElementById('capacityInfo');

        const message = messageInput.value;
        messageLength.textContent = `${message.length} characters`;

        if (this.currentEncodeImage) {
            const capacity = this.calculateImageCapacity(this.currentEncodeImage.img);
            const required = this.estimateRequiredBytes(message);
            
            capacityInfo.textContent = `Capacity: ${capacity} bytes, Required: ~${required} bytes`;
            
            if (required > capacity) {
                capacityInfo.classList.add('text-red-500');
                capacityInfo.classList.remove('text-green-500');
            } else {
                capacityInfo.classList.add('text-green-500');
                capacityInfo.classList.remove('text-red-500');
            }
        }
    }

    calculateImageCapacity(img) {
        // Each pixel has RGB channels, we can store 1 bit per channel
        // Reserve first few pixels for metadata (length, checksum, etc.)
        const totalPixels = img.width * img.height;
        const metadataPixels = 100; // Reserve pixels for metadata
        const usablePixels = totalPixels - metadataPixels;
        const bitsPerPixel = 3; // RGB channels
        return Math.floor((usablePixels * bitsPerPixel) / 8); // Convert to bytes
    }

    estimateRequiredBytes(message) {
        // Estimate encrypted message size + IV + metadata
        const textBytes = new TextEncoder().encode(message).length;
        const ivBytes = 12; // AES-GCM IV
        const overhead = 50; // Encryption overhead + metadata
        return textBytes + ivBytes + overhead;
    }

    // =================
    // ENCRYPTION
    // =================

    async deriveKey(password) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password || 'whispr-default-key-2024'),
            'PBKDF2',
            false,
            ['deriveKey']
        );

        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode('whispr-salt-2024'),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    async encryptMessage(message, password) {
        try {
            const key = await this.deriveKey(password);
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            
            // Generate random IV
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            // Encrypt
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                data
            );

            // Combine IV + encrypted data
            const result = new Uint8Array(iv.length + encrypted.byteLength);
            result.set(iv, 0);
            result.set(new Uint8Array(encrypted), iv.length);

            return result;
        } catch (error) {
            throw new Error('Encryption failed: ' + error.message);
        }
    }

    async decryptMessage(encryptedData, password) {
        try {
            const key = await this.deriveKey(password);
            
            // Extract IV and encrypted data
            const iv = encryptedData.slice(0, 12);
            const encrypted = encryptedData.slice(12);
            
            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encrypted
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            throw new Error('Decryption failed. Check your password and try again.');
        }
    }

    // =================
    // STEGANOGRAPHY
    // =================

    async embedMessageInImage(img, message, password) {
        try {
            // Encrypt message
            const encryptedData = await this.encryptMessage(message, password);
            
            // Convert to binary string
            const binaryData = this.arrayToBinaryString(encryptedData);
            
            // Check capacity
            const capacity = this.calculateImageCapacity(img);
            if (encryptedData.length > capacity) {
                throw new Error('Message is too long for this image. Try a larger image or shorter message.');
            }

            // Create canvas and get image data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Embed length in first pixels (32 bits)
            const lengthBinary = encryptedData.length.toString(2).padStart(32, '0');
            this.embedBitsInPixels(pixels, lengthBinary, 0);

            // Embed checksum in next pixels (32 bits)
            const checksum = this.calculateChecksum(encryptedData);
            const checksumBinary = checksum.toString(2).padStart(32, '0');
            this.embedBitsInPixels(pixels, checksumBinary, 32);

            // Embed actual data
            const dataStartBit = 64;
            this.embedBitsInPixels(pixels, binaryData, dataStartBit);

            // Update canvas
            ctx.putImageData(imageData, 0, 0);

            return canvas;
        } catch (error) {
            throw new Error('Failed to embed message: ' + error.message);
        }
    }

    async extractMessageFromImage(img, password) {
        try {
            // Create canvas and get image data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            // Extract length (first 32 bits)
            const lengthBinary = this.extractBitsFromPixels(pixels, 0, 32);
            const length = parseInt(lengthBinary, 2);
            
            if (length <= 0 || length > this.calculateImageCapacity(img)) {
                throw new Error('No valid hidden message found in this image.');
            }

            // Extract checksum (next 32 bits)
            const checksumBinary = this.extractBitsFromPixels(pixels, 32, 32);
            const expectedChecksum = parseInt(checksumBinary, 2);

            // Extract encrypted data
            const dataBits = length * 8;
            const dataStartBit = 64;
            const dataBinary = this.extractBitsFromPixels(pixels, dataStartBit, dataBits);
            const encryptedData = this.binaryStringToArray(dataBinary);

            // Verify checksum
            const actualChecksum = this.calculateChecksum(encryptedData);
            if (actualChecksum !== expectedChecksum) {
                throw new Error('Data integrity check failed. The image may be corrupted or not contain a hidden message.');
            }

            // Decrypt message
            const message = await this.decryptMessage(encryptedData, password);
            return message;
        } catch (error) {
            throw new Error('Failed to extract message: ' + error.message);
        }
    }

    embedBitsInPixels(pixels, binaryString, startBit) {
        for (let i = 0; i < binaryString.length; i++) {
            const pixelIndex = Math.floor((startBit + i) / 3) * 4; // 4 bytes per pixel (RGBA)
            const channelIndex = (startBit + i) % 3; // RGB channels only
            
            if (pixelIndex + channelIndex >= pixels.length) {
                throw new Error('Message too long for image capacity');
            }

            // Modify LSB
            const bit = parseInt(binaryString[i]);
            pixels[pixelIndex + channelIndex] = (pixels[pixelIndex + channelIndex] & 0xFE) | bit;
        }
    }

    extractBitsFromPixels(pixels, startBit, numBits) {
        let binaryString = '';
        
        for (let i = 0; i < numBits; i++) {
            const pixelIndex = Math.floor((startBit + i) / 3) * 4;
            const channelIndex = (startBit + i) % 3;
            
            if (pixelIndex + channelIndex >= pixels.length) {
                throw new Error('Attempted to read beyond image data');
            }

            // Extract LSB
            const bit = pixels[pixelIndex + channelIndex] & 1;
            binaryString += bit.toString();
        }
        
        return binaryString;
    }

    arrayToBinaryString(array) {
        return Array.from(array)
            .map(byte => byte.toString(2).padStart(8, '0'))
            .join('');
    }

    binaryStringToArray(binaryString) {
        const bytes = [];
        for (let i = 0; i < binaryString.length; i += 8) {
            const byte = binaryString.substr(i, 8);
            bytes.push(parseInt(byte, 2));
        }
        return new Uint8Array(bytes);
    }

    calculateChecksum(data) {
        let checksum = 0;
        for (let i = 0; i < data.length; i++) {
            checksum = (checksum + data[i]) % 0xFFFFFFFF;
        }
        return checksum;
    }

    // =================
    // MAIN ACTIONS
    // =================

    async generateSecretImage() {
        try {
            const message = document.getElementById('secretMessage').value.trim();
            const password = document.getElementById('encodePassword').value;

            if (!message) {
                this.showError('Please enter a secret message.');
                return;
            }

            if (!this.currentEncodeImage) {
                this.showError('Please select an image first.');
                return;
            }

            this.showLoading();

            // Generate secret image
            const canvas = await this.embedMessageInImage(
                this.currentEncodeImage.img,
                message,
                password
            );

            // Display result
            const resultImage = document.getElementById('resultImage');
            resultImage.src = canvas.toDataURL('image/png');
            
            this.resultCanvas = canvas;
            document.getElementById('encodeResult').classList.remove('hidden');

            this.showSuccess('Secret image generated successfully!');
            this.hideLoading();

        } catch (error) {
            this.showError(error.message);
            this.hideLoading();
        }
    }

    async revealMessage() {
        try {
            const password = document.getElementById('decodePassword').value;

            if (!this.currentDecodeImage) {
                this.showError('Please select an image first.');
                return;
            }

            this.showLoading();

            // Extract message
            const message = await this.extractMessageFromImage(
                this.currentDecodeImage.img,
                password
            );

            // Display result
            document.getElementById('revealedMessage').textContent = message;
            document.getElementById('decodeResult').classList.remove('hidden');

            this.showSuccess('Message revealed successfully!');
            this.hideLoading();

        } catch (error) {
            this.showError(error.message);
            this.hideLoading();
        }
    }

    downloadImage() {
        if (!this.resultCanvas) {
            this.showError('No image to download.');
            return;
        }

        this.resultCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'whispr-secret-image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showSuccess('Image downloaded successfully!');
        }, 'image/png');
    }

    async copyImageToClipboard() {
        if (!this.resultCanvas) {
            this.showError('No image to copy.');
            return;
        }

        try {
            this.resultCanvas.toBlob(async (blob) => {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                this.showSuccess('Image copied to clipboard!');
            }, 'image/png');
        } catch (error) {
            this.showError('Failed to copy image to clipboard.');
        }
    }

    async copyMessageToClipboard() {
        const message = document.getElementById('revealedMessage').textContent;
        
        try {
            await navigator.clipboard.writeText(message);
            this.showSuccess('Message copied to clipboard!');
        } catch (error) {
            this.showError('Failed to copy message to clipboard.');
        }
    }

    // =================
    // UI HELPERS
    // =================

    showLoading() {
        document.getElementById('loadingIndicator').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingIndicator').classList.add('hidden');
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('errorAlert').classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => this.hideAlert('error'), 5000);
    }

    showSuccess(message) {
        document.getElementById('successMessage').textContent = message;
        document.getElementById('successAlert').classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => this.hideAlert('success'), 3000);
    }

    hideAlert(type) {
        document.getElementById(`${type}Alert`).classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WhisprApp();
});