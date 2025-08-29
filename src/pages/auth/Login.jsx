import { useState } from "react";
import { FiLock, FiLogIn, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Button } from "react-bootstrap";

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //const { mutate: login, isLoading } = useLogin();
    const isLoading = false
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.log("Login");
        navigate("/")
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Icono circular encima */}
                <div className="login-icon">
                    <FiUser size={32} />
                </div>
                <h2>
                    <FiLogIn /> Iniciar Sesión
                </h2>

                <div className="input-group">
                    <label htmlFor="username">
                        <FiUser /> Usuario
                    </label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Ingresa tu usuario" required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">
                        <FiLock /> Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>

                <Button variant="primary" type="submit" disabled={isLoading}>
                    <FiLogIn /> {isLoading ? "Ingresando..." : "Ingresar"}
                </Button>
            </form>
        </div>
    );
}