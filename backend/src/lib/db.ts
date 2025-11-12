import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../dev.db');

// Promisified sqlite3 for synchronous-like behavior
sqlite3.verbose();

// SQLite database wrapper
class Database {
  private db: sqlite3.Database | null = null;
  private ready: Promise<void>;

  constructor() {
    this.ready = this.initialize();
  }

  private initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('❌ Database connection error:', err);
          reject(err);
          return;
        }

        console.log('✅ Connected to SQLite database');
        
        // Enable foreign keys and initialize tables
        this.db!.run('PRAGMA foreign_keys = ON', (err) => {
          if (err) {
            console.error('❌ Failed to enable foreign keys:', err);
            reject(err);
            return;
          }
          
          this.initializeDatabase()
            .then(() => {
              console.log('✅ Database tables initialized');
              resolve();
            })
            .catch(reject);
        });
      });
    });
  }

  private initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const statements = [
        `CREATE TABLE IF NOT EXISTS User (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS StudentProfile (
          id TEXT PRIMARY KEY,
          userId TEXT UNIQUE NOT NULL,
          grade TEXT,
          attendance REAL DEFAULT 0,
          performance TEXT,
          interests TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS TeacherProfile (
          id TEXT PRIMARY KEY,
          userId TEXT UNIQUE NOT NULL,
          points INTEGER DEFAULT 0,
          level INTEGER DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS QuizResult (
          id TEXT PRIMARY KEY,
          studentId TEXT NOT NULL,
          interests TEXT,
          completedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (studentId) REFERENCES StudentProfile(id) ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS StudentFeedback (
          id TEXT PRIMARY KEY,
          teacherId TEXT NOT NULL,
          studentName TEXT NOT NULL,
          performance TEXT,
          feedback TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacherId) REFERENCES TeacherProfile(id) ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS Achievement (
          id TEXT PRIMARY KEY,
          teacherId TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          earnedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacherId) REFERENCES TeacherProfile(id) ON DELETE CASCADE
        )`,

        `CREATE TABLE IF NOT EXISTS DonorSubmission (
          id TEXT PRIMARY KEY,
          fullName TEXT NOT NULL,
          email TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          organization TEXT,
          donationType TEXT,
          paymentMethod TEXT,
          estimatedAmount TEXT,
          reason TEXT,
          receiveUpdates BOOLEAN DEFAULT 0,
          submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE INDEX IF NOT EXISTS idx_user_email ON User(email)`,
        `CREATE INDEX IF NOT EXISTS idx_studentprofile_userid ON StudentProfile(userId)`,
        `CREATE INDEX IF NOT EXISTS idx_teacherprofile_userid ON TeacherProfile(userId)`,
        `CREATE INDEX IF NOT EXISTS idx_quizresult_studentid ON QuizResult(studentId)`,
        `CREATE INDEX IF NOT EXISTS idx_studentfeedback_teacherid ON StudentFeedback(teacherId)`,
        `CREATE INDEX IF NOT EXISTS idx_achievement_teacherid ON Achievement(teacherId)`
      ];

      let completed = 0;

      const executeNext = () => {
        if (completed >= statements.length) {
          resolve();
          return;
        }

        this.db!.run(statements[completed], (err) => {
          if (err) {
            console.error(`❌ Error executing statement ${completed}:`, err);
            reject(err);
            return;
          }
          completed++;
          executeNext();
        });
      };

      executeNext();
    });
  }

  // Wait for database to be ready before executing queries
  private async ensureReady() {
    await this.ready;
  }

  // Run a query with parameters
  run(sql: string, params: any[] = []): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.ensureReady();
        this.db!.run(sql, params, function(err) {
          if (err) {
            console.error('❌ DB run error:', err, 'SQL:', sql);
            reject(err);
          } else {
            resolve({ id: this.lastID, changes: this.changes });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get a single row
  get(sql: string, params: any[] = []): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.ensureReady();
        this.db!.get(sql, params, (err, row) => {
          if (err) {
            console.error('❌ DB get error:', err, 'SQL:', sql);
            reject(err);
          } else {
            resolve(row);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get all rows
  all(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.ensureReady();
        this.db!.all(sql, params, (err, rows) => {
          if (err) {
            console.error('❌ DB all error:', err, 'SQL:', sql);
            reject(err);
          } else {
            resolve(rows || []);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Close database connection
  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default new Database();
