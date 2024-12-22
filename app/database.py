import sqlite3
from datetime import datetime
import pandas as pd

class NachosDB:
    def __init__(self, db_path="nachos.db"):
        self.db_path = db_path
        self.init_db()

    def init_db(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Create reviews table
        c.execute('''
            CREATE TABLE IF NOT EXISTS reviews (
                review_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                lat REAL,
                lng REAL,
                date DATE,
                meal TEXT,
                meal_description TEXT,
                reviewer TEXT,
                price REAL,
                quantity_score INTEGER,
                taste_score INTEGER,
                atmosphere_score INTEGER,
                overall_score INTEGER,
                comments TEXT
            )
        ''')
        
        # Create pending table with same structure
        c.execute('''
            CREATE TABLE IF NOT EXISTS pending (
                review_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                lat REAL,
                lng REAL,
                date DATE,
                meal TEXT,
                meal_description TEXT,
                reviewer TEXT,
                price REAL,
                quantity_score INTEGER,
                taste_score INTEGER,
                atmosphere_score INTEGER,
                overall_score INTEGER,
                comments TEXT
            )
        ''')
        
        conn.commit()
        conn.close()

    def add_pending_review(self, review_data):
        """Add a new review to the pending table"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        columns = ', '.join(review_data.keys())
        placeholders = ':'+', :'.join(review_data.keys())
        query = f'INSERT INTO pending ({columns}) VALUES ({placeholders})'
        
        c.execute(query, review_data)
        conn.commit()
        conn.close()

    def approve_review(self, review_id):
        """Move a review from pending to approved reviews"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()
        
        # Get the review from pending
        c.execute('SELECT * FROM pending WHERE review_id = ?', (review_id,))
        review = c.execute('SELECT * FROM pending WHERE review_id = ?', (review_id,)).fetchone()
        
        if review:
            # Insert into reviews
            columns = [description[0] for description in c.description]
            columns.remove('review_id')  # Remove review_id as it will auto-increment
            columns_str = ', '.join(columns)
            values = review[1:]  # Exclude review_id
            placeholders = ', '.join(['?' for _ in values])
            
            c.execute(f'INSERT INTO reviews ({columns_str}) VALUES ({placeholders})', values)
            
            # Delete from pending
            c.execute('DELETE FROM pending WHERE review_id = ?', (review_id,))
            
            conn.commit()
        
        conn.close()

    def get_all_reviews(self):
        """Get all approved reviews as a pandas DataFrame"""
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query('SELECT * FROM reviews', conn)
        conn.close()
        return df

    def get_pending_reviews(self):
        """Get all pending reviews as a pandas DataFrame"""
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query('SELECT * FROM pending', conn)
        conn.close()
        return df 