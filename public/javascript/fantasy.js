document.addEventListener('DOMContentLoaded', function() {
  console.log('Fantasy.js loaded - DOM Content Loaded');
  console.log('Window fantasy rankings on load:', window.fantasyRankings);
  
  const saveBtn = document.getElementById('saveFantasyEntryBtn');
  const playerCounter = document.getElementById('playerCounter');
  const teamBreakdownModal = document.getElementById('teamBreakdownModal');
  
  console.log('Modal element found:', !!teamBreakdownModal);
  
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
      const seasonId = document.getElementById('seasonId').value;
      
      const selectedPlayers = Array.from(document.querySelectorAll('.player-selection-card.selected'))
        .map(card => card.getAttribute('data-player-id'));
      
      if (!teamName || !firstName || !lastName ) {
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
  
  // Handle team breakdown modal
  if (teamBreakdownModal) {
    console.log('Team breakdown modal found, adding event listener');
    
    teamBreakdownModal.addEventListener('show.bs.modal', function(event) {
      console.log('Modal show event triggered');
      
      const trigger = event.relatedTarget;
      const teamIndex = trigger.getAttribute('data-team-index');
      
      console.log('Team index:', teamIndex);
      console.log('Fantasy rankings available:', !!window.fantasyRankings);
      console.log('Fantasy rankings length:', window.fantasyRankings ? window.fantasyRankings.length : 'N/A');
      
      try {
        if (window.fantasyRankings && teamIndex !== null) {
          const teamData = window.fantasyRankings[parseInt(teamIndex)];
          console.log('Selected team data:', teamData);
          
          if (teamData) {
            populateTeamBreakdown(teamData);
          } else {
            throw new Error('Team data not found for index: ' + teamIndex);
          }
        } else {
          throw new Error('Fantasy rankings data not available or team index missing');
        }
      } catch (error) {
        console.error('Error loading team data:', error);
        document.getElementById('teamBreakdownContent').innerHTML = 
          `<div class="p-3">
            <p class="text-danger">Error loading team data: ${error.message}</p>
            <p class="text-muted">Team index: ${teamIndex}</p>
            <p class="text-muted">Available teams: ${window.fantasyRankings ? window.fantasyRankings.length : 'None'}</p>
            <p class="text-muted">Fantasy data type: ${typeof window.fantasyRankings}</p>
          </div>`;
      }
    });
  } else {
    console.log('Team breakdown modal not found in DOM');
  }
  
  function populateTeamBreakdown(teamData) {
    console.log('Populating team breakdown with data:', teamData); // Debug log
    
    const modalTitle = document.getElementById('teamBreakdownModalTitle');
    const modalContent = document.getElementById('teamBreakdownContent');
    
    if (!modalTitle || !modalContent) {
      console.error('Modal elements not found');
      return;
    }
    
    modalTitle.textContent = `${teamData.teamName} - ${teamData.firstName} ${teamData.lastName}`;
    
    let content = `
      <div class="mb-3">
        <h6>Total Points: <span class="badge bg-primary fs-6">${teamData.totalPoints}</span></h6>
      </div>
      
      <h6>Match-by-Match Breakdown:</h6>
    `;
    
    if (teamData.gameBreakdowns && teamData.gameBreakdowns.length > 0) {
      content += '<div class="accordion" id="matchAccordion">';
      
      teamData.gameBreakdowns.forEach((game, index) => {
        const gameDate = new Date(game.date).toLocaleDateString();
        const isExpanded = index === 0; // Expand first game (most recent)
        
        content += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
              <button class="accordion-button ${isExpanded ? '' : 'collapsed'}" type="button" 
                      data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                      aria-expanded="${isExpanded}" aria-controls="collapse${index}">
                <div class="d-flex justify-content-between w-100 me-3">
                  <span>vs ${game.opponent} - ${gameDate}</span>
                  <span class="badge bg-secondary">${game.matchTotal} pts</span>
                </div>
              </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse ${isExpanded ? 'show' : ''}" 
                 aria-labelledby="heading${index}" data-bs-parent="#matchAccordion">
              <div class="accordion-body">
        `;
        
        // Player scores table
        content += `
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Base</th>
                  <th>Goals</th>
                  <th>Assists</th>
                  <th>MVP</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
        `;
        
        game.playerScores.forEach(player => {
          const isOmitted = game.omittedPlayer && player.playerId === game.omittedPlayer.playerId;
          const rowClass = isOmitted ? 'table-warning' : (player.appeared ? '' : 'table-light');
          
          // Calculate individual stat points from the actual data
          const basePoints = player.appeared ? (1 + (player.baseScore || 0)) : 0; // 1 point for appearance + base score
          const goalPoints = (player.goals || 0) * 3; // 3 points per goal
          const assistPoints = (player.assists || 0) * 2; // 2 points per assist
          const mvpPoints = player.mvp ? 5 : 0; // 5 points for MVP
          
          // Add (omitted) to player name if they were omitted
          const playerDisplayName = isOmitted ? `${player.playerName} (omitted)` : player.playerName;
          
          content += `
            <tr class="${rowClass}">
              <td>${playerDisplayName}</td>
              <td>${player.appeared ? basePoints : '(DNP)'}</td>
              <td>${player.goals || 0} (${goalPoints})</td>
              <td>${player.assists || 0} (${assistPoints})</td>
              <td>${player.mvp ? 'Yes' : 'No'} (${mvpPoints})</td>
              <td><strong>${player.points}</strong></td>
            </tr>
          `;
        });
        
        // Calculate team totals (excluding omitted player)
        let teamTotalBase = 0;
        let teamTotalGoals = 0;
        let teamTotalGoalPoints = 0;
        let teamTotalAssists = 0;
        let teamTotalAssistPoints = 0;
        let teamTotalMvps = 0;
        let teamTotalMvpPoints = 0;
        
        game.playerScores.forEach(player => {
          const isOmitted = game.omittedPlayer && player.playerId === game.omittedPlayer.playerId;
          if (!isOmitted) {
            const basePoints = player.appeared ? (1 + (player.baseScore || 0)) : 0;
            teamTotalBase += basePoints;
            teamTotalGoals += (player.goals || 0);
            teamTotalGoalPoints += (player.goals || 0) * 3;
            teamTotalAssists += (player.assists || 0);
            teamTotalAssistPoints += (player.assists || 0) * 2;
            if (player.mvp) {
              teamTotalMvps += 1;
              teamTotalMvpPoints += 5;
            }
          }
        });
        
        // Add team totals row
        content += `
            <tr class="table-dark">
              <td><strong>Team Total</strong></td>
              <td><strong>${teamTotalBase}</strong></td>
              <td><strong>${teamTotalGoals} (${teamTotalGoalPoints})</strong></td>
              <td><strong>${teamTotalAssists} (${teamTotalAssistPoints})</strong></td>
              <td><strong>${teamTotalMvps} (${teamTotalMvpPoints})</strong></td>
              <td><strong>${game.matchTotal}</strong></td>
            </tr>
        `;
        
        content += `
              </tbody>
            </table>
          </div>
              </div>
            </div>
          </div>
        `;
      });
      
      content += '</div>';
    } else {
      content += '<p class="text-muted">No games played yet this season.</p>';
    }
    
    console.log('Setting modal content'); // Debug log
    modalContent.innerHTML = content;
  }
});