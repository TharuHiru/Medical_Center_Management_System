import puppeteer from 'puppeteer';

export const htmlToPdf = async (htmlContent) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
    });
  } finally {
    if (browser) await browser.close();
  }
};