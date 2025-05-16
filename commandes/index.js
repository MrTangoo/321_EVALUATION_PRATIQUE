
const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const amqp = require("amqplib");

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "orders",
  password: "postgres",
  port: 5432,
});

const waitForPostgres = async () => {
  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 10) {
    try {
      const client = await pool.connect();
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          product TEXT,
          quantity INT
        )
      `);
      client.release();
      connected = true;
      console.log("✅ Connected to PostgreSQL and initialized table");
    } catch (err) {
      console.log(`❌ PostgreSQL not ready yet, retrying in 3s... (${attempts + 1}/10)`);
      await new Promise(res => setTimeout(res, 3000));
      attempts++;
    }
  }
  if (!connected) {
    console.error("❌ Failed to connect to PostgreSQL after 10 attempts");
    process.exit(1);
  }
};

waitForPostgres();


let channel;

const waitForRabbitMQ = async () => {
  let connected = false;
  let attempts = 0;
  while (!connected && attempts < 10) {
    try {
      const conn = await amqp.connect("amqp://rabbitmq");
      channel = await conn.createChannel();
      await channel.assertExchange("orderExchange", "fanout", { durable: false });
      connected = true;
      console.log("✅ Connected to RabbitMQ and exchange created");
    } catch (err) {
      console.log(`❌ RabbitMQ not ready, retrying in 3s... (${attempts + 1}/10)`);
      await new Promise(res => setTimeout(res, 3000));
      attempts++;
    }
  }

  if (!connected) {
    console.error("❌ Failed to connect to RabbitMQ after 10 attempts");
    process.exit(1);
  }
};

waitForRabbitMQ();


app.post("/orders", async (req, res) => {
  const { product, quantity } = req.body;
  await pool.query("INSERT INTO orders (product, quantity) VALUES ($1, $2)", [product, quantity]);
  channel.publish("orderExchange", "", Buffer.from(JSON.stringify({ product, quantity })));
  res.json({ message: "Order placed" });
});

app.get("/orders", async (req, res) => {
  const result = await pool.query("SELECT * FROM orders");
  res.json(result.rows);
});

app.listen(8001, () => console.log("Orders service running on port 8001"));
