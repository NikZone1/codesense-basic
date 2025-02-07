<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CodeSense - Code Reviewer</title>
  <!-- Font Awesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-pO8Cw+UnxTt9T2gy7IXIhlMpaEnOE0bYzN6r8FfKpJ3z5V8/vvysr0eI/Hl8hvX+ft1g+GFw5pLrT+gkPz6+IQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    /* Reset some default styles */
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background-color: #f4f7f9;
      color: #333;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      max-width: 900px;
      width: 100%;
      background: #fff;
      margin: 20px;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h1, h2 {
      text-align: center;
      color: #222;
    }

    h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 1.8em;
      margin-top: 40px;
      margin-bottom: 10px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 5px;
    }

    .section {
      margin-bottom: 30px;
    }

    p, li {
      line-height: 1.6;
      font-size: 1em;
    }

    ul {
      list-style: none;
      padding-left: 0;
    }

    ul li {
      margin-bottom: 10px;
      padding-left: 30px;
      position: relative;
    }

    ul li::before {
      content: "\f058"; /* Font Awesome check icon */
      font-family: "Font Awesome 6 Free";
      font-weight: 900;
      position: absolute;
      left: 0;
      color: #28a745;
    }

    pre {
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      font-family: Consolas, "Courier New", monospace;
      font-size: 0.95em;
    }

    a {
      color: #007bff;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }

    .icon {
      margin-right: 8px;
      color: #007bff;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <h1><i class="fa-solid fa-code icon"></i>CodeSense - Code Reviewer</h1>

    <!-- Features Section -->
    <div class="section">
      <h2><i class="fa-solid fa-star icon"></i>Features</h2>
      <ul>
        <li><strong>Intelligent Code Analysis:</strong> Leverages AI models (Ollama Llama 3.2 or Gemini API) to detect security vulnerabilities, performance bottlenecks, and code quality issues.</li>
        <li><strong>Dual-Platform Solution:</strong> Offers a responsive web interface (built with React, TypeScript, and Tailwind CSS) and GitHub Actions integration for flexible usage.</li>
        <li><strong>Automated Reporting:</strong> Generates detailed markdown reports for clear communication across development teams.</li>
        <li><strong>Language-Agnostic Support:</strong> Compatible with diverse technology stacks and modern microservices architectures.</li>
        <li><strong>Model Flexibility:</strong> Supports multiple AI models (e.g., Ollama Llama 3.2, Gemini API, or any other compatible model).</li>
      </ul>
    </div>

    <!-- System Architecture Section -->
    <div class="section">
      <h2><i class="fa-solid fa-diagram-project icon"></i>System Architecture</h2>
      <p><strong>Web Application</strong></p>
      <p><em>Frontend:</em> Built with React (using Vite) in TypeScript and styled with Tailwind CSS. Supports code paste and file uploads for analysis.</p>
      <p><em>Backend:</em> Powered by Python Flask integrating with AI models (Ollama Llama 3.2 or Gemini API) for code analysis using custom prompts and formatting.</p>
      <p><strong>GitHub Integration:</strong> Includes a custom YAML workflow for repository-wide code scanning and automated markdown report generation for pull requests and reviews.</p>
    </div>

    <!-- Installation & Setup Section -->
    <div class="section">
      <h2><i class="fa-solid fa-cogs icon"></i>Installation & Setup</h2>
      <p><strong>Prerequisites:</strong> Node.js, npm, Python 3, Ollama, and a Gemini API key.</p>
      <p><strong>Steps:</strong></p>
      <pre>
# Clone the Repository
git clone https://github.com/suraj0-11/codesense-basic.git
cd codesense-basic

# Frontend Setup
cd frontend
npm install

# Backend Setup
cd ../backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
      </pre>
    </div>

    <!-- Running the Application Section -->
    <div class="section">
      <h2><i class="fa-solid fa-play icon"></i>Running the Application</h2>
      <p><strong>Start Backend Server:</strong></p>
      <pre>
python main.py
      </pre>
      <p><strong>Start Frontend Development Server:</strong></p>
      <pre>
cd frontend
npm run dev
      </pre>
    </div>

    <!-- GitHub Actions Section -->
    <div class="section">
      <h2><i class="fa-solid fa-code-branch icon"></i>GitHub Actions Setup</h2>
      <p>
        Configure your repository by enabling GitHub Actions (Settings → Actions) and creating a workflow file <code>.github/workflows/code-analysis.yml</code> with the configuration from <code>.github/workflows/ai-code-review.yml</code>.
      </p>
    </div>

    <!-- Expected Outcomes Section -->
    <div class="section">
      <h2><i class="fa-solid fa-check-circle icon"></i>Expected Outcomes</h2>
      <ul>
        <li>Enhanced code quality with immediate AI-powered analysis.</li>
        <li>Streamlined workflow via an intuitive interface and automated reporting.</li>
        <li>Automated repository management with continuous feedback.</li>
        <li>Scalable platform that supports large codebases and future enhancements.</li>
      </ul>
    </div>

    <!-- Contributors Section -->
    <div class="section">
      <h2><i class="fa-solid fa-users icon"></i>Contributors</h2>
      <p>
        <a href="https://github.com/Rubbershredder/">Rubbershredder</a>,
        <a href="https://github.com/NikZone1">NikZone1</a>,
        <a href="https://github.com/suraj0-11">suraj0-11</a>
      </p>
    </div>

    <!-- Acknowledgments Section -->
    <div class="section">
      <h2><i class="fa-solid fa-thumbs-up icon"></i>Acknowledgments</h2>
      <p>
        Special thanks to Ollama Llama 3.2, Gemini API, and GitHub Actions for powering this project.
      </p>
    </div>

    <!-- Footer Section -->
    <div class="section">
      <p>For issues or feature requests, please open an issue on the <a href="https://github.com/suraj0-11/codesense-basic.git">GitHub repository</a>.</p>
      <p>Happy coding! 🚀</p>
    </div>
  </div>
</body>
</html>
