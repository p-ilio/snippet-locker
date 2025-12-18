# 🔒 Snippet Locker

Hey! This is my Snippet Locker. I built this because I got tired of constantly searching through old projects or random browser bookmarks just to find that one specific piece of code I use all the time. 

It’s a simple, clean place to "lock away" your favorite code snippets so you can find them exactly when you need them.

## 🛠️ How I built this
I wanted to practice building a "Full Stack" app, so I used:
* **Django (Python)** on the back end to handle the data and the API.
* **React** on the front end to make it feel fast and snappy.
* **Tailwind CSS** because I wanted it to look dark and modern without writing 500 lines of CSS.

## ✨ What it does right now
* You can save a snippet with a title and the code itself.
* It lists everything in a clean dashboard.
* If you don't need a snippet anymore, there's a quick delete button to keep things tidy.
* It's set up with environment variables, so the API URLs aren't hardcoded (keeps things secure!).

## 🚀 Want to run it yourself?
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
And fire it up:
`npm run dev`

*Don't forget to create a `.env` file in the frontend folder based on the `.env.example` I left for you!*