const productModel = require("../models/productModel");

exports.getTitles = async (req, res) => {
  try {
    const titles = await productModel.find({}, "title price" );
    res.status(200).json({ data: titles });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 7;
    const searchTitle = req.query.searchTitle || "";
    const skip = (page - 1) * pageSize;
    const query = {};

    if (searchTitle) {
      query.$text = { $search: searchTitle };
    }

    let Product;

    if (req.query.new) {
      Product = await productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize);
    } else if (req.query.category) {
      const qCategory = req.query.category;
      Product = await productModel
        .find({
          ...query,
          category: {
            $in: [qCategory],
          },
        })
        .skip(skip)
        .limit(pageSize);
    } else {
      Product = await productModel.find(query).skip(skip).limit(pageSize);
    }

    const totalProduct = await productModel.countDocuments(query);
    const lastPage = Math.ceil(totalProduct / pageSize);

    res.status(200).json({ data: Product, totalProduct, lastPage });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await new productModel({ ...req.body });
    await newProduct.save();
    res.status(201).send("Created");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    await productModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send("Updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};
