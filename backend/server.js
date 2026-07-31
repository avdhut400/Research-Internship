// // const express = require("express");
// // const cors = require("cors");
// // require("dotenv").config();

// // const predictionRoutes = require("./routes/predictionRoutes");
// // const feedbackRoutes = require("./routes/feedbackRoutes");

// // const app = express();

// // const PORT = process.env.PORT || 5000;

// // app.use(
// //   cors({
// //     origin: "http://localhost:5173",
// //     methods: ["GET", "POST"],
// //     allowedHeaders: ["Content-Type"],
// //   })
// // );

// // app.use(express.json());

// // app.get("/", (req, res) => {
// //   res.status(200).json({
// //     success: true,
// //     message: "Oil Adulteration Express API is running",
// //   });
// // });

// // app.use("/api/predict", predictionRoutes);

// // app.use("/api/feedback", feedbackRoutes);

// // app.use((req, res) => {
// //   res.status(404).json({
// //     success: false,
// //     message: "API route not found",
// //   });
// // });

// // app.use((error, req, res, next) => {
// //   console.error("Server error:", error);

// //   res.status(500).json({
// //     success: false,
// //     message: "Internal server error",
// //   });
// // });

// // app.listen(PORT, () => {
// //   console.log(
// //     `Express server running on http://localhost:${PORT}`
// //   );
// // });

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const predictionRoutes = require("./routes/predictRoutes");
// const feedbackRoutes = require("./routes/feedbackRoutes");

// const app = express();

// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Backend API is running",
//   });
// });

// app.use("/api/predict", predictionRoutes);
// app.use("/api/feedback", feedbackRoutes);

// app.listen(PORT, () => {
//   console.log(
//     `Server running on http://localhost:${PORT}`
//   );
// });

// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const connectDatabase = require(
//   "./config/database"
// );

// const predictionRoutes = require(
//   "./routes/predictRoutes"
// );

// const feedbackRoutes = require(
//   "./routes/feedbackRoutes"
// );

// const app = express();

// const PORT = process.env.PORT || 5000;

// connectDatabase();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: [
//       "GET",
//       "POST",
//       "PATCH",
//       "DELETE",
//     ],
//   })
// );

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message:
//       "Oil Adulteration Express API is running",
//   });
// });

// app.use(
//   "/api/predict",
//   predictionRoutes
// );

// app.use(
//   "/api/feedback",
//   feedbackRoutes
// );

// /*
//   Multer validation error handler
// */
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   if (error) {
//     return res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   next();
// });

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "API route not found",
//   });
// });

// app.listen(PORT, () => {
//   console.log(
//     `Express server running on http://localhost:${PORT}`
//   );
// });



const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const connectDatabase = require(
  "./config/database"
);

const predictionRoutes = require(
  "./routes/predictRoutes"
);

const feedbackRoutes = require(
  "./routes/feedbackRoutes"
);

const app = express();

const PORT = process.env.PORT || 5000;

connectDatabase();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Postman and server-to-server requests
      // may not contain an Origin header.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(
        new Error(
          `CORS blocked for origin: ${origin}`
        )
      );
    },

    methods: [
      "GET",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Oil Adulteration Express API is running",
  });
});

app.use(
  "/api/predict",
  predictionRoutes
);

app.use(
  "/api/feedback",
  feedbackRoutes
);

/*
  Multer and general error handler
*/
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Something went wrong",
    });
  }

  next();
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.listen(PORT, () => {
  console.log(
    `Express server running on port ${PORT}`
  );

  console.log(
    "Allowed frontend origins:",
    allowedOrigins
  );
});