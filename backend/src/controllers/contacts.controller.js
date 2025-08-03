import User from "../models/users.model.js";

export const searchcontacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    console.log(req.user);
    // Base query to exclude current user
    let query = {
      _id: { $ne: req.user.id },
    };

    // If searchTerm is provided, add regex-based filtering
    if (searchTerm && searchTerm.trim() !== "") {
      const sanitized = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(sanitized, "i");

      query.$or = [{ fullName: regex }, { email: regex }];
    }

    const contacts = await User.find(query);
    return res.status(200).json({ contacts });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
