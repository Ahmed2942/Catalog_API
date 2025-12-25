# Catalog Ingestion & Search API

A robust backend service designed to import, validate, and persist product catalog data from CSV files into a MariaDB database, while providing a filtered search API. This system is built to handle imperfect real-world data with structured logging and automated failure reporting.

---

## 🏗️ Architecture

The system follows a modular architecture built with Node.js and Express, utilizing Sequelize ORM for database interactions.

### Core Business Rules
* **Relationships**: A Family can have many Products, but a Product belongs to exactly one Family.
* **Referential Integrity**: "No orphan products allowed"—all products must reference an existing Family Code.
* **Data Persistence**: The system performs "Upserts," meaning it inserts new records or updates existing records if they already exist in the database.
* **Partial Failures**: The import tracks failures without stopping the entire process and exports them into dedicated CSV files.

---

## 🛠️ Technical Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **ORM**: Sequelize (MariaDB)
* **Validation**: Joi
* **Logging**: Winston
* **File Handling**: Multer & CSV-Parser

---

## 🚦 Getting Started

### Prerequisites
* Node.js (v14+)
* MariaDB or MySQL database

### Installation
1.  **Clone the repository.**
git clone URL
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**: Create a `.env` file based on your database credentials (refer to `src/config/database.js`).

### Running the App
#### Start server
    npm run start
#### Start server in dev mode
    npm run dev

## 📑 API Reference & Usage

### 1. Import API

**`POST /api/import`**

Used to upload and process catalog CSV files. This endpoint requires a `multipart/form-data` request.

* **Required Headers**: `Content-Type: multipart/form-data`
* **Form Data Fields**:
* `familiesFile`: The CSV file containing family records.
* `productsFile`: The CSV file containing product records.



#### **How it works**

The server validates that both files are present and are in `.csv` format. Files are parsed using a `;` separator. Valid records are "upserted" (inserted or updated), while rows failing validation are logged into separate failure CSVs.

* **Response**: Returns success status, import statistics (processed, inserted, updated, failed), and paths to generated failure files.

---

### 2. Search API

**`GET /api/search`**

Retrieves products with their associated family data. Filtering is controlled entirely through **URL Query Parameters**.

#### **Filtering Parameters**

| Parameter | Type | Match Type | Description |
| --- | --- | --- | --- |
| `sku` | String | Partial | SKU contains the provided string. |
| `name` | String | Partial | Product name contains the provided string. |
| `familyCode` | String | Exact | Filters products by an exact family code match. |
| `productLine` | String | Exact | Filters by family product line. |
| `brand` | String | Exact | Filters by brand exact match. |
| `status` | String | Enum | Filters by status (`ACTIVE` or `INACTIVE`). |

#### **Pagination Parameters**

| Parameter | Type | Default | Max |
| --- | --- | --- | --- |
| `page` | Number | 1 | - |
| `limit` | Number | 10 | 100 |

**Example Request URL**:
`GET /api/search?brand=VALEO&status=ACTIVE&name=Wiper&limit=5&page=1`

---

## 🧪 Validation Logic

The system enforces strict data integrity:

* **Family Code**: Required, unique, and must match pattern `FAM_[A-Z]+_\d{3}`.
* **Status**: Strictly `ACTIVE` or `INACTIVE`.
* **SKU**: Required, unique, and must match pattern `SKU-[0-9]+`.
* **EAN UPC**: Numeric only, strictly 8 to 14 digits.

---

## 📂 Project Structure

* `src/models`: Database schema definitions (Sequelize).
* `src/services`: Business logic, CSV parsing, and validation.
* `src/middleware`: File upload handling, 404s, and global error handling.
* `src/infrastructure`: Database connection and server lifecycle management.
* `src/utils`: Shared constants and Joi validation schemas.

```

```