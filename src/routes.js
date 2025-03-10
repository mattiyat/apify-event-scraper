import { createCheerioRouter } from 'crawlee';

// This array will collect all our event objects.
export const events = [];
export const router = createCheerioRouter();

// The default handler processes the main listing pages.
router.addDefaultHandler(async ({ request, $, log, enqueueLinks }) => {
    const { source, eventTypes } = request.userData;
    log.info(`Processing ${request.url} for source: ${source}`);
    const category = eventTypes ? eventTypes.join(', ') : 'general';

    if (events.length >= request.userData.maxItems) {
        log.info(`Max events reached ${request.userData.maxItems}, exiting`);
        return;
    }

    if (source === 'Meetup') {
        $('.eventCard--link').each((index, el) => {
            if (events.length >= request.userData.maxItems) {
                return;
            }
            const eventName = $(el).find('.eventCardHead--title').text().trim();
            const eventDate = $(el).find('time').attr('datetime') || '';
            const location = $(el).find('.venueDisplay').text().trim();
            const ticketURL = $(el).attr('href') || '';
            if (eventName) {
                events.push({
                    eventName,
                    eventDate,
                    eventTime: '', // Add extraction for time if available.
                    location,
                    description: '', // Optionally extract more details.
                    ticketURL,
                    eventCategory: category,
                    source,
                    imageURL: '', // Optionally extract an image URL.
                    scrapeTimestamp: new Date().toISOString(),
                });
            }
        });
        // Look for a pagination link and enqueue it.
        const nextLink = $('a.next-page').attr('href');
        if (nextLink) {
            await enqueueLinks({
                urls: [nextLink],
                userData: { source, eventTypes, maxItems: request.userData.maxItems },
            });
        }
    } else if (source === 'Eventbrite') {
        $('div.eds-event-card-content__content').each((index, el) => {
            if (events.length >= request.userData.maxItems) {
                return;
            }
            const eventName = $(el).find('.eds-event-card-content__title').text().trim();
            const eventDate = $(el).find('time').attr('datetime') || '';
            const location = $(el).find('.card-text--truncated__one').text().trim();
            const ticketURL = $(el).closest('a').attr('href') || '';
            if (eventName) {
                events.push({
                    eventName,
                    eventDate,
                    eventTime: '',
                    location,
                    description: '',
                    ticketURL,
                    eventCategory: category,
                    source,
                    imageURL: '',
                    scrapeTimestamp: new Date().toISOString(),
                });
            }
        });
        const nextLink = $('a.eds-btn--pagination').last().attr('href');
        if (nextLink) {
            await enqueueLinks({
                urls: [nextLink],
                userData: { source, eventTypes, maxItems: request.userData.maxItems },
            });
        }
    } else if (source === 'LocalEvents') {
        $('div.event-item').each((index, el) => {
            if (events.length >= request.userData.maxItems) {
                return;
            }
            const eventName = $(el).find('h2.event-title').text().trim();
            const eventDate = $(el).find('span.event-date').text().trim();
            const location = $(el).find('div.event-location').text().trim();
            const ticketURL = $(el).find('a.event-details').attr('href') || '';
            if (eventName) {
                events.push({
                    eventName,
                    eventDate,
                    eventTime: '',
                    location,
                    description: $(el).find('p.event-description').text().trim() || '',
                    ticketURL,
                    eventCategory: category,
                    source,
                    imageURL: $(el).find('img.event-image').attr('src') || '',
                    scrapeTimestamp: new Date().toISOString(),
                });
            }
        });
        const nextLink = $('a.next-page').attr('href');
        if (nextLink) {
            await enqueueLinks({
                urls: [nextLink],
                userData: { source, eventTypes, maxItems: request.userData.maxItems },
            });
        }
    }
});

// Optional: A specific handler for detail pages if you decide to enqueue detail URLs.
router.addHandler('detail', async ({ request, $, log }) => {
    log.info(`Processing detail page: ${request.url}`);
    // Add detail extraction logic here if necessary.
});
