import axiosClient from "../utils/axiosInstance";

export const runCodeApi = async (
  problemId,
  code,
  language
) => {

  const response = await axiosClient.post(
    `/submission/run/${problemId}`,
    {
      code,
      language,
    }
  );

  return response.data;
};

export const submitCodeApi = async (
  problemId,
  code,
  language
) => {

  const response = await axiosClient.post(
    `/submission/submit/${problemId}`,
    {
      code,
      language,
    }
  );

  return response.data;
};