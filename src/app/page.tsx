'use client'

import { useState } from "react";
import produkty from "@/components/produkty.json";

export default function Home() {

  let [product, setProduct] = useState(produkty[0].name);

  const uniqueNames = produkty.map(item => item.subcategory).filter((value, index, self) => self.indexOf(value) === index);   
  

  return (
    <div className="min-h-screen py-2">
      <div className="">
        {uniqueNames.map((item, index) => (
          <section key={index} className="">
            <h1 key={index}>{item}</h1>
            <div className="flex flex-wrap gap-4">
              {produkty.filter(prod => prod.subcategory === item).map((prod, idx) => (
                <div key={idx} className="p-4 rounded border-1">
                  <h2 className="text-lg font-bold">{prod.code}</h2>
                  <img src="https://placehold.co/150x150" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
/*{produkty.map((item, index) => (
          <h1 key={index}>{item.subcategory}</h1>
        ))}*/