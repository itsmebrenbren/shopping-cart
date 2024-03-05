import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';
import ProductList from './components/products-handler';
import Cart from './components/cart';
import Checkout from './components/checkout';

function App() {
  return (
    <>
      <Container>
        <h1>Shopping Cart</h1>
      </Container>
      <Container>
        <Row>
          <Col>
              <ProductList/>
            </Col>
            <Col>
              <Cart/>
            </Col>
            <Col>
              <Checkout/>
            </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
