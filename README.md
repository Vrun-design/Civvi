# 🚀 Civvi

**AI-Powered Resume Builder & ATS Optimizer**

[![Made with React](https://img.shields.io/badge/Made%20with-React%2019-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Craft job-winning resumes with AI-powered ATS optimization. 100% free & open source.**

[✨ Live Demo](#) • [📖 Documentation](#-usage) • [🐛 Report Bug](https://github.com/Vrun-design/Civvi/issues) • [💡 Request Feature](https://github.com/Vrun-design/Civvi/issues)

---
<div align="center">
   
### Landing Page
<img width="2014" height="984" alt="00001" src="https://github.com/user-attachments/assets/64bbc4c8-018c-4701-aeb5-c3f888c5e1e1" />

### ATS Scanner
<img width="2014" height="1002" alt="00003" src="https://github.com/user-attachments/assets/5a02c731-8559-478e-ae99-16ea33593179" />

### Resume Editor
<img width="2014" height="1002" alt="00002" src="https://github.com/user-attachments/assets/6f2ca929-8b86-4f7e-9452-40ed9bc88c1f" />
</div>

---

## ✨ Features

### 🎨 Modern Resume Editor
- **Drag & Drop Sections** – Reorder resume sections effortlessly
- **Live A4 Preview** – See changes in real-time as you type
- **Multiple Templates** – Choose from professional, ATS-friendly designs
- **Custom Sections** – Add publications, volunteering, or any custom section

### 🤖 AI-Powered Writing
- **Smart Rewrite** – Enhance any bullet point or summary with one click
- **Context-Aware** – AI understands resume-specific writing best practices
- **Gemini Models** – Powered by Google's latest AI models

### 📊 ATS Optimizer
- **Match Score** – See how well your resume matches a job description
- **Missing Keywords** – Identify critical skills you're missing
- **Smart Suggestions** – Get AI-rewritten content tailored to the job
- **Weak Phrase Detection** – Find and fix generic or weak language

### 📥 Import & Export
- **Import PDF/DOCX** – Parse existing resumes automatically with AI
- **Export to PDF** – Download ATS-friendly PDFs with real text (not images)
- **Clickable Links** – Email, LinkedIn, GitHub links work in exported PDFs

### 🔐 Privacy First
- **Bring Your Own Key (BYOK)** – Use your own free Gemini API key
- **No Data Storage** – Your resume stays in your browser
- **Open Source** – Full transparency, audit the code yourself

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 19 with TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS (via CDN) |
| **AI** | Google Gemini API (`@google/genai`) |
| **PDF Export** | `@react-pdf/renderer` |
| **DOCX Parsing** | `mammoth.js` |
| **Icons** | Material Symbols Rounded |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Gemini API Key** (free) – [Get one here](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vrun-design/Civvi.git
   cd Civvi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key** *(Optional)*
   
   Create a `.env.local` file in the project root:
   ```env
   API_KEY=your_gemini_api_key_here
   ```
   
   > 💡 **Tip:** If you skip this step, the app will prompt you to enter your API key when you use AI features. The key is stored locally in your browser.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

---

## 📖 Usage

### Creating a Resume

1. Click **"Get Started"** on the landing page
2. Fill in your information in the editor sidebar
3. Watch the live preview update in real-time
4. Use the **AI Rewrite** button (✨) to enhance your content

### ATS Optimization

1. Switch to the **"Optimizer"** tab in the sidebar
2. Paste the job description you're applying for
3. Click **"Analyze Resume"**
4. Review your match score and suggestions
5. Click **"Apply All Suggestions"** to update your resume

### Exporting

1. Click **"Export PDF"** in the header
2. Your resume downloads as a clean, ATS-friendly PDF
3. Links are clickable and text is selectable (for ATS systems)

---

## 📁 Project Structure

```
Civvi/
├── App.tsx                 # Main application component
├── index.tsx               # React entry point
├── types.ts                # TypeScript type definitions
├── components/
│   ├── LandingPage.tsx     # Hero section and feature showcase
│   ├── ResumeEditor.tsx    # Section editing forms
│   ├── ResumePreview.tsx   # Live HTML preview wrapper
│   ├── AtsOptimizer.tsx    # Job description analyzer
│   ├── ApiKeyModal.tsx     # BYOK modal component
│   ├── icons.tsx           # Icon components
│   └── templates/          # HTML preview templates
│       ├── TemplateA.tsx   # Stockholm template
│       └── TemplateB.tsx   # Modern template
├── services/
│   ├── geminiService.ts    # AI API integration
│   ├── pdfGeneratorReactPDF.tsx  # PDF export entry
│   └── pdf/
│       ├── PDFTemplateA.tsx      # PDF template A
│       └── PDFTemplateB.tsx      # PDF template B
└── index.html              # HTML entry with CDN scripts
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | Your Gemini API key | No (can use BYOK instead) |

### Adding New Templates

1. Create a new component in `components/templates/` for the HTML preview
2. Create a matching PDF template in `services/pdf/`
3. Register both in the template selector in `App.tsx`

---

## 📦 Building for Production

```bash
npm run build
```

This creates optimized static files in the `dist/` directory.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contribution

- [ ] Add more resume templates
- [ ] Implement LinkedIn profile import
- [ ] Add resume sharing functionality
- [ ] Create a resume scoring history
- [ ] Add multi-language support (i18n)
- [ ] Implement offline mode with service workers

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini](https://aistudio.google.com/) – For the powerful AI capabilities
- [React PDF](https://react-pdf.org/) – For seamless PDF generation
- [Tailwind CSS](https://tailwindcss.com/) – For the beautiful styling utilities

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/Vrun-design/Civvi/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Vrun-design/Civvi/discussions)

---

**Built to help you pass unfair ATS systems**

If you find this project useful, please consider giving it a ⭐
