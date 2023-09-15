import React, { useEffect, useState, useRef } from "react";
function ImageInputProduct({ imageKey, value, setValue, preview }) {
  const imageInputRef = useRef(null);

  // Xử lý sự kiện khi người dùng chọn tệp hình ảnh mới
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setValue(imageKey, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sm:col-span-6">
      <label
        htmlFor={imageKey}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {imageKey === "thumbnail" ? "Thumbnail" : `Image ${imageKey}`}
      </label>
      <div className="mt-2" onClick={() => imageInputRef.current.click()}>
        {preview ? (
          <img
            src={preview}
            alt={imageKey === "thumbnail" ? "Thumbnail" : `Image ${imageKey}`}
            className="mt-2 w-32 h-32 cursor-pointer"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={imageInputRef}
            style={{ display: "none" }}
          />
        )}
      </div>
    </div>
  );
}
export default ImageInputProduct;
