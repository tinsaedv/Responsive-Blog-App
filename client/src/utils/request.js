const BASE_URL = 'http://localhost:4000/api';

async function postRequest(url, userData) {
  try {
    const response = await fetch(url, {
      method: 'post',
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

async function getRequest(url) {
  try {
    const response = await fetch(url);
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

async function deleteRequest(url) {
  try {
    const response = await fetch(url, {
      method: 'delete',
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
