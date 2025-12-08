import {useState} from "react";
import {useAuth} from "../hooks/useAuth";

export default function LoginPage() {
    const {loginUser} = useAuth();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    async function submit(e) {
        e.preventDefault();
        await loginUser(login, password);
        window.location.href = "/";
    }

    return (
        <div className="p-10">
            <h2 className="text-2xl mb-3">Login</h2>
            <form onSubmit={submit} className="flex flex-col gap-3 w-64">
                <input value={login} onChange={e => setLogin(e.target.value)} placeholder="login" className="border px-2 py-1"/>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="border px-2 py-1"/>
                <button className="bg-green-600 text-white py-2">Login</button>
            </form>
        </div>
    );
}
