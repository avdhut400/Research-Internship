// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000";

// export const submitFeedback = async (feedbackData) => {
//   try {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/feedback`,
//       feedbackData
//     );

//     return response.data;
//   } catch (error) {
//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.detail ||
//       "Feedback submit zala nahi";

//     throw new Error(message);
//   }
// };

// export const getAllFeedback = async () => {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/api/feedback`
//     );

//     return response.data;
//   } catch (error) {
//     const message =
//       error.response?.data?.message ||
//       error.response?.data?.detail ||
//       "Feedback load zala nahi";

//     throw new Error(message);
//   }
// };




import axios from "axios";

const API_URL = "http://localhost:5000/api/feedback";

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
    formData.append("fileName", fileName);
    formData.append(
      "predictedClass",
      predictedClass
    );
    formData.append(
      "isCorrect",
      String(isCorrect)
    );
    formData.append(
      "correctClass",
      correctClass
    );

    const response = await axios.post(
      API_URL,
      formData
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Unable to submit feedback.",
      {
        cause: error,
      }
    );
  }
};

export const getAllFeedback = async () => {
  try {
    const response = await axios.get(
      API_URL
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Unable to load feedback.",
      {
        cause: error,
      }
    );
  }
};