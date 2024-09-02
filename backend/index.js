const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("vehicle_data", (data) => {
    const timestamp = new Date().toISOString(); // Get the current timestamp
    const logEntry = `Timestamp: ${timestamp}, Data: ${JSON.stringify(data)}\n`; // Create the log entry

    // Write the log entry to a file
    fs.appendFile(
      path.join(__dirname, "vehicle_data_logs.txt"),
      logEntry,
      (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      }
    );

    console.log(logEntry);
    io.emit("received_data", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
