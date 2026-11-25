import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

const LIMIT = 10;

export default function DashboardUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState("");
    const [gender, setGender] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [editingId, setEditingId] = useState(null);

    const handleView = async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error("Couldn't load user!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
            toast.success("User Deleted!");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Couldn't Delete User!");
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setAge(user.age);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { firstName, lastName, email, age: Number(age) };
        try {
            if (editingId) {
                const response = await api.put(`/users/${editingId}`, body);
                setUsers(users.map((user) => (user.id === editingId ? response.data : user)));
                toast.success("User Updated!");
            } else {
                const response = await api.post("/users/add", body);
                setUsers([response.data, ...users]);
                toast.success("User Added!");
            }
            setFirstName("");
            setLastName("");
            setEmail("");
            setAge("");
            setEditingId(null);
        } catch (error) {
            console.error("Error saving user:", error);
            toast.error("Something went wrong!");
        }
    };

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
            <h1 className="page-title">Users Dashboard</h1>

            <div className="dashboard-panel souq-surface">
            <h2>{editingId ? `Edit user ${editingId}` : "Add a user"}</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                    <Col xs={12} sm={6} lg={3}>
                        <Form.Control placeholder="First name" aria-label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <Form.Control placeholder="Last name" aria-label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </Col>
                    <Col xs={12} sm={8} lg={3}>
                        <Form.Control type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Col>
                    <Col xs={12} sm={4} lg={1}>
                        <Form.Control type="number" placeholder="Age" aria-label="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                    </Col>
                    <Col xs={12} lg={2} className="d-grid">
                        <Button type="submit">{editingId ? "Save Changes" : "Add User"}</Button>
                    </Col>
                </Row>
            </Form>
            </div>

            {selectedUser && (
                <div className="dashboard-panel detail-panel souq-surface">
                    <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
                    <Row className="small">
                        <Col xs={12} md={6}>
                            <p className="mb-1">Username: {selectedUser.username}</p>
                            <p className="mb-1">Email: {selectedUser.email}</p>
                            <p className="mb-1">Phone: {selectedUser.phone}</p>
                            <p className="mb-1">Age: {selectedUser.age}</p>
                        </Col>
                        <Col xs={12} md={6}>
                            <p className="mb-1">Gender: {selectedUser.gender}</p>
                            <p className="mb-1">Birth date: {selectedUser.birthDate}</p>
                            <p className="mb-1">Address: {selectedUser.address.address}, {selectedUser.address.city}</p>
                            <p className="mb-1">Company: {selectedUser.company.name} ({selectedUser.company.title})</p>
                        </Col>
                    </Row>
                    <Button variant="outline-secondary" size="sm" className="mt-3" onClick={() => setSelectedUser(null)}>Close</Button>
                </div>
            )}

            <Row className="g-3 mb-3">
            <Col xs={12} sm={8} md={6}>
            <Form.Control
                placeholder="Search users..."
                aria-label="Search users"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setGender("");
                    setPage(1);
                }}
            />
            </Col>
            <Col xs={12} sm={4} md={3}>
            <Form.Select
                aria-label="Gender"
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
            </Col>
            </Row>
            {loading ? (
                <div className="loading-box">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    {users.length === 0 && <p className="text-center text-muted py-4">No users found.</p>}
                    <div className="table-surface souq-surface">
                    <Table hover striped responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Actions</th>
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
                                    <td>
                                        <div className="table-actions">
                                        <Button variant="outline-primary" size="sm" onClick={() => handleView(user.id)}>View</Button>
                                        <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(user)}>Edit</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    </div>
                    {totalPages > 1 && (
                        <div className="pagination-bar">
                            <div className="d-flex justify-content-center gap-2">
                            <Button variant="outline-primary" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button variant="outline-primary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                Next
                            </Button>
                            </div>
                            <p className="text-muted small mt-2 mb-0">Page {page} of {totalPages}</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
}