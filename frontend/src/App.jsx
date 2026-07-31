// import { useState } from "react";
// import "./App.css";
// import ImageUpload from "./components/ImageUpload";
// import { predictOil } from "./services/predictionService";
// import { submitFeedback } from "./services/feedbackService";

// const OIL_CLASSES = [
//   "Mustard_100_Palm",
//   "Mustard_20_Palm",
//   "Mustard_40_Palm",
//   "Mustard_60_Palm",
//   "Mustard_80_Palm",
//   "Peanut_100_Palm",
//   "Peanut_20_Palm",
//   "Peanut_40_Palm",
//   "Peanut_60_Palm",
//   "Peanut_80_Palm",
//   "Pure_Mustard",
//   "Pure_Peanut",
//   "Pure_Soyabean",
//   "Pure_Sunflower",
//   "Soyabean_100_Palm",
//   "Soyabean_20_Palm",
//   "Soyabean_40_Palm",
//   "Soyabean_60_Palm",
//   "Soyabean_80_Palm",
//   "Sunflower_100_Palm",
//   "Sunflower_20_Palm",
//   "Sunflower_40_Palm",
//   "Sunflower_60_Palm",
//   "Sunflower_80_Palm",
// ];

// function App() {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [feedbackChoice, setFeedbackChoice] = useState("");
//   const [correctClass, setCorrectClass] = useState("");
//   const [feedbackSubmitted, setFeedbackSubmitted] =
//     useState(false);
//   const [feedbackMessage, setFeedbackMessage] =
//     useState("");
//   const [feedbackLoading, setFeedbackLoading] = useState(false);

//   const resetFeedback = () => {
//     setFeedbackChoice("");
//     setCorrectClass("");
//     setFeedbackSubmitted(false);
//     setFeedbackMessage("");
//     setFeedbackLoading(false);
//   };

//   const handlePredict = async () => {
//     if (!image) {
//       setError(
//         "Krupaya ek oil sample image select kara."
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setResult(null);
//       resetFeedback();

//       const predictionResult =
//         await predictOil(image);

//       setResult(predictionResult);
//     } catch (err) {
//       setError(
//         err.message ||
//           "Image analyze karta aali nahi. Punha prayatna kara."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setImage(null);
//     setPreview("");
//     setResult(null);
//     setError("");
//     resetFeedback();
//   };

//   const handleFeedbackChoice = (choice) => {
//     setFeedbackChoice(choice);
//     setCorrectClass("");
//     setFeedbackMessage("");
//   };

//   const handleFeedbackSubmit = async () => {
//     if (!result) {
//       return;
//     }

//     if (!feedbackChoice) {
//       setFeedbackMessage(
//         "Krupaya correct kinva incorrect select kara."
//       );
//       return;
//     }

//     if (
//       feedbackChoice === "incorrect" &&
//       !correctClass
//     ) {
//       setFeedbackMessage(
//         "Krupaya correct class select kara."
//       );
//       return;
//     }

//     const feedbackData = {
//       fileName: result.fileName || image?.name,
//       predictedClass: result.predictedClass,
//       isCorrect: feedbackChoice === "correct",
//       correctClass:
//         feedbackChoice === "correct"
//           ? result.predictedClass
//           : correctClass,
//     };

//     try {
//       setFeedbackLoading(true);
//       setFeedbackMessage("");

//       const response = await submitFeedback(feedbackData);

//       setFeedbackSubmitted(true);
//       setFeedbackMessage(
//         response.message ||
//           "Feedback successfully save zala."
//       );
//     } catch (error) {
//       setFeedbackMessage(
//         error.message ||
//           "Feedback save karta aala nahi."
//       );
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   const isPure = result?.status === "Pure";

//   return (
//     <div className="fullscreen-app">
//       {/* TOP NAVBAR */}
//       <header className="top-navbar">
//         <div className="nav-brand">
//           <div className="brand-dot" />

//           <span className="brand-title">
//             OilDetect Pro
//           </span>

//           <span className="brand-tag">
//             Spectroscopy AI
//           </span>
//         </div>

//         <div className="nav-status">
//           <span className="status-indicator" />
//           Engine Online
//         </div>
//       </header>

//       {/* DASHBOARD BODY */}
//       <main className="dashboard-body">
//         {/* UPLOAD PANEL */}
//         <section className="dashboard-card upload-card">
//           <div className="card-title-group">
//             <span className="step-tag">01</span>

//             <div>
//               <h2>Sample Input</h2>

//               <p>
//                 Upload oil sample for visual purity
//                 analysis
//               </p>
//             </div>
//           </div>

//           <div className="upload-wrapper">
//             <ImageUpload
//               image={image}
//               preview={preview}
//               setImage={setImage}
//               setPreview={setPreview}
//             />
//           </div>

//           {error && (
//             <div className="error-toast">
//               {error}
//             </div>
//           )}

//           <div className="card-actions">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handlePredict}
//               disabled={!image || loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="btn-spinner" />
//                   Analyzing Sample...
//                 </>
//               ) : (
//                 "Run Purity Check"
//               )}
//             </button>

//             {image && (
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={handleReset}
//                 disabled={loading}
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </section>

//         {/* RESULTS PANEL */}
//         <section className="dashboard-card result-card">
//           <div className="card-title-group">
//             <span className="step-tag">02</span>

//             <div>
//               <h2>Diagnostic Metrics</h2>

