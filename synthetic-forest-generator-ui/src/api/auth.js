const API_URL = "http://localhost:8080";

export async function login(login, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({login, password})
    });

    if (!res.ok) throw new Error("Login failed");
    return await res.json(); // { token }
}

export async function registerUser(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Register failed");
    return await res.json();
}
