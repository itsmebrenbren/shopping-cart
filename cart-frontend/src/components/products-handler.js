import { useQuery } from "@tanstack/react-query";
import axios from 'axios';
import { useAtom } from "jotai";
import { allProductsAtom } from "../atoms/allProductsAtom";
import { Accordion } from 'react-bootstrap';

export default function ProductList () {
  const [allProductState, setAllProductState] = useAtom(allProductsAtom);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/products`);
      const fetchedData = response.data.data.map(item => item.attributes);
      console.log("Data fetched successfully:", fetchedData);
      try {
        setAllProductState(fetchedData);
        console.log(fetchedData)
      } catch (error) {
        console.error("Error", error);
      }  
      return fetchedData;  // Return data for caching by React Query
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;  // Re-throw the error to be caught by React Query
    }
  };
  
  const { isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Render loading or Error
  const renderLoadingOrError = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    } else if (isError) {
      return <div>Error: {error}</div>;
    }else{
    return ''
    }
  };


  return (
    <Accordion defaultActiveKey="0">
      {allProductState.map((product, index) => (
        <Accordion.Item eventKey={String(index)} key={index}>
          <Accordion.Header>{product.name} - ${product.cost}</Accordion.Header>
          <Accordion.Body>
            <p>Country: {product.country}</p>
            <p>In stock: {product.instock}</p>
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}