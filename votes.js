// ---- CONFIG: The deployed backend URL ----
const API_BASE = "https://goat-voting-backend.onrender.com";

let votes = {};
let myFavorite = localStorage.getItem("myFavoriteImage") || null;

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".image-card");

  // ----- VOTING: set up click handlers for buttons -----
  cards.forEach(card => {
    const imageId = card.dataset.id;
    const button = card.querySelector(".vote-button");

    button.addEventListener("click", () => {
      handleVote(imageId);
    });
  });

  // Load current votes from backend when page loads
  fetchVotesFromBackend();

  // ----- IMAGE MODAL / ENLARGE ON CLICK -----
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector("#imageModal .close");

  if (modal && modalImg && closeBtn) {
    // Add click listener to each image in the cards
    document.querySelectorAll(".image-card img").forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalImg.alt = img.alt || "";
      });
    });

    // Close when X is clicked
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Close when clicking outside the image
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  } else {
    console.warn("Modal elements not found – check imageModal, modalImg, and .close in HTML.");
  }
});

// ----- BACKEND VOTE FUNCTIONS -----
// Fetch current votes from the backend
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
