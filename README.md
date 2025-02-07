# <CodeSense?>

**CodeSense - Code Reviewer** is an intelligent code analysis system designed to automate and streamline the code review process in modern development environments. Powered by advanced AI models like **Ollama Llama 3.2** and **Gemini API**, it provides comprehensive code analysis through a responsive web interface and seamless GitHub Actions integration.

---

## Features

- **Intelligent Code Analysis**: Leverages AI models (Ollama Llama 3.2 or Gemini API) to detect security vulnerabilities, performance bottlenecks, and code quality issues.
- **Dual-Platform Solution**: Offers a responsive web interface (built with React, TypeScript, and Tailwind CSS) and GitHub Actions integration for flexible usage.
- **Automated Reporting**: Generates detailed markdown reports for clear communication across development teams.
- **Language-Agnostic Support**: Compatible with diverse technology stacks and modern microservices architectures.
- **Model Flexibility**: Supports multiple AI models (e.g., Ollama Llama 3.2, Gemini API, or any other compatible model). Currently tested and verified for **Gemini API** and **Ollama**.

---

## System Architecture

### Web Application

#### Frontend
- **Framework**: React with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Features**: Text paste and file upload support for code analysis.

#### Backend
- **Server**: Python Flask
- **AI Integration**: Ollama Llama 3.2 or Gemini API
- **Processing**: Custom prompts and response formatting for accurate code analysis.

### GitHub Integration
- **Custom YAML Workflow**: GitHub Actions integration for repository-wide code scanning.
- **Automated Reporting**: Generates markdown reports for pull requests and code reviews.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** and **npm**: Download from [nodejs.org](https://nodejs.org).
- **Python 3**: Download from [python.org](https://python.org).
- **Ollama**: Installation instructions available at [Ollama's GitHub repository](https://github.com/ollama/ollama).
- **Gemini API Key**: If using Gemini, ensure you have an API key.

---

## Installation

### 1. Clone the Repository
```bash
https://github.com/suraj0-11/codesense-basic.git
cd codesense-basic
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory with the required environment variables.

### 3. Backend Setup
```bash
cd ../backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` directory with the necessary configuration (e.g., API keys for Gemini or Ollama).

---

## Running the Application

### 1. Start Backend Server
```bash
# Ensure virtual environment is activated
python main.py
```

### 2. Start Frontend Development Server
```bash
cd frontend
npm run dev
```

---

## GitHub Actions Setup

### 1. Configure Repository Settings
- Navigate to your repository **Settings → Actions → General**.
- Enable Actions.
- Set **Workflow permissions** to **Read and write**.

### 2. Create Workflow File
- Create a new file `.github/workflows/code-analysis.yml`.
- Copy the workflow configuration from `.github/workflows/ai-code-review.yml`.

---

## Expected Outcomes

- **Enhanced Code Quality**: Immediate AI-powered analysis to identify and resolve issues.
- **Streamlined Workflow**: Intuitive interface and automated reporting for faster development cycles.
- **Automated Repository Management**: Continuous feedback and analysis for pull requests and code reviews.
- **Scalable Platform**: Supports large codebases and future enhancements.

---

## Contributors

- [Rubbershredder](https://github.com/Rubbershredder/)
- [NikZone1](https://github.com/NikZone1)
- [suraj0-11](https://github.com/suraj0-11)

We welcome contributions from the community! Please follow standard GitHub pull request procedures.

---

## Acknowledgments

- **Ollama Llama 3.2** for providing the AI model.
- **Gemini API** for enabling flexible AI integration.
- **GitHub Actions** for continuous integration and workflow automation.

---

## Notes on AI Models

This project is designed to work with multiple AI models, including **Ollama Llama 3.2** and **Gemini API**. While the system has been tested and verified for Gemini and Ollama, it is flexible enough to integrate with other compatible models. Ensure you configure the appropriate API keys and settings in the `.env` files for seamless operation.

---

For any issues or feature requests, please open an issue on the [GitHub repository](https://github.com/suraj0-11/codesense-basic.git). Happy coding! 🚀
