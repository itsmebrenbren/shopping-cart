
import { useAtom } from "jotai";
import { useState } from "react";
import { cartAtom } from "../atoms/cartAtom";
import { Button, Card, Table, Modal } from "react-bootstrap";

export default function Checkout() {
  const [cartState, setCartState] = useAtom(cartAtom);
  const [showModal, setShowModal] = useState(false);

  // Calculate the total cost
  const totalCost = cartState.reduce((total, item) => total + item.cost * item.quantity, 0);

  // Handle checkout
  const handleCheckout = () => {
    setCartState([]); // Clear the cart
    setShowModal(true); // Show success message
  };

  // Close the modal
  const handleClose = () => setShowModal(false);

  return (
    <Card>
      <Card.Body>
        <Card.Title className="title-text">Checkout</Card.Title>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {cartState.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.cost * item.quantity}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">Total</td>
              <td>${totalCost}</td>
            </tr>
          </tbody>
        </Table>
        <Button variant="primary" onClick={handleCheckout}>Checkout</Button>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className="title-text">Congrats!</Modal.Title>
          </Modal.Header>
          <Modal.Body>You have successfully checked out!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Thank you
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
}
