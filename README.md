# 🔒 Whispr - Hide Encrypted Messages in Images

**Whispr** is a standalone web application that allows you to hide encrypted text messages inside images using steganography. All processing happens locally in your browser - no internet connection or server required.

## 🚀 Quick Start

1. Open `whispr-web/index.html` in any modern browser
2. Upload an image and enter your secret message
3. Generate your steganographic image
4. Share the image - only those who know to look will find your hidden message!

## ✨ Features

- **🔐 AES-GCM Encryption**: Military-grade encryption using WebCrypto API
- **👁️ LSB Steganography**: Hide messages in the least significant bits of image pixels
- **📱 Offline Capable**: Works completely offline, no internet required
- **🎨 Modern UI**: Clean, responsive design with dark mode support
- **📥 Easy Download**: Save your secret images or copy to clipboard
- **🔒 Password Protection**: Optional password protection for additional security

## 📁 Project Structure

```
whispr-web/
├── index.html          # Main application
├── script.js           # Core steganography & encryption logic
├── style.css           # UI styling
├── README.md           # Detailed documentation
└── favicon.ico         # App icon
```

## 🛡️ Security

- All processing happens locally in your browser
- No data is transmitted to any server
- Military-grade AES-GCM encryption
- Secure random IV generation
- Data integrity verification with checksums

## 🌐 Browser Compatibility

Works in all modern browsers with WebCrypto API support:
- Chrome 37+
- Firefox 34+
- Safari 7+
- Edge 12+

## 📖 Full Documentation

See `whispr-web/README.md` for complete documentation, usage instructions, and technical details.

---

**Built with ❤️ for privacy and security.**
