document.addEventListener('DOMContentLoaded', function() {
  const saveBtn = document.getElementById('saveFantasyEntryBtn');
  const playerCounter = document.getElementById('playerCounter');
  let selectedCount = 0;
  const maxPlayers = 6;
  
  // Update player counter display
  function updatePlayerCounter() {
    if (playerCounter) {
      playerCounter.textContent = `Players Selected: ${selectedCount}/${maxPlayers}`;
      
      // Update counter styling based on selection count
      playerCounter.classList.remove('complete', 'over-limit');
      if (selectedCount === maxPlayers) {
        playerCounter.classList.add('complete');
      } else if (selectedCount > maxPlayers) {
        playerCounter.classList.add('over-limit');
      }
      
      // Enable/disable unselected cards based on limit
      const unselectedCards = document.querySelectorAll('.player-selection-card:not(.selected)');
      unselectedCards.forEach(card => {
        if (selectedCount >= maxPlayers) {
          card.classList.add('disabled');
        } else {
          card.classList.remove('disabled');
        }
      });
    }
  }
  
  // Handle player card selection
  const playerCards = document.querySelectorAll('.player-selection-card');
  playerCards.forEach(card => {
    card.addEventListener('click', function() {
      // Don't allow selection if card is disabled
      if (this.classList.contains('disabled')) {
        return;
      }
      
      // Toggle selection
      if (this.classList.contains('selected')) {
        this.classList.remove('selected');
        selectedCount--;
      } else {
        // Only allow selection if under the limit
        if (selectedCount < maxPlayers) {
          this.classList.add('selected');
          selectedCount++;
        }
      }
      
      updatePlayerCounter();
    });
  });
  
  // Initialize counter
  updatePlayerCounter();
  
  if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      const teamName = document.getElementById('teamName').value.trim();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const seasonId = document.getElementById('seasonId').value;
      
      const selectedPlayers = Array.from(document.querySelectorAll('.player-selection-card.selected'))
        .map(card => card.getAttribute('data-player-id'));
      
      if (!teamName || !firstName || !lastName || !email) {
        alert('Please fill in all required fields.');
        return;
      }
      
      if (selectedPlayers.length !== maxPlayers) {
        alert(`Please select exactly ${maxPlayers} players for your fantasy team.`);
        return;
      }
      
      try {
        const response = await fetch(window.basepath + 'api/fantasy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            teamName,
            firstName,
            lastName,
            email,
            seasonId,
            selectedPlayers
          })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          alert('Fantasy entry created successfully!');
          location.reload(); // Refresh the page to show the new entry
        } else {
          alert('Error creating fantasy entry: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error creating fantasy entry. Please try again.');
      }
    });
  }
});