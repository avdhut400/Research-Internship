// import { useEffect, useMemo, useState } from "react";

// import {
//   deleteFeedbackRecord,
//   getFeedbackList,
//   updateFeedbackStatus,
// } from "../services/adminFeedbackService";

// function AdminFeedbackDashboard() {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoadingId, setActionLoadingId] =
//     useState("");
//   const [error, setError] = useState("");
//   const [statusFilter, setStatusFilter] =
//     useState("all");

//   const loadFeedback = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await getFeedbackList();

//       setFeedbackList(response.feedback || []);
//     } catch (error) {
//       setError(
//         error.message ||
//           "Feedback list load karta aali nahi."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadFeedback();
//   }, []);

//   const filteredFeedback = useMemo(() => {
//     if (statusFilter === "all") {
//       return feedbackList;
//     }

//     return feedbackList.filter(
//       (feedback) =>
//         feedback.status === statusFilter
//     );
//   }, [feedbackList, statusFilter]);

//   const summary = useMemo(() => {
//     return {
//       total: feedbackList.length,

//       pending: feedbackList.filter(
//         (feedback) =>
//           feedback.status ===
//           "pending-verification"
//       ).length,

//       approved: feedbackList.filter(
//         (feedback) =>
//           feedback.status === "approved"
//       ).length,

//       rejected: feedbackList.filter(
//         (feedback) =>
//           feedback.status === "rejected"
//       ).length,
//     };
//   }, [feedbackList]);

//   const handleStatusUpdate = async (
//     feedbackId,
//     status
//   ) => {
//     try {
//       setActionLoadingId(feedbackId);
//       setError("");

//       const response =
//         await updateFeedbackStatus(
//           feedbackId,
//           status
//         );

//       setFeedbackList((currentList) =>
//         currentList.map((feedback) =>
//           feedback._id === feedbackId
//             ? response.feedback
//             : feedback
//         )
//       );
//     } catch (error) {
//       setError(
//         error.message ||
//           "Feedback status not updated."
//       );
//     } finally {
//       setActionLoadingId("");
//     }
//   };

//   const handleDelete = async (feedbackId) => {
//     const shouldDelete = window.confirm(
//       "real are you sur"
//     );

//     if (!shouldDelete) {
//       return;
//     }

//     try {
//       setActionLoadingId(feedbackId);
//       setError("");

//       await deleteFeedbackRecord(feedbackId);

//       setFeedbackList((currentList) =>
//         currentList.filter(
//           (feedback) =>
//             feedback._id !== feedbackId
//         )
//       );
//     } catch (error) {
//       setError(
//         error.message ||
//           "Feedback delete karta aala nahi."
//       );
//     } finally {
//       setActionLoadingId("");
//     }
//   };

//   const formatDate = (dateValue) => {
//     if (!dateValue) {
//       return "Unknown";
//     }

//     return new Date(dateValue).toLocaleString(
//       "en-IN",
//       {
//         dateStyle: "medium",
//         timeStyle: "short",
//       }
//     );
//   };

//   return (
//     <section className="admin-feedback-page">
//       <div className="admin-feedback-header">
//         <div>
//           <span className="admin-eyebrow">
//             Model Improvement
//           </span>

//           <h1>Feedback Verification</h1>

//           <p>
//             Review user-submitted samples before
//             using them for model retraining.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="admin-refresh-button"
//           onClick={loadFeedback}
//           disabled={loading}
//         >
//           {loading ? "Refreshing..." : "Refresh"}
//         </button>
//       </div>

//       <div className="admin-summary-grid">
//         <button
//           type="button"
//           className={`admin-summary-card ${
//             statusFilter === "all"
//               ? "active"
//               : ""
//           }`}
//           onClick={() => setStatusFilter("all")}
//         >
//           <span>Total Feedback</span>
//           <strong>{summary.total}</strong>
//         </button>

//         <button
//           type="button"
//           className={`admin-summary-card ${
//             statusFilter ===
//             "pending-verification"
//               ? "active"
//               : ""
//           }`}
//           onClick={() =>
//             setStatusFilter(
//               "pending-verification"
//             )
//           }
//         >
//           <span>Pending</span>
//           <strong>{summary.pending}</strong>
//         </button>

//         <button
//           type="button"
//           className={`admin-summary-card ${
//             statusFilter === "approved"
//               ? "active"
//               : ""
//           }`}
//           onClick={() =>
//             setStatusFilter("approved")
//           }
//         >
//           <span>Approved</span>
//           <strong>{summary.approved}</strong>
//         </button>

//         <button
//           type="button"
//           className={`admin-summary-card ${
//             statusFilter === "rejected"
//               ? "active"
//               : ""
//           }`}
//           onClick={() =>
//             setStatusFilter("rejected")
//           }
//         >
//           <span>Rejected</span>
//           <strong>{summary.rejected}</strong>
//         </button>
//       </div>

