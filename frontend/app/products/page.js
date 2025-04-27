import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function Products(){
  const productsJson = await fetch("http://localhost:5032/api/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const products = await productsJson.json();

  return (
    <div>
      <h1>Products List</h1>
      <Button>Button</Button>
      <Input />
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}