import toast from "react-hot-toast";
import api from "../../config/URL";

const CurrencyList = async () => {
  try {
    const response = await api.get("getAllCurrencyNameWithId");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default CurrencyList;
