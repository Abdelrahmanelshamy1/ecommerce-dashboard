import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await api.post("/users/add", { firstName, lastName, email, username, password });
            toast.success("Account created!");
            navigate("/");
        } catch (error) {
            toast.error("Register failed: " + error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Control placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <Form.Control placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Form.Control placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </Button>
            </Form>
        </div>
    );
}