import { useState } from "react";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { api } from "../api/api";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/authSlice";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
          const response = await api.post("/auth/login", { username, password });
          localStorage.setItem("token", response.data.accessToken)
          dispatch(setUser(response.data));
          toast.success("Login successful!");
          navigate("/");
        } catch (error){
          toast.error("Login failed: " + error.response.data.message);
        } finally {
          setLoading(false);
        }
    };

  return (
    <Container className="page-container">
    <Row className="justify-content-center">
    <Col xs={12} sm={10} md={7} lg={5}>
    <div className="Login auth-card panel">
      <span className="auth-icon"><FiLogIn aria-hidden="true" /></span>
      <h1>Login</h1>
      <p className="auth-subtitle">Sign in to your Souqly account.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login-username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required/>
        </Form.Group>
        <Form.Group className="mb-4" controlId="login-password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
        </Form.Group>
        <Button type="submit" disabled={loading} className="w-100" size="lg">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    </Col>
    </Row>
    </Container>
  );
}