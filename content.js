// ==UserScript==
// @name         Trello
// @namespace    http://tampermonkey.net/
// @version      2024-09-11
// @description  Make Trello more compact
// @author       dise
// @match        https://trello.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trello.com
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

const allStyles = `
/* Smaller header */
#header {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}
.board-header > :first-child {
    padding: 0 !important;
}
[data-js-id="header-container"] {
    min-height: 0 !important;
}

/* Fewer elements in cards */
[data-testid="badge-card-subscribed"],
[data-testid="badge-card-description"] {
    display: none !important;
}

/* Badges */
[data-testid="trello-card"] .nch-icon {
    width: 16px !important;
}
[data-testid^="badge-"],[data-testid$="-badge"]:not(.custom-field-detail-item) {
    height: 16px !important;
}

/* Small name badges */
[data-testid="badge-custom-field"] {
    height: 16px !important;
}
[data-testid="card-front-badges"] + div button span {
    width: 16px !important;
    height: 16px !important;
    line-height: 16px !important;
}

/* Labels in cards */
.Ln_WDlu2A5sGGO {
    display: none !important;
}

/* Name badges to the right */
[data-testid="card-name"]/*, [data-testid="card-front-badges"]*/ {
    max-width: 86.5% !important;
}
.D7qoLaQ_ABp2jD {
    top: 6px !important;
    max-width: 40px !important;
    position: absolute !important;
    right: 8px !important;
    column-gap: 1px !important;
    row-gap: 1px !important;
}

/* Remove "N cards match filters" */
.e5LZFj7edvnuic {
    display: none;
}

/* Move card edit button to bottom right */
[data-testid="quick-card-editor-button"] {
    position: absolute !important;
    bottom: 0px !important;
    right: 0px !important;
    top: unset !important;
}

/* Reduce card padding */
[data-testid="trello-card"] > div {
    padding: 4px 7px 4px !important;
    padding-bottom: 0px !important;
}
[data-testid="list-cards"] {
    padding: 0 !important;
    padding-right: 3px !important;
    row-gap: 5.5px !important;
}
[data-testid="list-cards-top-buffer"] {
    display: none !important;
}
[data-testid="list-header"] {
    padding-top: 2px !important;
}
[data-testid="list-header"] {
    padding: 0 2.5px !important;
}
[data-testid="list-wrapper"] {
    padding: 0 2.5px !important;
}
[data-testid="list"] {
    padding-bottom: 0px !important;
}
[data-testid="list-footer"] {
    padding: 0px !important;
}

/* Side nav */
[data-testid="workspace-navigation-nav"], [data-testid="workspace-navigation-collapsed-container"] {
    width: 8px !important;
}
[data-testid="lists"] {
    padding: 0 3px !important;
}

/* Opened card buttons */
.window-sidebar .window-module [data-testid^="card-back"],
.window-sidebar .window-module button,
.window-sidebar .window-module .button-link,
.window-sidebar .window-module .button-link + div,
.window-sidebar .window-module ul {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    height: unset !important;
    margin-top: 0 !important;
}
.window-sidebar .window-module ul {
    row-gap: 0 !important;
    line-height: 0 !important;
}
hgroup /*automation*/ {
    display: none !important;
}
.window-sidebar h3:first-of-type {
    display: none !important;
}
.window-sidebar h3:not(first-of-type) {
    opacity: 0 !important;
}

/* Opened card sidebar items */
.card-detail-window .js-new-card-attachment-picker-react-root-for-sidebar {
    height: unset !important;
    margin-bottom: -1px !important;
    margin-top: -1px !important;
}
/* fix for the above */
.window-sidebar .button-link-container {
    height: unset !important;
    margin-bottom: -1px !important;
    margin-top: 0.5px !important;
}

/* Opened card widths */
[aria-modal="true"] {
    width: 60vw !important;
}
.window-sidebar {
    width: 180px !important;
}
.window-main-col {
    width: calc(60vw - 5vw - 180px) !important;
}

/* Custom fields */
.custom-field-detail-badges-grid {
    row-gap: 0 !important;
}
.window-main-col > div,
.card-detail-item,
.js-card-back-labels-container,
.window-header,
.js-card-detail-header,
.window-header-inline-content,
.u-inline-block{
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
}
[data-elevation="1"] {
    margin: 16px 0 !important;
}


.window-main-col > div,
.window-main-col > div > div {
    padding: 0 !important;
}
.window-main-col section {
    margin-bottom: 0 !important;
    row-gap: 0 !important;
}
.window-main-col .js-react-root > div {
    margin-bottom: 12px !important;
}
.window-main-col .js-react-root > div > div {
    margin-bottom: 0px !important;
    padding-bottom: 0px !important;
}
.window-main-col .window-module-title-icon {
    top: unset !important;
}

/* Hide sidebar buttons that I don't use */
.window-sidebar .js-edit-location,
.window-sidebar .js-card-cover-chooser,
.window-sidebar .js-add-pups,
.window-sidebar [title="Add button"] {
    display: none !important;
}

/* Smaller margins between sidebar groups */
.window-module {
    margin-bottom: 12px !important;
}
.window-sidebar hr {
    margin: 5px !important;
    opacity: 0 !important;
}

/* Sendboard */
.window-main-col [src^="https://app.sendboard.com"] {
    height: 100px !important;
}
`;

