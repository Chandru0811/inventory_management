import toast from "react-hot-toast";
import api from "../../config/URL";

const ItemList = async () => {
  try {
    const response = await api.get("itemId-name");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default ItemList;
