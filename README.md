# Real Chet F.C. CMS

This is a Content Management System (CMS) designed to manage the roster, schedule, and statistics for **Real Chet F.C.**, a soccer team. The system is built using **Node.js**, **Express.js**, and **Handlebars**, utilizing the **MVC** (Model-View-Controller) architecture. It allows admins to efficiently manage player information, match results, and schedules.

## Features

### Player Management:
- **Roster Management:** Admins can add, edit, and delete player profiles.
- **Player Information:** Store essential details such as:
  - Name
  - Image
  - College
  - Country of Origin
- **Image Management:** Admins can upload and manage player images.

### Match Management:
- **Match Schedule:** Admins can add, edit, and remove scheduled matches.
- **Match Results:** Track match results with scores, including goals scored and assists per player.
- **Upcoming Matches:** View upcoming matches based on the schedule.

### Statistics:
- **Player Stats:** Track individual player statistics such as goals scored and assists.
- **Team Stats:** View aggregated team statistics, such as total goals, assists, and match outcomes.

---

## Folder Structure

The project follows the **MVC** (Model-View-Controller) architecture:

```
real-chet-fc-cms/
│
├── models/                  # Contains data models for players, matches, etc.
├── controller/              # Handles the logic and routes for managing players, matches, etc.
|   ├── routes/              # Defines the routes for player and match management
├── views/                   # Contains Handlebars templates for displaying content
│   ├── partials/            # Reusable view components
├── public/                  # Static assets (images, CSS, JS)
├── config/                  # Configuration files, such as database setup
├── controller/              # Logic for routing and managing data
├── server.js                # Main entry point to start the server
├── .env                     # Environment variables
```

---

## Technologies Used

- **Node.js**: JavaScript runtime environment for building the server-side application.
- **Express.js**: Web framework for building the application and handling HTTP requests.
- **Handlebars**: Templating engine used to generate dynamic HTML views.
- **Sequelize**: SQL ORM to create and manage data models.
- **CloudFlare** For storing player profile images.

---

## Usage

Once the system is running, an admin can:

1. **Manage Players**: 
   - Add new players with their images and stats.
   - Edit or delete existing player profiles.

2. **Manage Matches**:
   - Add upcoming matches with details like date, time, and location.
   - Record match results after they are completed.

3. **Manage Statistics**:
   - Access individual player statistics, including goals, assists, and match performance.
   - View team statistics to track overall performance.