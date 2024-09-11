const fs = require('fs');
const path = require('path');

const cacheFile = path.join(__dirname, 'calendar-cache.json');

// Function to read cache data
async function readCache() {
  try {
    const cacheData = await fs.promises.readFile(cacheFile, 'utf8');
    return JSON.parse(cacheData);
  } catch (error) {
    return {};
  }
}

// Function to write cache data
async function writeCache(data) {
  await fs.promises.writeFile(cacheFile, JSON.stringify(data, null, 2));
}


export {readCache, writeCache};
export default readCache;
