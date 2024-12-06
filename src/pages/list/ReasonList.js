import toast from "react-hot-toast";
import api from "../../config/URL";

const ReasonList = async () => {
  try {
    const response = await api.get("getAllAdjustmentReasons");
    return response.data;
  } catch (error) {
    toast.error("Error fetching center data:", error);
    throw error;
  }
};

export default ReasonList;
