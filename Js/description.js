//consoles for debugging purposes, to check if the story ID is correctly retrieved 
// from the URL and if the story data is correctly fetched and displayed on the page.

const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");
console.log("Story ID from URL:", storyId);

fetch("stories.json")
    .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then((stories) => {
        //all the stories from json file
        console.log("Stories fetched:", stories);
        const story = stories.find((s) => s.id === storyId);
        console.log("Found story:", story);

        if (story) {
            document.getElementById("story-title").textContent = story.title;
            document.getElementById("story-description").textContent = story.description;
            document.getElementById("story-cover").src = story.coverImage;

            document
                .getElementById("start-reading-btn")
                .href = `reading.html?story=${story.id}&page=1`;
        } else {
            document.getElementById("story-title").textContent = "Story Not Found";
            document.getElementById("story-description").textContent =
                "The story you are looking for does not exist.";
            document.getElementById("story-cover").src = "./covers/default_cover.jpg";
            document.getElementById("start-reading-btn").style.display = "none";
        }
    })
    .catch((error) => {
        console.error("Error loading stories:", error);
        document.getElementById("story-title").textContent = "Error Loading Story";
        document.getElementById("story-description").textContent = "An error occurred while loading the story. Please try again later.";
        document.getElementById("start-reading-btn").style.display = "none";
    }
);


