const words_per_page = 500;
let pages = [];
let currentPage = 1;
let totalPages = 1;
let storyId = "";

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        story: params.get("story"),
        page: parseInt(params.get("page")) || 1,
    }
}

function splitIntoPages(text) {
    const parts = text.split(/(\s+)/); // Split keeping whitespace separators
    const result = [];
    let currentPage = '';
    let wordCount = 0;
    for (let i = 0; i < parts.length; i += 2) { //since we are keeping whitespace,
        //adn words are at even indices, we can skip every other index
        const word = parts[i];
        if (word) {
            wordCount++;
            currentPage += word;
            if (i + 1 < parts.length) {
                currentPage += parts[i + 1]; // Add the whitespace separator
            }
            if (wordCount >= words_per_page) {
                result.push(currentPage);
                currentPage = '';
                wordCount = 0;
            }
        }
    }
    if (currentPage) {
        result.push(currentPage);
    }
    totalPages = result.length;
    return result;
}

function renderPage() {
    const pageContent = document.getElementById("story-content");
    pageContent.textContent = pages[currentPage - 1] || "End of Story.";
    // Preserve whitespace/line breaks from the original text 
    // while allowing wrapping
    pageContent.style.whiteSpace = "pre-wrap";
    pageContent.style.wordWrap = "break-word";

    const storyTitle = document.getElementById("breadcrumb-title");
    storyTitle.textContent = storyId.split("-").map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    document.getElementById("page-number").textContent = `${currentPage} of ${totalPages}`;
    document.getElementById("prev-btn").disabled = currentPage <= 1;
    document.getElementById("next-btn").disabled = currentPage >= totalPages;
}

function changePage(direction) {
    currentPage += direction;

    window.history.pushState({ page: currentPage }, "", `?story=${storyId}&page=${currentPage}`);
    renderPage();
    window.scrollTo(0, 0);
}

async function init() {
    const { story, page } = getURLParams();
    console.log("Story ID from URL:", story);
    storyId = story;
    currentPage = page;

    try {
        const response = await fetch("stories.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const stories = await response.json();
        console.log("All stories:", stories);
        const found = stories.find(s => s.id === storyId);
        console.log("Found story:", found);

        if (found) {
            const storyContentResponse = await fetch(found.content);
            if (!storyContentResponse.ok) throw new Error(`Failed to load story content: ${storyContentResponse.status}`);
            const storyText = await storyContentResponse.text();
            pages = splitIntoPages(storyText);
            totalPages = pages.length;
            currentPage = Math.min(Math.max(page, 1), totalPages);
            renderPage();
        } else {
            console.error("Story not found with ID:", storyId);
            document.getElementById("story-content").textContent = "Story not found.";
        }
    } catch (error) {
        console.error("Error loading story:", error);
        document.getElementById("story-content").textContent = `Error loading story: ${error.message}`;
    }
}

// Wait for DOM to be ready before attaching event listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById("prev-btn").addEventListener("click", () => changePage(-1));
        document.getElementById("next-btn").addEventListener("click", () => changePage(1));
        init();
    });
} else {
    document.getElementById("prev-btn").addEventListener("click", () => changePage(-1));
    document.getElementById("next-btn").addEventListener("click", () => changePage(1));
    init();
}

