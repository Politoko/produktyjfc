'use client'

import { useState } from "react";
import produkty from "@/components/produkty.json";

export default function Home() {

  let [product, setProduct] = useState(produkty[0].name);

  const uniqueNames = produkty.map(item => item.subcategory).filter((value, index, self) => self.indexOf(value) === index);   
  

  return (
    <div>
      <div>
        {uniqueNames.map((item, index) => (
          <h1 key={index}>{item}</h1>
        ))}
      </div>
    </div>
  );
}
/*{produkty.map((item, index) => (
          <h1 key={index}>{item.subcategory}</h1>
        ))}*/