/**
 * 
 * Programmatically builds navigation bar,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 * 
 * Dependencies: None
 * 
 * JS Version: ES2015/ES6
 * 
 * JS Standard: ESlint
 * 
*/

/**
 * @description scrolling setTimeout handler
 */
let scrollHandler;


/************************************************
 *               Main Function
 ************************************************/

/**
 * @description self-invoked main function to add event listeners to the DOM elements.
 */
(function main() {
    // Add an event listener to wait till the DOM is fully loaded.
    document.addEventListener('DOMContentLoaded', () => {
        // build the nav bar based on current sections in HTML.
        buildNavItems();
        // Add an event listener when the user clicks on nav items to scroll to the selected section.
        document.getElementById('navbar__list').addEventListener('click', scrollToSection);

        // Add event when clicking "Scroll To Top" Button.
        document.querySelector('.page__scroll-top').addEventListener('click', scrollToTop);
        // Add some events to be invoked while scrolling.
        document.addEventListener('scroll', controlScrollActions);
        // Add event to collapse/expand sections' paragraphs when clicking on the section header.
        document.querySelectorAll('section h2').forEach(section => {
            section.addEventListener('click', toggleSectionCollapsing);
        });
    });
})();


/**
 * @description creates the nav items based on the sections in the HTML file.
 */
function buildNavItems() {
    const navBarContainer = document.createDocumentFragment();
    const sectionsList = document.querySelectorAll('section');
    for (const section of sectionsList) {
        // Fetch the data of each section.
        const sectionHeader = section.getAttribute('data-nav');
        const sectionId = section.getAttribute('id');
        // Create the nav items with anchors to the selected section.
        const navElement = document.createElement('li');
        navElement.innerHTML = `<a class="menu__link" href="#${sectionId}">${sectionHeader}</a>`;
        navBarContainer.appendChild(navElement);
    }
    // Append the created items to the DOM under the navbar list.
    document.getElementById('navbar__list').appendChild(navBarContainer);
}



/************************************************
 *            onScroll Functions
 ************************************************/

/**
 * @description control events fired while scrolling.
 * @param {Event} evt - normal event object passed by the browser.
 */
function controlScrollActions(evt) {
    highlightCurrentSection(evt);
    controlNavBarVisibility(evt);
    controlScrollTopBtnVisibility(evt);
}


/**
 * @description highlight the section when its top is near of the viewport.
 */
function highlightCurrentSection() {
    const sectionsList = document.querySelectorAll('section');
    const currentActiveSection = document.querySelector('.active-section');

    for (const section of sectionsList) {
        const sectionRect = section.getBoundingClientRect();
        // Check if the section is in the view port and it is not the current highlighted one to avoid `reflow()` & `repaint()`.
        if (sectionRect.top > -1 && sectionRect.top <= document.documentElement.clientHeight / 2) {
            currentActiveSection.classList.remove('active-section');
            section.classList.add('active-section');
            highlightNavItem(section);
            break;
        }
    }
}


/**
 * @description highlight the nav item of the current section in the viewport.
 * @param {HTMLElement} currentSection - The current selected section in the viewport
 */
function highlightNavItem(currentSection) {
    const navItems = document.getElementsByClassName('menu__link');
    const selectedNavItem = document.querySelector('.active-nav-item');
    for (const item of navItems) {
        // If the current section in the view port is the section in the nav bar.
        if (item.attributes.href.value.replace('#', '') === currentSection.id) {
            // Remove highlighted nav item if there is an item highlighted.
            if (selectedNavItem)
                selectedNavItem.classList.remove('active-nav-item');
            item.classList.add('active-nav-item');
            break;
        }
    }
}


/**
 * @description toggle Nav Bar visibility while not scrolling
 */
function controlNavBarVisibility() {
    const navBarList = document.querySelector('header');
    // Clear timeout handler while scrolling.
    clearTimeout(scrollHandler);
    navBarList.classList.remove('hidden');

    // Set a timeout to run after scrolling ends with 2 seconds.
    scrollHandler = setTimeout(() => {
        navBarList.classList.add('hidden');
    }, 2000);
}


/**
 * @description toggle the "Scroll To Top" button visibility.
 */
function controlScrollTopBtnVisibility(evt) {
    const scrollTopBtn = document.querySelector('.page__scroll-top');
    if (document.body.scrollTop > 70 || document.documentElement.scrollTop > 70) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
}



/************************************************
 *              onClick Functions
 ************************************************/

/**
 * @description scroll to the selected section and prevent the default anchor navigation behaviour.
 * @param {Event} evt - a normal event from the DOM.
 */
function scrollToSection(evt) {
    if (evt.target.nodeName.toLowerCase() === 'a') {
        evt.preventDefault();   // Prevent the default behaviour of the anchor tag `<a>`.
        window.scrollTo({
            top: document.querySelector(evt.target.attributes.href.value).offsetTop,
            behavior: 'smooth'
        });
    }
}


/**
 * @description scrolling to the top of the page.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/**
 * @description collapse/expand the section's paragraphs when clicking on its header.
 * @param {Event} evt - Normal `event` object passed by the browser.
 */
function toggleSectionCollapsing(evt) {
    const sectionBody = evt.target.parentElement.querySelector('article');
    if (sectionBody.style.display === 'none') {
        sectionBody.style.display = 'block';
        evt.target.setAttribute('title', 'Click to collapse the section');
    } else {
        sectionBody.style.display = 'none';
        evt.target.setAttribute('title', 'Click to expand the section');
    }    
}