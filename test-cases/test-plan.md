# ShopSure QA — Master Test Plan

**Project**: ShopSure QA — E-Commerce Quality Assurance and API Testing Suite  
**System Under Test (SUT)**: DummyJSON E-Commerce REST API (`https://dummyjson.com`)  
**Document Standard**: Aligned with IEEE 829 Standard for Software Test Documentation  
**Version**: 1.0.0  
**Author**: Lead QA Engineer  
**Date**: October 2026  

---

## 1. Introduction & Overview

The **ShopSure QA** project delivers an enterprise-grade Quality Assurance and REST API testing framework for a modern e-commerce platform. The system facilitates product browsing, user authentication, inventory search, shopping cart management, and checkout simulation. 

This test plan defines the testing scope, strategy, environments, tools, test pass/fail criteria, entry/exit gates, and defect lifecycle used to validate the API against functional specifications and non-functional performance SLAs.

---

## 2. Test Objectives

1. **Functional Correctness**: Ensure all core e-commerce endpoints (`/products`, `/auth/login`, `/carts`) return expected HTTP status codes, correct payload structures, and valid calculated values.
2. **Security & Authentication Integrity**: Verify JWT issuance, protected endpoint authorization barriers (`/auth/me`), and rejection of malformed, expired, or missing tokens.
3. **Robust Error Handling**: Confirm that the API handles invalid IDs, out-of-boundary values, empty payloads, and non-existent routes gracefully with descriptive 4xx responses without exposing stack traces or returning 500 Internal Server Errors.
4. **Architectural Boundary Verification**: Verify and document system limitations, specifically that simulated e-commerce operations (`POST /carts/add`, `PUT /carts/1`, `DELETE /carts/1`) do not mutate persistent storage, and that unsupported routes (`/orders`, `/checkout`) are documented and handled safely.
5. **Performance & SLA Compliance**: Validate that 95% of API requests respond within the acceptable SLA threshold ($\le 3000\text{ ms}$).

---

## 3. Scope of Testing

### 3.1 In-Scope Modules

| Module | Scope Details |
| :--- | :--- |
| **Product Management** | Catalog retrieval, pagination (`limit`, `skip`), single product lookup by ID, category filtering, keyword search, invalid ID handling (404), negative boundary testing. |
| **Authentication & Authorization** | Demo credential validation (`emilys` / `emilyspass`), token extraction (`accessToken`), invalid credentials rejection, empty body handling, protected endpoint authorization (`/auth/me`), tampered token rejection (401). |
| **Shopping Cart Management** | All carts listing, single cart lookup, multi-product line item total and discount calculations, simulated cart addition (`POST 201`), update (`PUT 200`), and deletion (`DELETE 200`). |
| **Order Workflow Boundaries** | Cart checkout readiness validation, mock payment/order simulation, and explicit verification that native `/orders` endpoints return HTTP 404 per API architecture. |
| **Non-Functional & Quality SLAs** | Response latency monitoring, strict schema data typing, HTTP header integrity (`Content-Type`, `Connection`), and pagination edge cases (`limit=0`). |

### 3.2 Out-of-Scope Modules
- Database persistence verification across requests (DummyJSON is a mock API that simulates state changes per request).
- Third-party payment gateway integration (Stripe, PayPal, Razorpay).
- Frontend UI rendering and cross-browser testing (covered in API layer only).
- Hardware stress testing beyond API SLA response times.

---

## 4. Test Strategy & Methodology

### 4.1 Testing Levels
1. **Manual API Exploration**: Exploratory testing using Postman to verify contracts, headers, query parameters, and error message phrasing.
2. **Automated Integration Testing**: Automated test suites in Postman Runner and Newman CLI validating response bodies, JSON schemas, and HTTP status codes using JavaScript (`pm.test` assertions).
3. **Regression Testing**: Automated re-execution of core functional and negative suites after configuration changes to verify zero regression.

### 4.2 Test Types Applied
- **Positive Testing (Happy Path)**: Verifying expected business outcomes with valid inputs.
- **Negative Testing**: Injecting invalid credentials, missing parameters, and non-existent IDs.
- **Boundary Value Analysis (BVA)**: Evaluating pagination boundaries (`limit=0`, `skip=0`, negative IDs `-1`, out-of-bounds IDs `99999`).
- **Security Testing**: Validating JWT Bearer token enforcement, header spoofing, and injection-like payloads.
- **Data Integrity Testing**: Validating calculated line items:
  $$\text{total} = \sum (\text{product price} \times \text{quantity})$$
  $$\text{totalQuantity} = \sum (\text{quantity})$$

---

## 5. Test Environment Configuration

| Property | Environment Specification |
| :--- | :--- |
| **System Under Test** | `https://dummyjson.com` (Cloud Public REST API) |
| **API Architecture** | RESTful JSON over HTTPS |
| **API Client** | Postman Desktop (v11+) & Newman CLI (v6.2.3) |
| **Runtime Environment** | Node.js v24.12.0 / Python 3.13.1 |
| **OS Platform** | Windows 11 Enterprise |
| **Test Data Source** | `test-data/test-data.md` |

---

## 6. Entry and Exit Criteria

### Entry Criteria
- SUT (`https://dummyjson.com`) is accessible with $\ge 99\%$ uptime.
- Postman collection and environment files are loaded and syntax-validated.
- Verified test credentials (`emilys` / `emilyspass`) are active and validated.
- Test cases are documented and mapped to requirements.

### Exit Criteria
- 100% of planned test cases have been executed.
- $\ge 95\%$ pass rate among all executed test cases.
- 0 open Critical (P1) or High (P2) defects without documented workarounds or API limitations.
- Test execution report and Excel QA dashboard are generated and cross-verified.

---

## 7. Defect Severity & Priority Classification

| Severity Level | Description | Example |
| :--- | :--- | :--- |
| **Critical (S1)** | System crash, authentication bypass, data corruption, or unhandled 500 error. | Token validator allows unauthenticated access to user data. |
| **Major (S2)** | Core functional failure without a viable workaround. | Shopping cart calculations output incorrect total pricing. |
| **Moderate (S3)** | Non-critical functional anomaly, misleading error message, or inconsistent schema. | API returns 200 with HTML instead of standard JSON on error. |
| **Low (S4)** | Cosmetic issue, header inconsistency, or minor documentation mismatch. | Response header missing non-critical security header. |

---

## 8. Roles and Responsibilities

| Role | Responsibilities |
| :--- | :--- |
| **QA Lead / Automation Engineer** | Test plan authoring, Postman collection architecture, assertion scripts, Newman CI/CD execution, test metrics analysis. |
| **API Tester / QA Analyst** | Test case design, manual exploratory testing, defect logging and reproduction, actual vs expected comparison. |
| **Technical Reviewer / Mentor** | Reviewing test coverage, validating defect severity, approving test closure reports. |

---

## 9. Deliverables Matrix

1. **Test Plan**: `test-cases/test-plan.md`
2. **Test Cases Repository**: `test-cases/test-cases.csv`
3. **Automated Postman Collection**: `postman/ShopSure_API_Tests.postman_collection.json`
4. **Environment Variables**: `postman/ShopSure_Environment.postman_environment.json`
5. **Defect Template & Sample Reports**: `bug-reports/bug-report-template.md`, `bug-reports/sample-defects.md`
6. **Execution Report**: `reports/test-execution-report.md`
7. **Excel QA Executive Dashboard**: `dashboard/qa-dashboard.xlsx`
