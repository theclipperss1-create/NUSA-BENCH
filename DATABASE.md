# Database Schema

This document outlines the database schema for the NusaBench project. We use PostgreSQL hosted on Supabase.

## Tables

### 1. `auth.users`
*Provided by Supabase Auth.* Stores user credentials, email, passwords, and metadata.

### 2. `public.profiles`
Stores extended user profile information. Automatically populated when a new user signs up.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, REFERENCES auth.users(id) ON DELETE CASCADE | Unique identifier |
| `username` | TEXT | UNIQUE | Unique username for NusaBench |
| `full_name` | TEXT | | User's full name |
| `avatar_url` | TEXT | | Profile picture URL |
| `level` | INTEGER | DEFAULT 1 | User progression level |
| `xp` | INTEGER | DEFAULT 0 | User experience points |
| `games_played`| INTEGER | DEFAULT 0 | Total games played |
| `achievements`| JSONB | DEFAULT '[]' | Array of earned achievements |
| `bio` | TEXT | | User biography |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation time |

### 3. `public.inquiries`
Stores contact form submissions from the website.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `name` | TEXT | NOT NULL | Sender's name |
| `email` | TEXT | NOT NULL | Sender's email |
| `subject` | TEXT | | Message subject |
| `message` | TEXT | NOT NULL | The inquiry message |
| `status` | TEXT | DEFAULT 'pending' | Status ('pending', 'in_progress', 'resolved') |

### 4. `public.scores`
Stores game results / benchmark scores.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `user_id` | UUID | REFERENCES auth.users(id) ON DELETE CASCADE | The player |
| `game_type` | TEXT | NOT NULL | 'reaction_time', 'aim_trainer', 'number_memory', etc |
| `score_value` | NUMERIC| NOT NULL | The main score used for ranking |
| `additional_data`| JSONB| DEFAULT '{}' | Metadata (e.g. accuracy, time) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation time |

### 5. `public.questions`
Stores Wawasan Indonesia trivia questions.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| `category` | TEXT | NOT NULL | 'Geografi', 'Sejarah', 'Budaya', dll |
| `question_text`| TEXT | NOT NULL | The question |
| `options` | JSONB | NOT NULL | Array of possible answers |
| `correct_answer`| TEXT | NOT NULL | The correct answer string |
| `explanation` | TEXT | | Explanation after answering |
| `difficulty` | TEXT | DEFAULT 'medium' | 'easy', 'medium', 'hard' |
