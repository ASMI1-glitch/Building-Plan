# 🏗️ Building Planner .L2

Hi, I’m **Asmi Prasad** 👋  
This is a web app I built from scratch called **Building Planner .L2** — it lets users draw basic building layouts right in the browser. You can select tools like rectangle, circle, line, and start sketching on a canvas. There's also a save feature that stores your drawing in the backend.

I made this project to learn how to connect a drawing interface (frontend) with a real database (backend), and deploy the whole thing online.

> 🖥️ Live Link: [https://building-plan-8-frontend.onrender.com](https://building-plan-8-asmiprasad.onrender.com)  
> 📩 Contact: prasadasmi619@gmail.com

---

## 🧠 What This Project Does

The app lets you:
- Draw shapes like rectangles, lines, and circles
- Toggle between drawing and selection tools
- See annotations (optional)
- Save your drawing to a backend database (MongoDB)
- Later, you can fetch and display your saved drawing

It's basically a lightweight, browser-based sketch tool for building layouts.

---

## 🔧 Tech Stack I Used

### Frontend
- **React.js** – for building the interface
- **Tailwind CSS** – for fast, responsive styling
- **React Context API** – to manage the tool state
- **Custom canvas logic** – for drawing and shape tracking

### Backend
- **Node.js + Express** – REST APIs for saving/loading shapes
- **MongoDB + Mongoose** – to store the drawing data
- **CORS enabled** – so frontend and backend talk easily

---

## 🔗 Hosting (Both on Render)

- Frontend is deployed as a **Static Site**  
  → `client/` folder  
  → Built with `npm run build`

- Backend is deployed as a **Web Service**  
  → `server/` folder  
  → Has APIs like `/save` and `/load`

On the frontend, I set up environment variables to talk to the backend.  
On Render, I also added a **rewrite rule** to fix the 404 error when refreshing routes:

Source: /*
Destination: /index.html
Status: 200



---

## 🧪 How to Run It Locally (Step-by-Step)

Here’s how you can run this project on your own machine:

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/building-planner.git
   cd building-planner
   cd server
npm install
cd ../client
npm install
PORT=5000
MONGO_URI=your_mongodb_connection_string
cd server
npm run dev
cd ../client
npm start
💡 What I’d Like to Add Next
Zoom and pan support on canvas

Undo / redo feature

Login system so users can save personal drawings

Real-time collaboration (like Google Docs!)

🧍 A Bit About Me
I'm currently learning fullstack development, and this project helped me connect frontend interactions with real backend logic. I got to practice using tools like React Context, canvas event handling, MongoDB, and even deployments.

If you’d like to give feedback or collaborate, feel free to reach out!

— Asmi Prasad
📩 Email: prasadasmi619@gmail.com




---

### ✅ This version:
- Reads naturally like you’re speaking
- Includes **all steps clearly in one place**
- Doesn’t sound like a copy-paste from templates
- Shows **your voice** as a learner + builder

Let me know if you want this turned into a PDF or want to add screenshots. You're doing great!

