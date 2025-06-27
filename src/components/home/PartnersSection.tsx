
const PartnersSection = () => {
  const partners = [
    { name: "Vietcombank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "BIDV", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "Agribank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "VIB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "Techcombank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "TPBank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "MBBank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "VPBank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "ACB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "OCB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "SHB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "MSB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "NCB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "PGBank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "SCB", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
    { name: "SeABank", logo: "/lovable-uploads/2e6d11db-8a92-4350-98c0-30a3a9d74c28.png" },
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {partners.map((partner, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 p-4 flex items-center justify-center h-24">
              <div className="w-full h-full flex items-center justify-center">
                <div 
                  className="w-16 h-12 bg-contain bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(${partner.logo})`,
                    backgroundPosition: `${getLogoPosition(partner.name)}`
                  }}
                  title={partner.name}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper function to position different bank logos within the sprite image
const getLogoPosition = (bankName: string) => {
  const positions: { [key: string]: string } = {
    "Vietcombank": "0% 0%",
    "Agribank": "20% 0%", 
    "VetinBank": "40% 0%",
    "BIDV": "60% 0%",
    "ACB": "80% 0%",
    "Techcombank": "100% 0%",
    "VPBank": "0% 25%",
    "OCB": "20% 25%",
    "LienVietPostBank": "40% 25%",
    "SHB": "60% 25%",
    "TPBank": "80% 25%",
    "SeABank": "100% 25%",
    "MB": "0% 50%",
    "MSB": "20% 50%",
    "VIB": "40% 50%",
    "NCB": "60% 50%",
    "PGBank": "80% 50%",
    "CB": "100% 50%",
    "SCB": "0% 75%",
    "Eximbank": "20% 75%",
    "ABBank": "40% 75%",
    "BanViet": "60% 75%",
    "VietABank": "80% 75%",
    "VietBank": "100% 75%",
    "HDBank": "0% 100%",
    "Sacombank": "20% 100%",
    "BacABank": "40% 100%",
    "KienLongBank": "60% 100%",
    "OceanBank": "80% 100%",
    "GPBank": "100% 100%"
  };
  
  return positions[bankName] || "0% 0%";
};

export default PartnersSection;
