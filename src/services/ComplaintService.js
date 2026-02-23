// services/ComplaintService.js
import ApiService from "./apiHelper";

export const ComplaintService = {
  // ✅ 1. Get all complaints
  getAllComplaints: async () => {
    try {
      return await ApiService.get("complaints/all");
    } catch (error) {
      console.error("❌ Error fetching complaints:", error.message);
      throw error;
    }
  },

  // ✅ 2. Get complaint by ID
  getComplaintOfMy: async () => {
    console.log("i trigger");

    try {
      return await ApiService.get(`complaints/my`);
    } catch (error) {
      console.error("❌ Error fetching complaint by ID:", error);
      throw error;
    }
  },

  // ✅ 3. Create new complaint
  createComplaint: async (payload) => {
    try {
      console.log("📤 Creating complaint payload:", payload);

      return await ApiService.post("complaints", payload);
    } catch (error) {
      console.error("❌ Error creating complaint:", error.message);
      throw error;
    }
  },

  // ✅ 4. Update complaint status
  // updateComplaintStatus: async (id, status) => {
  //   try {
  //     return await ApiService.patch(`complaints/${id}/status`, { status });
  //   } catch (error) {
  //     console.error("❌ Error updating status:", error.message);
  //     throw error;
  //   }
  // },
  updateComplaintStatus: async (id, status, message = "") => {
    try {
      return await ApiService.put(`complaints/${id}/status`, {
        status,
        message,
      });
    } catch (error) {
      console.error("❌ Error updating status:", error.message);
      throw error;
    }
  },

  // ✅ 5. Delete complaint
  deleteComplaint: async (id) => {
    try {
      return await ApiService.delete(`complaints/${id}`);
    } catch (error) {
      console.error("❌ Error deleting complaint:", error.message);
      throw error;
    }
  },
};
