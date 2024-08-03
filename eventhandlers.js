document.addEventListener("DOMContentLoaded", async () => {
  const { ipcRenderer } = require('electron');
  const fs = require('fs');
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
    showInput = true;
    popUpButtonElement.style.display = "flex";
  });

  submitButtonElement.addEventListener("click", () => {
    const word = document.getElementById('wordInput').value;
    const answer = document.getElementById('translationInput').value;

    const card = {
     "word": word,
     "answer": answer
    }

    if (word === "" || answer === "") {
      displayMessage("Both fields are required.");
      return;
    }
    
    flashcards.push(card);
    
    
    fs.writeFile('flashcards.json', JSON.stringify(flashcards, null, 2), (err) => {
      if (err) {
        console.error("Failed to write file:", err);
        return;
      } else {
        displayMessage("Flashcard added successfully");
        popUpButtonElement.style.display = "none";
        showInput = false;
      }
  });

  });

  cancelButtonElement.addEventListener("click", () => {
    showInput = false;
    popUpButtonElement.style.display = "none";
  });

  const deleteCardAtIndex = (data, index) => {
    if (index < 0 || index >= data.length) {
      console.error('Invalid index');
      return data;
    }
    data.splice(index, 1); 
    return data;
  };

  deleteButtonElement.addEventListener('click', () => {
    fs.readFile('flashcards.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      let jsonArray = JSON.parse(data);

      const updatedJsonArray = deleteCardAtIndex(jsonArray, currentCardIndex);

      const modifiedJson = JSON.stringify(updatedJsonArray, null, 2);

      fs.writeFile('flashcards.json', modifiedJson, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        displayMessage('flashcard deleted successfully');
      });
    });
  });

  ipcRenderer.on('reload-cards', () => {
    loadCards();
  });

  await loadCards();
});
