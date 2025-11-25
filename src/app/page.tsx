'use client'

import { useState, useMemo, useEffect } from "react";
import produkty from "@/components/produkty.json";
import Image from 'next/image'

export default function Home() {

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMobility, setSelectedMobility] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subcategories = Array.from(
    new Set(
      produkty
        .map(p => p.subcategory)
        .filter((s): s is string => Boolean(s && typeof s === 'string'))
    )
  );

  const filteredSubcategories = subcategories.filter(sub =>
    sub.toLowerCase().includes("zbiorniki") &&
    (sub.toLowerCase().includes("diesel") ||
      sub.toLowerCase().includes("adblue"))
  );

  const showcaseProducts = useMemo(() => {
    const filtered = produkty
      .filter(p => {
        const isInFilteredSubcategories = typeof p.subcategory === 'string' && filteredSubcategories.includes(p.subcategory);
        if (!isInFilteredSubcategories) return false;

        if (selectedCategory && p.subcategory !== selectedCategory) {
          return false;
        }

        if (selectedMobility === "mobilne") {
          return p.code.includes("TT");
        } else if (selectedMobility === "stacjonarne") {
          return !p.code.includes("TT");
        }
        return true;
      });

    if (isClient && !selectedMobility) {
      return filtered.sort(() => Math.random() - 0.5).slice(0, 16);
    }
    return filtered.slice(0, 16);
  }, [selectedCategory, selectedMobility, filteredSubcategories, isClient]);

  const filteredProducts = produkty.filter(p => {
    const isSubcategoryMatch = p.subcategory === selectedCategory;
    const isMobilityMatch =
      selectedMobility === "mobilne"
        ? p.code.includes("TT")
        : selectedMobility === "stacjonarne"
          ? !p.code.includes("TT")
          : true;
    return typeof p.subcategory === 'string' && filteredSubcategories.includes(p.subcategory) && isSubcategoryMatch && isMobilityMatch;
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-sky-300 to-sky-800 flex flex-col justify-center">
      <div className="max-w-7xl w-full min-h-170 bg-white px-10 pt-5 pb-10 relative mx-auto flex">
        <div className="px-1/3">
          <h2 className="text-lg text-center">Wybierz, czy twój zbiornik ma być mobilny, czy stacjonarny</h2>
          <div className="my-4 flex gap-4">
            <input
              type="button"
              name="Mobilnosc"
              onClick={() => setSelectedMobility("stacjonarne")}
              className={`p-4 w-1/2 text-md rounded border-2 border-sky-600 transition cursor-pointer ${selectedMobility === "stacjonarne" ? "bg-sky-600 text-white" : "hover:bg-sky-700 hover:text-white"}`}
              value="Stacjonarne"
            />
            <input
              type="button"
              name="Mobilnosc"
              onClick={() => setSelectedMobility("mobilne")}
              className={`p-4 w-1/2 text-md rounded border-2 border-sky-600 transition cursor-pointer ${selectedMobility === "mobilne" ? "bg-sky-600 text-white" : "hover:bg-sky-700 hover:text-white"}`}
              value="Mobilne"
            />
          </div>
          <hr />
          <select disabled={!selectedMobility} defaultValue={"default"} className={"my-4 w-full p-2 border-sky-600 border-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option disabled className="text-center" value={"default"}>---Wybierz, jaki typ zbiornika chcesz---</option>
            <option>Zbiorniki na olej napędowy (diesel)</option>
            <option>Zbiorniki na AdBlue</option>
          </select>
          <hr />
          <h2 className="text-lg text-center">Wybierz rozmiar swojego zbiornika</h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center my-4">
            {filteredProducts.map((prod, index) => (
              <button
                key={prod.code ?? `${index}`}
                className="
                        w-full max-w-[150px]
                        p-2 rounded border-2 border-sky-600 hover:bg-sky-700 
                        hover:text-white transition cursor-pointer
                  "
                onClick={() => setSelectedProduct(prod)}
              >
                <h3 className="text-center font-semibold">
                  {prod.code}
                </h3>
                <Image src={"https://jfcpolska.pl" + (prod.images?.[0] ?? "/placeholder.png")} width={50} height={50} quality={25} alt={prod.name} className="mx-auto" />
                <h3 className="mt-2 text-center font-semibold">{prod.capacity}</h3>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center items-start mx-auto">
          <div className="grid grid-cols-4 gap-5 my-auto">
            {showcaseProducts.map((prod) => (
              <div key={prod.code} className="flex flex-col items-center gap-2">
                <Image src={"https://jfcpolska.pl" + (prod.images?.[0] ?? "/placeholder.png")} width={150} height={150} quality={25} alt={prod.code} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg border border-gray-300 overflow-auto max-h-[90vh] animate-slide-up relative">
            <button
              aria-label="Close"
              className=" bg-red-500 text-white text-lg z-50 hover:bg-red-600 h-13 w-13 absolute right-0"
              onClick={() => setSelectedProduct(null)}
            >
              &times;
            </button>

            <h1 className="text-2xl md:text-3xl font-bold my-4 text-center">
              {selectedProduct.name}
            </h1>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-full">
              <div className="md:col-span-2 flex flex-col p-4 order-1">

                <div className="flex flex-col gap-3 flex-1">

                  {(selectedProduct.extraEquipment && selectedProduct.extraEquipment.length > 0) || (selectedProduct.equipment && selectedProduct.equipment.length > 0) ? (
                    <>
                      <h2 className="text-xl font-semibold text-center border-y-2 border-gray-400/70 py-2 rounded-md">Wyposażenie standardowe</h2>
                      {selectedProduct.equipment && selectedProduct.equipment.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-700 mt-1 overflow-y-auto max-h-30">
                            {selectedProduct.equipment.map((eq: string, i: number) => (
                              <li key={`eq-${i}`}>{eq}</li>
                            ))}
                          </ul>
                      )}

                      <h2 className="text-xl font-semibold text-center border-y-2 border-gray-400/70 py-2 rounded-md">Dodatkowe opcje</h2>
                      {selectedProduct.extraEquipment && selectedProduct.extraEquipment.length > 0 && (
                        <div className="flex flex-col gap-2 overflow-y-auto max-h-40 border border-gray-400 rounded-md p-1">
                          {selectedProduct.extraEquipment.map((option: string, idx: number) => (
                            <label key={`extra-${idx}`} className="flex items-center gap-3">
                              <input type="checkbox" className="w-5 h-5" />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-gray-500">Brak dodatkowych opcji</p>
                  )}

                  <button className="w-full p-2 mt-3 rounded-md border-2 border-green-700 bg-green-500  hover:text-white hover:bg-green-600 transition cursor-pointer">Generuj</button>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col items-center p-4 order-2">
                <Image
                  src={"https://jfcpolska.pl" + (selectedProduct.images?.[0] ?? "/placeholder.png")}
                  width={350}
                  height={350}
                  quality={50}
                  className="mx-auto max-w-full h-auto"
                  alt={selectedProduct.name}
                />

                <div className="w-full overflow-y-auto h-30 border rounded-lg p-3 mt-3">
                  <p>{selectedProduct.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
