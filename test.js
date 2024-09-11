const fetchCalendarData = require('./index');

async function testCalendar() {
  const url = 'https://example.com/calendar'; 
  const data = await fetchCalendarData(url);
  console.log(data);
}

testCalendar();