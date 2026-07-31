// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const submitFeedback = async (feedbackData) => {
//   try {
//     const response = await api.post(
//       "/feedback",
//       feedbackData
//     );

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to submit feedback.",
//       {
//         cause: error,
//       }
//     );
//   }
// };

// export const getAllFeedback = async () => {
//   try {
//     const response = await api.get("/feedback");

//     return response.data;
//   } catch (error) {
//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to load feedback.",
//       {
//         cause: error,
//       }
//     );
//   }
// };

// import axios from "axios";

// const API_URL = "http://localhost:5000/api/feedback";

// export const submitFeedback = async ({
//   image,
//   fileName,
//   predictedClass,
//   isCorrect,
//   correctClass,
// }) => {
//   try {
//     const formData = new FormData();

//     formData.append("image", image);
//     formData.append("fileName", fileName || image.name);
//     formData.append("predictedClass", predictedClass);
//     formData.append("isCorrect", String(isCorrect));

//     if (correctClass) {
//       formData.append("correctClass", correctClass);
//     }

//     const response = await axios.post(
//       API_URL,
//       formData
//     );

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Feedback API error:",
//       error.response?.data || error
//     );

//     throw new Error(
//       error.response?.data?.message ||
//         "Unable to submit feedback.",
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

export const submitFeedback = async ({
  image,
  fileName,
  predictedClass,
  isCorrect,
  correctClass,
}) => {
  try {
    const formData = new FormData();

    formData.append("image", image);
    formData.append("fileName", fileName || image.name);
    formData.append("predictedClass", predictedClass);
    formData.append("isCorrect", String(isCorrect));

    if (correctClass) {
      formData.append("correctClass", correctClass);
    }

    const response = await axios.post(
      API_URL,
      formData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Feedback API error:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.message ||
        "Unable to submit feedback.",
      {
        cause: error,
      }
    );
  }
};