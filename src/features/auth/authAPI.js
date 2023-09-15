export async function createUser(userData) {
  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    return { data };
  } catch (error) {
    throw error;
  }
}

export async function checkUser(loginInfo) {
  const email = loginInfo.email;
  const password = loginInfo.password;

  try {
    const response = await fetch("http://localhost:8080/users?email=" + email);
    const data = await response.json();
    console.log({ data });

    if (data.length) {
      if (password === data[0].password) {
        return { data: data[0] };
      } else {
        throw new Error("wrong credentials");
      }
    } else {
      throw new Error("user not found");
    }
  } catch (error) {
    throw error;
  }
}

export function signOut(userId) {
  return { data: "success" };
}
