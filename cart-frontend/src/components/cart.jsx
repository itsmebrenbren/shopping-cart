import { useAtom } from "jotai";
import { cartAtom } from "../atoms/cartAtom";
import { productAtom } from "../atoms/productAtom";
import { Card, Table, Button } from "react-bootstrap";

export default function Cart() {
  const [cartState, setCartState] = useAtom(cartAtom);
  const [productState, setProductState] = useAtom(productAtom);

  const removeItemFromCart = (itemId) => {
    const newCart = cartState.reduce((acc, item) => {
      if (item.id === itemId) {
        if (item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    setCartState(newCart);

    // Update the productState to increment the instock value
    const updatedProducts = productState.map(product => {
      if (product.id === itemId) {
        return { ...product, instock: product.instock + 1 };
      }
      return product;
    });
    setProductState(updatedProducts);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="title-text">Cart</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartState.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <Button variant="danger" onClick={() => removeItemFromCart(item.id)}>Remove Item</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

