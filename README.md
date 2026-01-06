# Snippet Locker

Hey! This is my Snippet Locker. I built this because I got tired of constantly searching through old projects or random browser bookmarks just to find that one specific piece of code I use all the time. 

It’s a simple, clean place to "lock away" your favorite code snippets so you can find them exactly when you need them.

## How I built this
I wanted to practice building a "Full Stack" app, so I used:
* **Django (Python)** on the back end to handle data, authentication, and the API.
* **React** on the front end to make it feel fast and snappy.
* **Tailwind CSS** because I wanted it to look dark and modern without writing 500 lines of CSS.

## Features

### User Management
- Secure user registration and login
- Token-based authentication
- Each user has their own private snippet collection

### Snippet Management
- Create, read, update, and delete code snippets
- Search snippets by title or code content
- Filter by programming language
- One-click copy to clipboard
- Edit existing snippets with a modal interface

### Code Display
- Syntax highlighting for 20+ programming languages
- Line numbers for better readability
- Responsive grid layout
- Dark theme optimized for coding

### User Experience
- Loading states for all async operations
- Empty state messaging
- Real-time search and filtering
- Full-width responsive design


## Screenshots

### Login / Registration
![Login Page](Screenshots/Login.png)
*Sign in or register to access your snippets.*

### Main Dashboard
![Dashboard](Screenshots/Dashboard.png)  
*All your snippets in one place. Filter, search, copy, edit, and delete easily.*

### Language Support / Filter
![Language Support](Screenshots/Language%20Support.png)
*List of languages supported with syntax highlighting.*

### Edit
![Edit Feature](Screenshots/Edit.png)
*Edit your snippet when you need.*

### Search Filter
![Search](Screenshots/Search_filter.png)
*Either search your snippet or filter the language selection.*

## Want to run it yourself?
If you've cloned this, here is the "non-boring" guide to getting it started:

### 1. The Backend (The Brain)
Navigate to `/backend`, set up a virtual environment, and install the requirements:
`pip install -r requirements.txt`
Then, just run:
`python manage.py migrate`
`python manage.py runserver`

### 2. The Frontend (The Face)
In a new terminal, go to `/frontend`, install the stuff:
`npm install`

Create a .env file in the frontend folder and add your API URL:
VITE_API_URL=http://127.0.0.1:8000/api/
And fire it up:
`npm run dev`

## Tech Stack

* **Backend:** Django, Django REST Framework  
* **Frontend:** React, Tailwind CSS, Axios  
* **Authentication:** Token-based (Django REST Framework Auth)  
* **Database:** SQLite (default for Django, easy to swap later)
