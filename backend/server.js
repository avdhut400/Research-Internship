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

const connectDatabase = require("./config/database");
const predictionRoutes = require("./routes/predictRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDatabase();

/*
  Demo deployment:
  Allow requests from localhost, Vercel and Postman.
*/
app.use(
  cors({
    origin: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Oil Adulteration Express API is running",
  });
});

app.use("/api/predict", predictionRoutes);
app.use("/api/feedback", feedbackRoutes);

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

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Express server running on port ${PORT}`);
});