//       {error && (
//         <div className="admin-error-message">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="admin-loading-state">
//           <div className="admin-loader" />

//           <h3>Loading feedback</h3>

//           <p>
//             Fetching records from the backend.
//           </p>
//         </div>
//       ) : filteredFeedback.length === 0 ? (
//         <div className="admin-empty-state">
//           <h3>No feedback found</h3>

//           <p>
//             Selected status sathi feedback available
//             nahi.
//           </p>
//         </div>
//       ) : (
//         <div className="admin-feedback-grid">
//           {filteredFeedback.map((feedback) => {
//             const actionLoading =
//               actionLoadingId === feedback._id;

//             return (
//               <article
//                 className="admin-feedback-card"
//                 key={feedback._id}
//               >
//                 <div className="admin-image-wrapper">
//                   <img
//                     src={feedback.imageUrl}
//                     alt={
//                       feedback.originalFileName ||
//                       "Oil sample feedback"
//                     }
//                   />

//                   <span
//                     className={`admin-status-badge status-${feedback.status}`}
//                   >
//                     {feedback.status}
//                   </span>
//                 </div>

//                 <div className="admin-card-content">
//                   <div className="admin-card-title">
//                     <div>
//                       <span>Sample file</span>

//                       <h3>
//                         {feedback.originalFileName}
//                       </h3>
//                     </div>

//                     <button
//                       type="button"
//                       className="admin-delete-button"
//                       onClick={() =>
//                         handleDelete(feedback._id)
//                       }
//                       disabled={actionLoading}
//                     >
//                       Delete
//                     </button>
//                   </div>

//                   <div className="admin-details-grid">
//                     <div>
//                       <span>Predicted Class</span>
//                       <strong>
//                         {feedback.predictedClass}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Correct Class</span>
//                       <strong>
//                         {feedback.correctClass}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>User Feedback</span>
//                       <strong>
//                         {feedback.isCorrect
//                           ? "Correct"
//                           : "Incorrect"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Submitted At</span>
//                       <strong>
//                         {formatDate(
//                           feedback.createdAt
//                         )}
//                       </strong>
//                     </div>
//                   </div>

//                   <div className="admin-card-actions">
//                     <button
//                       type="button"
//                       className="admin-approve-button"
//                       onClick={() =>
//                         handleStatusUpdate(
//                           feedback._id,
//                           "approved"
//                         )
//                       }
//                       disabled={
//                         actionLoading ||
//                         feedback.status ===
//                           "approved"
//                       }
//                     >
//                       {actionLoading
//                         ? "Updating..."
//                         : "Approve"}
//                     </button>

//                     <button
//                       type="button"
//                       className="admin-reject-button"
//                       onClick={() =>
//                         handleStatusUpdate(
//                           feedback._id,
//                           "rejected"
//                         )
//                       }
//                       disabled={
//                         actionLoading ||
//                         feedback.status ===
//                           "rejected"
//                       }
//                     >
//                       {actionLoading
//                         ? "Updating..."
//                         : "Reject"}
//                     </button>

//                     <button
//                       type="button"
//                       className="admin-pending-button"
//                       onClick={() =>
//                         handleStatusUpdate(
//                           feedback._id,
//                           "pending-verification"
//                         )
//                       }
//                       disabled={
//                         actionLoading ||
//                         feedback.status ===
//                           "pending-verification"
//                       }
//                     >
//                       Mark Pending
//                     </button>
//                   </div>
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }

// export default AdminFeedbackDashboard;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  deleteFeedbackRecord,
  getFeedbackList,
  updateFeedbackStatus,
} from "../services/adminFeedbackService";

