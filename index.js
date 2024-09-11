// dependencies and modules
import './scheduler.js'; // Handles scheduled tasks (fetching calendar data at intervals)
import config from './config.js'; // Configuration file containing filters, formats, and other settings
import ical from 'ical-parser'; // iCal parser to parse calendar (.ics) files
import fetch from 'node-fetch'; // Used to fetch calendar data from external URLs
import { readCache, writeCache } from './cache.js'; // Functions to read and write cached data
import logger from './logger.js'; // Logger utility (for logging errors and info)
import moment from 'moment-timezone'; // Library for handling dates and timezones
import subscriptionManager from './subscriptionManager.js'; // Manages calendar subscriptions

// Array of calendar subscription URLs (can be expanded as needed)
const calendarUrls = [
  'https://example.com/calendar1.ics',
  'https://example.com/calendar2.ics',
];

// Function to fetch, filter and merge calendar data from multiple sources
export async function mergeCalendars() {
    // Fetch subscriptions from the subscriptionManager
    const subscriptions = await subscriptionManager.getSubscriptions();
    const events = [];
    // Loop through each subscription and fetch its calendar data
    for (const subscription of subscriptions) {
        const calendarData = await fetchCalendarData(subscription.url); // Fetch calendar data
        const filteredEvents = filterEvents(calendarData, config.filter); // Apply the event filters
    
        events.push(...filteredEvents); // Add filtered events to the events array
      }
    
      const formattedFeed = formatFeed(events, config.format);
    
      return formattedFeed;

  /*try {
    const calendars = await Promise.all(calendarUrls.map(fetchCalendarData));
    const mergedCalendar = mergeEvents(calendars);
    return generateCalendarFeed(mergedCalendar);
  } catch (error) {
    logger.error(`Error merging calendars: ${error}`);
  }*/
}

// Function to filter events based on the given filter configuration
function filterEvents(events, filter) {
    const filteredEvents = [];

    // Loop through all events and apply the filter
    for (const event of events) {
      // Filter based on event endDate and startDate (past or future events)
      if ((filter.includePastEvents && event.endDate < new Date()) ||
       (filter.includeFutureEvents && event.startDate > new Date())) {
        filteredEvents.push(event);
      }
    }
  
    return filteredEvents;
  }
  // Function to format events into the desired format (iCal/JSON)
  function formatFeed(events, format) {
    const formattedFeed = [];

    // Loop through each event and format it based on the configuration
    for (const event of events) {
      const formattedEvent = {
        title: event.title, // Event title
        startDate: formatDate(event.startDate, format.dateFormat, format.timezone), // Formatted start date
        endDate: formatDate(event.endDate, format.dateFormat, format.timezone), // Formatted end date
      };
      
      formattedFeed.push(formattedEvent); // Add formatted event to the feed
    }
  
    return formattedFeed;
  }

  function formatDate(date, dateFormat, timezone) {
    return moment(date).tz(timezone).format(dateFormat);
  }

// Function to fetch calendar data from a single URL
export async function fetchCalendarData(url) {
    try {
      // Check if the data is already cached and return if found
      const cacheData = await readCache();
      if (cacheData[url]) {
        return cacheData[url]; // Return cached data if available
      }

      // Fetch the calendar data from the URL
      const response = await fetch(url);
      const icalData = await response.text(); // Read the response as text
      const calendarData = ical.parse(icalData); // Parse the iCal data
  
      // Cache the fetched data for future use
      cacheData[url] = calendarData;
      await writeCache(cacheData);
  
      return calendarData;
    } catch (error) {
      // Log errors encountered during the fetch process
      logger.error(`Error fetching calendar data from ${url}: ${error}`);
    }
}

// Function to merge events from multiple calendars
function mergeEvents(calendars) {
  const mergedEvents = [];
  // Loop through each calendar and merge its events into a single array
  calendars.forEach((calendar) => {
    calendar.events.forEach((event) => {
      mergedEvents.push(event); // Add each event to the mergedEvents array
    });
  });
  return mergedEvents; //return list of merged events
}

// Function to generate a calendar feed from merged events
function generateCalendarFeed(events) {
  const icalFeed = new ical.Feed(); // Create a new iCal feed object
  // Loop through each event and add it to the iCal feed
  events.forEach((event) => {
    icalFeed.addEvent(event); // Add event to the iCal feed
  });
  return icalFeed.toString(); // Convert the feed to a string and return
}

// Call the mergeCalendars function to generate the merged calendar feed
mergeCalendars(); // Initiate the calendar merging process

