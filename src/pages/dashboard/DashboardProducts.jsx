import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form } from "react-bootstrap";
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

    if (loading) return <p>Loading...</p>;
    return (
        <>
            <DashboardNav />
            <h1>Products Dashboard</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Control placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Form.Control type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}/>
                <Button type="submit">{editingID ? "Save changes" : "Add product"}</Button>
            </Form>
            <Table>
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
                                    <Button onClick={() => handleDelete(product.id)}>
                                        Remove
                                    </Button>
                                    <Button onClick={() => handleEdit(product)}>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </Table>
        </>
    )
}