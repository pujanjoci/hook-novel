# Hook-Novel — Backend Setup Guide

This guide will walk you through setting up the Google Sheets database and the Google Apps Script API for your platform.

---

## Step 1: Create the Spreadsheet
1. Create a new Google Spreadsheet.
2. Give it a name (e.g., `Hook-Novel Database`).
3. Take note of the **Spreadsheet ID** (the long string in the URL between `/d/` and `/edit`).

## Step 2: Open Apps Script
1. Inside your spreadsheet, go to **Extensions** > **Apps Script**.
2. Rename the project to `hook-novel-api`.
3. You will see a file named `Code.gs` on the left sidebar.

## Step 3: Add the Backend Code
Delete everything inside the `Code.gs` file and paste the entire block below. 

> [!NOTE]
> All the code below should reside in the same **`Code.gs`** file. You do not need multiple files for this project.

### `Code.gs`
```javascript
/**
 * hook-novel — Google Apps Script Backend
 * Handles CRUD for Novels and Chapters via Next.js
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const API_KEY = "YOUR_SECRET_API_KEY_HERE"; // CHANGE THIS AND UPDATE .env.local

/**
 * Main Router for READ operations
 */
function doGet(e) {
  // Graceful handling for manual runs in the editor
  if (!e || !e.parameter) {
    return error("No parameters provided. Access via Web App URL.");
  }

  const action = e.parameter.action;
  
  try {
    switch (action) {
      case "getNovels":
        return success(getNovels(true));
      case "getAllNovels":
        return success(getNovels(false));
      case "getFeaturedNovels":
        return success(getFeaturedNovels());
      case "getNovelBySlug":
        return success(getNovelBySlug(e.parameter.slug));
      case "getNovelById":
        return success(getNovelById(e.parameter.id));
      case "getChapter":
        return success(getChapter(e.parameter.novelSlug, parseInt(e.parameter.number)));
      case "getChapterById":
        return success(getChapterById(e.parameter.id));
      case "getAllChapters":
        return success(getAllChapters(e.parameter.novelId));
      case "getDashboardStats":
        return success(getDashboardStats());
      default:
        return error("Invalid GET action: " + action);
    }
  } catch (err) {
    return error(err.toString());
  }
}

/**
 * Main Router for WRITE operations
 */
function doPost(e) {
  // Graceful handling for manual runs in the editor
  if (!e || !e.parameter) {
    return error("No parameters provided. Access via Next.js application.");
  }

  const action = e.parameter.action;
  const authKey = e.parameter.key;
  
  // Security Check
  if (authKey !== API_KEY) {
    return error("Unauthorized: Invalid API Key");
  }

  const payload = JSON.parse(e.postData.contents);

  try {
    switch (action) {
      case "createNovel":
        return success(createNovel(payload));
      case "updateNovel":
        return success(updateNovel(e.parameter.id, payload));
      case "createChapter":
        return success(createChapter(e.parameter.novelId, payload));
      case "updateChapter":
        return success(updateChapter(e.parameter.id, payload));
      case "deleteChapter":
        return success(deleteChapter(e.parameter.id));
      default:
        return error("Invalid POST action: " + action);
    }
  } catch (err) {
    return error(err.toString());
  }
}

// --- NOVEL ACTIONS ---

function getNovels(onlyPublished = true) {
  const novels = dbFetch("Novels");
  return onlyPublished ? novels.filter(n => n.isPublished === true) : novels;
}

function getFeaturedNovels() {
  const novels = getNovels(true);
  return novels.slice(0, 4);
}

function getNovelBySlug(slug) {
  const novel = dbFetch("Novels").find(n => n.slug === slug);
  if (!novel) return null;
  
  const chapters = dbFetch("Chapters")
    .filter(c => c.novelId === novel.id && c.status === "published")
    .map(({ content, ...rest }) => rest)
    .sort((a, b) => a.number - b.number);
    
  return { ...novel, chapters };
}

function getNovelById(id) {
  return dbFetch("Novels").find(n => n.id === id) || null;
}

function createNovel(data) {
  const id = generateId();
  const slug = slugify(data.title);
  const now = new Date().toISOString();
  
  const newNovel = {
    id,
    slug,
    title: data.title,
    author: data.author,
    synopsis: data.synopsis,
    coverUrl: data.coverUrl,
    genres: JSON.stringify(data.genres),
    chapterCount: 0,
    wordCount: 0,
    createdAt: now,
    updatedAt: now,
    isPublished: data.isPublished || false
  };
  
  dbAppend("Novels", newNovel);
  return newNovel;
}

function updateNovel(id, data) {
  const rows = dbFetch("Novels");
  const index = rows.findIndex(r => r.id === id);
  if (index === -1) throw "Novel not found";
  
  const updated = {
    ...rows[index],
    ...data,
    genres: data.genres ? JSON.stringify(data.genres) : rows[index].genres,
    slug: data.title ? slugify(data.title) : rows[index].slug,
    updatedAt: new Date().toISOString()
  };
  
  dbUpdateRow("Novels", index + 2, updated);
  return updated;
}

// --- CHAPTER ACTIONS ---

function getChapter(novelSlug, number) {
  const novel = dbFetch("Novels").find(n => n.slug === novelSlug);
  if (!novel) return null;
  
  return dbFetch("Chapters").find(c => c.novelId === novel.id && c.number === number && c.status === "published") || null;
}

function getAllChapters(novelId) {
  return dbFetch("Chapters")
    .filter(c => c.novelId === novelId)
    .map(({ content, ...rest }) => rest)
    .sort((a, b) => a.number - b.number);
}

function getChapterById(id) {
  return dbFetch("Chapters").find(c => c.id === id) || null;
}

function createChapter(novelId, data) {
  const id = generateId();
  const wordCount = countWords(data.content);
  const now = new Date().toISOString();
  
  const newChapter = {
    id,
    novelId,
    number: data.number,
    title: data.title,
    content: data.content,
    wordCount,
    status: data.status || "draft",
    createdAt: now,
    publishedAt: data.status === "published" ? now : ""
  };
  
  dbAppend("Chapters", newChapter);
  updateNovelStats(novelId);
  return newChapter;
}

function updateChapter(id, data) {
  const rows = dbFetch("Chapters");
  const index = rows.findIndex(r => r.id === id);
  if (index === -1) throw "Chapter not found";
  
  const wordCount = data.content ? countWords(data.content) : rows[index].wordCount;
  const now = new Date().toISOString();
  
  const updated = {
    ...rows[index],
    ...data,
    wordCount,
    publishedAt: (data.status === "published" && !rows[index].publishedAt) ? now : rows[index].publishedAt
  };
  
  dbUpdateRow("Chapters", index + 2, updated);
  updateNovelStats(updated.novelId);
  return updated;
}

function deleteChapter(id) {
  const rows = dbFetch("Chapters");
  const index = rows.findIndex(r => r.id === id);
  if (index === -1) throw "Chapter not found";
  
  const novelId = rows[index].novelId;
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Chapters");
  sheet.deleteRow(index + 2);
  
  updateNovelStats(novelId);
  return { deleted: true };
}

// --- STATS ---

function getDashboardStats() {
  const novels = dbFetch("Novels");
  const chapters = dbFetch("Chapters");
  
  return {
    novelCount: novels.length,
    publishedChapters: chapters.filter(c => c.status === "published").length,
    draftChapters: chapters.filter(c => c.status === "draft").length,
    totalWordCount: novels.reduce((acc, n) => acc + (parseInt(n.wordCount) || 0), 0)
  };
}

function updateNovelStats(novelId) {
  const chapters = dbFetch("Chapters").filter(c => c.novelId === novelId && c.status === "published");
  const wordCount = chapters.reduce((acc, c) => acc + (parseInt(c.wordCount) || 0), 0);
  
  updateNovel(novelId, {
    chapterCount: chapters.length,
    wordCount: wordCount
  });
}

// --- DATABASE UTILITIES ---

function dbFetch(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let val = row[i];
      if (h === "genres" && typeof val === "string") {
        try { obj[h] = JSON.parse(val); } catch(e) { obj[h] = []; }
      } else {
        obj[h] = val;
      }
    });
    return obj;
  });
}

function dbAppend(sheetName, obj) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(h => obj[h] ?? "");
  sheet.appendRow(row);
}

function dbUpdateRow(sheetName, rowNum, obj) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const values = [headers.map(h => obj[h] ?? "")];
  sheet.getRange(rowNum, 1, 1, headers.length).setValues(values);
}

// --- HELPERS ---

function success(data) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function error(message) {
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * INITIAL SETUP SCRIPT
 * Run this ONCE to create the sheets and headers.
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const schemas = {
    "Novels": ["id", "slug", "title", "author", "synopsis", "coverUrl", "genres", "chapterCount", "wordCount", "createdAt", "updatedAt", "isPublished"],
    "Chapters": ["id", "novelId", "number", "title", "content", "wordCount", "status", "createdAt", "publishedAt"]
  };
  
  for (const name in schemas) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    sheet.clear();
    sheet.getRange(1, 1, 1, schemas[name].length).setValues([schemas[name]]);
    sheet.setFrozenRows(1);
  }
  
  Logger.log("Setup complete. You can now deploy as a Web App.");
}
```

