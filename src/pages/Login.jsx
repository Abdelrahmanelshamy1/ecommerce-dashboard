import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
    <Row className="justify-content-center">
    <Col xs={12} sm={10} md={7} lg={5}>
    <div className="Login auth-card souq-surface">
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="login-username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={username} onChange={(event) => setUsername(event.target.value)} required/>
        </Form.Group>
        <Form.Group className="mb-4" controlId="login-password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
        </Form.Group>
        <Button type="submit" disabled={loading} className="w-100" size="lg">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
    </Col>
    </Row>
  );
}