const isUserscript = (typeof GM_info !== 'undefined') ||
    (typeof GM !== 'undefined' && GM.info);

function addStyle(styles) {
    if (isUserscript) {
        const styleRules = styles.split('}').filter(rule => rule.trim() !== '');
        styleRules.forEach(rule => {
            GM_addStyle(rule + '}');
        });
    } else {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.documentElement.appendChild(styleElement);
    }
}

function waitForElement(selector) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Optional: Add a timeout
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element with selector "${selector}" not found within timeout`));
        }, 5000);
    });
}

function toggleFilter() {
    const clearIcon = document.querySelector('[data-testid="filter-popover-button-x"]');
    if (clearIcon) {
        clearIcon.click();
        return;
    }

    // Step 1: Click the filter icon
    const filterIcon = document.querySelector('[data-testid="FilterIcon"]');
    if (filterIcon) {
        filterIcon.click();
    } else {
        console.error("Filter icon not found");
        return;
    }

    // Step 2: Wait for element
    waitForElement('[title="Cards assigned to me"]')
        .then(element => {
            // Step 3: Click the specific child element
            const targetElement = element.parentElement.parentElement.parentElement.children[1];
            if (targetElement) {
                targetElement.click();
            } else {
                console.error("Target element not found");
            }
            // Step 4: Click the filter icon again
            filterIcon.click();
        })
        .catch(error => {
            console.error("Error:", error.message);
        });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function processSpans() {
    // console.log("PROC");
    var changed = false;
    const spans = document.querySelectorAll('[data-testid="badge-custom-field"] > span');
    spans.forEach((span) => {
        if (span.dataset.processed) return;
        const text = span.textContent;
        const index = text.indexOf(': ');
        if (index !== -1) {
            span.textContent = text.substring(index + 2);
            changed = true;
            span.dataset.processed = true;
        }
    });
    return changed;
}

function searchChassis() {
    // Get the h2 element with id="js-dialog-title"
    var titleElement = document.getElementById('js-dialog-title');

    if (titleElement) {
        // Get the text content of the h2 element
        var titleText = titleElement.textContent.trim();

        // Split the text into words
        var words = titleText.split(/\s+/);
        var chassis, url;

        for (var i = 0; i < words.length; i++) {
            // Check if the word matches a chassis pattern
            if (/^ev\d{6}$/.test(words[i]) || /^v\d{4}$/.test(words[i])) {
                chassis = words[i];
                url = `https://trello.com/search?q=${chassis}`;
                window.open(url, '_blank');
                break;
            }
        }
    }
}

function openGrafana () {
    // Get the h2 element with id="js-dialog-title"
    var titleElement = document.getElementById('js-dialog-title');

    if (titleElement) {
        // Get the text content of the h2 element
        var titleText = titleElement.textContent.trim();

        // Split the text into words
        var words = titleText.split(/\s+/);
        var chassis, url;

        for (var i = 0; i < words.length; i++) {
            // Check if the word matches a chassis pattern
            if (/^ev\d{6}$/.test(words[i])) {
                chassis = words[i];
                url = `https://g-f0f6c92216.grafana-workspace.eu-central-1.amazonaws.com/d/dPqRKLJSz/evolitos-prod?orgId=1&var-chassis=${chassis}&from=now-7d&to=now`;
                window.open(url, '_blank');
                break;
            } else if (/^v\d{4}$/.test(words[i])) {
                chassis = words[i];
                let chassisForUrl = chassis.slice(2);
                url = `https://g-f0f6c92216.grafana-workspace.eu-central-1.amazonaws.com/d/wvZhHfB4z/volitos-prod?orgId=1&var-chassis=${chassisForUrl}&from=now-7d&to=now`;
                window.open(url, '_blank');
                break;
            }
        }
    }
}

