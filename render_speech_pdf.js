const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ShopSphere - Presentation Speech</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 18mm 16mm 18mm 16mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #0f172a;
      background: #ffffff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #6366f1;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 20pt;
      font-weight: 800;
      color: #1e1b4b;
      margin: 0 0 6px 0;
    }
    .header p {
      font-size: 10pt;
      color: #64748b;
      margin: 0;
    }
    .speaker-card {
      margin-bottom: 18px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .speaker-header {
      background: #f8fafc;
      padding: 8px 14px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .speaker-name {
      font-size: 12pt;
      font-weight: 800;
      color: #312e81;
    }
    .speaker-role {
      font-size: 9pt;
      font-weight: 600;
      color: #6366f1;
      background: #eef2ff;
      padding: 2px 8px;
      border-radius: 12px;
    }
    .speaker-time {
      font-size: 9pt;
      color: #64748b;
      font-weight: 600;
    }
    .speech-body {
      padding: 14px;
      font-size: 10.5pt;
      color: #1e293b;
      background: #ffffff;
    }
    .speech-body p {
      margin: 0 0 8px 0;
    }
    .speech-body p:last-child {
      margin-bottom: 0;
    }
    .speech-body ul {
      margin: 4px 0 8px 0;
      padding-left: 20px;
    }
    .speech-body li {
      margin-bottom: 4px;
    }
    .demo-step {
      background: #f1f5f9;
      padding: 6px 10px;
      border-radius: 6px;
      margin-bottom: 6px;
      font-size: 10pt;
    }
    .demo-step strong {
      color: #4338ca;
    }
  </style>
</head>
<body>

  <div class="header">
    <h1>🎙️ ShopSphere Presentation Speech</h1>
    <p><strong>Team:</strong> Shreya Khandelwal (Lead) • Khushboo Lakhani • Mahek &nbsp;|&nbsp; <strong>Duration:</strong> 5–7 Minutes</p>
  </div>

  <!-- Part 1: Shreya -->
  <div class="speaker-card">
    <div class="speaker-header">
      <span class="speaker-name">1. Shreya Khandelwal (Team Lead)</span>
      <span class="speaker-role">Intro & Platform Architecture</span>
      <span class="speaker-time">⏱️ 2 Mins</span>
    </div>
    <div class="speech-body">
      <p><em>"Hi everyone, today our team is presenting <strong>ShopSphere</strong>, our full-stack E-Commerce platform built with a complete DevOps automated delivery pipeline.</em></p>
      <p><em>I led the project and focused on the core architecture and DevOps infrastructure:</em></p>
      <ul>
        <li><strong>Full-Stack Architecture:</strong> Built the backend using Node.js and Express, connected to PostgreSQL with an automated SQLite fallback, and built the frontend in React with Vite.</li>
        <li><strong>Docker Architecture:</strong> Containerized both frontend and backend services, and orchestrated the entire platform (app, database, Prometheus, and Grafana) using Docker Compose.</li>
        <li><strong>CI/CD Automation:</strong> Configured an automated declarative Jenkins pipeline and GitHub Actions that runs automated Jest unit tests on every commit, builds Docker images, and deploys the application.</li>
        <li><strong>Monitoring & Telemetry:</strong> Added Prometheus metrics middleware capturing live HTTP traffic, request latencies, and order counters.</li>
      </ul>
      <p><em>I'll now hand over to Khushboo to talk about customer engagement and reviews."</em></p>
    </div>
  </div>

  <!-- Part 2: Khushboo -->
  <div class="speaker-card">
    <div class="speaker-header">
      <span class="speaker-name">2. Khushboo Lakhani</span>
      <span class="speaker-role">Reviews & Ratings System (SHOP-201)</span>
      <span class="speaker-time">⏱️ 1.5 Mins</span>
    </div>
    <div class="speech-body">
      <p><em>"Hi everyone, I was responsible for designing and implementing the <strong>Customer Reviews and Star Ratings system</strong> under Jira ticket <strong>SHOP-201</strong>.</em></p>
      <p><em>Here’s what I built:</em></p>
      <ul>
        <li>An interactive <strong>1-to-5 Star Rating Selector</strong> and feedback submission form.</li>
        <li>Dynamic score recalculation that updates average ratings and review counts instantly.</li>
        <li>Visual rating badges across product cards in the store.</li>
        <li>For our Git workflow, I developed this in my own branch <code>feature/khushboo-product-reviews</code>, followed Jira smart commit conventions, and merged it into main via a peer-reviewed Pull Request.</li>
      </ul>
      <p><em>Now, Mahek will cover our discounts and promotions engine."</em></p>
    </div>
  </div>

  <!-- Part 3: Mahek -->
  <div class="speaker-card">
    <div class="speaker-header">
      <span class="speaker-name">3. Mahek</span>
      <span class="speaker-role">Discounts, Cart & Checkout (SHOP-202)</span>
      <span class="speaker-time">⏱️ 1.5 Mins</span>
    </div>
    <div class="speech-body">
      <p><em>"Hi everyone, I developed the <strong>Coupon and Discount Promotion System</strong>, tracked under Jira user story <strong>SHOP-202</strong>.</em></p>
      <p><em>My key deliverables:</em></p>
      <ul>
        <li>Built the promo code validator supporting percentage discounts like <code>SAVE20</code> (20% off) and flat credits like <code>DEVOPS10</code>.</li>
        <li>Integrated real-time cart subtotal recalculations, updating taxes, discounts, and checkout totals dynamically.</li>
        <li>Ensured discounted orders persist correctly into the database when orders are placed.</li>
        <li>I worked in my branch <code>feature/mahek-discounts-coupons</code>, pushed my commits to GitHub, and merged via Pull Request after passing test checks.</li>
      </ul>
      <p><em>Back to Shreya for the live demo."</em></p>
    </div>
  </div>

  <!-- Part 4: Demo -->
  <div class="speaker-card">
    <div class="speaker-header">
      <span class="speaker-name">4. Shreya Khandelwal</span>
      <span class="speaker-role">Screen Share & Live Demo</span>
      <span class="speaker-time">⏱️ 1 Min</span>
    </div>
    <div class="speech-body">
      <p><em>(Share your screen on <code>http://localhost:3000</code>)</em></p>
      <p><em>"To wrap up, here is our live application:</em></p>
      <div class="demo-step"><strong>1. Catalog:</strong> Products across Electronics, Accessories, and Apparel loaded with live API data.</div>
      <div class="demo-step"><strong>2. Reviews (Khushboo):</strong> Open reviews on any product and submit a star rating.</div>
      <div class="demo-step"><strong>3. Discounts (Mahek):</strong> Open the Cart, apply promo code <code>SAVE20</code>, and see the discount apply instantly.</div>
      <div class="demo-step"><strong>4. DevOps Console:</strong> Click the 'DevOps Console' button in the navbar to show Jenkins build stages, Docker Compose architecture, Jira agile sprint board, and live Prometheus scrape metrics.</div>
      <p style="margin-top: 8px;"><em>Thank you! We’re happy to take any questions."</em></p>
    </div>
  </div>

</body>
</html>`;

const tempHtmlPath = path.join(__dirname, 'speech_render.html');
fs.writeFileSync(tempHtmlPath, htmlContent);

const outputPdfPath = path.join(__dirname, 'ShopSphere_Meeting_Speech.pdf');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

console.log('Rendering Speech PDF...');
const command = `"${chromePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" "${tempHtmlPath}"`;
execSync(command);

console.log('Speech PDF generated successfully at:', outputPdfPath);

// Copy to artifacts directory
const artifactDir = '/Users/shreyakhandelwal/.gemini/antigravity/brain/f1dcc669-2890-48e7-a954-0a1d4a139598';
const artifactPdfPath = path.join(artifactDir, 'ShopSphere_Meeting_Speech.pdf');
fs.copyFileSync(outputPdfPath, artifactPdfPath);
console.log('Copied to artifacts directory:', artifactPdfPath);
