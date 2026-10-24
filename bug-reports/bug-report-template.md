# ShopSure QA — Defect Report Template

Use this standardized template when logging software anomalies, API specification deviations, or security and performance defects.

---

## Defect Summary

| Field | Detail |
| :--- | :--- |
| **Defect ID** | `BUG-XXXX` (e.g., `BUG-0001`) |
| **Title** | *Concise, descriptive summary of the failure (Format: [Module] - Short Description)* |
| **Module** | Product Management / Authentication / Shopping Cart / Order Validation / Quality SLA |
| **Severity** | Critical (S1) / Major (S2) / Moderate (S3) / Low (S4) |
| **Priority** | P1 (Urgent) / P2 (High) / P3 (Medium) / P4 (Low) |
| **Status** | New / Open / In Review / Resolved / Closed / As Designed / Limitation |
| **Reported By** | QA Engineer / Test Analyst |
| **Date Logged** | YYYY-MM-DD |
| **Environment** | `https://dummyjson.com` (REST API v2+) |

---

## Preconditions
- *List any requirements that must be met before executing the test steps (e.g., valid JWT token active, network reachable).*

---

## Steps to Reproduce
1. Send an HTTP `<METHOD>` request to `<ENDPOINT>`
2. Include the following headers:
   ```http
   Content-Type: application/json
   Authorization: Bearer <TOKEN>
   ```
3. Include the following request payload (if applicable):
   ```json
   {
     "key": "value"
   }
   ```
4. Observe the returned HTTP status code and response body.

---

## Expected Result
- *State clearly what the documented specification or user requirement mandates should happen.*
- *Include expected HTTP status code, response time SLA, and JSON contract.*

---

## Actual Result
- *Describe the actual system behavior observed during test execution.*
- *Include actual HTTP status code, returned payload, and error messages.*

---

## Evidence & Logs
- **cURL Command**:
  ```bash
  curl -X METHOD "https://dummyjson.com/..." -H "..."
  ```
- **Response Headers**:
  ```http
  HTTP/1.1 ...
  Content-Type: ...
  ```
- **Response Body**:
  ```json
  {
    ...
  }
  ```
- **Screenshot Reference**: `screenshots/<filename>.png`

---

## Root Cause Analysis / Notes
- *Technical insights regarding why the anomaly occurs (e.g., lack of input sanitization, pagination default logic, legacy backward compatibility).*
