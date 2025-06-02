"use client";
import { useState } from 'react';
import { createSlug } from '../utils/slug';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [flowerName, setFlowerName] = useState('');
  const [similarProducts, setSimilarProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warn('Vui lòng chọn ảnh trước khi tải lên!');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setSimilarProducts(null);
    setFlowerName('');

    try {
      const response = await fetch('http://localhost:8000/search-by-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('FastAPI /search-by-image error');
      }

      const data = await response.json();
      const flowerTypeEnglish = data.flower_type;

      if (!data.similar_products || data.similar_products.length === 0) {
        toast.warn('Không tìm thấy sản phẩm tương tự!');
        setSimilarProducts([]);  // Set thành mảng rỗng rõ ràng
        setLoading(false);
        return;
      }

      // Kiểm tra nếu similar_products chỉ chứa error
      const validProducts = data.similar_products.filter(item => item.product);
      if (validProducts.length === 0) {
        toast.warn('Không tìm thấy sản phẩm tương tự!');
        setSimilarProducts([]);  // Set thành mảng rỗng
        setLoading(false);
        return;
      }

      setSimilarProducts(validProducts);  // Chỉ set sản phẩm hợp lệ

      // Gọi Spring Boot để lấy tên tiếng Việt
      const flowerRes = await fetch(`http://localhost:8080/api/flowers/by-english-name?englishName=${flowerTypeEnglish}`);
      if (flowerRes.ok) {
        const flowerData = await flowerRes.json();
        setFlowerName(flowerData.name);
      } else {
        toast.info(`Không tìm thấy tên tiếng Việt cho loại hoa: ${flowerTypeEnglish}`);
        setFlowerName(flowerTypeEnglish);
      }

    } catch (error) {
      console.error('Lỗi:', error);
      toast.error('Đã xảy ra lỗi trong quá trình xử lý ảnh!');
      setFlowerName('Lỗi xử lý');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-purple-700 my-6">
        🌸 Tìm kiếm ảnh hoa 🌸
      </h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded w-full block text-center hover:bg-purple-700"
          >
            📁 Chọn ảnh từ máy tính
          </label>
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-2">Đã chọn: {selectedFile.name}</p>
          )}
        </div>

        {previewImage && (
          <div className="mt-4">
            <h4 className="text-sm text-gray-600">Ảnh đã chọn:</h4>
            <img src={previewImage} alt="Preview" className="w-full h-auto rounded shadow-md mt-2" />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className="bg-purple-600 mt-2 text-white px-4 py-2 rounded w-full hover:bg-purple-700 disabled:bg-purple-300"
        >
          {loading ? 'Đang xử lý...' : 'Tải lên & Tìm kiếm'}
        </button>
      </div>

      {/* Chỉ hiển thị flowerName và sản phẩm nếu similarProducts có sản phẩm hợp lệ */}
      {Array.isArray(similarProducts) && similarProducts.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-purple-600 mb-4">
            Loại hoa nhận diện: <span className="font-bold">{flowerName}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {similarProducts.map((item, index) => (
              <div key={index} className="bg-white rounded shadow-md p-2">
                <img src={item.product.fullImageUrl} alt={item.product.name} className="w-full h-80 object-cover rounded" />
                <div className="mt-2 text-center">
                  <p className="font-semibold text-black text-sm md:text-lg truncate">{item.product.name}</p>
                  <p className="mt-2">
                    <a
                      href={`http://localhost:3000/products/${createSlug(item.product.name)}`}
                      className="text-purple-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem chi tiết
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