function openEmnify() {
    // Get the h2 element with id="js-dialog-title"
    var titleElement = document.getElementById('js-dialog-title');

    if (titleElement) {
        // Get the text content of the h2 element
        var titleText = titleElement.textContent.trim();

        // Split the text into words
        var words = titleText.split(/\s+/);
        var chassis, url;

        for (var i = 0; i < words.length; i++) {
            // Check if the word matches a chassis pattern
            if (/^ev\d{6}$/.test(words[i])) {
                chassis = words[i];
                let chassisForUrl = chassis.slice(2);
                url = `https://portal.emnify.com/connected-devices?page=1&per_page=100&name=${chassis}`;
                window.open(url, '_blank');
                break;
            }
            // TODO Volito2.0
        }
    }
}

// Function to find the list wrapper containing
function findListWrapper(str) {
    const listWrappers = document.querySelectorAll('[data-testid="list-wrapper"]');
    for (const wrapper of listWrappers) {
        const listName = wrapper.querySelector('[data-testid="list-name"]');
        if (listName && listName.textContent.includes(str)) {
            return wrapper;
        }
    }
    return null;
}

// Function to check if the URL should be excluded
function shouldExcludeUrl(url) {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // Regex to match a number followed by any variation of "Tickets"
    // This includes normal and UTF-8 special characters
    const regex = /^1555-.*/u;

    return regex.test(lastPart);
}

// Function to open hrefs in new tabs, excluding specific URLs
function openCardsInNewTabs(listWrapper) {
    const cards = listWrapper.querySelectorAll('[data-testid="card-name"]');
    cards.forEach(card => {
        const href = card.getAttribute('href');
        if (href && !shouldExcludeUrl(href)) {
            window.open(href, '_blank');
        }
    });
}

function openTickets() {
    const ticketListWrapper = findListWrapper('🎟️ Tickets');
    if (ticketListWrapper) {
        openCardsInNewTabs(ticketListWrapper);
    } else {
        console.log("Couldn't find the '🎟️ Tickets' list wrapper.");
    }
}

function openParkedTickets() {
    const ticketListWrapper = findListWrapper('🅿️ Parked tickets');
    if (ticketListWrapper) {
        openCardsInNewTabs(ticketListWrapper);
    } else {
        console.log("Couldn't find the '🅿️ Parked tickets' list wrapper.");
    }
}

function registerMenuCommand(name, fn, shortcut) {
    if (isUserscript) {
        GM_registerMenuCommand(name, fn, shortcut);
    } else {
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "executeMenuCommand" && message.name === name) {
                fn();
            }
        });

        // Send a message to the background script to create a context menu item
        browser.runtime.sendMessage({
            action: "createMenuItem",
            name: name,
            shortcut: shortcut
        });
    }

    // Add keyboard shortcut listener
    if (shortcut) {
        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.altKey && event.key === shortcut) {
                event.preventDefault();
                fn();
            }
        });
    }
}


(function() {
    'use strict'

    addStyle(allStyles);

    const debouncedProcessSpans = debounce(processSpans, 175, true);
    const mutationObserver = new MutationObserver((mutations) => {
        debouncedProcessSpans();
    });

    registerMenuCommand("Open SIM card info", openEmnify, "e");

    registerMenuCommand("Toggle user filter", toggleFilter, "f");

    registerMenuCommand("Opened chassis: Grafana 7d", openGrafana, "g");

    registerMenuCommand("Opened chassis: Search cards", searchChassis, "s");

    registerMenuCommand("Open all tickets", openTickets, "t");
    registerMenuCommand("Open all parked tickets", openParkedTickets, "p");

    // Start observing as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
        });
    } else {
        // The DOM has already loaded, start observing immediately
        mutationObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

})();
