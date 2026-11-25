import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form } from "react-bootstrap";
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
            <h1>Users Dashboard</h1>

            <h2>{editingId ? `Edit user ${editingId}` : "Add a user"}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Control placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <Form.Control placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Form.Control type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} required />
                <Button type="submit">{editingId ? "Save Changes" : "Add User"}</Button>
            </Form>

            {selectedUser && (
                <div>
                    <h2>{selectedUser.firstName} {selectedUser.lastName}</h2>
                    <p>Username: {selectedUser.username}</p>
                    <p>Email: {selectedUser.email}</p>
                    <p>Phone: {selectedUser.phone}</p>
                    <p>Age: {selectedUser.age}</p>
                    <p>Gender: {selectedUser.gender}</p>
                    <p>Birth date: {selectedUser.birthDate}</p>
                    <p>Address: {selectedUser.address.address}, {selectedUser.address.city}</p>
                    <p>Company: {selectedUser.company.name} ({selectedUser.company.title})</p>
                    <Button onClick={() => setSelectedUser(null)}>Close</Button>
                </div>
            )}

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
                                        <Button onClick={() => handleView(user.id)}>View</Button>
                                        <Button onClick={() => handleEdit(user)}>Edit</Button>
                                        <Button onClick={() => handleDelete(user.id)}>Delete</Button>
                                    </td>
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