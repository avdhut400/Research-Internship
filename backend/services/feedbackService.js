


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
