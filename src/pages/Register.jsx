import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
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
        <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
        <div className="auth-card souq-surface">
            <h1>Register</h1>
            <Form onSubmit={handleSubmit}>
                <Row className="g-3 mb-3">
                    <Col xs={12} sm={6}>
                        <Form.Control placeholder="First name" aria-label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </Col>
                    <Col xs={12} sm={6}>
                        <Form.Control placeholder="Last name" aria-label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </Col>
                    <Col xs={12}>
                        <Form.Control type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Col>
                    <Col xs={12}>
                        <Form.Control placeholder="Username" aria-label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </Col>
                    <Col xs={12}>
                        <Form.Control type="password" placeholder="Password" aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </Col>
                </Row>
                <Button type="submit" disabled={loading} className="w-100" size="lg">
                    {loading ? "Creating account..." : "Register"}
                </Button>
            </Form>
        </div>
        </Col>
        </Row>
    );
}