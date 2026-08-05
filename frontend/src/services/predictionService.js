


import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/predict`;

export const predictOil = async (imageFile) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axios.post(
      API_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Prediction failed";

    throw new Error(message);
  }
};