function AdminFeedbackDashboard() {
  const navigate = useNavigate();

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login", {
      replace: true,
    });
  };

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const adminToken = getAdminToken();

      if (!adminToken) {
        handleUnauthorized();
        return;
      }

      const response = await getFeedbackList(adminToken);

      setFeedbackList(response.feedback || []);
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        error.message ||
          "Unable to load the feedback list."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const filteredFeedback = useMemo(() => {
    if (statusFilter === "all") {
      return feedbackList;
    }

    return feedbackList.filter(
      (feedback) => feedback.status === statusFilter
    );
  }, [feedbackList, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: feedbackList.length,

      pending: feedbackList.filter(
        (feedback) =>
          feedback.status === "pending-verification"
      ).length,

      approved: feedbackList.filter(
        (feedback) => feedback.status === "approved"
      ).length,

      rejected: feedbackList.filter(
        (feedback) => feedback.status === "rejected"
      ).length,
    };
  }, [feedbackList]);

  const handleStatusUpdate = async (
    feedbackId,
    status
  ) => {
    try {
      setActionLoadingId(feedbackId);
      setError("");

      const adminToken = getAdminToken();

      if (!adminToken) {
        handleUnauthorized();
        return;
      }

      const response = await updateFeedbackStatus(
        feedbackId,
        status,
        adminToken
      );

      setFeedbackList((currentList) =>
        currentList.map((feedback) =>
          feedback._id === feedbackId
            ? response.feedback
            : feedback
        )
      );
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        error.message ||
          "Unable to update feedback status."
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDelete = async (feedbackId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setActionLoadingId(feedbackId);
      setError("");

      const adminToken = getAdminToken();

      if (!adminToken) {
        handleUnauthorized();
        return;
      }

      await deleteFeedbackRecord(
        feedbackId,
        adminToken
      );

      setFeedbackList((currentList) =>
        currentList.filter(
          (feedback) => feedback._id !== feedbackId
        )
      );
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        error.message ||
          "Unable to delete the feedback."
      );
    } finally {
      setActionLoadingId("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login", {
      replace: true,
    });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Unknown";
    }

    return new Date(dateValue).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  return (
    <section className="admin-feedback-page">
      <div className="admin-feedback-header">
        <div>
          <span className="admin-eyebrow">
            Model Improvement
          </span>

          <h1>Feedback Verification</h1>

          <p>
            Review user-submitted samples before using
            them for model retraining.
          </p>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadFeedback}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-summary-grid">
        <button
          type="button"
          className={`admin-summary-card ${
            statusFilter === "all" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("all")}
        >
          <span>Total Feedback</span>
          <strong>{summary.total}</strong>
        </button>

        <button
          type="button"
          className={`admin-summary-card ${
            statusFilter === "pending-verification"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("pending-verification")
          }
        >
          <span>Pending</span>
          <strong>{summary.pending}</strong>
        </button>

        <button
          type="button"
          className={`admin-summary-card ${
            statusFilter === "approved"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("approved")
          }
        >
          <span>Approved</span>
          <strong>{summary.approved}</strong>
        </button>

        <button
          type="button"
          className={`admin-summary-card ${
            statusFilter === "rejected"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setStatusFilter("rejected")
          }
        >
          <span>Rejected</span>
          <strong>{summary.rejected}</strong>
        </button>
      </div>

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-loading-state">
          <div className="admin-loader" />

          <h3>Loading feedback</h3>

          <p>
            Fetching records from the backend.
          </p>
        </div>
      ) : filteredFeedback.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No feedback found</h3>

          <p>
            No feedback is available for the selected
            status.
          </p>
        </div>
      ) : (
        <div className="admin-feedback-grid">
          {filteredFeedback.map((feedback) => {
            const actionLoading =
              actionLoadingId === feedback._id;

            return (
              <article
                className="admin-feedback-card"
                key={feedback._id}
              >
                <div className="admin-image-wrapper">
                  <img
                    src={feedback.imageUrl}
                    alt={
                      feedback.originalFileName ||
                      "Oil sample feedback"
                    }
                  />

                  <span
                    className={`admin-status-badge status-${feedback.status}`}
                  >
                    {feedback.status}
                  </span>
                </div>

                <div className="admin-card-content">
                  <div className="admin-card-title">
                    <div>
                      <span>Sample file</span>

                      <h3>
                        {feedback.originalFileName}
                      </h3>
                    </div>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() =>
                        handleDelete(feedback._id)
                      }
                      disabled={actionLoading}
                    >
                      Delete
                    </button>
                  </div>

                  <div className="admin-details-grid">
                    <div>
                      <span>Predicted Class</span>

                      <strong>
                        {feedback.predictedClass}
                      </strong>
                    </div>

                    <div>
                      <span>Correct Class</span>

                      <strong>
                        {feedback.correctClass}
                      </strong>
                    </div>

                    <div>
                      <span>User Feedback</span>

                      <strong>
                        {feedback.isCorrect
                          ? "Correct"
                          : "Incorrect"}
                      </strong>
                    </div>

                    <div>
                      <span>Submitted At</span>

                      <strong>
                        {formatDate(
                          feedback.createdAt
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-card-actions">
                    <button
                      type="button"
                      className="admin-approve-button"
                      onClick={() =>
                        handleStatusUpdate(
                          feedback._id,
                          "approved"
                        )
                      }
                      disabled={
                        actionLoading ||
                        feedback.status === "approved"
                      }
                    >
                      {actionLoading
                        ? "Updating..."
                        : "Approve"}
                    </button>

                    <button
                      type="button"
                      className="admin-reject-button"
                      onClick={() =>
                        handleStatusUpdate(
                          feedback._id,
                          "rejected"
                        )
                      }
                      disabled={
                        actionLoading ||
                        feedback.status === "rejected"
                      }
                    >
                      {actionLoading
                        ? "Updating..."
                        : "Reject"}
                    </button>

                    <button
                      type="button"
                      className="admin-pending-button"
                      onClick={() =>
                        handleStatusUpdate(
                          feedback._id,
                          "pending-verification"
                        )
                      }
                      disabled={
                        actionLoading ||
                        feedback.status ===
                          "pending-verification"
                      }
                    >
                      Mark Pending
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AdminFeedbackDashboard;