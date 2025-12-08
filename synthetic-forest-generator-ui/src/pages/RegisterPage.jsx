import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
    const { registerNewUser } = useAuth();

    const [form, setForm] = useState({
        login: "",
        password: "",
        email: "",
        firstName: "",
        lastName: ""
    });

    function update(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function submit(e) {
        e.preventDefault();
        await registerNewUser(form);
        window.location.href = "/";
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-8 shadow-lg rounded-lg w-96">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Register</h2>

                <form onSubmit={submit} className="flex flex-col gap-3">
                    <input
                        value={form.login}
                        onChange={e => update("login", e.target.value)}
                        placeholder="Login"
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        type="password"
                        value={form.password}
                        onChange={e => update("password", e.target.value)}
                        placeholder="Password"
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        value={form.email}
                        onChange={e => update("email", e.target.value)}
                        placeholder="Email"
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        value={form.firstName}
                        onChange={e => update("firstName", e.target.value)}
                        placeholder="First name"
                        className="border px-3 py-2 rounded"
                    />
                    <input
                        value={form.lastName}
                        onChange={e => update("lastName", e.target.value)}
                        placeholder="Last name"
                        className="border px-3 py-2 rounded"
                    />

                    <button className="bg-green-600 text-white py-2 rounded">
                        Create account
                    </button>
                </form>

                <button
                    onClick={() => (window.location.href = "/login")}
                    className="mt-4 text-sm text-green-700 underline"
                >
                    Already have an account?
                </button>
            </div>
        </div>
    );
}
