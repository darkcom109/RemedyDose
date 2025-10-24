# 💊 RemedyDose

<p align="center">
  <img src="https://img.shields.io/badge/-React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/-Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/-Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white" />
  <img src="https://img.shields.io/badge/-HuggingFace-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" />
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/-Expo_Router-000000?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/-Local_Auth-4CAF50?style=for-the-badge&logo=android&logoColor=white" />
  <img src="https://img.shields.io/badge/-Notifications-2196F3?style=for-the-badge&logo=bell&logoColor=white" />
</p>

**RemedyDose** is a **Full-Stack React Native and Expo** application designed to bring personalized healthcare management to your fingertips.  
It integrates **local authentication**, **scheduled notifications**, and a full **Appwrite backend (BaaS)** — enhanced with **Hugging Face AI** for smart assistance and conversational interaction.

---

## 🚀 Features

- 🔐 **Local Authentication** (Fingerprint / Face ID via Expo Local Auth)  
- ⏰ **Scheduled Local Notifications** for medication reminders  
- 🧠 **AI-Powered Chat & Assistance** using Hugging Face Inference API  
- ☁️ **Full Backend Integration** with Appwrite (authentication, database, and storage)  
- 📋 **Health Logs & Medication Tracking** stored securely in the cloud  
- ⚙️ **Environment Configuration** with `.env` and Expo Public Variables  
- 🎨 **Modern UI** with Expo Router navigation and Google Fonts  
- 📱 **Cross-Platform Support** (iOS, Android, Web)

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript / JavaScript |
| Routing | Expo Router |
| Authentication | Expo Local Authentication |
| Notifications | Expo Notifications |
| Backend | Appwrite (BaaS) |
| AI | Hugging Face Inference API |
| Storage | SecureStore + Appwrite Databases |

---

## 💾 Installation

```bash
# Clone the repository
git clone https://github.com/darkcom109/RemedyDose
cd RemedyDose

# Install dependencies
npm install

# Create a .env file and add your keys
EXPO_PUBLIC_APPWRITE_ENDPOINT=YOUR_APPWRITE_ENDPOINT
EXPO_PUBLIC_APPWRITE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_APPWRITE_DATABASE_ID=YOUR_DATABASE_ID
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=YOUR_COLLECTION_ID
EXPO_PUBLIC_HUGGING_FACE_TOKEN=YOUR_HUGGING_FACE_TOKEN

# Start the project
npx expo start --tunnel
