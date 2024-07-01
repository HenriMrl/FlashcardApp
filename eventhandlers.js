document.addEventListener("DOMContentLoaded", async () => {
  const flashcardElement = document.getElementById("flashcard");
  const frontsideElement = document.getElementById("frontside");
  const backsideElement = document.getElementById("backside");
  let flashcards = [];
  let currentCardIndex = 0;
  let isVisible = true;

  async function loadCards() {
    try {
      const response = await fetch("flashcards.json");
      flashcards = await response.json();
      displayFlashcard();
    } catch (error) {
      console.error("Failed to load flashcards:", error);
    }
  }

  function displayFlashcard() {
    if (flashcards.length === 0) return;
    const card = flashcards[currentCardIndex];
    frontsideElement.textContent = card.word;
    backsideElement.textContent = card.answer;
    updateCardVisibility();
  }

  function updateCardVisibility() {
    if (isVisible) {
      frontsideElement.style.display = "flex";
      backsideElement.style.display = "none";
    } else {
      frontsideElement.style.display = "none";
      backsideElement.style.display = "flex";
    }
  }

  flashcardElement.addEventListener("click", () => {
    isVisible = !isVisible;
    updateCardVisibility();
  });

  await loadCards();
});
