
from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from typing import List

app = FastAPI(title="Catalogue Service")

db = sqlite3.connect("catalogue.db", check_same_thread=False)
cursor = db.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL
)
""")
db.commit()

class Product(BaseModel):
    name: str
    price: float

@app.post("/products")
def create_product(product: Product):
    cursor.execute("INSERT INTO products (name, price) VALUES (?, ?)", (product.name, product.price))
    db.commit()
    return {"message": "Product created"}

@app.get("/products", response_model=List[Product])
def get_products():
    cursor.execute("SELECT name, price FROM products")
    rows = cursor.fetchall()
    return [Product(name=row[0], price=row[1]) for row in rows]
