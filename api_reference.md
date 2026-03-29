# 📘 API Reference — English Grammar Backend

> **Base URL:** `http://localhost:8080/api/v1`  
> **Auth:** Bearer JWT — đặt trong header: `Authorization: Bearer <token>`  
> **Response wrapper** cho mọi API:
> ```json
> { "code": 1000, "message": "success", "result": { ... } }
> ```

---

## 📑 Mục lục

1. [🔐 Authentication](#1-authentication)
2. [👤 User & Profile](#2-user--profile)
3. [📚 Content (Category / Topic / Lesson)](#3-content-category--topic--lesson)
4. [📝 Exercise & Attempt](#4-exercise--attempt)
5. [📖 Lesson Progress](#5-lesson-progress)
6. [🗂 Flashcard Deck & Card](#6-flashcard-deck--card)
7. [🧠 SRS (Spaced Repetition)](#7-srs-spaced-repetition)
8. [📊 User Dashboard & Stats](#8-user-dashboard--stats)
9. [🔧 Admin APIs](#9-admin-apis)

---

## 1. 🔐 Authentication

> Không cần Bearer token (trừ logout)

| Method | URL | Mô tả |
|--------|-----|-------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới |
| `POST` | `/auth/login` | Đăng nhập |
| `POST` | `/auth/refresh-token?token=xxx` | Làm mới access token |
| `POST` | `/auth/logout?token=xxx` | Đăng xuất |

### POST /auth/register
```json
// Request
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "Nguyen",
  "lastName": "Trung",
  "phoneNumber": "0901234567"
}

// Response result
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716...",
  "tokenType": "Bearer"
}
```

### POST /auth/login
```json
// Request
{ "email": "user@example.com", "password": "Password123!" }

// Response result
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716...",
  "tokenType": "Bearer"
}
```

### POST /auth/refresh-token?token={refreshToken}
```json
// Response result
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "new-refresh-token...",
  "tokenType": "Bearer"
}
```

---

## 2. 👤 User & Profile

> Yêu cầu Bearer token

| Method | URL | Mô tả | Role |
|--------|-----|-------|------|
| `GET` | `/users/me` | Lấy thông tin cá nhân | Auth |
| `PUT` | `/users/me` | Cập nhật thông tin | Auth |
| `PUT` | `/users/me/password` | Đổi mật khẩu | Auth |
| `PUT` | `/users/me/avatar` | Upload ảnh đại diện (multipart) | Auth |
| `GET` | `/users/me/membership` | Xem gói thành viên | Auth |
| `POST` | `/users/me/membership/upgrade` | Nâng cấp gói | Auth |
| `GET` | `/users` | Danh sách users | ADMIN |
| `POST` | `/users` | Tạo user | ADMIN |
| `GET` | `/users/{email}` | Tìm user theo email | ADMIN |

### GET /users/me — Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "Nguyen",
  "lastName": "Trung",
  "avatarUrl": "https://cdn.example.com/avatars/user.jpg",
  "role": "STUDENT",
  "membershipType": "FREE",
  "isActive": true
}
```

### PUT /users/me — Request
```json
{ "firstName": "Nguyen", "lastName": "Van Trung" }
```

### PUT /users/me/password — Request
```json
{ "currentPassword": "OldPass123!", "newPassword": "NewPass456!" }
```

### PUT /users/me/avatar
```
Content-Type: multipart/form-data
field: file = <image file>

// Response result: "https://cdn.example.com/avatars/new.jpg"
```

### GET /users/me/membership — Response
```json
{
  "membershipType": "PREMIUM",
  "membershipExpiresAt": "2026-12-31T23:59:59"
}
```

---

## 3. 📚 Content (Category / Topic / Lesson)

> Public (không cần token) | Teacher/Admin endpoints cần role

### 📂 Categories

| Method | URL | Mô tả | Role |
|--------|-----|-------|------|
| `GET` | `/categories` | Danh sách tất cả category | Public |
| `GET` | `/categories/{slug}` | Chi tiết theo slug | Public |
| `GET` | `/categories/{slug}/topics` | Danh sách topics của category | Public |
| `POST` | `/admin/categories` | Tạo category | ADMIN |
| `PUT` | `/admin/categories/{id}` | Cập nhật | ADMIN |
| `DELETE` | `/admin/categories/{id}` | Xóa | ADMIN |

### GET /categories — Response
```json
[
  {
    "id": "uuid-here",
    "name": "Grammar",
    "slug": "grammar",
    "description": "English grammar lessons"
  }
]
```

### POST /admin/categories — Request
```json
{ "name": "Grammar", "description": "English grammar lessons" }
```

---

### 📁 Topics

| Method | URL | Mô tả | Role |
|--------|-----|-------|------|
| `GET` | `/topics` | Danh sách topics (filter: ?category=slug&level=BEGINNER) | Public |
| `GET` | `/topics/{slug}` | Chi tiết topic | Public |
| `GET` | `/topics/{topicSlug}/lessons` | Bài học của topic | Public |
| `POST` | `/teacher/topics` | Tạo topic | TEACHER/ADMIN |
| `PUT` | `/teacher/topics/{id}` | Cập nhật | TEACHER/ADMIN |
| `DELETE` | `/teacher/topics/{id}` | Xóa | TEACHER/ADMIN |

### GET /topics?category=grammar&level=BEGINNER — Response
```json
[
  {
    "id": "uuid-here",
    "name": "Present Tense",
    "slug": "present-tense",
    "description": "Learn present tense",
    "level": "BEGINNER",
    "categoryId": "uuid-here",
    "categoryName": "Grammar",
    "isPublished": true
  }
]
```

> **Level enum:** `BEGINNER` | `INTERMEDIATE` | `ADVANCED`

---

### 📄 Lessons

| Method | URL | Mô tả | Role |
|--------|-----|-------|------|
| `GET` | `/topics/{topicSlug}/lessons` | Lessons của topic | Public |
| `GET` | `/lessons/{slug}` | Chi tiết lesson | Public |
| `POST` | `/teacher/lessons` | Tạo lesson | TEACHER/ADMIN |
| `PUT` | `/teacher/lessons/{id}` | Cập nhật | TEACHER/ADMIN |
| `DELETE` | `/teacher/lessons/{id}` | Xóa | TEACHER/ADMIN |
| `PUT` | `/teacher/lessons/{id}/publish` | Toggle publish | TEACHER/ADMIN |
| `PUT` | `/teacher/lessons/reorder` | Sắp xếp lại thứ tự | TEACHER/ADMIN |

### GET /lessons/{slug} — Response
```json
{
  "id": "uuid-here",
  "title": "Simple Present Tense",
  "slug": "simple-present-tense",
  "content": "HTML content here...",
  "lessonType": "THEORY",
  "orderIndex": 1,
  "isPublished": true,
  "topicId": "uuid-here",
  "topicName": "Present Tense"
}
```

### POST /teacher/lessons — Request
```json
{
  "topicId": "uuid-here",
  "title": "Simple Present Tense",
  "content": "<p>Learn how to use...</p>",
  "lessonType": "THEORY",
  "orderIndex": 1
}
```

> **LessonType enum:** `THEORY` | `EXERCISE` | `READING` | `VOCABULARY`

---

## 4. 📝 Exercise & Attempt

> Yêu cầu Bearer token

### Exercises (Public view)

| Method | URL | Mô tả | Role |
|--------|-----|-------|------|
| `GET` | `/lessons/{lessonId}/exercises` | Exercises của lesson | Auth |
| `GET` | `/exercises/{id}` | Chi tiết exercise | Auth |
| `POST` | `/teacher/exercises` | Tạo exercise | TEACHER/ADMIN |
| `PUT` | `/teacher/exercises/{id}` | Cập nhật | TEACHER/ADMIN |
| `DELETE` | `/teacher/exercises/{id}` | Xóa | TEACHER/ADMIN |

### GET /exercises/{id} — Response
```json
{
  "id": "uuid-here",
  "title": "Present Tense Quiz",
  "description": "Test your knowledge",
  "exerciseType": "MULTIPLE_CHOICE",
  "passingScore": 70,
  "lessonId": "uuid-here",
  "questions": [
    {
      "id": "uuid-here",
      "content": "Which sentence uses present tense correctly?",
      "orderIndex": 1,
      "options": [
        { "id": "uuid-here", "content": "I goes to school." },
        { "id": "uuid-here", "content": "I go to school." }
      ]
    }
  ]
}
```

---

### Attempts (làm bài)

| Method | URL | Mô tả | Role |
|--------|-----|-------|------|
| `POST` | `/exercises/{exerciseId}/start` | Bắt đầu làm bài | Auth |
| `POST` | `/exercises/{exerciseId}/submit` | Nộp bài | Auth |
| `GET` | `/exercises/{exerciseId}/attempts` | Lịch sử làm bài của tôi | Auth |
| `GET` | `/attempts/{attemptId}` | Chi tiết lần làm | Auth |
| `GET` | `/admin/attempts` | Tất cả attempts | ADMIN |

### POST /exercises/{exerciseId}/start — Response
```json
{
  "attemptId": "uuid-here",
  "exerciseId": "uuid-here",
  "status": "IN_PROGRESS",
  "startedAt": "2026-03-28T15:30:00"
}
```

### POST /exercises/{exerciseId}/submit — Request
```json
{
  "answers": [
    {
      "questionId": "uuid-here",
      "selectedOptionId": "uuid-here"
    },
    {
      "questionId": "uuid-here",
      "selectedOptionId": "uuid-here"
    }
  ]
}
```

### POST /exercises/{exerciseId}/submit — Response
```json
{
  "attemptId": "uuid-here",
  "score": 85.0,
  "passed": true,
  "status": "SUBMITTED",
  "submittedAt": "2026-03-28T15:35:00",
  "totalQuestions": 10,
  "correctAnswers": 8
}
```

---

## 5. 📖 Lesson Progress

> Yêu cầu Bearer token

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/users/me/progress` | Tất cả tiến độ học |
| `GET` | `/users/me/progress/topics/{topicId}` | Tiến độ của topic |
| `POST` | `/lessons/{lessonId}/progress/start` | Bắt đầu học bài |
| `PUT` | `/lessons/{lessonId}/progress` | Cập nhật % tiến độ |
| `POST` | `/lessons/{lessonId}/progress/complete` | Đánh dấu hoàn thành |

### GET /users/me/progress — Response
```json
[
  {
    "lessonId": "uuid-here",
    "lessonTitle": "Simple Present Tense",
    "status": "IN_PROGRESS",
    "progressPercent": 60,
    "startedAt": "2026-03-25T10:00:00",
    "completedAt": null
  },
  {
    "lessonId": "uuid-here",
    "lessonTitle": "Past Tense",
    "status": "COMPLETED",
    "progressPercent": 100,
    "startedAt": "2026-03-20T08:00:00",
    "completedAt": "2026-03-20T09:30:00"
  }
]
```

### GET /users/me/progress/topics/{topicId} — Response
```json
{
  "topicId": "uuid-here",
  "totalLessons": 8,
  "completedLessons": 5,
  "progressPercent": 62
}
```

### PUT /lessons/{lessonId}/progress — Request
```json
{ "progressPercent": 75 }
```

> **Status enum:** `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED`

---

## 6. 🗂 Flashcard Deck & Card

> Yêu cầu Bearer token

### Decks

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/flashcard-decks` | Decks (public + của tôi) |
| `GET` | `/flashcard-decks/{id}` | Chi tiết deck |
| `POST` | `/flashcard-decks` | Tạo deck |
| `PUT` | `/flashcard-decks/{id}` | Cập nhật (owner) |
| `DELETE` | `/flashcard-decks/{id}` | Xóa (owner) |

### GET /flashcard-decks — Response
```json
[
  {
    "id": "uuid-here",
    "title": "My Vocabulary Deck",
    "description": "Daily English words",
    "isPublic": false,
    "cardCount": 25,
    "ownerId": "uuid-here",
    "createdAt": "2026-03-20T10:00:00"
  }
]
```

### POST /flashcard-decks — Request
```json
{ "title": "My Vocabulary", "description": "Words I'm learning", "isPublic": false }
```

---

### Cards (trong Deck)

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/flashcard-decks/{deckId}/cards` | Danh sách thẻ |
| `POST` | `/flashcard-decks/{deckId}/cards` | Thêm thẻ (owner) |
| `PUT` | `/flashcard-decks/{deckId}/cards/{cardId}` | Sửa thẻ (owner) |
| `DELETE` | `/flashcard-decks/{deckId}/cards/{cardId}` | Xóa thẻ (owner) |
| `PUT` | `/flashcard-decks/{deckId}/cards/reorder` | Sắp xếp thẻ |

### GET /flashcard-decks/{deckId}/cards — Response
```json
[
  {
    "id": "uuid-here",
    "frontText": "Hello",
    "backText": "Xin chào",
    "example": "Hello, how are you?",
    "displayOrder": 1
  }
]
```

### POST /flashcard-decks/{deckId}/cards — Request
```json
{
  "frontText": "Hello",
  "backText": "Xin chào",
  "example": "Hello, how are you?"
}
```

### PUT /flashcard-decks/{deckId}/cards/reorder — Request
```json
{ "cardIds": ["uuid-1", "uuid-2", "uuid-3"] }
```

---

## 7. 🧠 SRS (Spaced Repetition)

> Yêu cầu Bearer token

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/srs/due` | Tất cả thẻ cần ôn hôm nay |
| `GET` | `/srs/decks/{deckId}/due` | Thẻ cần ôn theo deck |
| `POST` | `/srs/review/{flashcardId}` | Ghi nhận kết quả ôn |
| `GET` | `/srs/stats` | Thống kê SRS |

### GET /srs/due — Response
```json
[
  {
    "flashcardId": "uuid-here",
    "frontText": "Hello",
    "backText": "Xin chào",
    "nextReviewDate": "2026-03-28T22:00:00"
  }
]
```

### POST /srs/review/{flashcardId} — Request
```json
{ "quality": 4 }
```
> **quality** scale: `0`=quên hoàn toàn, `1`=sai, `2`=sai nhưng nhớ lại được, `3`=đúng nhưng khó, `4`=đúng, `5`=hoàn hảo

### POST /srs/review/{flashcardId} — Response
```json
{
  "flashcardId": "uuid-here",
  "frontText": "Hello",
  "backText": "Xin chào",
  "nextReviewDate": "2026-04-01T10:00:00"
}
```

### GET /srs/stats — Response
```json
{
  "totalCards": 150,
  "dueCards": 12,
  "learnedCards": 87
}
```

---

## 8. 📊 User Dashboard & Stats

> Yêu cầu Bearer token

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/users/me/dashboard` | Tổng quan học tập + streak |
| `GET` | `/users/me/stats` | Thống kê chi tiết |

### GET /users/me/dashboard — Response
```json
{
  "totalLessonsCompleted": 15,
  "totalTopicsCompleted": 3,
  "currentStreak": 4,
  "longestStreak": 12
}
```

### GET /users/me/stats — Response
```json
{
  "totalLessonsStarted": 20,
  "totalLessonsCompleted": 15,
  "completionRate": 75.0,
  "averageScore": 83.5,
  "totalWordsLearned": 87,
  "reviewCount": 150
}
```

---

## 9. 🔧 Admin APIs

> Yêu cầu role `ADMIN`

### System Stats

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/admin/stats` | Tổng quan hệ thống |
| `GET` | `/admin/stats/users?days=30` | Tăng trưởng user theo ngày |
| `GET` | `/admin/stats/content?limit=10` | Nội dung phổ biến |

### GET /admin/stats — Response
```json
{
  "totalUsers": 1250,
  "totalLessons": 85,
  "totalExercises": 320,
  "totalAttempts": 8740
}
```

### GET /admin/stats/users?days=30 — Response
```json
[
  { "date": "2026-03-01", "newUsers": 5 },
  { "date": "2026-03-02", "newUsers": 12 },
  { "date": "2026-03-28", "newUsers": 8 }
]
```

### GET /admin/stats/content?limit=10 — Response
```json
[
  { "id": "uuid-lesson", "type": "LESSON", "count": 450 },
  { "id": "uuid-lesson2", "type": "LESSON", "count": 320 },
  { "id": "uuid-exercise", "type": "EXERCISE", "count": 280 }
]
```

---

### Admin User Management

| Method | URL | Mô tả |
|--------|-----|-------|
| `GET` | `/admin/users` | Danh sách users |
| `PUT` | `/admin/users/{id}` | Cập nhật user |
| `DELETE` | `/admin/users/{id}` | Xóa user |

---

## ⚠️ Error Response Format

```json
{
  "code": 4001,
  "message": "Unauthorized",
  "result": null
}
```

| Code | HTTP | Ý nghĩa |
|------|------|---------|
| `1000` | 200 | Thành công |
| `4001` | 401 | Chưa đăng nhập |
| `4003` | 403 | Không có quyền |
| `4004` | 404 | Không tìm thấy |
| `4009` | 409 | Conflict (trùng lặp) |
| `5000` | 500 | Lỗi server |

---

## 🔑 Frontend Auth Flow

```
1. POST /auth/login → lưu accessToken & refreshToken vào localStorage
2. Mọi request → header: Authorization: Bearer {accessToken}
3. Nếu 401 → POST /auth/refresh-token?token={refreshToken} → lấy token mới
4. Nếu refresh cũng fail → redirect về /login
5. POST /auth/logout → xóa tokens
```
