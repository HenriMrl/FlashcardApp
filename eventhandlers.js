document.addEventListener("DOMContentLoaded", async () => {
  const flashcardElement = document.getElementById("flashcard");
  const frontsideElement = document.getElementById("frontside");
  const backsideElement = document.getElementById("backside");
  const nextButtonElement = document.querySelector(".nextButton");
  const previousButtonElement = document.querySelector(".previousButton");
  const newCardButtonElement = document.querySelector(".newCardButton");
  const popUpButtonElement = document.querySelector(".popup-content");
  const submitButtonElement = document.querySelector(".submitButton");
  const deleteButtonElement = document.querySelector(".deleteCardButton");
  const cancelButtonElement = document.querySelector(".cancelButton");

  let flashcards = [];
  let currentCardIndex = 0;
  let isVisible = true;
  let showInput = true;

  popUpButtonElement.style.display = "none";

  // Fetch flashcards from MongoDB API
  async function loadCards() {
    try {
      const response = await fetch("http://localhost:5000/flashcards");
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
    frontsideElement.style.display = isVisible ? "flex" : "none";
    backsideElement.style.display = isVisible ? "none" : "flex";
  }

  flashcardElement.addEventListener("click", () => {
    isVisible = !isVisible;
    updateCardVisibility();
  });

  nextButtonElement.addEventListener("click", () => {
    if (currentCardIndex < flashcards.length - 1) {
      currentCardIndex++;
      displayFlashcard();
    } else {
      displayMessage("No cards left");
    }
  });

  previousButtonElement.addEventListener("click", () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      displayFlashcard();
    } else {
      displayMessage("At first card");
    }
  });

  newCardButtonElement.addEventListener("click", () => {
    showInput = true;
    popUpButtonElement.style.display = "flex";
  });

  // Send new flashcard to MongoDB API
  submitButtonElement.addEventListener("click", async () => {
    const word = document.getElementById("wordInput").value;
    const answer = document.getElementById("translationInput").value;

    console.log("Word input:", word);
    console.log("Answer input:", answer);

    if (!word || !answer) {
        displayMessage("Both fields are required.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/flashcards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word, answer }),
        });

        console.log("Response status:", response.status);
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (response.ok) {
            displayMessage("Flashcard added successfully");
            popUpButtonElement.style.display = "none";
            await loadCards(); // Reload cards
        }
    } catch (error) {
        console.error("Error adding flashcard:", error);
    }
});


  // Delete a flashcard
  deleteButtonElement.addEventListener("click", async () => {
    if (flashcards.length === 0) return;

    const cardToDelete = flashcards[currentCardIndex];

    try {
      const response = await fetch(`http://localhost:5000/flashcards/${cardToDelete._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        displayMessage("Flashcard deleted successfully");
        await loadCards(); // Reload after delete
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  });

  await loadCards();
});
