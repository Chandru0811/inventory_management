import toast from "react-hot-toast";
import api from "../../config/URL";

const PaymentTermList = async () => {
  try {
    const response = await api.get("getPaymentIdname");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default PaymentTermList;
