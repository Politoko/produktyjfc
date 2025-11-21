'use client'

import { useState } from "react";
import produkty from "@/components/produkty.json";
import Image from 'next/image'

export default function Home() {

  const subcategories = Array.from(
    new Set(
      produkty
        .map(p => p.subcategory)
        .filter((s): s is string => Boolean(s && typeof s === 'string'))
    )
  );

  const filteredSubcategories = subcategories.filter(sub =>
    sub.toLowerCase().includes("kontenery") ||
    sub.toLowerCase().includes("zbiorniki")
  );

  const [category, setCategory] = useState(filteredSubcategories[0]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-sky-300 to-sky-800">
      <div className="max-w-7xl w-full min-h-200 bg-white px-10 pt-5 pb-10 relative mx-auto top-10">
        <select className="mb-5 p-2 border-2 border-sky-600 rounded mx-auto block">
          {filteredSubcategories.map((subcategory, index) => {
            const items = produkty.filter(p => p.subcategory === subcategory);
            return (
              <option key={index} value={subcategory} onClick={() => setCategory(subcategory)}>
                {subcategory}
              </option>
            );
          })}
        </select>

        <div
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
          {produkty.filter(p => p.subcategory === category).map((prod, index) => (
              <button
                key={prod.code ?? `${index}`}
                className="
                        w-full max-w-[200px]
                        p-4 rounded border-2 border-sky-600 hover:bg-sky-700 
                        hover:text-white transition cursor-pointer

                      "
                onClick={() => setSelectedProduct(prod)}
              >
                <Image src={"https://jfcpolska.pl" + (prod.images?.[0] ?? "/placeholder.png")} width={100} height={100} quality={25} alt="" className="mx-auto" />

                <h2 className="text-lg font-bold text-center mb-2">
                  {prod.code}
                </h2>
              </button>
          ))}
          
        </div>
      </div>

      {
        selectedProduct && (
          <div className=" fixed left-0 right-0 bottom-0  bg-white shadow-2xl w-full h-full animate-slide-up">
            <div className="grid grid-cols-4 grid-rows-5 gap-3">
              <div className="col-span-2 row-span-5">
                <div className="flex flex-col h-full p-4">

                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
                    {selectedProduct.code}
                  </h2>

                  <p className="text-center mb-4">
                    <b>Kategoria:</b> {selectedProduct.subcategory}
                  </p>

                  <div className="flex flex-col gap-3 mb-6">
                    <h3 className="text-xl font-semibold text-center">Dodatkowe opcje</h3>

                    {selectedProduct.extraEquipment && selectedProduct.extraEquipment.length > 0 ? (
                      selectedProduct.extraEquipment.map((option: string, idx: number) => (
                        <label key={idx} className="flex items-center gap-3">
                          <input type="checkbox" className="w-5 h-5" />
                          {option}
                        </label>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">Brak dodatkowych opcji</p>
                    )}
                  </div>

                  <button
                    className="bg-red-500 text-white px-6 py-3 rounded text-lg mt-auto"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Zamknij
                  </button>
                </div>
              </div>
              <div className="col-span-2 row-span-3 col-start-3">
                <img
                  src="https://placehold.co/200x200"
                  className="mx-auto mb-6 w-full max-w-[250px] object-contain"
                />
              </div>
              <div className="col-span-2 row-span-2 col-start-3 row-start-4">3</div>
            </div>
          </div>
        )
      }
    </div>
  );
}
