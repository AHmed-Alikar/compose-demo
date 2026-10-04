const http = require("http");
const { Client } = require("pg");

const PORT = process.env.PORT || 3000;

const db = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function startServer() {
  try {
    await db.connect();
    console.log("Connected to PostgreSQL!");

    const server = http.createServer(async (req, res) => {
      if (req.url === "/") {
        res.writeHead(200, {
          "Content-Type": "text/plain"
        });

        res.end("Node.js + PostgreSQL are working!");
        return;
      }

      if (req.url === "/db") {
        const result = await db.query("SELECT NOW() AS time");

        res.writeHead(200, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify(result.rows[0]));
        return;
      }

      res.writeHead(404);
      res.end("Not Found");
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

startServer();
