import { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus } from "react-icons/fi";
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
        <Container className="page-container">
        <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
        <div className="auth-card panel">
            <span className="auth-icon"><FiUserPlus aria-hidden="true" /></span>
            <h1>Register</h1>
            <p className="auth-subtitle">Create your Souqly account.</p>
            <Form onSubmit={handleSubmit}>
                <Row className="g-3 mb-4">
                    <Col xs={12} sm={6}>
                        <Form.Group controlId="register-first-name">
                            <Form.Label>First name</Form.Label>
                            <Form.Control autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Form.Group controlId="register-last-name">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="register-email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="register-username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col xs={12}>
                        <Form.Group controlId="register-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" disabled={loading} className="w-100" size="lg">
                    {loading ? "Creating account..." : "Register"}
                </Button>
            </Form>
            <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </div>
        </Col>
        </Row>
        </Container>
    );
}