const BASE_URL = 'http://localhost:4000/api';

async function postRequest(url, userData, token) {
  try {
    const response = await fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      let message;
      if (data.error) {
        message = data.error;
      } else {
        message = response;
      }
      return { error: true, message };
    }

    return data;
  } catch (error) {
    console.error(error.message);
  }
}

async function getRequest(url, token) {
  try {
    const response = await fetch(url, {
      method: 'get',
      Authorization: `Bearer ${token}`,
    });
    const data = await response.json();

    if (!response.ok) {
      let message = 'An error occurred!';
      if (data?.error) {
        message = data.error;
      }
      return message;
    }

    return data;
  } catch (error) {
    console.error(error.message);
  }
}

async function updateRequest(url, userData) {
  try {
    const response = await fetch(url, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      let message;
      if (data.error) {
        message = data.error;
      }
      console.error(response.status);
      return message;
    }
    return data;
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteRequest(url, token) {
  try {
    const response = await fetch(url, {
      method: 'delete',
      Authorization: `Bearer ${token}`,
    });

    const data = await response.json();

    if (!response.ok) {
      let message;

      if (data.error) {
        message = data.error;
      }
      return message;
    }

    return data;
  } catch (error) {
    console.error(error.message);
  }
}

export { BASE_URL, postRequest, getRequest, updateRequest, deleteRequest };
