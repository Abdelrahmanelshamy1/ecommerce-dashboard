import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button } from "react-bootstrap";
import toast from "react-hot-toast";


export default function DashboardProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleDelete = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter((p) => p.id !== id))
            toast.success("Product Deleted Successfully!")
        } catch (error) {
            toast.error("Couldn't Delete Product!");
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </Table>
        </>
    )
}