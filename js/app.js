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
 * @description Scrolling setTimeout handler
 */
let scrollHandler;

/**
 * @description Dummy sections number
 */
const sectionsNo = 4;

/************************************************
 *               Main Function
 ************************************************/

/**
 * @description self-invoked main function to add event listeners to the DOM elements.
 */
(() => {
    // Add an event listener to wait till the DOM is fully loaded.
    document.addEventListener('DOMContentLoaded', () => {
        buildSections();
        buildNavItems();
        updateCopyright();
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
 * @description Create sections with dummy content dynamically
 */
const buildSections = () => {
    const sectionsContainer = document.createDocumentFragment();
    for (let i = 1; i <= sectionsNo; i++) {
        // Create Section 
        const sectionHeader = 'Section ' + i;
        const sectionElement = document.createElement('section');
        sectionElement.id = 'section' + (i);
        sectionElement.setAttribute('data-nav', sectionHeader);
        if (i === 1)
            sectionElement.classList.add('active-section');
        sectionsContainer.appendChild(sectionElement);

        // Create Section Container
        const container = document.createElement('div');
        container.classList.add('landing__container');
        sectionElement.appendChild(container);
        // Create Section Header
        const header = document.createElement('h2');
        header.textContent = sectionHeader;
        container.appendChild(header);
        // Create Section Article
        const article = document.createElement('article');
        container.appendChild(article);
        // Create Section Paragraphs
        const paragraph1 = document.createElement('p');
        paragraph1.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fermentum metus faucibus lectus pharetra dapibus. Suspendisse potenti. Aenean aliquam elementum mi, ac euismod augue. Donec eget lacinia ex. Phasellus imperdiet porta orci eget mollis. Sed convallis sollicitudin mauris ac tincidunt. Donec bibendum, nulla eget bibendum consectetur, sem nisi aliquam leo, ut pulvinar quam nunc eu augue. Pellentesque maximus imperdiet elit a pharetra. Duis lectus mi, aliquam in mi quis, aliquam porttitor lacus. Morbi a tincidunt felis. Sed leo nunc, pharetra et elementum non, faucibus vitae elit. Integer nec libero venenatis libero ultricies molestie semper in tellus. Sed congue et odio sed euismod.';
        article.appendChild(paragraph1);
        const paragraph2 = document.createElement('p');
        paragraph2.textContent = 'Aliquam a convallis justo. Vivamus venenatis, erat eget pulvinar gravida, ipsum lacus aliquet velit, vel luctus diam ipsum a diam. Cras eu tincidunt arcu, vitae rhoncus purus. Vestibulum fermentum consectetur porttitor. Suspendisse imperdiet porttitor tortor, eget elementum tortor mollis non.';
        article.appendChild(paragraph2)
    }
    document.querySelector('main').appendChild(sectionsContainer);
}


/**
 * @description creates the nav items based on the sections in the HTML file.
 */
const buildNavItems = () => {
    const navBarContainer = document.createDocumentFragment();
    const sectionsList = document.querySelectorAll('section');
    sectionsList.forEach(section => {
        // Fetch the data of each section.
        const sectionHeader = section.getAttribute('data-nav');
        const sectionId = section.getAttribute('id');
        // Create the nav items with anchors to the selected section.
        const navElement = document.createElement('li');
        navElement.innerHTML = `<a class="menu__link" href="#${sectionId}">${sectionHeader}</a>`;
        navBarContainer.appendChild(navElement);
    });
    // Append the created items to the DOM under the navbar list.
    document.getElementById('navbar__list').appendChild(navBarContainer);
}


/**
 * @description Update copyright year in footer.
 */
const updateCopyright = () =>  {
    document.querySelector('footer p').textContent += ' | ' + new Date().getFullYear();
}


/************************************************
 *            onScroll Functions
 ************************************************/

/**
 * @description control events fired while scrolling.
 * @param {Event} evt - normal event object passed by the browser.
 */
const controlScrollActions = (evt) => {
    highlightCurrentSection(evt);
    controlNavBarVisibility(evt);
    controlScrollTopBtnVisibility(evt);
}


/**
 * @description highlight the section when its top is near of the viewport.
 */
const highlightCurrentSection = () => {
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
const highlightNavItem = (currentSection) => {
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
const controlNavBarVisibility = () => {
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
const controlScrollTopBtnVisibility = (evt) => {
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
const scrollToSection = (evt) => {
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
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


/**
 * @description collapse/expand the section's paragraphs when clicking on its header.
 * @param {Event} evt - Normal `event` object passed by the browser.
 */
const toggleSectionCollapsing = (evt) => {
    const sectionBody = evt.target.parentElement.querySelector('article');
    if (sectionBody.style.display === 'none') {
        sectionBody.style.display = 'block';
        evt.target.setAttribute('title', 'Click to collapse the section');
    } else {
        sectionBody.style.display = 'none';
        evt.target.setAttribute('title', 'Click to expand the section');
    }
}