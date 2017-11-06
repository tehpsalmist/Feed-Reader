/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */

        it('are defined.', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        // This was my initial attempt, which produced fewer Jasmine specs,
        // but seemed to bypass the usefulness of the Jasmine matchers.

        /*
        it('has a url string for each feed', function() {
            let feedLength = allFeeds.length;
            let hasURL = allFeeds
                .filter(feed => typeof(feed.url) === 'string')
                .filter(feed => feed.url.includes('http'));
            expect(hasURL.length).toEqual(feedLength);
        });


        it('has a name defined for each feed', function() {
            let feedLength = allFeeds.length;
            let hasName = allFeeds
                .filter(feed => typeof(feed.name) === 'string')
                .filter(feed => feed.name !== '');
            expect(hasName.length).toEqual(feedLength);
        })
        */

        // I preferred this version because of its simplicity and the fact
        // that the spec would reveal the exact location of the failed property.
        allFeeds.forEach((feed, index) => {
            it('Feed ' + index + ' has a url string', function() {
                expect(typeof(feed.url)).toEqual('string');
                // making sure the string isn't empty, but also that it is likely a legit url
                expect(feed.url).toContain('http');
            });

            it('and has a defined name.', function() {
            	// checking both criteria ensures that null/undefined/etc. don't pass
                expect(typeof(feed.name)).toEqual('string');
                expect(feed.name).not.toEqual('');
            });
        });
    });

    describe('The menu', function() {
    	// I don't prefer to use jQuery, so I didn't.
        const body = window.document.body;
        const menu = document.getElementsByClassName('menu-icon-link')[0];

        it('is hidden by default.', function() {
            expect(body.classList).toContain('menu-hidden');
        });

        it('toggles visibility when clicked.', function() {
            menu.click();
            expect(window.document.body.classList).not.toContain('menu-hidden');
            menu.click();
            expect(window.document.body.classList).toContain('menu-hidden');
        });
    });

    // Asynchronous behavior requires the use of Jasmine's nifty done() function
    describe('Initial Entries', function() {
    	// This test compares the number of .entry elements in .feed with 0 after
    	// the async load is complete.
        
        const feed = document.getElementsByClassName('feed')[0];
        
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        it('load at least one entry in the feed.', function(done) {
            expect($('.feed .entry').length).toBeGreaterThan(0);
            done();
        });
    });

    // Asynchronous behavior requires the use of Jasmine's nifty done() function...hey, is there an echo in here?
    describe('New Feed Selection', function() {
        // This test stores the state of .feed's html after 2 different feeds load,
        // then compares them in the expectation.

        let feedZero;
        let feedTwo;

        beforeEach(function(done) {
        	loadFeed(2, function() {
            	feedTwo = $('.feed').html();
            	loadFeed(0, function() {
                    feedZero = $('.feed').html();
                    done();
                });
            });
        });

        it('changes the content of the feed entries.', function() {
      		expect(feedZero).not.toEqual(feedTwo);
        });
    });
}());
