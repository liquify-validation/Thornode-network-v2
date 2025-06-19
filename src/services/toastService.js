import { toast } from "react-toastify";

export function showErrorToast(error) {
  const message = error instanceof Error ? error.message : String(error);

  toast.error(message, {
    position: toast.POSITION.CENTER,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    // className: "inner-glass-effect",
  });
}

export function showSuccessToast(message) {
  toast.success(message, {
    position: toast.POSITION.CENTER,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    // className: "inner-glass-effect",
  });
}
