# API Contract

This document defines the interface and data types for the backend API.

## Base URL
`/api/v1`

## Authentication
`Authorization: Bearer <token>`

---

## 1. Profiles
### `GET /profiles/me` (Auth Required)
Returns the current user profile including `username`, `level`, `xp`, `games_played`, and `achievements`.

### `PUT /profiles/me` (Auth Required)
Update profile fields.
```json
{
  "full_name": "string",
  "username": "string"
}
```

---

## 2. Scores & Leaderboard
### `POST /scores` (Auth Required)
Submit a game result.
```json
{
  "game_type": "reaction_time | aim_trainer | number_memory | sequence_memory | visual_memory | verbal_memory | wawasan_indonesia",
  "score_value": 150,
  "additional_data": { "accuracy": 95, "time": 10.5 } // Optional
}
```

### `GET /scores/leaderboard/:game_type` (Public)
Fetch top 100 players for a specific game type.
**Response:**
```json
{
  "data": [
    {
      "score_value": 142,
      "additional_data": {},
      "created_at": "2026-06-21T00:00:00Z",
      "profiles": { "username": "GarengSolo", "avatar_url": null }
    }
  ]
}
```

### `GET /scores/me` (Auth Required)
Get personal best scores for the current user.

---

## 3. Wawasan Indonesia (Questions)
### `GET /questions?category=Sejarah&limit=10` (Public)
Fetch random questions. The response **does not** include the `correct_answer`.
**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "category": "Sejarah",
      "question_text": "Siapakah presiden pertama Indonesia?",
      "options": ["Soeharto", "Soekarno", "Habibie", "Gus Dur"],
      "difficulty": "medium"
    }
  ]
}
```

### `POST /questions/verify` (Public)
Verify if the answer is correct and get an explanation.
```json
{
  "questionId": "uuid",
  "answer": "Soekarno"
}
```
**Response:**
```json
{
  "isCorrect": true,
  "correctAnswer": "Soekarno",
  "explanation": "Ir. Soekarno memproklamasikan kemerdekaan dan menjadi presiden pertama."
}
```

---

## 4. Inquiries
### `POST /inquiries` (Public)
Submit a contact form.
```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "message": "Halo, NusaBench sangat keren!"
}
```
