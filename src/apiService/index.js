// export const DOMAIN = 'https://dashboard.thehousemonk.com/shared-resource/way-finder';
// export const DOMAIN = 'https://staging.thehousemonk.com/shared-resource/way-finder';
export const DOMAIN = 'https://dev.thehousemonk.com/shared-resource/way-finder';
// export const DOMAIN = "http://localhost:9000/shared-resource/way-finder";

const buildQueryString = (params) => {
  const queryParams = new URLSearchParams(params);
  return queryParams.toString();
};

export const fetchData = async (endpoint, queryParams = {}) => {
  const url = `${DOMAIN}${endpoint}?${buildQueryString(queryParams)}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Log the status and statusText for debugging
      console.error(`Error ${response.status}: ${response.statusText}`);
      // Throwing an error so it can be caught in the catch block
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error; // This ensures that the calling function can catch the error
  }
};

