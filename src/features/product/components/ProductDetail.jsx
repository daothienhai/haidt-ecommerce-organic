import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductByIdAsync,
  selectProductById,
  selectProductListStatus,
} from "../productSlice";
import { useParams } from "react-router-dom";
import {
  addToCartAsync,
  selectItems,
  updateCartAsync,
} from "../../cart/cartSlice";
import { selectLoggedInUser } from "../../auth/authSlice";
import { discountedPrice } from "../../../app/constants";
// import { useAlert } from "react-alert";
import { ColorRing } from "react-loader-spinner";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SnackbarComponent from "../../common/SnackbarComponent";

export default function ProductDetail() {
  const user = useSelector(selectLoggedInUser);
  const items = useSelector(selectItems);
  const product = useSelector(selectProductById);
  const dispatch = useDispatch();
  const params = useParams();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const status = useSelector(selectProductListStatus);
  const handleCart = (e) => {
    e.preventDefault();
    let message = "";

    const existingItemIndex = items.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      const updatedItems = [...items]; // Tạo bản sao của mảng items
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex], // Sao chép tất cả các thuộc tính khác
        quantity: updatedItems[existingItemIndex].quantity + 1, // Cập nhật số lượng
      };

      dispatch(updateCartAsync(updatedItems[existingItemIndex]));
      message = "Item quantity updated in Cart";
    } else {
      // Sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
      const newItem = {
        ...product,
        productId: product.id,
        quantity: 1,
        user: user.id,
      };
      delete newItem["id"];
      dispatch(addToCartAsync(newItem));
      message = "Item added to Cart";
    }

    // Sau khi xác định thông báo, hiển thị Snackbar
    setOpenSnackbar(true);
    setSnackbarMessage(message); // Sét thông báo cho Snackbar
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  useEffect(() => {
    dispatch(fetchProductByIdAsync(params.id));
  }, [dispatch, params.id]);
  const fallbackImage = "https://via.placeholder.com/600x600";

  const onImageError = (e) => {
    e.target.src = fallbackImage;
  };
  return (
    <div className="bg-white">
      {status === "loading" ? (
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{
            position: "absolute",
            top: "50%",
            insetInlineStart: "50%",
            margin: "-10px",
            display: "inline-block",
            textAlign: "center",
          }}
          wrapperClass="blocks-wrapper"
          colors={["#333"]}
        />
      ) : null}
      {product && (
        <div className="pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              {product.breadcrumbs &&
                product.breadcrumbs.map((breadcrumb) => (
                  <li key={breadcrumb.id}>
                    <div className="flex items-center">
                      <a
                        href={breadcrumb.href}
                        className="mr-2 text-sm font-medium text-gray-900"
                      >
                        {breadcrumb.name}
                      </a>
                      <svg
                        width={16}
                        height={20}
                        viewBox="0 0 16 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-5 w-4 text-gray-300"
                      >
                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                      </svg>
                    </div>
                  </li>
                ))}
              <li className="text-sm">
                <a
                  href={product.href}
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600"
                >
                  {product.title}
                </a>
              </li>
            </ol>
          </nav>

          {/* Image gallery */}
          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
            <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
              <img
                src={product.images?.[0] ? product.images?.[0] : fallbackImage}
                alt={product.title}
                className="h-full w-full object-cover object-center"
                onError={onImageError}
              />
            </div>
            <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={
                    product.images?.[1] ? product.images?.[1] : fallbackImage
                  }
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                  onError={onImageError}
                />
              </div>
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
                <img
                  src={
                    product.images?.[2] ? product.images?.[2] : fallbackImage
                  }
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                  onError={onImageError}
                />
              </div>
            </div>
            <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
              <img
                src={product.images?.[3] ? product.images?.[3] : fallbackImage}
                alt={product.title}
                className="h-full w-full object-cover object-center"
                onError={onImageError}
              />
            </div>
          </div>

          {/* Product info */}
          <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.title}
              </h1>
            </div>

            {/* Options */}
            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <h2 className="sr-only">Product information</h2>
              <p className="text-xl line-through tracking-tight text-gray-900">
                ${product.price}
              </p>
              <p className="text-3xl tracking-tight text-gray-900">
                ${discountedPrice(product)}
              </p>

              <form className="mt-10">
                <button
                  onClick={handleCart}
                  type="submit"
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-lime-600 px-8 py-3 text-base font-medium text-white hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
                >
                  Add to Cart
                </button>
                <SnackbarComponent
                  open={openSnackbar}
                  message={snackbarMessage}
                  handleClose={handleCloseSnackbar}
                  severity="success"
                />
              </form>
            </div>

            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
