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
  let newCardInput = true;

  popUpButtonElement.style.display = "none";

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

  function displayMessage(message) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.textContent = message;
    setTimeout(() => {
      messageContainer.textContent = "";
    }, 1500);
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
      displayMessage("No cards left");
    }
  });

  previousButtonElement.addEventListener("click", () => {
    if (currentCardIndex > 0) {
      currentCardIndex = currentCardIndex - 1;
      displayFlashcard();
    } else {
      displayMessage("At first card");
    }
  });

  newCardButtonElement.addEventListener("click", () => {
    if (newCardInput) {
      popUpButtonElement.style.display = "flex";
    } else {
      popUpButtonElement.style.display = "none";
    }
    newCardInput = !newCardInput;
  });

  await loadCards();
});
