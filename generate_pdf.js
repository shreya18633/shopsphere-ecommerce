const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require(path.join(__dirname, 'backend/node_modules/marked'));

const markdownPath = path.join(__dirname, 'DEVOPS_LAB_REPORT_GROUP_PROJECT.md');
const mdContent = fs.readFileSync(markdownPath, 'utf8');

// Parse markdown to HTML
const htmlBody = marked.parse(mdContent);

const styledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Agile Software and DevOps Lab - Mini Project Report</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.45;
      color: #111;
      background: #fff;
    }
    h1 {
      font-size: 18pt;
      font-weight: 800;
      text-align: center;
      margin-top: 10pt;
      margin-bottom: 4pt;
      color: #0f172a;
    }
    h2 {
      font-size: 14pt;
      font-weight: 700;
      text-align: center;
      margin-top: 2pt;
      margin-bottom: 2pt;
      color: #334155;
    }
    h3 {
      font-size: 11pt;
      font-weight: 600;
      text-align: center;
      margin-top: 2pt;
      margin-bottom: 12pt;
      color: #475569;
    }
    h1:not(:first-of-type) {
      font-size: 13pt;
      font-weight: 800;
      text-align: left;
      border-bottom: 1.5pt solid #0f172a;
      padding-bottom: 3pt;
      margin-top: 18pt;
      margin-bottom: 8pt;
      page-break-after: avoid;
    }
    h2:not(:first-of-type) {
      font-size: 11.5pt;
      font-weight: 700;
      text-align: left;
      margin-top: 12pt;
      margin-bottom: 5pt;
      color: #0f172a;
      page-break-after: avoid;
    }
    h4 {
      font-size: 10.5pt;
      font-weight: 700;
      margin-top: 9pt;
      margin-bottom: 3pt;
      color: #1e293b;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 6pt;
      text-align: justify;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 6pt;
      padding-left: 18pt;
    }
    li {
      margin-bottom: 2.5pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6pt;
      margin-bottom: 10pt;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 4.5pt 6pt;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #0f172a;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    pre, code {
      font-family: "JetBrains Mono", Consolas, "Courier New", monospace;
    }
    pre {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 3pt solid #4f46e5;
      padding: 6pt 8pt;
      border-radius: 3pt;
      font-size: 8.5pt;
      line-height: 1.35;
      margin-top: 3pt;
      margin-bottom: 6pt;
      white-space: pre-wrap;
      word-break: break-all;
      page-break-inside: avoid;
    }
    code:not(pre code) {
      background-color: #f1f5f9;
      color: #4338ca;
      padding: 1pt 3pt;
      border-radius: 2pt;
      font-size: 8.5pt;
    }
    blockquote {
      border-left: 3pt solid #3b82f6;
      background-color: #eff6ff;
      margin: 6pt 0;
      padding: 5pt 10pt;
      font-size: 9pt;
      color: #1e40af;
      page-break-inside: avoid;
    }
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 12pt 0;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  ${htmlBody}
</body>
</html>`;

const tempHtmlPath = path.join(__dirname, 'report_render.html');
fs.writeFileSync(tempHtmlPath, styledHtml);

const outputPdfPath = path.join(__dirname, 'Agile_DevOps_Lab_Report_ShopSphere.pdf');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Rendering PDF using Headless Chrome...');
const command = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" "${tempHtmlPath}"`;
execSync(command);

console.log('PDF Generated successfully at:', outputPdfPath);

// Also copy to artifacts directory for direct user download
const artifactDir = '/Users/shreyakhandelwal/.gemini/antigravity/brain/f1dcc669-2890-48e7-a954-0a1d4a139598';
const artifactPdfPath = path.join(artifactDir, 'Agile_DevOps_Lab_Report_ShopSphere.pdf');
fs.copyFileSync(outputPdfPath, artifactPdfPath);
console.log('Copied to artifacts directory:', artifactPdfPath);
