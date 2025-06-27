
const PartnersSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Các ngân hàng đối tác</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Chúng tôi hợp tác với các ngân hàng hàng đầu Việt Nam để mang đến cho bạn nhiều lựa chọn vay vốn đa dạng
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="max-w-5xl w-full">
            <img 
              src="/lovable-uploads/67eb5d3b-4a0f-44a4-9a5d-d64ec54ca5c8.png" 
              alt="Các ngân hàng đối tác" 
              className="w-full h-auto rounded-xl shadow-lg border border-gray-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
