const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require(path.join(__dirname, 'backend/node_modules/marked'));

const markdownPath = path.join(__dirname, 'MEETING_PRESENTATION_SCRIPT.md');
const mdContent = fs.readFileSync(markdownPath, 'utf8');

// Parse markdown to HTML
const htmlBody = marked.parse(mdContent);

const styledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ShopSphere - Project Presentation & Meeting Script</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm 14mm 16mm 14mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.45;
      color: #0f172a;
      background: #ffffff;
    }
    h1 {
      font-size: 18pt;
      font-weight: 800;
      text-align: center;
      margin-top: 4pt;
      margin-bottom: 3pt;
      color: #1e1b4b;
    }
    h2 {
      font-size: 13pt;
      font-weight: 700;
      color: #312e81;
      border-bottom: 2pt solid #6366f1;
      padding-bottom: 3pt;
      margin-top: 14pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11pt;
      font-weight: 700;
      color: #4338ca;
      margin-top: 10pt;
      margin-bottom: 4pt;
      page-break-after: avoid;
    }
    p {
      margin: 4pt 0 6pt 0;
    }
    strong {
      color: #0f172a;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8pt 0 10pt 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 5pt 7pt;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    blockquote {
      border-left: 3.5pt solid #6366f1;
      background-color: #eef2ff;
      margin: 6pt 0;
      padding: 6pt 10pt;
      font-size: 9.5pt;
      color: #1e1b4b;
      border-radius: 0 4pt 4pt 0;
      page-break-inside: avoid;
    }
    blockquote p {
      margin: 2pt 0;
    }
    ul, ol {
      margin: 4pt 0 6pt 0;
      padding-left: 18pt;
    }
    li {
      margin-bottom: 2pt;
    }
    code {
      background-color: #f1f5f9;
      color: #4338ca;
      padding: 1pt 3pt;
      border-radius: 2pt;
      font-size: 8.5pt;
      font-family: Menlo, Monaco, Consolas, monospace;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 10pt 0;
    }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

const tempHtmlPath = path.join(__dirname, 'meeting_script_render.html');
fs.writeFileSync(tempHtmlPath, styledHtml);

const outputPdfPath = path.join(__dirname, 'ShopSphere_Project_Meeting_Script.pdf');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Rendering PDF using Headless Chrome...');
const command = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" "${tempHtmlPath}"`;
execSync(command);

console.log('PDF Generated successfully at:', outputPdfPath);

// Copy to artifacts directory
const artifactDir = '/Users/shreyakhandelwal/.gemini/antigravity/brain/f1dcc669-2890-48e7-a954-0a1d4a139598';
const artifactPdfPath = path.join(artifactDir, 'ShopSphere_Project_Meeting_Script.pdf');
fs.copyFileSync(outputPdfPath, artifactPdfPath);
console.log('Copied to artifacts directory:', artifactPdfPath);
