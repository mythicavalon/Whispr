# 🔒 Whispr - Hide Messages in Images

**Whispr** is a standalone web application that allows you to hide encrypted text messages inside images using steganography. All processing happens locally in your browser - no internet connection or server required.

![Whispr Logo](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzYzNjZmMSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4LTggOCAzLjU5IDggOC0zLjU5IDgtOCA4em0tMS0xM2gydjZoLTJ6bTAgOGgydjJoLTJ6Ii8+PC9zdmc+)

## ✨ Features

- **🔐 AES-GCM Encryption**: Military-grade encryption using WebCrypto API
- **👁️ LSB Steganography**: Hide messages in the least significant bits of image pixels
- **📱 Offline Capable**: Works completely offline, no internet required
- **🎨 Modern UI**: Clean, responsive design with dark mode support
- **📥 Easy Download**: Save your secret images or copy to clipboard
- **🔍 Message Extraction**: Reveal hidden messages from steganographic images
- **🔒 Password Protection**: Optional password protection for additional security
- **📱 Mobile Friendly**: Responsive design works on all devices

## 🚀 How to Use

### Encoding (Hide a Message)

1. **Upload an Image**: Click or drag-and-drop a PNG/JPEG image (up to 4MB)
2. **Enter Your Message**: Type the secret message you want to hide
3. **Set Password** (Optional): Add a password for extra security
4. **Generate**: Click "Generate Secret Image" to create your steganographic image
5. **Download/Share**: Save the image or copy it to your clipboard

### Decoding (Reveal a Message)

1. **Upload Secret Image**: Select an image that contains a hidden message
2. **Enter Password**: If a password was used during encoding, enter it here
3. **Reveal**: Click "Reveal Message" to extract the hidden text
4. **Copy Message**: Copy the revealed message to your clipboard

## 🔧 Technical Details

### Encryption
- **Algorithm**: AES-GCM (256-bit key)
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **IV**: 12-byte random initialization vector
- **Default Key**: Uses "whispr-default-key-2024" if no password provided

### Steganography
- **Method**: LSB (Least Significant Bit) manipulation
- **Channels**: RGB channels of image pixels
- **Metadata**: Stores message length and checksum for integrity
- **Capacity**: ~3 bits per pixel (RGB channels)

### File Support
- **Input Formats**: PNG, JPEG
- **Output Format**: PNG (to preserve LSB data)
- **Size Limit**: 4MB maximum file size
- **Resolution**: Maintains original image dimensions

## 🛡️ Security & Privacy

### ✅ Security Features
- All processing happens locally in your browser
- No data is transmitted to any server
- Military-grade AES-GCM encryption
- Secure random IV generation
- Data integrity verification with checksums

### ⚠️ Security Limitations
- **Visual Detection**: The output image is virtually identical to the original, but sophisticated analysis tools might detect modifications
- **Password Strength**: Security depends on password strength (if used)
- **Local Storage**: No persistent storage - refresh clears all data
- **Browser Security**: Relies on browser's WebCrypto implementation

### 🔒 Best Practices
- Use strong, unique passwords
- Keep your secret images secure
- Don't rely on steganography alone for highly sensitive data
- Combine with other security measures when needed

## 💾 Installation & Usage

### Option 1: Download and Run Locally
1. Download all files (`index.html`, `script.js`, `style.css`)
2. Open `index.html` in any modern browser
3. No installation or setup required!

### Option 2: Host on Web Server
1. Upload files to any web server
2. Access via HTTPS for full functionality
3. Works on any hosting platform

### Option 3: GitHub Pages
1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Access your hosted version

## 🌐 Browser Compatibility

**Fully Supported:**
- Chrome 37+
- Firefox 34+
- Safari 7+
- Edge 12+

**Required APIs:**
- WebCrypto API
- Canvas API
- FileReader API
- Clipboard API (for copy functions)

## 📊 Capacity Calculator

The number of bytes you can hide depends on image size:

| Image Size | Approximate Capacity |
|------------|---------------------|
| 500×500px  | ~93 KB              |
| 1000×1000px| ~375 KB             |
| 1920×1080px| ~777 KB             |
| 4000×3000px| ~4.5 MB             |

*Formula: (width × height × 3 bits) ÷ 8 bytes - metadata overhead*

## 🐛 Troubleshooting

### Common Issues

**"Message too long for image"**
- Use a larger image or shorter message
- Check the capacity indicator in real-time

**"Failed to load image"**
- Ensure file is PNG or JPEG format
- Check file size is under 4MB
- Try a different image file

**"Decryption failed"**
- Verify the correct password (if used)
- Ensure the image contains a hidden message
- Check that the image hasn't been modified or compressed

**"No hidden message found"**
- Confirm the image was created with Whispr
- Verify the image hasn't been re-saved or compressed
- Try uploading the original steganographic image

### Performance Tips
- Larger images take longer to process
- Use PNG format for best compatibility
- Avoid heavy image compression that might damage LSB data

## 🔬 How It Works

1. **Message Encryption**: Your text is encrypted using AES-GCM with a derived key
2. **Binary Conversion**: Encrypted data is converted to binary representation
3. **LSB Embedding**: Binary bits are stored in the least significant bits of RGB pixels
4. **Metadata Storage**: Message length and checksum are stored in the first pixels
5. **Image Output**: The modified image is generated as PNG to preserve data integrity

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## ⚖️ Legal Notice

This software is provided for educational and legitimate privacy purposes. Users are responsible for complying with all applicable laws and regulations in their jurisdiction. The developers are not responsible for any misuse of this software.

## 🔗 Additional Resources

- [WebCrypto API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Steganography on Wikipedia](https://en.wikipedia.org/wiki/Steganography)
- [AES-GCM Encryption](https://en.wikipedia.org/wiki/Galois/Counter_Mode)

---

**Built with ❤️ for privacy and security.**

*Last updated: 2024*