## Step 4: Run the Setup
1. In the Apps Script toolbar, select **`setup`** from the function dropdown (located next to the "Run" button).
2. Click **Run**.
3. Authorize the script when prompted.
4. Check your Spreadsheet; you should see two new tabs: `Novels` and `Chapters`.

## Step 5: Deploy the Web App
1. Click **Deploy** > **New deployment**.
2. Select type: **Web app**.
3. Description: `Hook-Novel API v1`.
4. Execute as: **Me**.
5. Who has access: **Anyone**. (Authentication is handled via your API Key).
6. Click **Deploy**.
7. Copy the **Web App URL**.

## Step 6: Update your Next.js project
1. In your project, open `.env.local`.
2. Set `GAS_ENDPOINT` to the Web App URL you just copied.
3. Set `GAS_KEY` to your chosen `API_KEY` (the one you set in Step 3).

Example `.env.local`:
```env
GAS_ENDPOINT=https://script.google.com/macros/s/.../exec
GAS_KEY=YOUR_SECRET_API_KEY_HERE
```

---

## Troubleshooting

### Error: `TypeError: Cannot read properties of undefined (reading 'parameter')`
This error occurs if you try to click the **"Run"** button while `doGet` or `doPost` is selected. 

**Why it happens:** These functions expect to be triggered by an actual web request (from your app or browser). When run manually from the editor, the required "event object" (the `e` inside the parentheses) is missing.

**The Fix:** 
1. **Don't run `doGet` manually.** It is only meant to be run by the platform.
2. If you want to test the connection, use the **Web App URL** provided in Step 5 and append something like `?action=getNovels` to the end of it in your browser.
3. **Always use the `setup` function** for initial configuration.

