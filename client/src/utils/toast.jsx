import toast from "react-hot-toast";

export const toastSuccess = (msg) => toast.success(msg, { id: msg });

export const toastError = (msg) => toast.error(msg, { id: msg });

export const toastInfo = (msg) => toast(msg, { id: msg });

export const toastLoading = (msg) => toast.loading(msg, { id: msg });
