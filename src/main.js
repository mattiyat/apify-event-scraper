import { Actor } from 'apify';
import { CheerioCrawler } from 'crawlee';

import { router, events } from './routes.js';

await Actor.init();

const input = await Actor.getInput() || {};
const {
    city = 'San Francisco',
    eventTypes = [],
    startDate = '',
    endDate = '',
    maxItems = 100,
    sources = ['Meetup', 'Eventbrite', 'LocalEvents']
} = input;

const proxyConfiguration = await Actor.createProxyConfiguration();

// Build an array of start URLs based on selected sources.
const startUrls = [];

if (sources.includes('Meetup')) {
    const meetupUrl = `https://www.meetup.com/find/events/?allMeetups=false&radius=10&userFreeform=${encodeURIComponent(city)}`;
    startUrls.push({ url: meetupUrl, userData: { source: 'Meetup', eventTypes, maxItems } });
}

if (sources.includes('Eventbrite')) {
    const eventbriteCity = city.toLowerCase().replace(/\s+/g, '-');
    const eventbriteUrl = `https://www.eventbrite.com/d/ca--${encodeURIComponent(eventbriteCity)}/all-events/`;
    startUrls.push({ url: eventbriteUrl, userData: { source: 'Eventbrite', eventTypes, maxItems } });
}

if (sources.includes('LocalEvents')) {
    // please update this link with the correct website
    const localEventsUrl = `https://localevents.example.com/${encodeURIComponent(city.toLowerCase())}/events`;
    startUrls.push({ url: localEventsUrl, userData: { source: 'LocalEvents', eventTypes, maxItems } });
}

const crawler = new CheerioCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxRequestsPerCrawl: maxItems, // this does not set the actual total of events
});

await crawler.run(startUrls);

// Push all scraped events to the default Apify dataset.
await Actor.pushData(events);

await Actor.exit();