//               <p>
//                 Real-time AI evaluation breakdown
//               </p>
//             </div>
//           </div>

//           {!result && !loading && (
//             <div className="empty-state-view">
//               <div className="empty-icon-circle">
//                 💧
//               </div>

//               <h3>No Active Sample</h3>

//               <p>
//                 Image upload karun "Run Purity Check"
//                 var click kara.
//               </p>
//             </div>
//           )}

//           {loading && (
//             <div className="loading-state-view">
//               <div className="pulse-loader" />

//               <h3>Analyzing Sample</h3>

//               <p>
//                 Neural network image features detect
//                 karat ahe...
//               </p>
//             </div>
//           )}

//           {result && !loading && (
//             <div className="result-display">
//               {/* VERDICT BANNER */}
//               <div
//                 className={`verdict-banner ${
//                   isPure ? "pure" : "adulterated"
//                 }`}
//               >
//                 <div className="verdict-icon">
//                   {isPure ? "✓" : "!"}
//                 </div>

//                 <div>
//                   <span className="verdict-subtitle">
//                     Visual Quality Analysis
//                   </span>

//                   <h3>{result.status} Sample</h3>

//                   <p>
//                     {result.details ||
//                       "Sample quality parameters processed successfully."}
//                   </p>
//                 </div>
//               </div>

//               {/* GRID METRICS */}
//               <div className="stats-grid">
//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Oil Category
//                   </span>

//                   <span className="stat-value">
//                     {result.oilType || "Standard"}
//                   </span>
//                 </div>

//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Predicted Sub-type
//                   </span>

//                   <span className="stat-value">
//                     {result.predictedClass}
//                   </span>
//                 </div>

//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Adulteration Level
//                   </span>

//                   <span className="stat-value">
//                     {result.adulterationPercentage ??
//                       0}
//                     %
//                   </span>
//                 </div>

//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Sample File
//                   </span>

//                   <span className="stat-value">
//                     {result.fileName || image?.name}
//                   </span>
//                 </div>
//               </div>

//               {/* MATCHES */}
//               {result.topPredictions?.length > 0 && (
//                 <div className="match-list-box">
//                   <h4>Top Structural Matches</h4>

//                   <div className="match-tags">
//                     {result.topPredictions.map(
//                       (prediction, index) => (
//                         <span
//                           key={`${prediction.className}-${index}`}
//                           className="match-tag"
//                         >
//                           {prediction.className}
//                         </span>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* HUMAN FEEDBACK */}
//               <div className="feedback-box">
//                 {!feedbackSubmitted ? (
//                   <>
//                     <div className="feedback-heading">
//                       <h4>
//                         Was this prediction correct?
//                       </h4>

//                       <p>
//                         Verified feedback can help improve
//                         future model versions.
//                       </p>
//                     </div>

