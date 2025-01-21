import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal fixed inset-0  flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-80"
        onClick={onClose}
      ></div>
      <div className=" p-6 rounded  relative z-10 max-w-3xl w-full">
        <button
          className="absolute top-4 right-4 text-green-400 hover:text-gray-700 z-40"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
