// import axios from "axios";

// const API_URL = "http://localhost:5000/api/feedback";

// export const getFeedbackList = async () => {
//   try {
//     const response = await axios.get(API_URL);

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to load feedback list.",
//       {
//         cause: error,
//       }
//     );
//   }
// };

// export const updateFeedbackStatus = async (
//   feedbackId,
//   status
// ) => {
//   try {
//     const response = await axios.patch(
//       `${API_URL}/${feedbackId}/status`,
//       {
//         status,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to update feedback status.",
//       {
//         cause: error,
//       }
//     );
//   }
// };

// export const deleteFeedbackRecord = async (
//   feedbackId
// ) => {
//   try {
//     const response = await axios.delete(
//       `${API_URL}/${feedbackId}`
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to delete feedback.",
//       {
//         cause: error,
//       }
//     );
//   }
// };





// import axios from "axios";

// const API_URL = `${
//   import.meta.env.VITE_API_URL || "http://localhost:5000"
// }/api/feedback`;

// export const getFeedbackList = async () => {
//   try {
//     const response = await axios.get(API_URL);
//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to load feedback list.",
//       {
//         cause: error,
//       }
//     );
//   }
// };

// export const updateFeedbackStatus = async (
//   feedbackId,
//   status
// ) => {
//   try {
//     const response = await axios.patch(
//       `${API_URL}/${feedbackId}/status`,
//       {
//         status,
//       }
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to update feedback status.",
//       {
//         cause: error,
//       }
//     );
//   }
// };

// export const deleteFeedbackRecord = async (
//   feedbackId
// ) => {
//   try {
//     const response = await axios.delete(
//       `${API_URL}/${feedbackId}`
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to delete feedback.",
//       {
//         cause: error,
//       }
//     );
//   }
// };


import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/feedback`;

const getAdminToken = () => {
  return localStorage.getItem("adminToken");
};

const getAuthConfig = () => {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Admin token not found. Please login again.");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getFeedbackList = async () => {
  try {
    const response = await axios.get(
      API_URL,
      getAuthConfig()
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to load feedback list."
    );
  }
};

export const updateFeedbackStatus = async (
  feedbackId,
  status
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${feedbackId}/status`,
      {
        status,
      },
      getAuthConfig()
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to update feedback status."
    );
  }
};

export const deleteFeedbackRecord = async (
  feedbackId
) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${feedbackId}`,
      getAuthConfig()
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Unable to delete feedback."
    );
  }
};