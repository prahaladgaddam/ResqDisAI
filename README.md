🛟 ResqDisAI — AI-Powered Disaster Response Platform
ResqDisAI is an intelligent crisis management platform that accelerates rescue and relief operations in disaster-affected areas. It combines real-time data gathering, AI-driven urgency triage, geolocation mapping, and automated dispatching — all in one place.

🚨 Problem Statement
In disaster or crisis events, victims face:

❌ Difficulty accessing emergency channels

❌ Scattered and uncoordinated rescue information

❌ Delays caused by manual triage and logistics

✅ Our Solution
ResqDisAI delivers a centralized, AI-powered rescue platform designed for rescue agencies, NGOs, and volunteers:

📡 Multi-source ingestion: Accepts SOS via SMS, Twitter, and Manual Entry

🧠 AI classification: Evaluates urgency, type of need, and sentiment from messages

📍 Location detection: Auto-tags geolocation (with offline fallback)

🚨 Automated dispatch: Sends requests to nearby responders

📊 Live dashboard: Tracks criticality, dispatch status, and request density on maps

Manual Entry Form(For data collection from all channels):

![manual entry form](https://github.com/user-attachments/assets/4652e7f4-7807-47e0-94fb-dfb46144ba48)


Dashboard for Dispatch Management:

![Dashboard](https://github.com/user-attachments/assets/22f1002e-1f51-4895-ba96-e004fdc9dace)


🛠️ MVP Implemented Features
Feature	Description
🧾 Manual Entry Portal	Interface for call/text operators to log requests with urgency and needs
🗺️ Emergency Dashboard	Real-time map and stats overview: critical count, dispatch status, urgency
📊 AI-powered Insights	NLP-based triage that auto-detects urgency, request type, and priority
📦 Request Categorization	Classifies needs: Food/Water, Medical, Shelter, Evacuation, etc.
📌 Geolocation	Detects and maps request origin; supports manual or device-based location
🚑 Dispatcher UI	Displays real-time requests, status, urgency filter, and actions
🔍 Sentiment Analysis	Enhances triage with AI-based emotional inference from request content

🧠 AI-Powered Capabilities
Module	Description
🔥 Urgency Classifier	Uses OpenAI + NLP rules to assess severity from message
🤖 Secondary AI Verifier	Confirms operator-entered urgency/type using AI cross-verification
🧭 Smart Dispatcher	Suggests closest volunteers/teams based on urgency & type
📶 Offline Fallback	Stores request data when network is offline, syncs later

🧱 Tech Stack
Layer	Technology
Frontend	React.js, Vite, Tailwind CSS, shadcn/ui
Backend	Node.js + Express.js (TypeScript)
Database	PostgreSQL (Neon serverless) + Drizzle ORM
AI Layer	OpenAI API, Custom NLP Pipeline
APIs Used	Twitter API, SMS Gateway, OpenAI
Deployment	Replit-ready with hot reload + build scripts

🗺️ System Architecture
<img width="1222" height="740" alt="image" src="https://github.com/user-attachments/assets/922f05af-7277-4d22-9c93-6cac7c68055a" />


🧪 Prototype Summary
What we’ve implemented in our MVP:

✅ A Manual Entry Form for operators

✅ A real-time Dashboard UI to track requests

✅ AI-based urgency and need classifier for every incoming report

✅ Integration of map visualization and status tracking

✅ AI-assisted dispatcher view and secondary validation


⚠️ Due to hackathon time constraints, and issues faced with our original code(crisis-backend, web-app) base we had to pivot to Replit a the last minute for development and testing to ship things and finish in time, what you see above are both code bases-original code(crisis-backend, web-app), and Replit-All other files, please rechout to us for any clarification, thanks!
