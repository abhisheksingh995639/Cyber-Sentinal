# Cyber Sentinel 🛡️

A real-time societal threat analysis dashboard built for the **Cybershield Hackathon 2025**. This project provides a centralized command center for law enforcement to monitor, analyze, and act upon potential threats identified from open-source intelligence (OSINT) feeds like Reddit and news articles.

**[🌐 View Live Demo](https://cyber-sentinel-mp.onrender.com)**

-----
## 📸 Screenshots
<img width="1903" height="915" alt="Screenshot 2025-09-28 101149" src="https://github.com/user-attachments/assets/885f90fe-376e-4c70-83da-c77036b9a674" />
<img width="1896" height="710" alt="Screenshot 2025-09-28 101208" src="https://github.com/user-attachments/assets/c60ab97a-d756-4fcc-b2cd-4d27a5f22aba" />

*(Add screenshots of your dashboard here. For example: the main dashboard view, the geospatial heatmap, and the case file modal.)*

## ✨ Key Features

  * **Real-Time Data Aggregation:** Fetches and processes live data from various subreddits and news articles via the NewsAPI.
  * **Automated Threat Analysis:** A custom sentiment and keyword-based engine analyzes content and assigns a threat level ('High', 'Medium', or 'None').
  * **Geospatial Intelligence:** Visualizes threat hotspots across Madhya Pradesh on an interactive heatmap using Leaflet.js.
  * **Actionable Dashboards:** Provides at-a-glance metrics, a sentiment distribution chart (Chart.js), keyword trends, and a high-priority feed for immediate situational awareness.
  * **In-Depth Case Files:** Allows for deep-dive analysis of specific posts, including user activity analysis and downloadable PDF report generation for documentation.

## 💻 Tech Stack

**Frontend:**

  * HTML5 & Tailwind CSS
  * JavaScript (Vanilla)
  * [Chart.js](https://www.chartjs.org/) for data visualization.
  * [Leaflet.js](https://leafletjs.com/) for the interactive map.
  * [jsPDF](https://github.com/parallax/jsPDF) for generating PDF reports.

**Backend:**

  * [Node.js](https://nodejs.org/)
  * [Express.js](https://expressjs.com/) for the server and API proxy.
  * [node-fetch](https://www.npmjs.com/package/node-fetch) for making API requests.

**APIs:**

  * Reddit API
  * NewsAPI

## 🚀 Running Locally

To get a local copy up and running, follow these steps.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### 1\. Clone the Repository

```bash
git clone https://github.com/abhisheksingh995639/cyber-sentinel-hackathon.git
cd cyber-sentinel-hackathon
```

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Set Up Environment Variables

Create a `.env` file in the root of the project and add your API credentials. Your file should look like this:

```
REDDIT_CLIENT_ID='YOUR_REDDIT_CLIENT_ID'
REDDIT_CLIENT_SECRET='YOUR_REDDIT_CLIENT_SECRET'
NEWS_API_KEY='YOUR_NEWS_API_KEY'
```

### 4\. Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## 🌐 Deployment

This project is deployed as a **Web Service** on [Render](https://render.com). The environment variables from the `.env` file were added in the Render dashboard to ensure secure handling of API keys.

## 🙏 Acknowledgements

This project was developed as a submission for the **Cybershield Hackathon 2025**, and we would like to thank the organizers, sponsors, and partners:

  * **Organizer:** Madhya Pradesh Police
  * **Sponsor:** State Bank of India (SBI)
  * **Co-host:** VIT Bhopal
  * **Industry Partners:** Netlink & Cleartrail

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
