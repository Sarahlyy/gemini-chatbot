// import puppeteer from 'puppeteer';
// import mongoose from 'mongoose';
// import {DataModel} from './models/data.js';
import dotenv from 'dotenv';
dotenv.config();


import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { DataModel } from "./models/data.js";

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

// Function to scrape data and save to MongoDB
const scrapeAndSaveData = async (urls) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    for (const url of urls) {
      await page.goto(url, { waitUntil: "networkidle2" });

      // Extract data
      const data = await page.evaluate(() => {
        const questions = Array.from(document.querySelectorAll("h4")).map(
          (el) => el.textContent.trim()
        );
        const answers = Array.from(document.querySelectorAll("p")).map((el) =>
          el.textContent.trim()
        );

        // Pair questions with answers
        return questions.map((question, index) => ({
          question,
          answer: answers[index] || "No answer available", // Default if no answer is available
        }));
      });

      // Save data to MongoDB
      await DataModel.insertMany(data);
      console.log(`Data from ${url} saved to MongoDB`);
    }
  } catch (error) {
    console.error("Error scraping or saving data:", error);
  } finally {
    await browser.close(); // Close the browser
  }
};

// Execution block
(async () => {
  // Connect to MongoDB
  await connectToMongoDB();

  // Define the list of URLs to scrape
  const urls = [
    "https://gra.gov.gh/tin/tin-faq/",
    "https://gra.gov.gh/customs/customs-faq/",
    "https://gra.gov.gh/domestic-tax/domestic-tax-faq/",

    // Add more URLs as needed
  ];

  // Run the scraping function
  await scrapeAndSaveData(urls);
})();
