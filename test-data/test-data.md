# ShopSure QA — Master Test Data Specification

This document details the complete test data matrix utilized across manual test cases, Postman API collections, and regression suites for the **ShopSure QA** project.

---

## 1. Environment & Base URL Configuration

| Key | Value | Description |
| :--- | :--- | :--- |
| `baseUrl` | `https://dummyjson.com` | Primary System Under Test (SUT) |
| `maxResponseTime` | `2000` | Configurable response time assertion threshold in milliseconds |
| `authToken` | *Dynamically populated* | Extracted JWT bearer token from successful login |
| `currentUserId` | `1` | Test user ID associated with demo user `emilys` |

---

## 2. Authentication Test Data Matrix

### 2.1 Valid Credentials (Happy Path)
| Parameter | Value | Expected Behavior |
| :--- | :--- | :--- |
| `username` | `emilys` | HTTP `200 OK` |
| `password` | `emilyspass` | Returns `accessToken`, `refreshToken`, user object |
| `expiresInMins` | `60` | Optional parameter (defaults to 60) |

### 2.2 Invalid & Boundary Credentials (Negative Paths)
| Scenario | Username | Password | Expected Status | Expected Error Message |
| :--- | :--- | :--- | :---: | :--- |
| Invalid Password | `emilys` | `WrongPass#999` | `400` | `"Invalid credentials"` |
| Non-existent User | `unknown_tester_99` | `dummyPass123` | `400` | `"Invalid credentials"` |
| Missing Password | `emilys` | *Omitted* | `400` | `"Username and password required"` |
| Missing Username | *Omitted* | `emilyspass` | `400` | `"Username and password required"` |
| Empty JSON Body | `{}` | `{}` | `400` | `"Username and password required"` |
| SQL Injection Pattern | `' OR '1'='1` | `' OR '1'='1` | `400` | `"Invalid credentials"` |
| Legacy V1 User | `kminchelle` | `0lelldR` | `400` | `"Invalid credentials"` |

### 2.3 Bearer Token Vectors
| Scenario | Header Value | Expected Status | Expected Error Message |
| :--- | :--- | :---: | :--- |
| Valid Bearer Token | `Bearer {{authToken}}` | `200` | Returns profile for `emilys` |
| Tampered / Invalid Token | `Bearer eyJhbGciOiJIUzI1Ni...tampered` | `401` | `"Invalid/Expired Token!"` |
| Malformed Header | `Token xyz123` | `401` | `"Access Token is required"` |
| Missing Authorization Header | *Header omitted* | `401` | `"Access Token is required"` |

---

## 3. Product Module Test Data

### 3.1 Product Retrieval & Boundary Values
| Test Data | Type | Scenario | Expected Status | Notes |
| :--- | :--- | :--- | :---: | :--- |
| `1` | Integer | Valid existing product ID | `200` | Essence Mascara Lash Princess |
| `100` | Integer | Boundary high existing ID | `200` | Standard catalog boundary item |
| `99999` | Integer | Out-of-bounds non-existent ID | `404` | `"Product with id '99999' not found"` |
| `-1` | Negative Int | Negative boundary value | `404` | `"Product with id '-1' not found"` |
| `0` | Zero | Zero boundary value | `404` | `"Product with id '0' not found"` |
| `abc` | String | Non-numeric alpha ID | `404` | `"Product with id 'abc' not found"` |
| `3.14` | Float | Decimal ID value | `404` | `"Product with id '3.14' not found"` |

### 3.2 Product Search & Category Filtering
| Query Parameter | Value | Expected Status | Expected Result Characteristics |
| :--- | :--- | :---: | :--- |
| `q` | `phone` | `200` | Returns products containing "phone" in title/description |
| `q` | `xyz987nonexistent` | `200` | Returns empty array: `total: 0, products: []` |
| `q` | ` ` (space) | `200` | Returns default product list |
| Category Slug | `smartphones` | `200` | All returned items have `category: "smartphones"` |
| Category Slug | `beauty` | `200` | All returned items have `category: "beauty"` |
| Category Slug | `invalid_category_xyz` | `200` | Returns `products: [], total: 0` |

---

## 4. Shopping Cart Test Data

### 4.1 Cart Identification & Retrieval
| Cart ID | Type | Expected Status | Expected Result |
| :--- | :--- | :---: | :--- |
| `1` | Integer | `200` | Valid cart object with array of products and calculated totals |
| `99999` | Integer | `404` | `"Cart with id '99999' not found"` |
| `-5` | Negative Int | `404` | `"Cart with id '-5' not found"` |

### 4.2 Cart Add Payload (`POST /carts/add`)
```json
{
  "userId": 1,
  "products": [
    {
      "id": 1,
      "quantity": 2
    },
    {
      "id": 2,
      "quantity": 1
    }
  ]
}
```
- **Expected Status**: `201 Created`
- **Calculations Validated**:
  - `totalQuantity` = sum of product quantities (`2 + 1 = 3`)
  - `total` = sum of `(price * quantity)`
  - `discountedTotal` = calculated discount amount

### 4.3 Cart Update Payload (`PUT /carts/1`)
```json
{
  "merge": true,
  "products": [
    {
      "id": 1,
      "quantity": 4
    }
  ]
}
```
- **Expected Status**: `200 OK`

---

## 5. Order Workflow Simulation Data & System Limitation

### System Limitation Statement
> **Finding**: The DummyJSON API does not implement a native `/orders` or `/checkout` endpoint. Attempts to query `GET /orders` or `POST /orders` return an HTTP 404 response.

### QA Simulation Workflow
In production e-commerce architectures, an order workflow transitions from:
`Active Cart` $\rightarrow$ `Checkout Initiation` $\rightarrow$ `Payment Authorization` $\rightarrow$ `Order Confirmation`.

To validate this workflow within the testable scope without inventing unsupported endpoints:
1. **Pre-order Validation**: Ensure cart has valid `userId`, non-empty `products` array, valid inventory IDs, and positive item quantities.
2. **Checkout Simulation**: Send `POST /carts/add` representing the committed cart payload.
3. **Receipt Validation**: Assert that the response calculates `totalProducts`, `totalQuantity`, `total`, and `discountedTotal` with numerical consistency.
4. **Order Failure Negative Test**: Send `POST /orders` to verify and document that the unexposed endpoint cleanly returns `404 Not Found` without server crashes or sensitive stack trace exposure.
