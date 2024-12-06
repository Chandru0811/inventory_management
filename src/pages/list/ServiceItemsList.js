import toast from "react-hot-toast";
import api from "../../config/URL";

const ServiceItemsList = async () => {
  try {
    const response = await api.get("serviceItems");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default ServiceItemsList;
