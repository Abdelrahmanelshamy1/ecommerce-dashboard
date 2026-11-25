import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import TableSkeleton from "../../components/TableSkeleton";
import { api } from "../../api/api";
import { Table, Button, Form, Row, Col, Container } from "react-bootstrap";
import { FiEdit2, FiTrash2, FiPlus, FiSave } from "react-icons/fi";
import toast from "react-hot-toast";


export default function DashboardProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [editingID, setEditingID] = useState(null);

    const handleDelete = async (id) => {
        const product = products.find((p) => p.id === id);
        // Local items were never saved on DummyJSON, so there is nothing to delete on the server
        if (product?.isLocal) {
            setProducts(products.filter((p) => p.id !== id));
            toast.success("Product Deleted Successfully!");
            return;
        }
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
        const newValues = { title, price: Number(price) };
        try {
            if (editingID) {
                const product = products.find((p) => p.id === editingID);
                if (product?.isLocal) {
                    // Local item: update it in our list only (no API call)
                    setProducts(products.map((p) => (p.id === editingID ? { ...p, ...newValues } : p)));
                } else {
                    const response = await api.put(`/products/${editingID}`, newValues);
                    setProducts(products.map((p) => (p.id === editingID ? { ...response.data, isLocal: true } : p)));
                }
                toast.success("Changes Saved!");
            } else {
                const response = await api.post("/products/add", newValues);
                // DummyJSON returns the same id for every new item, so we give it a unique one
                setProducts([{ ...response.data, id: Date.now(), isLocal: true }, ...products]);
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
        <Container className="page-container">
            <DashboardNav />
            <h1 className="page-heading">Products Dashboard</h1>
            <TableSkeleton columns={5} />
        </Container>
    );
    return (
        <Container className="page-container">
            <DashboardNav />
            <h1 className="page-heading">Products Dashboard</h1>
            <section className="panel form-panel">
            <h2 className="panel-title">{editingID ? `Edit product ${editingID}` : "Add a product"}</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="g-2">
                    <Col xs={12} md={6}>
                        <Form.Control placeholder="Title" aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <Form.Control type="number" min="0" step="0.01" placeholder="Price" aria-label="Price" value={price} onChange={(e) => setPrice(e.target.value)} required/>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="d-grid">
                        <Button type="submit">
                            {editingID ? <><FiSave aria-hidden="true" /> Save changes</> : <><FiPlus aria-hidden="true" /> Add product</>}
                        </Button>
                    </Col>
                </Row>
            </Form>
            </section>
            <section className="panel table-panel">
            <Table hover responsive className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="text-secondary-muted">{product.id}</td>
                                <td className="fw-medium">{product.title}</td>
                                <td>${Number(product.price).toFixed(2)}</td>
                                <td className="text-capitalize">{product.category || "—"}</td>
                                <td>
                                    <div className="table-actions">
                                    <Button variant="light" className="btn-icon" title="Edit" aria-label={`Edit ${product.title}`} onClick={() => handleEdit(product)}>
                                        <FiEdit2 aria-hidden="true" />
                                    </Button>
                                    <Button variant="light" className="btn-icon btn-icon-danger" title="Remove" aria-label={`Remove ${product.title}`} onClick={() => handleDelete(product.id)}>
                                        <FiTrash2 aria-hidden="true" />
                                    </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </Table>
            </section>
        </Container>
    )
}
