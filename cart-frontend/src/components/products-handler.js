import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useAtom } from "jotai";
import { productAtom } from "../atoms/productAtom";
import { cartAtom } from "../atoms/cartAtom";
import { Accordion, Card, Button } from 'react-bootstrap';



export default function ProductList() {
  const [ productState, setProductState ] = useAtom(productAtom);
  const [ cartState, setCartState ] = useAtom(cartAtom);

  // Fetch data from our strapi endpoint
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/products`);
      const fetchedData = response.data.data.map(item => ({
        id: item.id,
        ...item.attributes // Spread the attributes into the main object
      }));
      console.log("Data fetched successfully:", fetchedData);
      try {
        setProductState(fetchedData); // Set the fetched data into our global state
      } catch (error) {
        console.error("Error", error);
      }  
      return fetchedData; // Return data for caching by React Query
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Re-throw the error to be caught by React Query
    }
  };
  
  const { isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const updateProductStock = async (id, newStock) => {
    try {
      await axios.put(`http://localhost:1337/api/products/${id}`, {
        data: {
          instock: newStock,
        },
      });
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  const addToCart = async (productToAdd) => {
    const newCart = [...cartState];
    const itemInCart = newCart.find(item => item.id === productToAdd.id);
    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      newCart.push({ ...productToAdd, quantity: 1 });
    }
    setCartState(newCart);
  
    const newStock = productToAdd.instock - 1;
    await updateProductStock(productToAdd.id, newStock); // Update database

    const updatedProducts = productState.map(product => 
      product.id === productToAdd.id ? { ...product, instock: newStock } : product
    );
    setProductState(updatedProducts); // Update product list with new stock number
  };

  const restockProduct = async (productId) => {
    const newStock = productState.find(product => product.id === productId).instock + 10;
    await updateProductStock(productId, newStock); // Update database on restock

    const updatedProducts = productState.map(product => 
      product.id === productId ? { ...product, instock: newStock } : product
    );
    setProductState(updatedProducts); // Update products on restock
  };

  // Render loading or Error
  const renderLoadingOrError = () => {
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.toString()}</div>;
    return null;
  };

  return (
    <>
      <Card> 
        <Card.Body>
          <Card.Title>Products {renderLoadingOrError()}</Card.Title>
          <Accordion defaultActiveKey="null">
            {productState.map((product, index) => (
              <Accordion.Item eventKey={String(index)} key={index}>
                <Accordion.Header>{product.name} - ${product.cost}</Accordion.Header>
                <Accordion.Body>
                  <p>Country: {product.country}</p>
                  <p>In stock: {product.instock}</p>
                  <Button 
                    disabled={product.instock <= 0} 
                    onClick={() => addToCart(product)}>
                      Add to Cart
                  </Button>
                  <Button 
                    disabled={product.instock > 0} 
                    onClick={() => restockProduct(product.id)}>
                      Restock Item
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
      </Card>
    </>
  );
}
