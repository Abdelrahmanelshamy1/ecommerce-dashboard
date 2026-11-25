import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import TableSkeleton from "../../components/TableSkeleton";
import { api } from "../../api/api";
import { Table, Button, Form, Row, Col, Container } from "react-bootstrap";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
    // gender for the add / edit form (separate from the "gender" filter above)
    const [formGender, setFormGender] = useState("");
    const [editingId, setEditingId] = useState(null);

    const handleView = async (id) => {
        const user = users.find((u) => u.id === id);
        // Local users: show our own copy (a GET would return 404 or old data)
        if (user?.isLocal) {
            setSelectedUser(user);
            return;
        }
        try {
            const response = await api.get(`/users/${id}`);
            setSelectedUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            toast.error("Couldn't load user!");
        }
    };

    const handleDelete = async (id) => {
        const user = users.find((u) => u.id === id);
        // Local users don't exist on DummyJSON, so we only remove them from our list
        if (user?.isLocal) {
            setUsers(users.filter((u) => u.id !== id));
            if (selectedUser?.id === id) setSelectedUser(null);
            toast.success("User Deleted!");
            return;
        }
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
            if (selectedUser?.id === id) setSelectedUser(null);
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
        setFormGender(user.gender || "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { firstName, lastName, email, age: Number(age), gender: formGender };
        try {
            let updatedUser = null;
            if (editingId) {
                const user = users.find((u) => u.id === editingId);
                if (user?.isLocal) {
                    // Local user: update it in our list only (no API call)
                    updatedUser = { ...user, ...body };
                } else {
                    const response = await api.put(`/users/${editingId}`, body);
                    updatedUser = { ...response.data, isLocal: true };
                }
                setUsers(users.map((user) => (user.id === editingId ? updatedUser : user)));
                if (selectedUser?.id === editingId) setSelectedUser(updatedUser);
                toast.success("User Updated!");
            } else {
                const response = await api.post("/users/add", body);
                // DummyJSON gives every new user the same id, so we create a unique one
                setUsers([{ ...response.data, id: Date.now(), isLocal: true }, ...users]);
                toast.success("User Added!");
            }
            setFirstName("");
            setLastName("");
            setEmail("");
            setAge("");
            setFormGender("");
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
        <Container className="page-container">
            <DashboardNav />
            <h1 className="page-heading">Users Dashboard</h1>

            <section className="panel form-panel">
            <h2 className="panel-title">{editingId ? `Edit user ${editingId}` : "Add a user"}</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="g-2">
                    <Col xs={12} sm={6} lg={3}>
                        <Form.Control placeholder="First name" aria-label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </Col>
                    <Col xs={12} sm={6} lg={3}>
                        <Form.Control placeholder="Last name" aria-label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </Col>
                    <Col xs={12} sm={6} lg={6}>
                        <Form.Control type="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </Col>
                    <Col xs={6} sm={3} lg={2}>
                        <Form.Control type="number" min="1" placeholder="Age" aria-label="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                    </Col>
                    <Col xs={6} sm={3} lg={3}>
                        <Form.Select aria-label="Gender" value={formGender} onChange={(e) => setFormGender(e.target.value)} required>
                            <option value="" disabled>Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </Form.Select>
                    </Col>
                    <Col xs={12} lg={{ span: 3, offset: 4 }} className="d-grid">
                        <Button type="submit">
                            {editingId ? <><FiSave aria-hidden="true" /> Save Changes</> : <><FiPlus aria-hidden="true" /> Add User</>}
                        </Button>
                    </Col>
                </Row>
            </Form>
            </section>

            {selectedUser && (
                <section className="panel detail-panel">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h2 className="panel-title mb-0">{selectedUser.firstName} {selectedUser.lastName}</h2>
                        <Button variant="light" className="btn-icon" aria-label="Close user details" title="Close" onClick={() => setSelectedUser(null)}>
                            <FiX aria-hidden="true" />
                        </Button>
                    </div>
                    <dl className="detail-list">
                        <div><dt>Username</dt><dd>{selectedUser.username || "—"}</dd></div>
                        <div><dt>Email</dt><dd>{selectedUser.email}</dd></div>
                        <div><dt>Phone</dt><dd>{selectedUser.phone || "—"}</dd></div>
                        <div><dt>Age</dt><dd>{selectedUser.age}</dd></div>
                        <div><dt>Gender</dt><dd className="text-capitalize">{selectedUser.gender || "—"}</dd></div>
                        <div><dt>Birth date</dt><dd>{selectedUser.birthDate || "—"}</dd></div>
                        <div><dt>Address</dt><dd>{selectedUser.address?.address ? `${selectedUser.address.address}, ${selectedUser.address?.city}` : "—"}</dd></div>
                        <div><dt>Company</dt><dd>{selectedUser.company?.name ? `${selectedUser.company.name} (${selectedUser.company?.title})` : "—"}</dd></div>
                    </dl>
                </section>
            )}

            <div className="toolbar">
                <div className="input-icon">
                    <FiSearch aria-hidden="true" />
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
                </div>
                <Form.Select
                    aria-label="Filter by gender"
                    className="toolbar-select"
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
            </div>
            {loading ? (
                <TableSkeleton columns={6} />
            ) : (
                <>
                    <section className="panel table-panel">
                    <Table hover responsive className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr><td colSpan={6} className="text-center text-secondary-muted py-4">No users found.</td></tr>
                            )}
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="text-secondary-muted">{user.id}</td>
                                    <td className="fw-medium">{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td className="text-capitalize">{user.gender}</td>
                                    <td>
                                        <div className="table-actions">
                                        <Button variant="light" className="btn-icon" title="View" aria-label={`View ${user.firstName}`} onClick={() => handleView(user.id)}><FiEye aria-hidden="true" /></Button>
                                        <Button variant="light" className="btn-icon" title="Edit" aria-label={`Edit ${user.firstName}`} onClick={() => handleEdit(user)}><FiEdit2 aria-hidden="true" /></Button>
                                        <Button variant="light" className="btn-icon btn-icon-danger" title="Delete" aria-label={`Delete ${user.firstName}`} onClick={() => handleDelete(user.id)}><FiTrash2 aria-hidden="true" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    </section>
                    {totalPages > 1 && (
                        <nav className="pager" aria-label="Users pages">
                            <Button variant="outline-primary" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                <FiChevronLeft aria-hidden="true" /> Previous
                            </Button>
                            <span className="pager-info">Page {page} of {totalPages}</span>
                            <Button variant="outline-primary" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                Next <FiChevronRight aria-hidden="true" />
                            </Button>
                        </nav>
                    )}
                </>
            )}
        </Container>
    );
}
