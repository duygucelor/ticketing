import { useState } from "react";
import axios from "axios";

export default ({ method, url, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if(onSuccess){
        onSuccess(response.data)
      }
      return response.data;
    } catch (error) {
      setErrors(
        <div className="alert alert-danger">
          <h3> Error!</h3>
          <ul>
            {error.response.data.errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};
