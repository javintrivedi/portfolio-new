const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('response', response => {
    const url = response.url();
    if (url.includes('.glb') || url.includes('.gltf') || url.includes('.obj') || url.includes('.bin') || url.includes('draco') || url.includes('.json')) {
      console.log('Found 3D asset:', url);
    }
  });

  await page.goto('https://yutaabe.com', { waitUntil: 'networkidle2' });
  await browser.close();
})();
