# Online Image Editor

🚀 **A high-performance, free & open-source browser-based image editor powered by Rust + WebAssembly + React.**

## 🌟 Features
✅ RGB, Brightness, Contrast Adjustments  
✅ Rotate & Blur (5 levels: 1, 2, 3, 5, 10)  
✅ Color Pop, Grey Scale, Vintage, Vignette, Sepia  
✅ Color Invert & Reset  

## ⚡ Why Rust + WebAssembly?
Unlike traditional web-based editors that rely on powerful servers, this one **offloads computations to the client**, leveraging Rust + WebAssembly for:
- **5-10x faster** image processing compared to JavaScript  
- **Better memory efficiency** (no garbage collection overhead)  
- **Real-time image manipulations** directly in the browser  

## 🛠 Tech Stack
- **Frontend:** ReactJS  
- **Core Processing:** Rust + WebAssembly  

## 🎯 Challenges Faced
- **Blur Effect Optimization:** Even with Rust + Wasm, high blur strengths may cause minor lags.  
- **Rust ↔ JavaScript Interconversion:** Efficiently handling data between Rust and JS was a challenge.  


## 📢 Contributions
Contributions are welcome! Feel free to open issues, suggest features, or submit pull requests.

---

### Getting Started

To get started with the project locally:

1. Clone the repository:  
   ```bash
   git clone https://github.com/yourusername/online-image-editor.git
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Run the development server: 
   ```bash
   npm run dev
   ``` 
   
