const fs = require('fs'); // Import the 'fs' module for file system operations
const path = require('path'); // Import 'path' module to handle and manipulate file paths

const subscriptionsFile = path.join(__dirname, 'subscriptions.json'); // Define the path to the 'subscriptions.json' file

let subscriptions = require(subscriptionsFile); // Load existing subscriptions from the 'subscriptions.json' file

// Retrieve the list of calendar subscriptions
async function getSubscriptions() {
  return subscriptions.calendars; // Return the array of calendars from the subscriptions
}

// Add a new subscription URL to the list of calendars
async function addSubscription(url) {
  subscriptions.calendars.push({ url }); // Add the new URL to the subscriptions
  await saveSubscriptions(); // Save the updated subscriptions list to the file
}

// Remove a subscription by its URL
async function removeSubscription(url) {
  subscriptions.calendars = subscriptions.calendars.filter((calendar) => calendar.url !== url); // Filter out the calendar with the matching URL
  await saveSubscriptions(); // Save the updated subscriptions list to the file
}

// Update an existing subscription by replacing the old URL with a new one
async function updateSubscription(oldUrl, newUrl) {
  const index = subscriptions.calendars.findIndex((calendar) => calendar.url === oldUrl); // Find the index of the calendar with the old URL
  if (index !== -1) { // If a matching URL is found
    subscriptions.calendars[index].url = newUrl; // update the URL
    await saveSubscriptions(); // Save the updated subscriptions list to the file
  }
}

// Save the updated subscriptions to the 'subscriptions.json' file
async function saveSubscriptions() { 
  fs.writeFileSync(subscriptionsFile, JSON.stringify(subscriptions, null, 2)); // Write the updated 'subscriptions' object to the file, (with indentation for readability)
}

// Export the subscription management functions for use in other parts of the application
export default { getSubscriptions, addSubscription, removeSubscription, updateSubscription };
