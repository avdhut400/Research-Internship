# Oil Adulteration Detection using Vision Transformer and Continuous Learning

## Overview

Oil Adulteration Detection is an AI-powered web application that identifies whether an edible oil sample is pure or adulterated using a Vision Transformer (ViT-B/16) deep learning model.

The system provides real-time predictions, allows users to submit correction feedback, enables administrators to verify feedback, and continuously improves the AI model through a feedback-driven retraining pipeline.

---

# Features

- AI-based edible oil classification
- Detects pure and adulterated oil samples
- Confidence score for every prediction
- Top-3 prediction probabilities
- User feedback collection
- Cloudinary image storage
- MongoDB feedback management
- Admin verification panel
- Continuous learning through approved feedback
- Automatic model version management
- Google Drive model deployment

---

# Tech Stack

## Frontend

- React.js
- Vite
- Axios

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Cloudinary
- Multer

## AI Service

- Python
- FastAPI
- PyTorch
- Vision Transformer (ViT-B/16)
- Torchvision

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Render (AI Service)
- MongoDB Atlas
- Cloudinary
- Google Drive

---
<img width="1399" height="6072" alt="Continuous Learning Flow Diagram" src="https://github.com/user-attachments/assets/288cb698-1aa2-4f07-9356-f418c10bb3bb" />

<img width="5797" height="2248" alt="Arxhitecture" src="https://github.com/user-attachments/assets/65620335-93bd-4b6f-956c-71048e27ce03" />


# Project Architecture

```text
React Frontend
        │
        ▼
Express Backend
        │
        ▼
FastAPI AI Service
        │
        ▼
Vision Transformer Model
        │
        ▼
Prediction Result
```

---

# Prediction Pipeline

```text
User Upload Image
        │
        ▼
React Frontend
        │
        ▼
Express Backend
        │
        ▼
FastAPI
        │
        ▼
Image Preprocessing
        │
        ▼
Vision Transformer
        │
        ▼
Prediction Result
```

---

# Feedback Pipeline

```text
Prediction
        │
        ▼
User Feedback
        │
        ▼
Express Backend
        │
        ├────────► Cloudinary
        │
        └────────► MongoDB
```

---

# Admin Verification Pipeline

```text
Pending Feedback
        │
        ▼
Admin Dashboard
        │
        ▼
Approve / Reject
        │
        ▼
MongoDB Status Update
```

---

# Continuous Learning Pipeline

```text
Approved Feedback
        │
        ▼
Download Images
        │
        ▼
Original Dataset
        +
Approved Images
        │
        ▼
Model Fine-Tuning
        │
        ▼
New Model Version
        │
        ▼
Google Drive
        │
        ▼
Render AI Service
        │
        ▼
Improved Predictions
```

---

# AI Model

Model Architecture

- Vision Transformer (ViT-B/16)

Classes

- 24 Oil Classes

Prediction Output

- Oil Type
- Pure / Adulterated
- Confidence Score
- Adulteration Percentage
- Top 3 Predictions

---

# Feedback Workflow

1. User uploads an oil image.
2. AI predicts the oil class.
3. User verifies the prediction.
4. If incorrect, the correct class is selected.
5. Image is uploaded to Cloudinary.
6. Metadata is stored in MongoDB.
7. Admin reviews the feedback.
8. Approved feedback becomes part of the retraining dataset.

---

# Continuous Learning

The system improves over time using a human-in-the-loop learning process.

1. Users submit correction feedback.
2. Administrators verify submitted feedback.
3. Approved images are downloaded automatically.
4. Approved images are merged with the original training dataset.
5. The Vision Transformer model is fine-tuned.
6. A new model version is generated.
7. The validated model is uploaded to Google Drive.
8. The AI service loads the latest model for future predictions.

---

# Model Versioning

Examples

```
final_purity_model1.pth
final_purity_model_v2.pth
final_purity_model_v3.pth
```

The application automatically loads the latest available model version.

---

# Project Structure

```
Research-Internship
│
├── frontend
│
├── backend
│
├── ai
│   ├── model_loader.py
│   ├── retrain_model.py
│   ├── download_approved_feedback.py
│   ├── classes.txt
│   └── final_purity_model.pth
│
├── dataset
│
└── README.md
```

---

# API Endpoints

## Prediction

```
POST /api/predict
```

## Submit Feedback

```
POST /api/feedback
```

## Get Feedback

```
GET /api/feedback
```

## Update Feedback

```
PATCH /api/feedback/:id/status
```

## Delete Feedback

```
DELETE /api/feedback/:id
```

---

# Deployment

Frontend

- Vercel

Backend

- Render

AI Service

- Render

Database

- MongoDB Atlas

Image Storage

- Cloudinary

Model Storage

- Google Drive

---

# Future Enhancements

- Automatic retraining scheduler
- Google Drive automatic model upload
- Model performance dashboard
- Multi-model comparison
- Active learning strategy
- Email notifications for retraining completion

---

# Contributors

Tanishq 
Avdhut Magar
Athrav H
Sarthak


Research Internship Project

---
