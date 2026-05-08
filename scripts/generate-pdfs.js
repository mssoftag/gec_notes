const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function main() {

  const repoRoot = process.cwd();

  const htmlFiles = fs
    .readdirSync(repoRoot)
    .filter(file =>
      file.endsWith(".html")
    );

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox"
  ]
});

  for (const htmlFile of htmlFiles) {

    const htmlPath = path.join(repoRoot, htmlFile);

    const pdfPath = path.join(
      repoRoot,
      htmlFile.replace(".html", ".pdf")
    );

    const page = await browser.newPage();

    await page.goto(
      "file://" + htmlPath,
      {
        waitUntil: "networkidle0"
      }
    );

    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true
    });

    await page.close();

    console.log("PDF erstellt:", pdfPath);
  }

  await browser.close();
}

main();
