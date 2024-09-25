// Get references to DOM elements
const subscriptionForm = document.getElementById('subscription-form');
const subscriptionUrlInput = document.getElementById('subscription-url');
const subscriptionsList = document.getElementById('subscriptions-list');
const includePastEventsCheckbox = document.getElementById('include-past-events');
const includeFutureEventsCheckbox = document.getElementById('include-future-events');
const timezoneSelect = document.getElementById('timezone');
const dateFormatSelect = document.getElementById('date-format');
const mergedCalendarOutput = document.getElementById('merged-calendar-output');

// Populate timezone and date format options
const timezones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];
timezones.forEach((timezone) => {
  const option = document.createElement('option');
  option.value = timezone;
  option.text = timezone;
  timezoneSelect.appendChild(option);
});

const dateFormats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
dateFormats.forEach((dateFormat) => {
  const option = document.createElement('option');
  option.value = dateFormat;
  option.text = dateFormat;
  dateFormatSelect.appendChild(option);
});

// Handle form submission
subscriptionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const subscriptionUrl = subscriptionUrlInput.value;
  try {
    await addSubscription(subscriptionUrl);
    subscriptionUrlInput.value = '';
    renderSubscriptions();
  } catch (error) {
    console.error('Error adding subscription:', error);
  }
});

// Render subscriptions list
function renderSubscriptions() {
  subscriptionsList.innerHTML = '';
  subscriptions.calendars.forEach((subscription) => {
    const li = document.createElement('li');
    li.textContent = subscription.url;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeSubscription(subscription.url);
      renderSubscriptions();
    });
    li.appendChild(removeButton);
    subscriptionsList.appendChild(li);
  });
}

// Handle configuration changes
includePastEventsCheckbox.addEventListener('change', handleConfigurationChange);
includeFutureEventsCheckbox.addEventListener('change', handleConfigurationChange);
timezoneSelect.addEventListener('change', handleConfigurationChange);
dateFormatSelect.addEventListener('change', handleConfigurationChange);

async function handleConfigurationChange() {
  const config = {
    filter: {
      includePastEvents: includePastEventsCheckbox.checked,
      includeFutureEvents: includeFutureEventsCheckbox.checked,
    },
    format: {
      timezone: timezoneSelect.value,
      dateFormat: dateFormatSelect.value,
    },
  };
  try {
    const mergedFeed = await mergeCalendars(config);
    mergedCalendarOutput.textContent = JSON.stringify(mergedFeed, null, 2);
  } catch (error) {
    console.error('Error merging calendars:', error);
  }
}

// Initial render
renderSubscriptions();
handleConfigurationChange();