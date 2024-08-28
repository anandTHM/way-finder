// export const DOMAIN = 'https://dashboard.thehousemonk.com/shared-resource/way-finder';
export const DOMAIN = 'https://staging.thehousemonk.com/shared-resource/way-finder';
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
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};
