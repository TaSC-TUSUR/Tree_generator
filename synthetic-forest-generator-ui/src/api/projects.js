const API_URL = "http://localhost:8080";

function authHeader() {
    return { Authorization: "Bearer " + localStorage.getItem("token") };
}

export async function getProjects() {
    const res = await fetch(`${API_URL}/api/projects/all`, {
        headers: authHeader()
    });
    return await res.json();
}

export async function createProject(dto) {
    const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify(dto)
    });
    return await res.json();
}

export async function updateProject(dto) {
    const res = await fetch(`${API_URL}/api/projects`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader()
        },
        body: JSON.stringify(dto)
    });
    return await res.json();
}

export async function deleteProject(id) {
    await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });
}
