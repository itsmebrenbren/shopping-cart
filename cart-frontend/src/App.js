import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Col, Container } from 'react-bootstrap';
import ProductList from './components/products-handler';

function App() {
  return (
    <>
      <Container>
        <h1>Shopping Cart</h1>
      </Container>
      <Container>
        <Col>
          <ProductList/>
        </Col>
      </Container>
    </>
  );
}

export default App;
