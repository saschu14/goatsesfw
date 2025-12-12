// ---- CONFIG: change this when you deploy the backend somewhere online ----
const API_BASE = "https://goat-voting-backend.onrender.com"; // later: "https://your-backend-url.com"

let votes = {};
let myFavorite = localStorage.getItem("myFavoriteImage") || null;

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".image-card");

  // Attach click handlers for "Vote" buttons
  cards.forEach(card => {
    const imageId = card.dataset.id;
    const button = card.querySelector(".vote-button");

    button.addEventListener("click", () => {
      handleVote(imageId);
    });
  });

  // Load votes from backend when page opens
  fetchVotesFromBackend();
});

// Get current vote counts from backend
function fetchVotesFromBackend() {
  fetch(`${API_BASE}/votes`)
    .then(res => res.json())
    .then(data => {
      votes = data.votes || {};
      renderVotes();
    })
    .catch(err => {
      console.error("Error fetching votes:", err);
    });
}

// Send a vote to the backend
function handleVote(imageId) {
  myFavorite = imageId;
  localStorage.setItem("myFavoriteImage", imageId);

  fetch(`${API_BASE}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ imageId })
  })
    .then(res => res.json())
    .then(data => {
      votes = data.votes || {};
      renderVotes();
    })
    .catch(err => {
      console.error("Error sending vote:", err);
    });
}

// Update the UI with vote counts and favorite highlight
function renderVotes() {
  const cards = document.querySelectorAll(".image-card");

  cards.forEach(card => {
    const imageId = card.dataset.id;
    const button = card.querySelector(".vote-button");
    const countSpan = card.querySelector(".vote-count");

    const count = votes[imageId] || 0;
    updateCountText(countSpan, count);

    if (imageId === myFavorite) {
      button.classList.add("voted");
      button.textContent = "Your favorite";
    } else {
      button.classList.remove("voted");
      button.textContent = "Vote";
    }
  });
}

function updateCountText(span, count) {
  span.textContent = count === 1 ? "1 vote" : `${count} votes`;
}
