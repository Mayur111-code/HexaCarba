import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const { data: response } = await apiFunction(...args);
        setData(response.data);
        return response;
      } catch (err) {
        const message = err.response?.data?.message || 'Something went wrong';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, loading, error, execute };
};

export const useApiWithToast = (apiFunction, successMsg) => {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      try {
        const { data: response } = await apiFunction(...args);
        if (successMsg) toast.success(successMsg);
        return response;
      } catch (err) {
        const message = err.response?.data?.message || 'Something went wrong';
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, successMsg]
  );

  return { loading, execute };
};
