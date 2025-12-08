import {useState} from "react";
import {login, registerUser} from "../api/auth";

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    async function loginUser(loginStr, password) {
        const data = await login(loginStr, password);
        localStorage.setItem("token", data.token);
        setToken(data.token);
    }

    async function registerNewUser(form) {
        const data = await registerUser(form);
        localStorage.setItem("token", data.token);
        setToken(data.token);
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return {token, loginUser, registerNewUser, logout};
}
