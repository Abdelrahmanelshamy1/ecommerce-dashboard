import { useState } from "react";
import { Form, Button } from "react-bootstrap";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Username:", username);
        console.log("Password:", password);
        const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const data = await response.json();
        console.log("Response:", data);
        localStorage.setItem("token", data.accessToken);
    };

  return (
    <div className="Login">
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </Form.Group>
        <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}