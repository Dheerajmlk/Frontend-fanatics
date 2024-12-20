// Firebase Realtime Database URL (provided)
const firebaseURL =
  "https://time-buddy-eb9ab-default-rtdb.firebaseio.com/users/";

let links = [];
let favoriteLinks = [];

// Load links and favorites when the page loads
document.addEventListener("DOMContentLoaded", () => {
  loadLinksFromFirebase();
  loadFavoritesFromFirebase();
});

// Add a new link to Firebase
function addLink() {
  const linkInput = document.getElementById("link");
  const categoryInput = document.getElementById("category");

  const url = linkInput.value.trim();
  const category = categoryInput.value.trim() || "uncategorized";

  // Ensure the URL and category are not empty before adding
  if (url === "") {
    alert("Please enter a valid URL.");
    return;
  }

  const newLink = { url, category };

  // Save the link to Firebase using POST
  saveLinkToFirebase(newLink);

  // Clear input fields
  linkInput.value = "";
  categoryInput.value = "";
}

// Save link to Firebase
function saveLinkToFirebase(link) {
  fetch(`${firebaseURL}links.json`, {
    // Corrected string interpolation
    method: "POST",
    body: JSON.stringify(link),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Add the generated Firebase ID to the link object
      const newLinkWithId = { ...link, id: data.name };
      links.push(newLinkWithId); // Store the link along with the Firebase ID
      loadLinksFromFirebase(); // Reload the links after adding
    })
    .catch((error) => {
      console.error("Error adding link:", error);
    });
}

// Load links from Firebase
function loadLinksFromFirebase() {
  fetch(`${firebaseURL}links.json`) // Corrected string interpolation
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // Convert object values to array and store the Firebase IDs
        links = Object.keys(data).map((key) => ({ ...data[key], id: key }));
      } else {
        links = [];
      }
      displayLinks();
    })
    .catch((error) => {
      console.error("Error loading links:", error);
    });
}

// Display links in the UI
function displayLinks(filteredCategory = "all") {
  const linkSections = document.getElementById("link-sections");
  linkSections.innerHTML = "";

  const categories = Array.from(new Set(links.map((link) => link.category)));
  categories.forEach((category) => {
    const section = document.createElement("div");
    section.classList.add("link-section");

    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);

    const linkList = document.createElement("ul");
    linkList.classList.add("link-list");

    const categoryLinks = links.filter(
      (link) => link.category.toLowerCase() === category.toLowerCase()
    );

    categoryLinks.forEach((link) => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <a href="${link.url}" target="_blank">${link.url}</a>
        <button onclick="deleteLink('${link.id}')">Delete</button>
        <button onclick="favoriteLink('${link.id}')">Favorite</button>
      `;
      linkList.appendChild(listItem);
    });

    section.appendChild(sectionTitle);
    section.appendChild(linkList);
    linkSections.appendChild(section);
  });
}

// Delete a link from Firebase
function deleteLink(linkId) {
  const linkRef = `${firebaseURL}links/${linkId}.json`; // Corrected string interpolation

  // Delete the link from Firebase using DELETE
  fetch(linkRef, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Link deleted");
      // Remove the link from the local links array using the link ID
      links = links.filter((link) => link.id !== linkId);
      displayLinks(); // Reload the links after deletion
    })
    .catch((error) => {
      console.error("Error deleting link:", error);
    });
}

// Add link to favorites
function favoriteLink(linkId) {
  const link = links.find((link) => link.id === linkId);

  if (link && !favoriteLinks.includes(link)) {
    favoriteLinks.push(link);
    saveFavoriteToFirebase(link);
    displayFavorites();
  }
}

// Save favorite link to Firebase
function saveFavoriteToFirebase(link) {
  fetch(`${firebaseURL}favorites.json`, {
    // Corrected string interpolation
    method: "POST",
    body: JSON.stringify(link),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      console.log("Favorite link added");
    })
    .catch((error) => {
      console.error("Error saving favorite link:", error);
    });
}

// Load favorite links from Firebase
function loadFavoritesFromFirebase() {
  fetch(`${firebaseURL}favorites.json`) // Corrected string interpolation
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        favoriteLinks = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
      } else {
        favoriteLinks = [];
      }
      displayFavorites();
    })
    .catch((error) => {
      console.error("Error loading favorite links:", error);
    });
}

// Display favorite links in the UI
function displayFavorites() {
  const favoriteLinksSection = document.getElementById("favorite-links");
  favoriteLinksSection.innerHTML = "";

  if (favoriteLinks.length === 0) {
    favoriteLinksSection.innerHTML = "<p>No favorite links yet.</p>";
  }

  favoriteLinks.forEach((link) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <a href="${link.url}" target="_blank">${link.url}</a>
      <button onclick="unfavoriteLink('${link.id}')">Unfavorite</button>
    `;
    favoriteLinksSection.appendChild(listItem);
  });
}

function unfavoriteLink(linkId) {
  const favoriteRef = `${firebaseURL}favorites/${linkId}.json`; 


  fetch(favoriteRef, {
    method: "DELETE",
  })
    .then(() => {
      console.log("Link removed from favorites");
      favoriteLinks = favoriteLinks.filter((link) => link.id !== linkId); 
      displayFavorites(); 
    })
    .catch((error) => {
      console.error("Error removing favorite link:", error);
    });
}

function openFavoriteLinks() {
  favoriteLinks.forEach((link) => window.open(link.url, "_blank"));
}