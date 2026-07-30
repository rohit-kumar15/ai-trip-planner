<div align="center">

# 🌍 AI Trip Planner

### An AI-Powered Full-Stack Travel Planning Platform

Generate personalized travel itineraries with AI, discover attractions and hotels, visualize trips on interactive maps, and manage your journeys through a modern, scalable web application.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss)
![Convex](https://img.shields.io/badge/Convex-Database-orange?style=for-the-badge)
![Clerk](https://img.shields.io/badge/Authentication-Clerk-purple?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-OpenRouter-success?style=for-the-badge)

</div>

---

# 📖 Overview

AI Trip Planner is an intelligent full-stack travel planning platform that leverages Large Language Models (LLMs) to create personalized travel experiences based on user preferences, destinations, trip duration, and budget.

The platform combines AI-powered itinerary generation, interactive maps, secure authentication, cloud database management, and modern UI/UX to simplify travel planning from start to finish.

Designed with scalability and production-readiness in mind, the application integrates multiple APIs and follows modern full-stack development practices.

---

# ✨ Features

### 🤖 AI Trip Planning

- AI-generated personalized itineraries
- Smart travel recommendations
- Day-wise travel schedule
- Personalized destination suggestions
- Dynamic travel planning

### 🗺️ Maps & Location

- Interactive Mapbox integration
- Tourist attraction visualization
- Nearby places recommendations
- Hotel location display
- Geographic destination support

### 🏨 Hotel Recommendations

- AI-based hotel suggestions
- Nearby accommodation discovery
- Hotel images
- Location-based recommendations

### 📍 Tourist Attractions

- Popular attraction suggestions
- Attraction images
- Attraction details
- Nearby attractions

### 👤 Authentication

- Secure user authentication using Clerk
- User profile management
- Protected routes
- Session management

### ☁ Cloud Database

- Store user trips
- Save itinerary history
- Manage user-generated plans
- Fast cloud synchronization

### 💳 Subscription Support

- Premium feature integration
- Subscription management
- User plan handling

### 🛡️ Security

- Arcjet rate limiting
- Bot protection
- Secure API requests
- Protected backend endpoints

---

# 🛠 Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ShadCN UI
- Aceternity UI

## Backend

- Next.js API Routes
- Convex Database
- Server Actions

## Authentication

- Clerk Authentication

## Artificial Intelligence

- OpenRouter API
- Gemini Models

## Maps & Location

- Mapbox
- Geoapify API

## Images

- Unsplash API

## Security

- Arcjet

## Deployment

- Vercel

---

# 🏗 System Architecture

```
                    User

                      │

                      ▼

              Next.js Frontend

                      │

        ┌─────────────┴─────────────┐

        ▼                           ▼

 Clerk Authentication         AI Planner

                                      │

                             OpenRouter API

                                      │

                              Gemini Model

        ▼                           ▼

 Convex Database              Mapbox API

        ▼                           ▼

 Saved Trips             Geoapify + Images

```

---

# 📂 Project Structure

```
AI-Trip-Planner/

│

├── app/

├── components/

├── actions/

├── hooks/

├── lib/

├── utils/

├── types/

├── public/

├── convex/

├── styles/

└── package.json
```

---

# 🚀 Core Functionalities

### ✅ AI Itinerary Generation

Generate complete travel itineraries using AI based on:

- Destination
- Budget
- Number of days
- Travel preferences
- Interests

---

### ✅ Smart Recommendations

The AI recommends:

- Hotels
- Tourist attractions
- Restaurants
- Local experiences

---

### ✅ Interactive Maps

Visualize:

- Hotels
- Attractions
- Destinations
- Travel routes

using Mapbox.

---

### ✅ User Dashboard

Users can

- View saved trips
- Access previous itineraries
- Manage travel history
- Create new plans

---

### ✅ Secure Authentication

Users can

- Sign Up
- Login
- Manage Profiles
- Access protected features

using Clerk Authentication.

---

# 🔄 Application Workflow

```
User Login
      │
      ▼
Enter Travel Preferences
      │
      ▼
AI Prompt Generation
      │
      ▼
OpenRouter API
      │
      ▼
LLM Response
      │
      ▼
Generate Itinerary
      │
      ▼
Store in Convex
      │
      ▼
Display Maps
      │
      ▼
Save Trip
```

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/your-username/AI-Trip-Planner.git
```

Navigate to project directory

```bash
cd AI-Trip-Planner
```

Install dependencies

```bash
npm install
```
# ▶ Running the Project

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Start Production

```bash
npm run start
```
# 💡 Challenges Solved

- AI prompt engineering
- Dynamic itinerary generation
- Secure authentication
- Cloud database synchronization
- Interactive map rendering
- API integration
- Responsive UI
- Scalable application architecture

---

# 🚀 Future Enhancements

- Voice-based travel assistant
- Expense tracker
- Flight price prediction
- Collaborative trip planning
- Offline itinerary support
- Multi-language support
- Weather forecasting
- AI travel chatbot
- Real-time public transport integration
- Budget optimization using AI

---

# 📈 Learning Outcomes

Through this project, I gained hands-on experience in:

- Full-Stack Web Development
- AI Application Development
- Prompt Engineering
- LLM Integration
- REST API Integration
- Authentication Systems
- Cloud Database Management
- Interactive Maps
- Modern UI/UX Development
- Serverless Architecture
- Secure Web Applications
