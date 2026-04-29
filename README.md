# Ai-Health - Mental Health & Wellness Platform

![AI Health](https://img.shields.io/badge/AI-Health-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)

A comprehensive AI-powered mental health and wellness platform connecting patients with doctors, featuring mood tracking, meditation, journaling, and real-time medicine suggestions.

## 🌟 Features

### For Patients
- **Mood Tracking**: Daily mood logging with AI-powered sentiment analysis
- **Journal**: Secure personal journal with gratitude prompts
- **Meditation**: Built-in 5-minute guided meditation timer
- **Walking Tracker**: Activity tracking with step counter
- **Calming Music**: YouTube-integrated relaxing music (Piano, Nature, Morning, Sleep)
- **Doctor List**: View available doctors and their specializations
- **Gamification**: Earn badges and points for completing activities
- **AI Chatbot**: 24/7 mental health support chat
- **Crisis Alerts**: Emergency support system

### For Doctors
- **Patient Dashboard**: View all assigned patients
- **Health Details**: Access patient mood history, symptoms, medications
- **Medicine Suggestions**: Prescribe and suggest medicines directly
- **Real-time Updates**: See new patient registrations instantly
- **Risk Assessment**: Low/Medium/High risk level indicators

## 🚀 Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- Framer Motion for animations
- Lucide React for icons
- Axios for API calls

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- OpenAI API integration
- Socket.io for real-time features

**AI Services:**
- OpenAI GPT for chatbot responses
- Sentiment analysis for mood tracking
- Personalized activity suggestions

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### 1. Clone Repository
```bash
git clone https://github.com/nitesh680/Ai-Health.git
cd Ai-Health
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Start backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🌐 Usage

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Demo Credentials
**Patient:**
- Email: patient@demo.com
- Password: demo123

**Doctor:**
- Email: doctor@demo.com
- Password: demo123

## 📁 Project Structure

```
ai-health/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & validation
│   ├── services/        # AI services
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Page components
│   │   │   ├── patient/ # Patient dashboard
│   │   │   └── doctor/  # Doctor dashboard
│   │   ├── services/    # API calls
│   │   └── context/     # Auth context
│   └── index.html
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/patients` - Get all patients (doctors only)
- `GET /api/users/doctors` - Get all doctors
- `POST /api/users/activity-badge` - Award activity badges

### Mood & Journal
- `POST /api/mood` - Log mood entry
- `GET /api/mood/history` - Get mood history
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get journal entries

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - Get appointments
- `PUT /api/appointments/:id` - Update appointment

### Chat
- `POST /api/chat/send` - Send message to AI
- `GET /api/chat/history` - Get chat history

## 🎮 Gamification System

Earn badges by completing activities:
- 🧘 **Mindful Meditator** - Complete meditation session
- 🚶 **Active Walker** - Complete walking session
- 🎵 **Music Lover** - Listen to calming music
- 📝 **Gratitude Writer** - Write journal entry

Each badge awards **50 points** to your wellness score!

## 🩺 Medicine Suggestion Feature

Doctors can:
1. Click on any patient from the list
2. View complete health profile (mood, symptoms, history)
3. Fill medicine suggestion form:
   - Medicine name
   - Dosage (e.g., 50mg)
   - Frequency (e.g., Twice daily)
   - Additional notes
4. Send directly to patient

## 🎵 YouTube Music Integration

Embedded relaxing music categories:
- **Piano Music** - Study/focus tracks
- **Nature Sounds** - Forest, rain, ocean
- **Morning Energizer** - Uplifting melodies
- **Sleep Music** - Deep relaxation for sleep

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS enabled
- Environment variable protection

## 🚑 Crisis Support

Emergency features include:
- Crisis alert button
- Trusted contacts notification
- Direct helpline access
- Safety planning tools

## 📱 Responsive Design

Fully responsive for:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Niteshhx** - [GitHub](https://github.com/nitesh680)

## 🙏 Acknowledgments

- OpenAI for GPT API
- MongoDB Atlas for database hosting
- Vite for fast development
- TailwindCSS for beautiful styling

---

**Made with ❤️ for better mental health**