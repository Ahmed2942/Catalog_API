# Catalog Ingestion & Search API

A robust backend service designed to import, validate, and persist product catalog data from CSV files into a MariaDB database, while providing a filtered search API. This system is built to handle imperfect real-world data with structured logging and automated failure reporting.

## 🚀 Features

* **Bulk CSV Import**: Supports multi-file uploads (Families and Products) using `Multer`.
* **Imperfect Data Handling**: Continues processing valid records even when individual rows fail validation.
* **Automated Failure Reports**: Generates detailed CSV files for failed rows, including the row number, business key, and specific validation reason.
* **Advanced Search**: High-performance search API with support for partial matches on SKU/Name and exact matches on Family attributes.
* **Structured Logging**: Production-grade JSON logging for auditing import lifecycle and system errors.

---

## 🏗️ Architecture

The system follows a modular architecture built with Node.js and Express, utilizing Sequelize ORM for database interactions.

### Core Business Rules
* **Relationships**: A Product belongs to exactly one Family, but a Family can have many Products.
* **Referential Integrity**: "No orphan products allowed"—all products must reference an existing Family Code.
* **Data Persistence**: The system performs "Upserts," meaning it inserts new records or updates existing records if they already exist in the database.

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
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating a `.env` file based on your database credentials.

### Running the App
```bash
# Start server
npm start