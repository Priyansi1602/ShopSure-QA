# Execution Evidence & Screenshots Directory

This directory stores actual, verified screenshots taken during manual and automated test execution of the **ShopSure QA** suite.

> **Integrity Notice**: In accordance with QA best practices and academic standards, no fabricated or mock screenshots are placed here. Real screenshots must be captured during your execution and saved using the naming convention below.

---

## Recommended Screenshot Index

When you execute tests in Postman or view the Excel dashboard, take screenshots (using `Win + Shift + S` or the Snipping Tool on Windows) and save them to this folder:

| Filename | Description | When to Capture |
| :--- | :--- | :--- |
| `01_postman_collection_run.png` | Postman Collection Runner summary showing all 32+ executed assertions | After running the collection in Postman Runner |
| `02_auth_token_extraction.png` | Successful `POST /auth/login` request displaying generated access token | After executing Login request in Postman |
| `03_protected_route_auth_me.png` | Successful `GET /auth/me` with Bearer token header | After executing Auth Me request |
| `04_negative_test_404.png` | `GET /products/99999` returning `404 Not Found` with assertion passes | After running Product negative test |
| `05_cart_simulation_201.png` | `POST /carts/add` returning `201 Created` with simulated cart | After running Cart Add test |
| `06_excel_dashboard_view.png` | Microsoft Excel QA Dashboard showing KPIs, Pass/Fail chart, and Defect chart | After opening `dashboard/qa-dashboard.xlsx` |
| `07_newman_cli_execution.png` (Optional) | Newman CLI terminal test summary with green assertion tables | After running Newman from PowerShell |

---

## How to Capture and Add Genuine Evidence

1. **In Postman**:
   - Open Postman, click on the **ShopSure API Testing Suite** collection.
   - Click the **Run** button (top right).
   - Select all requests and click **Run ShopSure API Testing Suite**.
   - When the runner completes, press `Win + Shift + S`, select the entire Postman window, and save the image as `screenshots/01_postman_collection_run.png`.

2. **In Excel**:
   - Open `dashboard/qa-dashboard.xlsx`.
   - Navigate to the **Dashboard** sheet.
   - Capture the sheet view and save as `screenshots/06_excel_dashboard_view.png`.

3. **In Git**:
   - Stage and commit your genuine screenshots:
     ```bash
     git add screenshots/
     git commit -m "docs: add verified test execution screenshots"
     ```