//                     <div className="feedback-choice-row">
//                       <button
//                         type="button"
//                         className={`feedback-choice correct-choice ${
//                           feedbackChoice === "correct"
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           handleFeedbackChoice(
//                             "correct"
//                           )
//                         }
//                       >
//                         ✓ Correct
//                       </button>

//                       <button
//                         type="button"
//                         className={`feedback-choice incorrect-choice ${
//                           feedbackChoice ===
//                           "incorrect"
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           handleFeedbackChoice(
//                             "incorrect"
//                           )
//                         }
//                       >
//                         ✕ Incorrect
//                       </button>
//                     </div>

//                     {feedbackChoice ===
//                       "incorrect" && (
//                       <div className="correct-class-field">
//                         <label htmlFor="correctClass">
//                           Select correct class
//                         </label>

//                         <select
//                           id="correctClass"
//                           value={correctClass}
//                           onChange={(event) =>
//                             setCorrectClass(
//                               event.target.value
//                             )
//                           }
//                         >
//                           <option value="">
//                             Choose correct class
//                           </option>

//                           {OIL_CLASSES.filter(
//                             (className) =>
//                               className !==
//                               result.predictedClass
//                           ).map((className) => (
//                             <option
//                               value={className}
//                               key={className}
//                             >
//                               {className}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {feedbackMessage && (
//                       <p className="feedback-error">
//                         {feedbackMessage}
//                       </p>
//                     )}

//                     {feedbackChoice && (
//                       <button
//                         type="button"
//                         className="submit-feedback-btn"
//                         onClick={handleFeedbackSubmit}
//                         disabled={feedbackLoading}
//                       >
//                         {feedbackLoading
//                           ? "Saving Feedback..."
//                           : "Submit Feedback"}
//                       </button>
//                     )}
//                   </>
//                 ) : (
//                   <div className="feedback-success">
//                     <div className="feedback-success-icon">
//                       ✓
//                     </div>

//                     <div>
//                       <h4>Feedback Received</h4>
//                       <p>{feedbackMessage}</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;















































// import { useState } from "react";
// import "./App.css";

// import ImageUpload from "./components/ImageUpload";
// import { predictOil } from "./services/predictionService";
// import { submitFeedback } from "./services/feedbackService";

// const OIL_CLASSES = [
//   "Mustard_100_Palm",
//   "Mustard_20_Palm",
//   "Mustard_40_Palm",
//   "Mustard_60_Palm",
//   "Mustard_80_Palm",

//   "Peanut_100_Palm",
//   "Peanut_20_Palm",
//   "Peanut_40_Palm",
//   "Peanut_60_Palm",
//   "Peanut_80_Palm",

//   "Pure_Mustard",
//   "Pure_Peanut",
//   "Pure_Soyabean",
//   "Pure_Sunflower",

//   "Soyabean_100_Palm",
//   "Soyabean_20_Palm",
//   "Soyabean_40_Palm",
//   "Soyabean_60_Palm",
//   "Soyabean_80_Palm",

//   "Sunflower_100_Palm",
//   "Sunflower_20_Palm",
//   "Sunflower_40_Palm",
//   "Sunflower_60_Palm",
//   "Sunflower_80_Palm",
// ];

// function App() {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   const [result, setResult] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [feedbackChoice, setFeedbackChoice] =
//     useState("");

//   const [correctClass, setCorrectClass] =
//     useState("");

//   const [feedbackSubmitted, setFeedbackSubmitted] =
//     useState(false);

//   const [feedbackMessage, setFeedbackMessage] =
//     useState("");

//   const [feedbackLoading, setFeedbackLoading] =
//     useState(false);

//   const resetFeedback = () => {
//     setFeedbackChoice("");
//     setCorrectClass("");
//     setFeedbackSubmitted(false);
//     setFeedbackMessage("");
//     setFeedbackLoading(false);
//   };

//   const handlePredict = async () => {
//     if (!image) {
//       setError(
//         "Krupaya ek oil sample image select kara."
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setResult(null);

//       resetFeedback();

//       const predictionResult =
//         await predictOil(image);

//       setResult(predictionResult);
//     } catch (error) {
//       setError(
//         error.message ||
//           "Image analyze karta aali nahi. Punha prayatna kara."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setImage(null);
//     setPreview("");
//     setResult(null);
//     setError("");

//     resetFeedback();
//   };

//   const handleFeedbackChoice = (choice) => {
//     setFeedbackChoice(choice);
//     setCorrectClass("");
//     setFeedbackMessage("");
//   };

//   const handleFeedbackSubmit = async () => {
//     if (!result || !image) {
//       setFeedbackMessage(
//         "Prediction image available nahi."
//       );
//       return;
//     }

//     if (!feedbackChoice) {
//       setFeedbackMessage(
//         "Correct kinva Incorrect select kara."
//       );
//       return;
//     }

//     if (
//       feedbackChoice === "incorrect" &&
//       !correctClass
//     ) {
//       setFeedbackMessage(
//         "Krupaya correct class select kara."
//       );
//       return;
//     }

//     const feedbackData = {
//       image,

//       fileName:
//         result.fileName || image.name,

//       predictedClass:
//         result.predictedClass,

//       isCorrect:
//         feedbackChoice === "correct",

//       correctClass:
//         feedbackChoice === "correct"
//           ? result.predictedClass
//           : correctClass,
//     };

//     try {
//       setFeedbackLoading(true);
//       setFeedbackMessage("");

//       const response =
//         await submitFeedback(feedbackData);

//       setFeedbackSubmitted(true);

//       setFeedbackMessage(
//         response.message ||
//           "Feedback and image saved successfully."
//       );
//     } catch (error) {
//       setFeedbackMessage(
//         error.message ||
//           "Feedback save karta aala nahi."
//       );
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   const isPure =
//     result?.status === "Pure";

//   return (
//     <div className="fullscreen-app">
//       {/* TOP NAVBAR */}
//       <header className="top-navbar">
//         <div className="nav-brand">
//           <div className="brand-dot" />

//           <span className="brand-title">
//             OilDetect Pro
//           </span>

//           <span className="brand-tag">
//             Vision Transformer AI
//           </span>
//         </div>

//         <div className="nav-status">
//           <span className="status-indicator" />
//           Engine Online
//         </div>
//       </header>

//       {/* DASHBOARD */}
//       <main className="dashboard-body">
//         {/* UPLOAD SECTION */}
//         <section className="dashboard-card upload-card">
//           <div className="card-title-group">
//             <span className="step-tag">
//               01
//             </span>

//             <div>
//               <h2>Sample Input</h2>

//               <p>
//                 Upload oil sample for visual
//                 purity analysis
//               </p>
//             </div>
//           </div>

//           <div className="upload-wrapper">
//             <ImageUpload
//               image={image}
//               preview={preview}
//               setImage={setImage}
//               setPreview={setPreview}
//             />
//           </div>

//           {error && (
//             <div className="error-toast">
//               {error}
//             </div>
//           )}

//           <div className="card-actions">
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={handlePredict}
//               disabled={!image || loading}
//             >
//               {loading ? (
//                 <>
//                   <span className="btn-spinner" />
//                   Analyzing Sample...
//                 </>
//               ) : (
//                 "Run Purity Check"
//               )}
//             </button>

//             {image && (
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={handleReset}
//                 disabled={loading}
//               >
//                 Clear
//               </button>
//             )}
//           </div>
//         </section>

//         {/* RESULT SECTION */}
//         <section className="dashboard-card result-card">
//           <div className="card-title-group">
//             <span className="step-tag">
//               02
//             </span>

//             <div>
//               <h2>Diagnostic Metrics</h2>

//               <p>
//                 Real-time AI evaluation
//                 breakdown
//               </p>
//             </div>
//           </div>

//           {!result && !loading && (
//             <div className="empty-state-view">
//               <div className="empty-icon-circle">
//                 💧
//               </div>

//               <h3>No Active Sample</h3>

//               <p>
//                 Image upload karun Run Purity
//                 Check var click kara.
//               </p>
//             </div>
//           )}

//           {loading && (
//             <div className="loading-state-view">
//               <div className="pulse-loader" />

//               <h3>Analyzing Sample</h3>

//               <p>
//                 Neural network image features
//                 detect karat ahe...
//               </p>
//             </div>
//           )}

//           {result && !loading && (
//             <div className="result-display">
//               {/* VERDICT */}
//               <div
//                 className={`verdict-banner ${
//                   isPure
//                     ? "pure"
//                     : "adulterated"
//                 }`}
//               >
//                 <div className="verdict-icon">
//                   {isPure ? "✓" : "!"}
//                 </div>

//                 <div>
//                   <span className="verdict-subtitle">
//                     Visual Quality Analysis
//                   </span>

//                   <h3>
//                     {result.status} Sample
//                   </h3>

//                   <p>
//                     {result.details ||
//                       "Sample quality parameters processed successfully."}
//                   </p>
//                 </div>
//               </div>

//               {/* RESULT STATS */}
//               <div className="stats-grid">
//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Oil Category
//                   </span>

//                   <span className="stat-value">
//                     {result.oilType ||
//                       "Unknown"}
//                   </span>
//                 </div>

//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Predicted Sub-type
//                   </span>

//                   <span className="stat-value">
//                     {result.predictedClass}
//                   </span>
//                 </div>

//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Adulteration Level
//                   </span>

//                   <span className="stat-value">
//                     {result.adulterationPercentage ??
//                       0}
//                     %
//                   </span>
//                 </div>

//                 <div className="stat-item">
//                   <span className="stat-label">
//                     Sample File
//                   </span>

//                   <span className="stat-value">
//                     {result.fileName ||
//                       image?.name}
//                   </span>
//                 </div>
//               </div>

//               {/* TOP MATCHES */}
//               {result.topPredictions?.length >
//                 0 && (
//                 <div className="match-list-box">
//                   <h4>
//                     Top Structural Matches
//                   </h4>

//                   <div className="match-tags">
//                     {result.topPredictions.map(
//                       (
//                         prediction,
//                         index
//                       ) => (
//                         <span
//                           key={`${prediction.className}-${index}`}
//                           className="match-tag"
//                         >
//                           {
//                             prediction.className
//                           }
//                         </span>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* FEEDBACK */}
//               <div className="feedback-box">
//                 {!feedbackSubmitted ? (
//                   <>
//                     <div className="feedback-heading">
//                       <h4>
//                         Was this prediction
//                         correct?
//                       </h4>

//                       <p>
//                         Verified feedback can
//                         help improve future
//                         model versions.
//                       </p>
//                     </div>

//                     <div className="feedback-choice-row">
//                       <button
//                         type="button"
//                         className={`feedback-choice correct-choice ${
//                           feedbackChoice ===
//                           "correct"
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           handleFeedbackChoice(
//                             "correct"
//                           )
//                         }
//                         disabled={
//                           feedbackLoading
//                         }
//                       >
//                         ✓ Correct
//                       </button>

//                       <button
//                         type="button"
//                         className={`feedback-choice incorrect-choice ${
//                           feedbackChoice ===
//                           "incorrect"
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           handleFeedbackChoice(
//                             "incorrect"
//                           )
//                         }
//                         disabled={
//                           feedbackLoading
//                         }
//                       >
//                         ✕ Incorrect
//                       </button>
//                     </div>

//                     {feedbackChoice ===
//                       "incorrect" && (
//                       <div className="correct-class-field">
//                         <label htmlFor="correctClass">
//                           Select correct class
//                         </label>

//                         <select
//                           id="correctClass"
//                           value={correctClass}
//                           onChange={(event) =>
//                             setCorrectClass(
//                               event.target.value
//                             )
//                           }
//                           disabled={
//                             feedbackLoading
//                           }
//                         >
//                           <option value="">
//                             Choose correct class
//                           </option>

//                           {OIL_CLASSES.filter(
//                             (className) =>
//                               className !==
//                               result.predictedClass
//                           ).map(
//                             (className) => (
//                               <option
//                                 value={
//                                   className
//                                 }
//                                 key={
//                                   className
//                                 }
//                               >
//                                 {className}
//                               </option>
//                             )
//                           )}
//                         </select>
//                       </div>
//                     )}

//                     {feedbackMessage && (
//                       <p className="feedback-error">
//                         {feedbackMessage}
//                       </p>
//                     )}

//                     {feedbackChoice && (
//                       <button
//                         type="button"
//                         className="submit-feedback-btn"
//                         onClick={
//                           handleFeedbackSubmit
//                         }
//                         disabled={
//                           feedbackLoading
//                         }
//                       >
//                         {feedbackLoading
//                           ? "Saving Feedback..."
//                           : "Submit Feedback"}
//                       </button>
//                     )}
//                   </>
//                 ) : (
//                   <div className="feedback-success">
//                     <div className="feedback-success-icon">
//                       ✓
//                     </div>

//                     <div>
//                       <h4>
//                         Feedback Received
//                       </h4>

//                       <p>
//                         {feedbackMessage}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;
































// import { useState } from "react";
// import "./App.css";

// import ImageUpload from "./components/ImageUpload";
// import AdminFeedbackDashboard from "./components/AdminFeedbackDashboard";

// import { predictOil } from "./services/predictionService";
// import { submitFeedback } from "./services/feedbackService";

// const OIL_CLASSES = [
//   "Mustard_100_Palm",
//   "Mustard_20_Palm",
//   "Mustard_40_Palm",
//   "Mustard_60_Palm",
//   "Mustard_80_Palm",

//   "Peanut_100_Palm",
//   "Peanut_20_Palm",
//   "Peanut_40_Palm",
//   "Peanut_60_Palm",
//   "Peanut_80_Palm",

//   "Pure_Mustard",
//   "Pure_Peanut",
//   "Pure_Soyabean",
//   "Pure_Sunflower",

//   "Soyabean_100_Palm",
//   "Soyabean_20_Palm",
//   "Soyabean_40_Palm",
//   "Soyabean_60_Palm",
//   "Soyabean_80_Palm",

//   "Sunflower_100_Palm",
//   "Sunflower_20_Palm",
//   "Sunflower_40_Palm",
//   "Sunflower_60_Palm",
//   "Sunflower_80_Palm",
// ];

// function App() {
//   const [showAdminDashboard, setShowAdminDashboard] =
//     useState(false);

//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");
//   const [result, setResult] = useState(null);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [feedbackChoice, setFeedbackChoice] =
//     useState("");

//   const [correctClass, setCorrectClass] =
//     useState("");

//   const [feedbackSubmitted, setFeedbackSubmitted] =
//     useState(false);

//   const [feedbackMessage, setFeedbackMessage] =
//     useState("");

//   const [feedbackLoading, setFeedbackLoading] =
//     useState(false);

//   const resetFeedback = () => {
//     setFeedbackChoice("");
//     setCorrectClass("");
//     setFeedbackSubmitted(false);
//     setFeedbackMessage("");
//     setFeedbackLoading(false);
//   };

//   const handlePredict = async () => {
//     if (!image) {
//       setError(
//         "Please select an oil sample image."
//       );

//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setResult(null);

//       resetFeedback();

//       const predictionResult =
//         await predictOil(image);

//       setResult(predictionResult);
//     } catch (error) {
//       setError(
//         error.message ||
//           "Unable to analyze the image. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     if (preview) {
//       URL.revokeObjectURL(preview);
//     }

//     setImage(null);
//     setPreview("");
//     setResult(null);
//     setError("");

//     resetFeedback();
//   };

//   const handleFeedbackChoice = (choice) => {
//     setFeedbackChoice(choice);
//     setCorrectClass("");
//     setFeedbackMessage("");
//   };

//   const handleFeedbackSubmit = async () => {
//     if (!result || !image) {
//       setFeedbackMessage(
//         "The prediction image is not available."
//       );

//       return;
//     }

//     if (!feedbackChoice) {
//       setFeedbackMessage(
//         "Please select Correct or Incorrect."
//       );

//       return;
//     }

//     if (
//       feedbackChoice === "incorrect" &&
//       !correctClass
//     ) {
//       setFeedbackMessage(
//         "Please select the correct class."
//       );

//       return;
//     }

//     const feedbackData = {
//       image,

//       fileName:
//         result.fileName || image.name,

//       predictedClass:
//         result.predictedClass,

//       isCorrect:
//         feedbackChoice === "correct",

//       correctClass:
//         feedbackChoice === "correct"
//           ? result.predictedClass
//           : correctClass,
//     };

//     try {
//       setFeedbackLoading(true);
//       setFeedbackMessage("");

//       const response =
//         await submitFeedback(feedbackData);

//       setFeedbackSubmitted(true);

//       setFeedbackMessage(
//         response.message ||
//           "Feedback and image saved successfully."
//       );
//     } catch (error) {
//       setFeedbackMessage(
//         error.message ||
//           "Unable to save feedback. Please try again."
//       );
//     } finally {
//       setFeedbackLoading(false);
//     }
//   };

//   const openPredictionPage = () => {
//     setShowAdminDashboard(false);
//   };

//   const openAdminDashboard = () => {
//     setShowAdminDashboard(true);
//   };

//   const isPure =
//     result?.status === "Pure";
//     return (
//     <div className="fullscreen-app">
//       <header className="top-navbar">
//         <div className="nav-brand">
//           <div className="brand-dot" />

//           <span className="brand-title">
//             OilDetect Pro
//           </span>

//           <span className="brand-tag">
//             Vision Transformer AI
//           </span>
//         </div>

//         <div className="nav-links">
//           <button
//             type="button"
//             className={`nav-link ${
//               !showAdminDashboard ? "active" : ""
//             }`}
//             onClick={openPredictionPage}
//           >
//             Prediction
//           </button>

//           <button
//             type="button"
//             className={`nav-link ${
//               showAdminDashboard ? "active" : ""
//             }`}
//             onClick={openAdminDashboard}
//           >
//             Admin Dashboard
//           </button>
//         </div>

//         <div className="nav-status">
//           <span className="status-indicator" />
//           Engine Online
//         </div>
//       </header>

//       {showAdminDashboard ? (
//         <AdminFeedbackDashboard />
//       ) : (
//         <main className="dashboard-body">
//           <section className="dashboard-card upload-card">
//             <div className="card-title-group">
//               <span className="step-tag">
//                 01
//               </span>

//               <div>
//                 <h2>Sample Input</h2>

//                 <p>
//                   Upload an oil sample image for
//                   visual purity analysis.
//                 </p>
//               </div>
//             </div>

//             <div className="upload-wrapper">
//               <ImageUpload
//                 image={image}
//                 preview={preview}
//                 setImage={setImage}
//                 setPreview={setPreview}
//               />
//             </div>

//             {error && (
//               <div className="error-toast">
//                 {error}
//               </div>
//             )}

//             <div className="card-actions">
//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={handlePredict}
//                 disabled={!image || loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="btn-spinner" />
//                     Analyzing Sample...
//                   </>
//                 ) : (
//                   "Run Purity Check"
//                 )}
//               </button>

//               {image && (
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={handleReset}
//                   disabled={loading}
//                 >
//                   Clear
//                 </button>
//               )}
//             </div>
//           </section>

//           <section className="dashboard-card result-card">
//             <div className="card-title-group">
//               <span className="step-tag">
//                 02
//               </span>

//               <div>
//                 <h2>Diagnostic Metrics</h2>

//                 <p>
//                   View the real-time AI evaluation
//                   results.
//                 </p>
//               </div>
//             </div>

//             {!result && !loading && (
//               <div className="empty-state-view">
//                 <div className="empty-icon-circle">
//                   💧
//                 </div>

//                 <h3>No Active Sample</h3>

//                 <p>
//                   Upload an image and click Run Purity
//                   Check to view the result.
//                 </p>
//               </div>
//             )}

//             {loading && (
//               <div className="loading-state-view">
//                 <div className="pulse-loader" />

//                 <h3>Analyzing Sample</h3>

//                 <p>
//                   The neural network is processing the
//                   uploaded image.
//                 </p>
//               </div>
//             )}

//             {result && !loading && (
//               <div className="result-display">
//                 <div
//                   className={`verdict-banner ${
//                     isPure
//                       ? "pure"
//                       : "adulterated"
//                   }`}
//                 >
//                   <div className="verdict-icon">
//                     {isPure ? "✓" : "!"}
//                   </div>

//                   <div>
//                     <span className="verdict-subtitle">
//                       Visual Quality Analysis
//                     </span>

//                     <h3>
//                       {result.status} Sample
//                     </h3>

//                     <p>
//                       {result.details ||
//                         "The sample was analyzed successfully."}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="stats-grid">
//                   <div className="stat-item">
//                     <span className="stat-label">
//                       Oil Category
//                     </span>

//                     <span className="stat-value">
//                       {result.oilType || "Unknown"}
//                     </span>
//                   </div>

//                   <div className="stat-item">
//                     <span className="stat-label">
//                       Predicted Sub-Type
//                     </span>

//                     <span className="stat-value">
//                       {result.predictedClass}
//                     </span>
//                   </div>

//                   <div className="stat-item">
//                     <span className="stat-label">
//                       Adulteration Level
//                     </span>

//                     <span className="stat-value">
//                       {result.adulterationPercentage ?? 0}%
//                     </span>
//                   </div>

//                   <div className="stat-item">
//                     <span className="stat-label">
//                       Sample File
//                     </span>

//                     <span className="stat-value">
//                       {result.fileName || image?.name}
//                     </span>
//                   </div>
//                 </div>

//                 {result.topPredictions?.length > 0 && (
//                   <div className="match-list-box">
//                     <h4>Top Structural Matches</h4>

//                     <div className="match-tags">
//                       {result.topPredictions.map(
//                         (prediction, index) => (
//                           <span
//                             key={`${prediction.className}-${index}`}
//                             className="match-tag"
//                           >
//                             {prediction.className}
//                           </span>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 )}
//                                 <div className="feedback-box">
//                   {!feedbackSubmitted ? (
//                     <>
//                       <div className="feedback-heading">
//                         <h4>
//                           Was this prediction correct?
//                         </h4>

//                         <p>
//                           Verified feedback can help improve
//                           future versions of the model.
//                         </p>
//                       </div>

//                       <div className="feedback-choice-row">
//                         <button
//                           type="button"
//                           className={`feedback-choice correct-choice ${
//                             feedbackChoice === "correct"
//                               ? "selected"
//                               : ""
//                           }`}
//                           onClick={() =>
//                             handleFeedbackChoice("correct")
//                           }
//                           disabled={feedbackLoading}
//                         >
//                           ✓ Correct
//                         </button>

//                         <button
//                           type="button"
//                           className={`feedback-choice incorrect-choice ${
//                             feedbackChoice === "incorrect"
//                               ? "selected"
//                               : ""
//                           }`}
//                           onClick={() =>
//                             handleFeedbackChoice("incorrect")
//                           }
//                           disabled={feedbackLoading}
//                         >
//                           ✕ Incorrect
//                         </button>
//                       </div>

//                       {feedbackChoice === "incorrect" && (
//                         <div className="correct-class-field">
//                           <label htmlFor="correctClass">
//                             Select the correct class
//                           </label>

//                           <select
//                             id="correctClass"
//                             value={correctClass}
//                             onChange={(event) =>
//                               setCorrectClass(event.target.value)
//                             }
//                             disabled={feedbackLoading}
//                           >
//                             <option value="">
//                               Choose the correct class
//                             </option>

//                             {OIL_CLASSES.filter(
//                               (className) =>
//                                 className !== result.predictedClass
//                             ).map((className) => (
//                               <option
//                                 value={className}
//                                 key={className}
//                               >
//                                 {className}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       )}

//                       {feedbackMessage && (
//                         <p className="feedback-error">
//                           {feedbackMessage}
//                         </p>
//                       )}

//                       {feedbackChoice && (
//                         <button
//                           type="button"
//                           className="submit-feedback-btn"
//                           onClick={handleFeedbackSubmit}
//                           disabled={feedbackLoading}
//                         >
//                           {feedbackLoading
//                             ? "Saving Feedback..."
//                             : "Submit Feedback"}
//                         </button>
//                       )}
//                     </>
//                   ) : (
//                     <div className="feedback-success">
//                       <div className="feedback-success-icon">
//                         ✓
//                       </div>

//                       <div>
//                         <h4>Feedback Received</h4>

//                         <p>{feedbackMessage}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </section>
//         </main>
//       )}
//     </div>
//   );
// }

// export default App;















































import { useState } from "react";
import "./App.css";

import ImageUpload from "./components/ImageUpload";
import AdminFeedbackDashboard from "./components/AdminFeedbackDashboard";

import { predictOil } from "./services/predictionService";
import { submitFeedback } from "./services/feedbackService";

const OIL_CLASSES = [
  "Mustard_100_Palm",
  "Mustard_20_Palm",
  "Mustard_40_Palm",
  "Mustard_60_Palm",
  "Mustard_80_Palm",

  "Peanut_100_Palm",
  "Peanut_20_Palm",
  "Peanut_40_Palm",
  "Peanut_60_Palm",
  "Peanut_80_Palm",

  "Pure_Mustard",
  "Pure_Peanut",
  "Pure_Soyabean",
  "Pure_Sunflower",

  "Soyabean_100_Palm",
  "Soyabean_20_Palm",
  "Soyabean_40_Palm",
  "Soyabean_60_Palm",
  "Soyabean_80_Palm",

  "Sunflower_100_Palm",
  "Sunflower_20_Palm",
  "Sunflower_40_Palm",
  "Sunflower_60_Palm",
  "Sunflower_80_Palm",
];

function App() {
  const [showAdminDashboard, setShowAdminDashboard] =
    useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [feedbackChoice, setFeedbackChoice] =
    useState("");

  const [correctClass, setCorrectClass] =
    useState("");

  const [feedbackSubmitted, setFeedbackSubmitted] =
    useState(false);

  const [feedbackMessage, setFeedbackMessage] =
    useState("");

  const [feedbackLoading, setFeedbackLoading] =
    useState(false);

  const resetFeedback = () => {
    setFeedbackChoice("");
    setCorrectClass("");
    setFeedbackSubmitted(false);
    setFeedbackMessage("");
    setFeedbackLoading(false);
  };

  const handlePredict = async () => {
    if (!image) {
      setError(
        "Please select an oil sample image."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      resetFeedback();

      const predictionResult =
        await predictOil(image);

      setResult(predictionResult);
    } catch (error) {
      setError(
        error.message ||
          "Unable to analyze the image. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");
    setResult(null);
    setError("");

    resetFeedback();
  };

  const handleFeedbackChoice = (choice) => {
    setFeedbackChoice(choice);
    setCorrectClass("");
    setFeedbackMessage("");
  };

  const handleFeedbackSubmit = async () => {
    if (!result || !image) {
      setFeedbackMessage(
        "The prediction image is not available."
      );

      return;
    }

    if (!feedbackChoice) {
      setFeedbackMessage(
        "Please select Correct or Incorrect."
      );

      return;
    }

    if (
      feedbackChoice === "incorrect" &&
      !correctClass
    ) {
      setFeedbackMessage(
        "Please select the correct class."
      );

      return;
    }

    const feedbackData = {
      image,

      fileName:
        result.fileName || image.name,

      predictedClass:
        result.predictedClass,

      isCorrect:
        feedbackChoice === "correct",

      correctClass:
        feedbackChoice === "correct"
          ? result.predictedClass
          : correctClass,
    };

    try {
      setFeedbackLoading(true);
      setFeedbackMessage("");

      const response =
        await submitFeedback(feedbackData);

      setFeedbackSubmitted(true);

      setFeedbackMessage(
        response.message ||
          "Feedback and image saved successfully."
      );
    } catch (error) {
      setFeedbackMessage(
        error.message ||
          "Unable to save feedback. Please try again."
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  const openPredictionPage = () => {
    setShowAdminDashboard(false);
  };

  const ADMIN_PASSWORD = "admin7248973985";

  const openAdminDashboard = () => {
    const enteredPassword = window.prompt(
      "Enter the admin password"
    );

    if (enteredPassword === null) {
      return;
    }

    if (enteredPassword !== ADMIN_PASSWORD) {
      window.alert(
        "Incorrect password. Access denied."
      );
      return;
    }

    setShowAdminDashboard(true);
  };

  const isPure =
    result?.status === "Pure";
    return (
    <div className="fullscreen-app">
      <header className="top-navbar">
        <div className="nav-brand">
          <div className="brand-dot" />

          <span className="brand-title">
            OilDetect Pro
          </span>

          <span className="brand-tag">
            Vision Transformer AI
          </span>
        </div>

        <div className="nav-links">
          <button
            type="button"
            className={`nav-link ${
              !showAdminDashboard ? "active" : ""
            }`}
            onClick={openPredictionPage}
          >
            Prediction
          </button>

          <button
            type="button"
            className={`nav-link ${
              showAdminDashboard ? "active" : ""
            }`}
            onClick={openAdminDashboard}
          >
            Admin Dashboard
          </button>
        </div>

        <div className="nav-status">
          <span className="status-indicator" />
          Engine Online
        </div>
      </header>

      {showAdminDashboard ? (
        <AdminFeedbackDashboard />
      ) : (
        <main className="dashboard-body">
          <section className="dashboard-card upload-card">
            <div className="card-title-group">
              <span className="step-tag">
                01
              </span>

              <div>
                <h2>Sample Input</h2>

                <p>
                  Upload an oil sample image for
                  visual purity analysis.
                </p>
              </div>
            </div>

            <div className="upload-wrapper">
              <ImageUpload
                image={image}
                preview={preview}
                setImage={setImage}
                setPreview={setPreview}
              />
            </div>

            {error && (
              <div className="error-toast">
                {error}
              </div>
            )}

            <div className="card-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePredict}
                disabled={!image || loading}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner" />
                    Analyzing Sample...
                  </>
                ) : (
                  "Run Purity Check"
                )}
              </button>

              {image && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Clear
                </button>
              )}
            </div>
          </section>

          <section className="dashboard-card result-card">
            <div className="card-title-group">
              <span className="step-tag">
                02
              </span>

              <div>
                <h2>Diagnostic Metrics</h2>

                <p>
                  View the real-time AI evaluation
                  results.
                </p>
              </div>
            </div>

            {!result && !loading && (
              <div className="empty-state-view">
                <div className="empty-icon-circle">
                  💧
                </div>

                <h3>No Active Sample</h3>

                <p>
                  Upload an image and click Run Purity
                  Check to view the result.
                </p>
              </div>
            )}

            {loading && (
              <div className="loading-state-view">
                <div className="pulse-loader" />

                <h3>Analyzing Sample</h3>

                <p>
                  The neural network is processing the
                  uploaded image.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="result-display">
                <div
                  className={`verdict-banner ${
                    isPure
                      ? "pure"
                      : "adulterated"
                  }`}
                >
                  <div className="verdict-icon">
                    {isPure ? "✓" : "!"}
                  </div>

                  <div>
                    <span className="verdict-subtitle">
                      Visual Quality Analysis
                    </span>

                    <h3>
                      {result.status} Sample
                    </h3>

                    <p>
                      {result.details ||
                        "The sample was analyzed successfully."}
                    </p>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">
                      Oil Category
                    </span>

                    <span className="stat-value">
                      {result.oilType || "Unknown"}
                    </span>
                  </div>

                  <div className="stat-item">
                    <span className="stat-label">
                      Predicted Sub-Type
                    </span>

                    <span className="stat-value">
                      {result.predictedClass}
                    </span>
                  </div>

                  <div className="stat-item">
                    <span className="stat-label">
                      Adulteration Level
                    </span>

                    <span className="stat-value">
                      {result.adulterationPercentage ?? 0}%
                    </span>
                  </div>

                  <div className="stat-item">
                    <span className="stat-label">
                      Sample File
                    </span>

                    <span className="stat-value">
                      {result.fileName || image?.name}
                    </span>
                  </div>
                </div>

                {result.topPredictions?.length > 0 && (
                  <div className="match-list-box">
                    <h4>Top Structural Matches</h4>

                    <div className="match-tags">
                      {result.topPredictions.map(
                        (prediction, index) => (
                          <span
                            key={`${prediction.className}-${index}`}
                            className="match-tag"
                          >
                            {prediction.className}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
                                <div className="feedback-box">
                  {!feedbackSubmitted ? (
                    <>
                      <div className="feedback-heading">
                        <h4>
                          Was this prediction correct?
                        </h4>

                        <p>
                          Verified feedback can help improve
                          future versions of the model.
                        </p>
                      </div>

                      <div className="feedback-choice-row">
                        <button
                          type="button"
                          className={`feedback-choice correct-choice ${
                            feedbackChoice === "correct"
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleFeedbackChoice("correct")
                          }
                          disabled={feedbackLoading}
                        >
                          ✓ Correct
                        </button>

                        <button
                          type="button"
                          className={`feedback-choice incorrect-choice ${
                            feedbackChoice === "incorrect"
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleFeedbackChoice("incorrect")
                          }
                          disabled={feedbackLoading}
                        >
                          ✕ Incorrect
                        </button>
                      </div>

                      {feedbackChoice === "incorrect" && (
                        <div className="correct-class-field">
                          <label htmlFor="correctClass">
                            Select the correct class
                          </label>

                          <select
                            id="correctClass"
                            value={correctClass}
                            onChange={(event) =>
                              setCorrectClass(event.target.value)
                            }
                            disabled={feedbackLoading}
                          >
                            <option value="">
                              Choose the correct class
                            </option>

                            {OIL_CLASSES.filter(
                              (className) =>
                                className !== result.predictedClass
                            ).map((className) => (
                              <option
                                value={className}
                                key={className}
                              >
                                {className}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {feedbackMessage && (
                        <p className="feedback-error">
                          {feedbackMessage}
                        </p>
                      )}

                      {feedbackChoice && (
                        <button
                          type="button"
                          className="submit-feedback-btn"
                          onClick={handleFeedbackSubmit}
                          disabled={feedbackLoading}
                        >
                          {feedbackLoading
                            ? "Saving Feedback..."
                            : "Submit Feedback"}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="feedback-success">
                      <div className="feedback-success-icon">
                        ✓
                      </div>

                      <div>
                        <h4>Feedback Received</h4>

                        <p>{feedbackMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

export default App;