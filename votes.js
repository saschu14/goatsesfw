// votes.js

// Keeps votes (for this browser only)
const votes = {};
let myFavorite = null;

// Try to restore user's previous choice from localStorage
const storedFavorite = localStorage.getItem("myFavoriteImage");
if (storedFavorite) {
  myFavorite = storedFavorite;
}

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".image-card");

  cards.forEach(card => {
    const imageId = card.dataset.id;
    const button = card.querySelector(".vote-button");
    const countSpan = card.querySelector(".vote-count");

    // Initialize count display
    votes[imageId] = votes[imageId] || 0;
    updateCountText(countSpan, votes[imageId]);

    // Highlight if this is currently user's favorite
    if (imageId === myFavorite) {
      button.classList.add("voted");
      button.textContent = "Your favorite";
    }

    button.addEventListener("click", () => {
      handleVote(imageId);
    });
  });
});

function handleVote(imageId) {
  const cards = document.querySelectorAll(".image-card");

  // Reset previous favorite
  if (myFavorite && myFavorite !== imageId) {
    const prevCard = document.querySelector(`.image-card[data-id="${myFavorite}"]`);
    if (prevCard) {
      const prevBtn = prevCard.querySelector(".vote-button");
      prevBtn.classList.remove("voted");
      prevBtn.textContent = "Vote";
    }
  }

  // Set new favorite
  myFavorite = imageId;
  localStorage.setItem("myFavoriteImage", imageId);

  // Update button styles and count text
  cards.forEach(card => {
    const id = card.dataset.id;
    const button = card.querySelector(".vote-button");
    const countSpan = card.querySelector(".vote-count");

    // Simple fake counting: mark favorite as 1 vote, others 0
    votes[id] = id === myFavorite ? 1 : 0;
    updateCountText(countSpan, votes[id]);

    if (id === myFavorite) {
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

// ----- IMAGE ZOOM / MODAL -----
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = document.querySelector(".close");

  // Add click event to all images
  document.querySelectorAll(".image-card img").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  // Close modal on X click
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
