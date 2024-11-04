const express = require("express");
const ScrapData = require("../models/scrapdata");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const router = express.Router();
const fs = require('fs');
const path = require('path');
router.use('/api/scrapData/screenshots', express.static(path.join(__dirname, 'screenshots')));

router.get("/", async (req, res) => {
  const data = await ScrapData.find();
  res.json(data);
});
router.get("/screenshots/:imageName", async (req, res) => {
  console.log("_-----------------------", req.body);
  const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'screenshots', imageName);

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        }
    });

});

router.post("/delete", async (req, res) => {
  try {
    console.log(`id's to de deleted`, req.body);

    const result = await ScrapData.deleteMany({
      _id: { $in: req.body.idsToBeDeleted }, 
    });
    console.log(`Deleted ${result.deletedCount} users.`);
    res.json({ message: "Scrapped Data Deleted" });
  } catch (error) {
    console.error("Error deleting users:", error);
  }
});


router.post("/scrape", async (req, res) => {
  const { url } = req.body;
  console.log("Url That we need to scrape is ", url);

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-http2"],
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const html = await page.content();
  const screenshotPath = path.join(__dirname, 'screenshots', `screenshot-${Date.now()}.png`);
  await page.screenshot({ path: screenshotPath });

  
  const screenshotDataUrl = `${process.env.api_url}${process.env.PORT}/api/scrapData/screenshots/${path.basename(screenshotPath)}`;
  console.log('Screenshot captured and saved to:', screenshotDataUrl);
    const $ = cheerio.load(html);
    console.log("-----", $('meta[property="og:title"]'));
    let logoUrl = "";
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}`;
    const response = await fetch(faviconUrl);
    if (response) {
      console.log("IMAAAAAGE", response.url);
      logoUrl = response.url;
    }

    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname; 
    let companyName = hostname.replace("www.", "").split(".")[0];

    companyName = companyName.charAt(0).toUpperCase() + companyName.slice(1);
    if (!companyName) {
      companyName = $("h1.company-name").text().trim()
        ? $("h1.company-name").text().trim()
        : $("title").text().trim();
    }
    console.log("IMAAAAAGE2222222222", response.url);
    const text = $("body").text();
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = text.match(emailPattern);
    const scrapedData = {
      name: companyName
        ? companyName
        : $('meta[property="og:title"]').attr("content") || $("h1").text(),
      metaDescription: $('meta[name="description"]').attr("content"),
      companyLogo: logoUrl
        ? logoUrl
        : $('meta[property="og:image"]').attr("content"),
      facebookUrl: $('a[href*="facebook.com"]').attr("href"),
      linkedinUrl: $('a[href*="linkedin.com"]').attr("href"),
      twitterUrl: $('a[href*="twitter.com"]').attr("href"),
      instagramUrl: $('a[href*="instagram.com"]').attr("href"),
      address:
        $("address").text() ||
        $('meta[property="og:site_name"]').attr("content"),
      phoneNumber: $('a[href^="tel:"]').text(),
      email: emails ? emails : $('a[href^="mailto:"]').text(),
      screenshot: screenshotDataUrl
    };

    console.log(scrapedData);

    await browser.close();
    const newData = new ScrapData({
      name: companyName,
      description: scrapedData.metaDescription,
      cmpLogo: scrapedData.companyLogo,
      url: url,
      fbUrl: scrapedData.linkedinUrl,
      linkedInUrl: scrapedData.linkedinUrl,
      twitterUrl: scrapedData.twitterUrl,
      instaUrl: scrapedData.instagramUrl,
      address: scrapedData.address,
      phnNumber: scrapedData.phoneNumber,
      email: scrapedData.email,
      screenshot: screenshotDataUrl
    });

    const savedScrap = await newData.save();
    res.json(savedScrap);
  } catch (error) {
    console.log("Error:-", error);
    res
      .status(500)
      .json({ message: "Error scraping the URL", error: error.message });
  }
});
module.exports = router;
