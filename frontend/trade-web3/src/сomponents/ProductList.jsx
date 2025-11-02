export function ProductList({ products }) {
  return (
    <div className="div mt-10 w-80">
      {products.map((prod) => (
        <div className="product-div" key={prod.product}>
          <p>Name: {prod.product}</p>
          <p className="rightElem">Wei: {prod.price}</p>
        </div>
      ))}
    </div>
  );
}
