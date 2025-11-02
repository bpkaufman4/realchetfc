// Roster Management JavaScript

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the page
  updateStatistics();
  setupEventListeners();
});

function setupEventListeners() {
  // Search functionality
  document.getElementById('playerSearch').addEventListener('input', searchPlayers);
}

function updateStatistics() {
  const onRosterCards = document.querySelectorAll('#onRosterCards .player-card');
  const availableCards = document.querySelectorAll('#availableCards .player-card');
  const totalCards = onRosterCards.length + availableCards.length;

  document.getElementById('totalPlayers').textContent = totalCards;
  document.getElementById('playersOnRoster').textContent = onRosterCards.length;
  document.getElementById('playersAvailable').textContent = availableCards.length;

  // Update pool counts
  document.getElementById('onRosterCount').textContent = onRosterCards.length;
  document.getElementById('availableCount').textContent = availableCards.length;
}

function searchPlayers() {
  const searchTerm = document.getElementById('playerSearch').value.toLowerCase();
  const allPlayerCards = document.querySelectorAll('.player-card');

  allPlayerCards.forEach(card => {
    const playerName = card.querySelector('.player-name').textContent.toLowerCase();
    const playerNumber = card.querySelector('.player-number').textContent.toLowerCase();

    const matchesSearch = playerName.includes(searchTerm) ||
      playerNumber.includes(searchTerm);

    if (matchesSearch || searchTerm === '') {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

async function addToRoster(playerId) {
  const seasonId = getCurrentSeasonId();

  try {
    const response = await fetch('/api/player-season', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: playerId,
        seasonId: seasonId
      })
    });

    if (response.ok) {
      // Move card from available to on roster
      movePlayerCard(playerId, true);
      updateStatistics();
      showNotification('Player added to roster successfully!', 'success');
    } else {
      const error = await response.json();
      showNotification(`Error: ${error.message}`, 'error');
    }
  } catch (error) {
    console.error('Error adding player to roster:', error);
    showNotification('Failed to add player to roster', 'error');
  }
}

async function removeFromRoster(playerId) {
  const seasonId = getCurrentSeasonId();

  try {
    const response = await fetch('/api/player-season', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: playerId,
        seasonId: seasonId
      })
    });

    if (response.ok) {
      // Move card from on roster to available
      movePlayerCard(playerId, false);
      updateStatistics();
      showNotification('Player removed from roster successfully!', 'success');
    } else {
      const error = await response.json();
      showNotification(`Error: ${error.message}`, 'error');
    }
  } catch (error) {
    console.error('Error removing player from roster:', error);
    showNotification('Failed to remove player from roster', 'error');
  }
}

function movePlayerCard(playerId, toRoster) {
  const playerCard = document.querySelector(`[data-player-id="${playerId}"]`);
  if (!playerCard) return;

  // Remove the card from its current location
  playerCard.remove();

  if (toRoster) {
    // Move to roster pool
    playerCard.classList.remove('available');
    playerCard.classList.add('on-roster');

    // Update button
    const button = playerCard.querySelector('button');
    button.className = 'remove-btn';
    button.textContent = '×';
    button.onclick = () => removeFromRoster(playerId);

    // Add to on roster container
    document.getElementById('onRosterCards').appendChild(playerCard);
  } else {
    // Move to available pool
    playerCard.classList.remove('on-roster');
    playerCard.classList.add('available');

    // Update button
    const button = playerCard.querySelector('button');
    button.className = 'add-btn';
    button.textContent = '+';
    button.onclick = () => addToRoster(playerId);

    // Add to available container
    document.getElementById('availableCards').appendChild(playerCard);
  }

  // Add animation effect
  playerCard.style.transform = 'scale(1.1)';
  setTimeout(() => {
    playerCard.style.transform = '';
  }, 200);
}

function getCurrentSeasonId() {
  // Extract season ID from the current URL
  const pathParts = window.location.pathname.split('/');
  return pathParts[pathParts.length - 1];
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transition: opacity 0.3s ease;
    `;

  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#28a745';
      break;
    case 'error':
      notification.style.backgroundColor = '#dc3545';
      break;
    default:
      notification.style.backgroundColor = '#17a2b8';
  }

  // Add to page
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}