import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteItemFromCartAsync,
  selectCartStatus,
  selectItems,
  updateCartAsync,
} from "./cartSlice";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { discountedPrice } from "../../app/constants";
import { ColorRing } from "react-loader-spinner";
import Modal from "../common/Modal";

export default function Cart() {
  const dispatch = useDispatch();

  const items = useSelector(selectItems);
  const status = useSelector(selectCartStatus);
  const [openModal, setOpenModal] = useState(null);

  const totalAmount = items.reduce(
    (amount, item) => discountedPrice(item) * item.quantity + amount,
    0
  );
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (item, newQuantity) => {
    if (newQuantity >= 1) {
      // Đảm bảo số lượng không âm
      dispatch(updateCartAsync({ ...item, quantity: newQuantity }));
    }
  };

  const handleRemove = (e, id) => {
    dispatch(deleteItemFromCartAsync(id));
  };
  const fallbackImage = "https://via.placeholder.com/600x600";

  const onImageError = (e) => {
    e.target.src = fallbackImage;
  };
  return (
    <>
      {items.length ? (
        <div>
          <div className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className=" px-4 py-6 sm:px-6">
              <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                Cart
              </h1>
              <div className="flow-root">
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
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.thumbnail ? item.thumbnail : fallbackImage}
                          alt={item.title}
                          className="h-full w-full object-contain object-center"
                          onError={onImageError}
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                              <a href={item.href}>{item.title}</a>
                            </h3>
                            <p className="ml-4">${discountedPrice(item)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.brand}
                          </p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  handleQuantity(item, item.quantity - 1)
                                }
                                type="button"
                                className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="mx-2 text-lg font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantity(item, item.quantity + 1)
                                }
                                type="button"
                                className="px-3 py-1 rounded-full bg-lime-600 text-white hover:bg-lime-700 focus:outline-none"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="flex">
                            <Modal
                              title={`Delete ${item.title}`}
                              message="Are you sure you want to delete this Cart item ?"
                              dangerOption="Delete"
                              cancelOption="Cancel"
                              dangerAction={(e) => handleRemove(e, item.id)}
                              cancelAction={() => setOpenModal(null)}
                              showModal={openModal === item.id}
                            ></Modal>
                            <button
                              onClick={(e) => {
                                setOpenModal(item.id);
                              }}
                              type="button"
                              className="font-medium text-lime-600 hover:text-lime-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>$ {totalAmount}</p>
              </div>
              <div className="flex justify-between my-2 text-base font-medium text-gray-900">
                <p>Total Items in Cart</p>
                <p>{totalItems} items</p>
              </div>

              <div className="mt-6">
                <Link
                  to="/checkout"
                  className="flex items-center justify-center rounded-md border border-transparent bg-lime-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-lime-700"
                >
                  Checkout
                </Link>
              </div>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or&nbsp;
                  <Link to="/">
                    <button
                      type="button"
                      className="font-medium text-lime-600 hover:text-lime-500"
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="mx-auto mt-12 bg-white max-w-7xl px-4 sm:px-6 lg:px-8"
            style={{ minHeight: 400 }}
          >
            <div className=" px-4 py-6 sm:px-6">
              <h1 className="text-4xl my-5 font-bold tracking-tight text-gray-900">
                Cart
              </h1>
              <p>Your shopping cart is empty.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
