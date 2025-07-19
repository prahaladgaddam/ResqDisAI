# 🛟 ResqDisAI — Intelligent Disaster Response Platform

**ResqDisAI** is an AI-powered crisis management platform that accelerates disaster rescue operations by automating **victim identification**, **urgency classification**, and **real-time coordination** using social media, SMS, and geolocation intelligence — even offline.

---

## 🚨 The Problem

During natural disasters, **victims struggle to reach help** and **rescue teams waste precious time** manually scanning social media or verifying distress calls.

> ❌ Critical delays  
> ❌ No centralized visibility  
> ❌ No urgency-based triage

---

## ✅ Our Solution

ResqDisAI builds a **centralized, intelligent dashboard** for rescuers that:

- 🔍 Fetches live help requests from **Twitter** (via API)
- 📩 Accepts direct reports via **SMS**, **toll-free number**, and **in-app**
- 🧠 Uses **AI models** to score **urgency** based on keywords and sentiment
- 📍 Detects user **location automatically** — even offline
- 🚨 Dispatches nearby **volunteers, NGOs, or government teams**
- 📊 Tracks victim rescue status in real time

---

## 🔧 Tech Stack

| Layer          | Tech                                 |
|----------------|--------------------------------------|
| Frontend       | React Native (Expo Router)           |
| Backend        | Node.js + Express.js                 |
| Database       | MongoDB                              |
| AI Layer       | Custom NLP + scoring pipeline        |
| APIs Used      | Twitter API, SMS Gateway             |

---

## 🖥️ Architecture

```mermaid
flowchart TD
    User[Victim/Survivor] -->|SMS/Twitter/App| AI[Urgency Classifier]
    AI --> DB[Rescue Requests DB]
    AI --> Map[Location Module]
    Map --> Dispatcher[Rescue Dispatcher]
    Dispatcher --> Volunteers[NGOs/Volunteers]
    Volunteers --> Status[Status Tracker]

⚠️ Due to hackathon time constraints, development and testing were done on **Replit** to enable faster iteration, integrated deployment, and real-time team collaboration. The stack remains fully portable to other production-grade platforms.




