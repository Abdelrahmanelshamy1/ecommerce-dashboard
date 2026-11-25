import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form } from "react-bootstrap";

const LIMIT = 10;

export default function DashboardUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState("");
    const [gender, setGender] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            try {
                setLoading(true);
                let url = "/users";
                let params = { limit: LIMIT, skip: (page - 1) * LIMIT };
                if (query) {
                    url = "/users/search";
                    params.q = query;
                } else if (gender) {
                    url = "/users/filter";
                    params.key = "gender";
                    params.value = gender;
                }
                const response = await api.get(url, { params });
                setUsers(response.data.users);
                setTotalPages(Math.ceil(response.data.total / LIMIT));
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, [page, query, gender]);

    return (
        <>
            <DashboardNav />
            <h1>Users Dashboard</h1>
            <Form.Control
                placeholder="Search users..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setGender("");
                    setPage(1);
                }}
            />
            <Form.Select
                value={gender}
                onChange={(e) => {
                    setGender(e.target.value);
                    setQuery("");
                    setPage(1);
                }}
            >
                <option value="">All genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </Form.Select>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {users.length === 0 && <p>No users found.</p>}
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>{user.gender}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {totalPages > 1 && (
                        <>
                            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                Next
                            </Button>
                            <p>Page {page} of {totalPages}</p>
                        </>
                    )}
                </>
            )}
        </>
    );
}