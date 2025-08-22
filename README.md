# SaviAI - AI-Powered Interview Preparation Platform

A comprehensive interview preparation platform built with Next.js 13+, featuring AI-generated content, real-time feedback, and progress tracking.

## Features

- 🤖 **AI-Generated Content**: Dynamic aptitude questions and coding problems using offline AI models
- 💻 **Multi-Language Coding Practice**: Support for JavaScript, Python, C++, Java, and C
- 🧠 **Aptitude Training**: Comprehensive topics with formulas, examples, and practice questions
- 📊 **Progress Tracking**: Detailed analytics and performance metrics
- 🎯 **Mock Interviews**: AI-powered interview simulation with real-time feedback
- 🔐 **Session Management**: Auto-logout and secure authentication
- 🎨 **Theme Support**: Dark/light mode with consistent styling
- 📱 **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: NextAuth.js
- **AI Models**: Offline LLM integration (Mistral 7B, CodeLlama)
- **Animations**: Framer Motion
- **Code Highlighting**: React Syntax Highlighter

## Prerequisites

Before running the application, you need to download and set up the AI models:

### Required AI Models

1. **Mistral 7B Instruct** (for aptitude questions)
   - Download: [Mistral-7B-Instruct-v0.1.gguf](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF)
   - Size: ~4.1GB
   - Place in: `./models/mistral-7b-instruct-v0.1.gguf`

2. **CodeLlama 7B** (for coding problems)
   - Download: [CodeLlama-7B-Instruct.gguf](https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF)
   - Size: ~3.8GB
   - Place in: `./models/codellama-7b-instruct.gguf`

3. **Llama.cpp Binary** (for model execution)
   - Download: [llama.cpp releases](https://github.com/ggerganov/llama.cpp/releases)
   - Extract the binary to: `./bin/llama-cpp`
   - Make it executable: `chmod +x ./bin/llama-cpp`

### Directory Structure

\`\`\`
project-root/
├── models/
│   ├── mistral-7b-instruct-v0.1.gguf
│   └── codellama-7b-instruct.gguf
├── bin/
│   └── llama-cpp
└── ...
\`\`\`

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd savi-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file:
   \`\`\`env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/savi-ai

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key

   # AI Models (optional - for custom paths)
   MISTRAL_MODEL_PATH=./models/mistral-7b-instruct-v0.1.gguf
   CODELLAMA_MODEL_PATH=./models/codellama-7b-instruct.gguf
   LLAMA_CPP_PATH=./bin/llama-cpp
   \`\`\`

4. **Download AI models** (see Prerequisites section above)

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## AI Model Setup Guide

### Option 1: Automatic Download (Recommended)

Run the setup script to automatically download models:
\`\`\`bash
npm run setup-models
\`\`\`

### Option 2: Manual Download

1. **Create directories**:
   \`\`\`bash
   mkdir -p models bin
   \`\`\`

2. **Download Mistral 7B**:
   \`\`\`bash
   wget -O models/mistral-7b-instruct-v0.1.gguf \
     https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf
   \`\`\`

3. **Download CodeLlama**:
   \`\`\`bash
   wget -O models/codellama-7b-instruct.gguf \
     https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF/resolve/main/codellama-7b-instruct.Q4_K_M.gguf
   \`\`\`

4. **Download llama.cpp**:
   \`\`\`bash
   # For Linux/Mac
   wget -O bin/llama-cpp https://github.com/ggerganov/llama.cpp/releases/latest/download/llama-cpp-linux
   chmod +x bin/llama-cpp
   
   # For Windows
   wget -O bin/llama-cpp.exe https://github.com/ggerganov/llama.cpp/releases/latest/download/llama-cpp-windows.exe
   \`\`\`

## Usage

### For Students

1. **Register/Login**: Create an account or sign in
2. **Choose Practice Mode**:
   - **Aptitude**: Practice quantitative aptitude with AI-generated questions
   - **Coding**: Solve programming problems in multiple languages
   - **Mock Interview**: Take AI-powered interview sessions
3. **Track Progress**: View detailed analytics in your profile

### For Administrators

1. **Login with admin role**
2. **Access Admin Dashboard**: View user statistics and system metrics
3. **Manage Content**: Monitor AI model performance and usage

## API Endpoints

### AI Generation
- `POST /api/ai/generate-aptitude` - Generate aptitude questions
- `POST /api/ai/generate-coding` - Generate coding problems

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Interview
- `POST /api/interview` - Interview session management

## Development

### Project Structure
\`\`\`
src/
├── app/                 # Next.js 13+ app directory
│   ├── api/            # API routes
│   ├── aptitude/       # Aptitude practice pages
│   ├── coding/         # Coding practice pages
│   └── profile/        # User profile pages
├── components/         # Reusable React components
├── lib/               # Utility functions and services
│   ├── ai-models.ts   # AI model management
│   ├── ai-service.ts  # AI service integration
│   └── session-manager.ts # Session management
└── styles/            # Global styles
\`\`\`

### Key Components

- **RouteGuard**: Protects routes based on user roles
- **ThemeProvider**: Manages dark/light theme switching
- **SessionManager**: Handles auto-logout and session security
- **AIService**: Interfaces with offline AI models

### Adding New Features

1. **New Practice Topics**: Add to topic arrays in respective page files
2. **New Languages**: Update language support in coding components
3. **New AI Models**: Extend `AIModelManager` class in `lib/ai-models.ts`

## Troubleshooting

### Common Issues

1. **AI Models Not Loading**
   - Verify model files are in correct directories
   - Check file permissions and sizes
   - Ensure llama.cpp binary is executable

2. **Session Issues**
   - Clear browser localStorage and cookies
   - Check NEXTAUTH_SECRET in environment variables

3. **Theme Not Working**
   - Verify ThemeProvider is wrapping the app
   - Check Tailwind CSS configuration

4. **MongoDB Connection**
   - Ensure MongoDB is running
   - Verify MONGODB_URI in environment variables

### Performance Optimization

- **Model Loading**: Models are loaded on-demand to save memory
- **Caching**: API responses are cached for better performance
- **Lazy Loading**: Components are loaded as needed

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation wiki

---

**Note**: This application uses offline AI models for privacy and performance. Initial setup requires downloading large model files (~8GB total). Ensure you have sufficient disk space and a stable internet connection for the initial download.
