# ShopSure QA — Sample Defect Reports

> **Integrity Notice**: These defect reports reflect genuine anomalies, edge cases, and architectural observations discovered during exploratory and automated testing against `https://dummyjson.com`. They are documented here using the official QA Defect Template for portfolio review and placement evaluation.

---

## Defect Log 1: `BUG-001`

| Field | Detail |
| :--- | :--- |
| **Defect ID** | `BUG-001` |
| **Title** | `[Products] Parameter 'limit=0' overrides limit to 194 and returns entire catalog instead of an empty set` |
| **Module** | Product Management / Pagination Boundary |
| **Severity** | Moderate (S3) |
| **Priority** | P3 (Medium) |
| **Status** | Verified / Documented Behavior Deviation |
| **Reported By** | Senior QA Engineer |
| **Date Logged** | 2026-10-24 |
| **Environment** | `https://dummyjson.com/products` |

### Preconditions
- SUT is reachable over HTTPS.

### Steps to Reproduce
1. Open terminal or Postman.
2. Send a `GET` request to:
   ```http
   GET https://dummyjson.com/products?limit=0 HTTP/1.1
   Host: dummyjson.com
   ```
3. Inspect the returned JSON payload: `limit`, `total`, and `products.length`.

### Expected Result
In standard REST API pagination design:
- Either the server rejects `limit=0` with `HTTP 400 Bad Request (Limit must be greater than 0)`, OR
- The server returns `HTTP 200 OK` with an empty `products: []` array (`products.length === 0`) while preserving `total: 194`, allowing client-side caching of catalog counts without payload overhead.

### Actual Result
- The server responds with `HTTP 200 OK`.
- The returned payload overrides the user's requested limit:
  ```json
  {
    "products": [ /* 194 product items returned */ ],
    "total": 194,
    "skip": 0,
    "limit": 194
  }
  ```
- **Payload size**: ~307 kB returned over the network, causing unexpected bandwidth consumption on mobile clients.

### Root Cause Analysis
The server-side route handler likely uses a JavaScript falsy check (e.g. `const limit = Number(req.query.limit) || defaultTotal;`). Because `Number("0")` evaluates to `0` (falsy in JavaScript), the default fallback activates and returns all 194 products.

---

## Defect Log 2: `BUG-002`

| Field | Detail |
| :--- | :--- |
| **Defect ID** | `BUG-002` |
| **Title** | `[Orders] Querying unexposed /orders route returns raw HTML 404 rather than standardized JSON error contract` |
| **Module** | Order Validation / Content-Type Consistency |
| **Severity** | Moderate (S3) |
| **Priority** | P3 (Medium) |
| **Status** | Verified / Architectural Limitation |
| **Reported By** | Senior QA Engineer |
| **Date Logged** | 2026-10-24 |
| **Environment** | `https://dummyjson.com/orders` |

### Preconditions
- Public internet connectivity active.

### Steps to Reproduce
1. Send an HTTP GET request to:
   ```bash
   curl -i "https://dummyjson.com/orders"
   ```
2. Inspect the HTTP response headers and body.

### Expected Result
- The API should maintain a consistent RESTful JSON contract across all routes:
  - `Content-Type: application/json; charset=utf-8`
  - Body:
    ```json
    {
      "message": "Route /orders not found"
    }
    ```

### Actual Result
- The server returns a 404 status, but with raw Express HTML instead of JSON:
  ```html
  HTTP/1.1 404 Not Found
  Content-Type: text/html; charset=utf-8

  <!DOCTYPE html>
  <html lang="en">
  <head><title>Error</title></head>
  <body><pre>Cannot GET /orders</pre></body>
  </html>
  ```
- Any mobile or frontend API client attempting to parse `response.json()` will throw an unhandled `SyntaxError: Unexpected token '<'` parsing exception.

### Root Cause Analysis
DummyJSON utilizes Express.js for routing. The default Express 404 middleware renders HTML for unmatched top-level routes because no wildcard JSON error handler `app.use('*', ...)` is configured for unmapped endpoints.

---

## Defect Log 3: `BUG-003`

| Field | Detail |
| :--- | :--- |
| **Defect ID** | `BUG-003` |
| **Title** | `[Authentication] Login credential failure returns HTTP 400 Bad Request instead of standard HTTP 401 Unauthorized` |
| **Module** | Authentication & Security |
| **Severity** | Low (S4) |
| **Priority** | P4 (Low) |
| **Status** | Verified / Specification Nuance |
| **Reported By** | Senior QA Engineer |
| **Date Logged** | 2026-10-24 |
| **Environment** | `https://dummyjson.com/auth/login` |

### Preconditions
- User enters wrong password for valid user `emilys`.

### Steps to Reproduce
1. Send `POST https://dummyjson.com/auth/login` with:
   ```json
   {
     "username": "emilys",
     "password": "WrongPassword#999"
   }
   ```

### Expected Result
- RFC 7235 and standard REST security practices dictate:
  - `HTTP 401 Unauthorized` when authentication credentials are invalid or missing.
  - `HTTP 400 Bad Request` should only be returned when the request syntax itself is malformed (e.g. invalid JSON, missing content-type).

### Actual Result
- Server responds with `HTTP 400 Bad Request`:
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

### Impact & Recommendation
While the error message `"Invalid credentials"` is clear, returning 400 instead of 401 hinders automated API gateway authentication interceptors that rely on 401 status to trigger token refresh workflows.
