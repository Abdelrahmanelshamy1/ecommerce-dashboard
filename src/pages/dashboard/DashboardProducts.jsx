import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";


export default function DashboardProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [editingID, setEditingID] = useState(null);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((p) => p.id !== id))
            toast.success("Product Deleted Successfully!")
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Couldn't Delete Product!");
        }
    }

    const handleEdit = (product) => {
        setEditingID(product.id);
        setTitle(product.title);
        setPrice(product.price);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingID) {
                const response = await api.put(`/products/${editingID}`, { title, price: Number(price) });
                setProducts(products.map((p) => (p.id === editingID ? response.data : p)));
                toast.success("Changes Saved!");
            } else {
                const response = await api.post("/products/add", { title, price: Number(price) });
                setProducts([response.data, ...products]);
                toast.success("Product Added Successfully!");
            }
            setTitle("");
            setPrice("");
            setEditingID(null);
        } catch (error){
            console.error("Error saving product:", error);
            toast.error("Something went wrong!");
        }
    }

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                let url = "/products";
                const response = await api.get(url);
                setProducts(response.data.products);
            } catch (error){
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        getProducts();
    }, [])

    if (loading) return (
        <div className="loading-box">
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
    return (
        <>
            <DashboardNav />
            <h1 className="page-title">Products Dashboard</h1>
            <div className="dashboard-panel souq-surface">
            <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                    <Col xs={12} md={6}>
                        <Form.Control placeholder="Title" aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <Form.Control type="number" placeholder="Price" aria-label="Price" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="d-grid">
                        <Button type="submit">{editingID ? "Save changes" : "Add product"}</Button>
                    </Col>
                </Row>
            </Form>
            </div>
            <div className="table-surface souq-surface">
            <Table hover striped responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.title}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>{product.category}</td>
                                <td>
                                    <div className="table-actions">
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(product.id)}>
                                        Remove
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(product)}>
                                        Edit
                                    </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </Table>
            </div>
        </>
    )
}