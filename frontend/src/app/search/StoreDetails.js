export default function StoreDetails({ store, brands }) {
    const brand = brands.find(b => b.brand_id === store.brand_id);
  
    return (
      <div>
        <img src={`data:image/png;base64,${brand.brand_picture}`} alt={brand.brand_name} width="100" height="100" />
        <h2>{store.store_name}</h2>
        <p>連絡先: {store.store_contact}</p>
      </div>
    );
  }