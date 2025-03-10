````markdown
# Local Events Aggregator Scraper

This project is a local events aggregator scraper built using Apify's Crawlee framework. It collects event information from multiple sources (e.g., Meetup, Eventbrite, and a dummy LocalEvents site) and outputs structured event data in JSON format.

## Features

-   **Multi-Source Scraping:** Aggregates events from multiple platforms.
-   **Configurable Input:** Specify city, event types, date range, maximum items, and sources.
-   **Pagination Handling:** Automatically follows "next page" links.
-   **Modular Architecture:** Easily extendable to add more sources or enhance data extraction logic.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher recommended)
-   NPM (comes with Node.js)
-   [Apify SDK](https://docs.apify.com/)
-   [Crawlee](https://docs.apify.com/crawlee)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/local-events-scraper.git
    ```
````

2. **Navigate into the project directory:**

    ```bash
    cd local-events-scraper
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

## Configuration

The scraper accepts a JSON input for configuration. An example configuration is shown below:

```json
{
    "city": "San Francisco",
    "eventTypes": ["music", "tech"],
    "startDate": "2025-01-01",
    "endDate": "2025-12-31",
    "maxItems": 100,
    "sources": ["Meetup", "Eventbrite", "LocalEvents"]
}
```

-   **city:** Target city for events.
-   **eventTypes:** Array of event categories for filtering.
-   **startDate & endDate:** Date range for events (currently not applied pre-scrape).
-   **maxItems:** Maximum number of events to scrape.
-   **sources:** List of platforms to scrape from.

## Usage

To run the scraper, simply execute:

```bash
node main.js
```

The crawler will process the start URLs based on the provided configuration. When the crawl completes, the scraped event data will be saved to the default dataset (or can be further processed as needed).

## Code Structure

-   **main.js:**

    -   Initializes the actor and reads input configuration.
    -   Sets up the proxy configuration.
    -   Constructs start URLs based on selected sources.
    -   Configures and starts the CheerioCrawler with our routing logic.

-   **routes.js:**
    -   Defines the router with default handlers for event listing pages.
    -   Implements source-specific data extraction and pagination handling.
    -   Collects all scraped event objects for output.

## Customization

-   **Date Filtering:**  
    Currently, `startDate` and `endDate` are part of the input schema but not used. You can implement pre-scrape filtering (by modifying the URLs) or post-scrape filtering within the router handlers.
-   **Selectors:**  
    Adjust CSS selectors in `routes.js` to match changes in the target websites.
-   **Additional Sources:**  
    Extend the router and main file logic to add more event sources as needed.

## License

This project is licensed under the [MIT License](LICENSE).

## Contributing

Contributions, suggestions, and improvements are welcome! Please feel free to open issues or pull requests.

```

```
