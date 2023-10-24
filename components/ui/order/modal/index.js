import { useETHPrice } from "@components/hooks/useETHPrice";
import { Modal, Button } from "@components/ui/common";
import React, { useEffect, useState } from "react";

const OrderModal = ({ course, onClose, onSubmit, isNewPurchase }) => {
  const defaultOrder = {
    price: "",
    email: "",
    confirmEmail: "",
  };

  const [isOpen, setOpen] = useState(false);
  const [order, setOrder] = useState(defaultOrder);
  const [updatePrice, setUpdatePrice] = useState(false);
  const [acceptedTerms, setTerms] = useState(false);
  const [error, setError] = useState("");

  const { eth } = useETHPrice();

  useEffect(() => {
    if (course) {
      setOpen(true);
      setOrder({
        ...defaultOrder,
        price: eth.perItem,
      });
      setTerms(false);
    }
  }, [course]);

  const handleClose = () => {
    setOpen(false);
    onClose();
    setTerms(false);
    setOrder(defaultOrder);
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="mb-5 text-lg font-bold leading-6 text-gray-900"
                id="modal-title"
              >
                {course.title}
              </h3>
              <div
                className={`mt-1 relative rounded-md ${
                  !isNewPurchase && "mb-4"
                }`}
              >
                <div className="mb-1">
                  <label className="mb-2 font-bold">Price Ξ</label>
                </div>
                <input
                  type="text"
                  name="price"
                  disabled={!updatePrice}
                  id="price"
                  value={order.price}
                  onChange={({ target: { value } }) => {
                    if (isNaN(value)) return;
                    setOrder({
                      ...order,
                      price: value,
                    });
                  }}
                  className="disabled:opacity-50 w-80 mb-1 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                />
                <div className="text-xs text-gray-700 flex my-4">
                  <label className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={updatePrice}
                      onChange={({ target: { checked } }) => {
                        setUpdatePrice(checked);
                        setOrder({
                          ...order,
                          price: checked ? order.price : eth.perItem,
                        });
                      }}
                    />
                  </label>
                  <span>
                    Adjust Price - <em>only when below price is not correct</em>
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  Price will be verified at the time of the order. If the price
                  will be lower, order can be declined (nominal slippage is
                  allowed)
                </p>
              </div>
              {isNewPurchase && (
                <>
                  <div className="mt-2 relative rounded-md">
                    <div className="mb-1">
                      <label className="mb-2 font-bold">Email</label>
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      onBlur={() =>
                        setError(
                          order.confirmEmail.length &&
                            order.email !== order.confirmEmail
                            ? "Email and repeat email addresses do not match."
                            : ""
                        )
                      }
                      onChange={(e) =>
                        setOrder({ ...order, email: e.target.value.trim() })
                      }
                      className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                      placeholder="john-doe@example.com"
                    />
                    <p className="text-xs text-gray-700 mt-1">
                      It&apos;s important to fill a correct email, otherwise the
                      order cannot be verified. We are not storing your email
                      anywhere
                    </p>
                  </div>
                  <div className="my-2 relative rounded-md">
                    <div className="mb-1">
                      <label className="mb-2 font-bold">Repeat Email</label>
                    </div>
                    <input
                      type="email"
                      name="confirmationEmail"
                      id="confirmationEmail"
                      onBlur={() =>
                        setError(
                          order.email !== order.confirmEmail
                            ? "Email and repeat email addresses do not match."
                            : ""
                        )
                      }
                      onChange={(e) => {
                        const confirmEmail = e.target.value.trim();
                        setOrder({
                          ...order,
                          confirmEmail,
                        });
                      }}
                      className="w-80 focus:ring-indigo-500 shadow-md focus:border-indigo-500 block pl-7 p-4 sm:text-sm border-gray-300 rounded-md"
                      placeholder="john-doe@example.com"
                    />
                  </div>
                </>
              )}
              <div className="text-xs text-gray-700 flex">
                <label className="flex items-center mr-2">
                  <input
                    type="checkbox"
                    value={acceptedTerms}
                    onChange={({ target: { checked } }) => setTerms(checked)}
                    className="form-checkbox"
                  />
                </label>
                <span>
                  I accept Eincode &apos;terms of service&apos; and I agree that
                  my order can be rejected in the case data provided above are
                  not correct
                </span>
              </div>
              {error.length > 0 && (
                <div className="p-4 mt-3 text-red-700 bg-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
          <Button
            onClick={() => {
              onSubmit(order, course);
              handleClose();
            }}
            size="sm"
            disabled={
              isNewPurchase
                ? order.email !== order.confirmEmail ||
                  order.price == 0 ||
                  !acceptedTerms
                : order.price === 0 || !acceptedTerms
            }
          >
            Submit
          </Button>
          <Button variant="red" size="sm" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderModal;
