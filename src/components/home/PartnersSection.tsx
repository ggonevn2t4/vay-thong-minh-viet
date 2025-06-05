
const PartnersSection = () => {
  const partners = [
    "Vietcombank", "BIDV", "Agribank", "VIB", 
    "Techcombank", "TPBank", "MBBank", "VPBank"
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Các ngân hàng đối tác</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Chúng tôi hợp tác với các ngân hàng hàng đầu Việt Nam để mang đến cho bạn nhiều lựa chọn vay vốn đa dạng
          </p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6">
          {partners.map((partner, index) => (
            <div key={index} className="py-5 px-8 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
              <p className="text-lg font-medium text-gray-800">{partner}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
