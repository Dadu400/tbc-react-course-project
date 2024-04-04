"use client";
import { products as staticProducts } from "../../utils/constants";
import Product from "../../components/Product";
import { Search } from "../../components/Search";
import { useState } from "react";
import Sort from "../../components/Sort";

const Products = () => {
  // we need two states for products to keep one unsorted copy of the searched products
  const [products, setProducts] = useState(staticProducts);
  const [searchedProducts, setSearchedProducts] = useState(staticProducts);
  const [sort, setSort] = useState("a-z");
  const [clearSort, setClearSort] = useState(false);
  const [search, setSearch] = useState("");

  const sortProducts = () => {
    if (clearSort) {
      setProducts([...searchedProducts]);
      setClearSort(false);
      return;
    }
    setProducts((_) => {
      setClearSort(true);
      if (sort === "a-z") {
        return [...searchedProducts].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
      }
      if (sort === "z-a") {
        return [...searchedProducts].sort((a, b) =>
          b.title.localeCompare(a.title)
        );
      }
      if (sort === "price-ascending") {
        return [...searchedProducts].sort((a, b) => a.price - b.price);
      }
      if (sort === "price-descending") {
        return [...searchedProducts].sort((a, b) => b.price - a.price);
      }
    });
  };

  const searchProducts = (searchString) => {
    setSearchedProducts(
      [...staticProducts].filter((item) => {
        return item.title.toLowerCase().includes(searchString);
      })
    );
    setProducts(
      [...staticProducts].filter((item) => {
        return item.title.toLowerCase().includes(searchString);
      })
    );
  };

  const handleChange = (e) => {
    setSort(e.target.value);
  };

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        searchProducts(e.target.value);
      }, 500);
    };
  };

  return (
    <section className="products">
      <Search handleSearch={debounce()} search={search} />
      <div className="products-header">
        <h2>products</h2>
        <Sort handleChange={handleChange} sortProducts={sortProducts} />
      </div>
      <div className="products-container">
        {products.map((product) => {
          return <Product key={product.id} product={product} />;
        })}
      </div>
    </section>
  );
};

export default Products;