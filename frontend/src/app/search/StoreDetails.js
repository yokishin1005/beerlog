export default function StoreDetails({ store, brands }) {
  const brand = brands.find(b => b.brand_id === store.brand_id);

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-2xl bg-white p-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
      <img src={`data:image/png;base64,${brand.brand_picture}`} alt={brand.brand_name} className="w-full h-32 object-cover rounded-t-lg mx-auto"/>
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 text-center">{store.store_name}</h2>
        <p className="text-gray-700 text-base text-center">
          連絡先: {store.store_contact}
        </p>
      </div>
    </div>
  );
}
