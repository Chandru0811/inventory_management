import toast from "react-hot-toast";
import api from "../../config/URL";

const CustomerList = async () => {
  try {
    const response = await api.get("getAllBrands");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default CustomerList;
