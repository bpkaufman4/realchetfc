document.addEventListener('DOMContentLoaded', function() {
  const saveBtn = document.getElementById('saveFantasyEntryBtn');
  
  if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      const teamName = document.getElementById('teamName').value.trim();
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const seasonId = document.getElementById('seasonId').value;
      
      const selectedPlayers = Array.from(document.querySelectorAll('.player-checkbox:checked'))
        .map(checkbox => checkbox.value);
      
      if (!teamName || !firstName || !lastName || !email) {
        alert('Please fill in all required fields.');
        return;
      }
      
      if (selectedPlayers.length === 0) {
        alert('Please select at least one player.');
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