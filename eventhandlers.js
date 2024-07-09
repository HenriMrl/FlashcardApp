document.addEventListener("DOMContentLoaded", async () => {
  const flashcardElement = document.getElementById("flashcard");
  const frontsideElement = document.getElementById("frontside");
  const backsideElement = document.getElementById("backside");
  const nextButtonElement = document.querySelector(".nextButton");
  const previousButtonElement = document.querySelector(".previousButton");
  const newCardButtonElement = document.querySelector(".newCardButton");
  const popUpButtonElement = document.querySelector(".popup-content");
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
    popUpButtonElement.style.display = "none";
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

  nextButtonElement.addEventListener("click", () => {
    if (currentCardIndex < flashcards.length - 1) {
      currentCardIndex = currentCardIndex + 1;
      displayFlashcard();
    } else {
      alert("No cards left");
    }
  });

  previousButtonElement.addEventListener("click", () => {
    if (currentCardIndex > 0) {
      currentCardIndex = currentCardIndex - 1;
      displayFlashcard();
    } else {
      alert("already at the first card");
    }
  });

  newCardButtonElement.addEventListener("click", () => {
    popUpButtonElement.style.display = "flex";
  });

  await loadCards();
});
