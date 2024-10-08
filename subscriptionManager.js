import { fileURLToPath } from 'url'; // Import for converting module URL to file path
import { dirname, join } from 'path'; // Import for handling file paths
import { promises as fs } from 'fs'; // Import fs.promises for asynchronous file operations

// Define the path to the 'subscriptions.json' file
const __dirname = dirname(fileURLToPath(import.meta.url)); // Get the directory name of the current module
const subscriptionsFile = join(__dirname, 'subscriptions.json'); // Join directory name with the file name

// Load existing subscriptions from the 'subscriptions.json' file asynchronously
let subscriptions;

try {
  // Read the file asynchronously with UTF-8 encoding
  const data = await fs.readFile(subscriptionsFile, 'utf-8');
  subscriptions = JSON.parse(data); // Parse the file content to JSON
} catch (err) {
  console.error(`Error reading subscriptions file: ${err.message}`); // Log any errors that occur
}

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
    subscriptions.calendars[index].url = newUrl; // Update the URL
    await saveSubscriptions(); // Save the updated subscriptions list to the file
  }
}

// Save the updated subscriptions to the 'subscriptions.json' file
async function saveSubscriptions() { 
  await fs.writeFile(subscriptionsFile, JSON.stringify(subscriptions, null, 2)); // Write the updated 'subscriptions' object to the file asynchronously, with indentation for readability
}

// Export the subscription management functions for use in other parts of the application
export default { getSubscriptions, addSubscription, removeSubscription, updateSubscription };
