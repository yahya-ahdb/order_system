const categoryModel = require("../models/categoryModel");

exports.getTitle = async (req, res) => {
    try {
      const title = await categoryModel.find({}, 'title');
      res.status(200).json({ data: title });
    } catch (error) {
      res.status(500).send(error);
    }
  };


exports.getCategory = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const skip = (page - 1) * pageSize;
      const query = {};
  
      let category;
  
      if (req.query.new) {
        category = await categoryModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
      } else if (req.query.status) {
        const qCategory = req.query.status;
        category = await categoryModel
          .find({
            ...query,
            status: {
              $in: [qCategory],
            },
          })
          .skip(skip)
          .limit(pageSize);
      } else {
        category = await categoryModel
          .find(query)
          .skip(skip)
          .limit(pageSize);
      }
  
      const totalOrders = await categoryModel.countDocuments(query);
      const lastPage = Math.ceil(totalOrders / pageSize);
      
      res.status(200).json({ data: category, totalOrders, lastPage });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await new categoryModel({ ...req.body });
    await newCategory.save();
    res.status(201).send("Created");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send("Updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

