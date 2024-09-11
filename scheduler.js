import cron from 'node-cron';
import { mergeCalendars } from './index.js';

// Schedule the mergeCalendars function to run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    await mergeCalendars();
    console.log('Merged calendar feed updated successfully!');
  } catch (error) {
    console.error(`Error updating merged calendar feed: ${error}`);
  }
});