import { useDispatch, useSelector } from "react-redux";

import {
  clearSelectedProduct,
  createProductAsync,
  deleteProductAsync,
  fetchProductByIdAsync,
  selectBrands,
  selectCategories,
  selectProductById,
  updateProductAsync,
} from "../../product/productSlice";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import SnackbarComponent from "../../common/SnackbarComponent";

function ProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const dispatch = useDispatch();
  const params = useParams();
  const [pageTitle, setPageTitle] = useState("Add Product");
  const selectedProduct = useSelector(selectProductById);
  const [openModal, setOpenModal] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductByIdAsync(params.id));
      setPageTitle("Edit Product");
    } else {
      dispatch(clearSelectedProduct());
      setPageTitle("Add Product");
    }
  }, [params.id, dispatch]);
  const [imagePreviews, setImagePreviews] = useState({
    thumbnail: "",
    image1: "",
    image2: "",
    image3: "",
  });
  const [selectedImage, setSelectedImage] = useState("");
  useEffect(() => {
    if (selectedProduct && selectedProduct.images && params.id) {
      setValue("title", selectedProduct.title);
      setValue("description", selectedProduct.description);
      setValue("price", selectedProduct.price);
      setValue("discountPercentage", selectedProduct.discountPercentage);
      const images = {
        thumbnail: selectedProduct.thumbnail,
        image1: selectedProduct.images[0],
        image2: selectedProduct.images[1],
        image3: selectedProduct.images[2],
      };
      // Thay đổi thành setImagePreviews(images);
      setImagePreviews(images);
      setValue("thumbnail", selectedProduct.thumbnail);
      setValue("image1", selectedProduct.images[0]);
      setValue("image2", selectedProduct.images[1]);
      setValue("image3", selectedProduct.images[2]);
      setValue("stock", selectedProduct.stock);
      setValue("brand", selectedProduct.brand);
      setValue("category", selectedProduct.category);
      console.log(selectedProduct.images[0]);
    }
  }, [selectedProduct, params.id, setValue]);
  const handleImageChange = (fieldName) => (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreviews((prevPreviews) => ({
        ...prevPreviews,
        [fieldName]: imageUrl,
      }));
      setSelectedImage(imageUrl); // Cập nhật biến selectedImage
      setValue(fieldName, imageUrl);
    }
  };
  // const handleDelete = () => {
  //   const product = { ...selectedProduct };
  //   product.deleted = true;
  //   dispatch(updateProductAsync(product));
  // };
  const handleDelete = async () => {
    if (selectedProduct) {
      const response = await dispatch(deleteProductAsync(selectedProduct.id));
      if (deleteProductAsync.fulfilled.match(response)) {
        let message = "";
        dispatch(clearSelectedProduct());
        message = "Delete product successfully!";
        setOpenSnackbar(true);
        setSnackbarMessage(message);
        reset();
      }
    }
  };
  const fileInputs = {
    thumbnail: null,
    image1: null,
    image2: null,
    image3: null,
  };
  const selectedThumbnail = selectedImage || imagePreviews.thumbnail;
  const fallbackImage = "https://via.placeholder.com/600x600";

  const onImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  return (
    <>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault(); // Ngăn chặn hành động mặc định của form
          handleSubmit((data) => {
            console.log(data);
            const product = { ...data };
            product.thumbnail = selectedThumbnail;
            product.images = [
              product.image1,
              product.image2,
              product.image3,
              product.thumbnail,
            ];
            delete product["image1"];
            delete product["image2"];
            delete product["image3"];
            product.price = +product.price;
            product.stock = +product.stock;
            product.discountPercentage = +product.discountPercentage;
            console.log(product);

            if (params.id) {
              let message = "";
              product.id = params.id;
              dispatch(updateProductAsync(product));
              reset();
              console.log(11111);
              message = "Product edited successfully!";
              setOpenSnackbar(true);
              setSnackbarMessage(message);
              // handleOpenSnackbar("Product updated successfully!", "success");
            } else {
              let message = "";
              dispatch(createProductAsync(product));
              reset();
              console.log(22222);
              message = "Product added successfully!";
              setOpenSnackbar(true);
              setSnackbarMessage(message);
              // handleOpenSnackbar("Product saved successfully!", "success");
            }
          })(e);
        }}
      >
        <div className="space-y-12 bg-white p-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className=" text-2xl font-s font-bold leading-7 text-gray-900">
              {pageTitle}
            </h2>

            <div className="mt-0 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <h2 className="text-red-500 sm:col-span-6">
                {selectedProduct?.deleted ? (
                  <span>This product is deleted</span>
                ) : null}
              </h2>

              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Product Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-lime-600 ">
                    <input
                      type="text"
                      {...register("title", {
                        required: "name is required",
                      })}
                      id="title"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "description is required",
                    })}
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-lime-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
                {errors.description && (
                  <p className="text-red-500">{errors.description.message}</p>
                )}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Brand
                </label>
                <div className="mt-2">
                  <select
                    {...register("brand", {
                      required: "brand is required",
                    })}
                  >
                    <option value="">Choose brand</option>
                    {brands.map((brand) => (
                      <option value={brand.value}>{brand.label}</option>
                    ))}
                  </select>
                </div>
                {errors.brand && (
                  <p className="text-red-500">{errors.brand.message}</p>
                )}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2">
                  <select
                    {...register("category", {
                      required: "category is required",
                    })}
                  >
                    <option value="">Choose category</option>
                    {categories.map((category) => (
                      <option value={category.value}>{category.label}</option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-red-500">{errors.category.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-lime-600 ">
                    <input
                      type="text"
                      onInput={(e) => {
                        e.target.value =
                          Math.abs(parseInt(e.target.value)) || "";
                      }}
                      {...register("price", {
                        required: "Price is required",
                        min: {
                          value: 0,
                          message: "Price must be greater than or equal to 0",
                        },
                        max: {
                          value: 10000,
                          message: "Price must be less than or equal to 10,000",
                        },
                      })}
                      id="price"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="discountPercentage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Discount Percentage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-lime-600 ">
                    <input
                      type="text"
                      onInput={(e) => {
                        e.target.value =
                          Math.abs(parseInt(e.target.value)) || "";
                      }}
                      {...register("discountPercentage", {
                        required: "Discount percentage is required",
                        min: {
                          value: 0,
                          message:
                            "Discount percentage must be greater than or equal to 0",
                        },
                        max: {
                          value: 100,
                          message:
                            "Discount percentage must be less than or equal to 100",
                        },
                      })}
                      id="discountPercentage"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.discountPercentage && (
                    <p className="text-red-500">
                      {errors.discountPercentage.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Stock
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-lime-600 ">
                    <input
                      type="text"
                      onInput={(e) => {
                        let value = parseInt(e.target.value);

                        if (isNaN(value)) {
                          e.target.value = "";
                        } else {
                          e.target.value = Math.abs(value);
                        }
                      }}
                      {...register("stock", {
                        required: "Stock is required",
                        min: {
                          value: 0,
                          message: "Stock must be greater than or equal to 0",
                        },
                      })}
                      id="stock"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-red-500">{errors.stock.message}</p>
                  )}
                </div>
              </div>
              {["thumbnail", "image1", "image2", "image3"].map((fieldName) => (
                <div key={fieldName} className="sm:col-span-6">
                  <label
                    htmlFor={fieldName}
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    {fieldName === "thumbnail"
                      ? "Thumbnail"
                      : `Image ${fieldName.slice(-1)}`}
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center mb-2">
                      <input
                        className="mb-3"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange(fieldName)}
                        style={{ display: "none" }}
                        ref={(input) => (fileInputs[fieldName] = input)}
                      />
                      <button
                        type="button" // Thêm thuộc tính type="button" ở đây
                        onClick={() => fileInputs[fieldName].click()}
                        className="px-3 py-1.5 text-sm font-semibold text-white bg-lime-600 rounded-md hover:bg-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-600"
                      >
                        Choose Image
                      </button>
                    </div>
                    {imagePreviews[fieldName] && (
                      <img
                        src={
                          imagePreviews[fieldName]
                            ? imagePreviews[fieldName]
                            : fallbackImage
                        }
                        alt={`Preview ${fieldName}`}
                        width="100"
                        onError={onImageError}
                        onClick={() => {
                          fileInputs[fieldName].click();
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {errors[fieldName] && (
                      <p className="text-red-500">
                        {errors[fieldName].message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          {selectedProduct && selectedProduct.deleted !== null && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenModal(true);
              }}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
            >
              Delete
            </button>
          )}

          <button
            type="submit"
            className="rounded-md bg-lime-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
          >
            Save
          </button>
        </div>
        <SnackbarComponent
          open={openSnackbar}
          message={snackbarMessage}
          handleClose={handleCloseSnackbar}
          severity="success"
        />
      </form>
      <Modal
        title={`Delete ${selectedProduct?.title}`}
        message="Are you sure you want to delete this Product ?"
        dangerOption="Delete"
        cancelOption="Cancel"
        dangerAction={handleDelete}
        cancelAction={() => setOpenModal(null)}
        showModal={openModal}
      ></Modal>
    </>
  );
}

export default ProductForm;
