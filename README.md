# Drug Indications API

This project was developed as part of a technical test for a Node.js position. The application extracts drug indications from the Dupixent label (DailyMed), maps those indications to ICD-10 codes using the OpenAI API, and provides a RESTful API for querying and managing the data.

---

## 🚀 Technologies Used

- **NestJS** (Node.js Framework)
- **MongoDB** (NoSQL database)
- **OpenAI GPT API** (ICD-10 mapping)
- **Mongoose**
- **JWT Authentication**
- **Docker & docker-compose**
- **Jest + mongodb-memory-server** (for testing)

---

## 📆 How to Run the Project

> Requirements: Docker and Docker Compose

1. Clone the repository:

```bash
git clone https://github.com/your-user/drug-indications-api.git
cd drug-indications-api
```

2. Set up the `.env` file:

```env
MONGO_URI=mongodb://root:<PASSWORD>@mongo:27017/indicationsdb?authSource=admin
JWT_SECRET=your-secret
OPENAI_API_KEY=sk-...
```

3. Start with Docker:

```bash
docker-compose up
```

4. Access the application at:  
   `http://localhost:3000`

---

## 📘 API Documentation

> All routes require JWT Authentication (`Bearer <token>`)

### 🔑 Auth

| Method | Route            | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Login and get token |

### 💊 Drugs

| Method | Route        | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/drugs`     | List all drugs    |
| POST   | `/drugs`     | Create a new drug |
| GET    | `/drugs/:id` | Get drug details  |
| PUT    | `/drugs/:id` | Update a drug     |
| DELETE | `/drugs/:id` | Delete a drug     |

### 🦠 Indications

| Method | Route                                        | Description                          |
| ------ | -------------------------------------------- | ------------------------------------ |
| GET    | `/indications`                               | List all indications                 |
| GET    | `/indications/drug/:drugId`                  | List indications by drug             |
| POST   | `/indications`                               | Create a manual indication           |
| POST   | `/indications/generate-from-scraper/:drugId` | Extract + map + save via GPT         |
| GET    | `/programs/:program_id`                      | Return structured JSON for a program |

---

## 🧪 Testing

Run unit tests with:

```bash
npm run test
```

- Uses Jest + MongoDB in memory
- Tests services (scraper, mapping, drugs, auth, etc.)
- Integration tests using supertest

---

## 🧠 Scalability Considerations

- Decoupled database (MongoDB via Docker)
- Modular scraper (per drug)
- ICD-10 mapping via LLM with fallback (`unmapped`)
- Easy to extend to multiple drugs
- Optimization possible with caching, async jobs, and batch operations

---

## 🛠 Future Improvements

- Admin panel to review unmapped indications
- Integration with local ICD-10 code databases
- Automated scheduled scraping (cron job)
- Full RBAC implementation (admin vs user)
- API pagination and filtering

---

## 💼 How I Would Lead the Team

If I were leading the engineering team for this project, I would follow these principles:

1. **Clean architecture from the start**, with clear separation between scraping, mapping, API, and data layers.
2. **Incremental delivery planning**, using continuous deployment.
3. **Minimum test coverage required for all new features** (mandatory before merge).
4. **Active error monitoring**, especially around AI/GPT failures.
5. **Accessible documentation and visual demos** (e.g., Swagger or Postman).
6. **Internal consistency through standards** (DTOs, naming, error responses).

Long-term maintenance would focus on extensibility: adding new drugs, fields, and sources. MongoDB allows flexibility without sacrificing structure, and the GPT-based logic is encapsulated and replaceable if needed.

---

## 📋 Example API Response

```json
{
  "programId": "6829d95de79c986c568fb5ea",
  "name": "Dupixent",
  "source": "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=595f437d-2729-40bb-9c62-c8ece1f82780&audience=consumer",
  "indications": [
    {
      "condition": "DUPIXENT is used to reduce the number of flare-ups (the worsening of your COPD symptoms for several days) and can improve your breathing",
      "icd10Code": "J44.9",
      "icd10Description": "Chronic obstructive pulmonary disease, unspecified",
      "unmapped": false
    }
  ],
  "createdAt": "2025-05-18T12:58:05.455Z"
}
```

---
