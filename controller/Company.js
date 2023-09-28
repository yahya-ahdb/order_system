const companyModel = require("../models/companyModel");

exports.getName = async (req, res) => {
    try {
      const name = await companyModel.find({}, 'name phone');
      res.status(200).json({ data: name });
    } catch (error) {
      res.status(500).send(error);
    }
  };

exports.getCompany = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 8;
      const searchTitle = req.query.searchTitle || '';
      const skip = (page - 1) * pageSize;
      const query = {};
  
      if (searchTitle) {
        query.$text = { $search: searchTitle };
      }
      let company;
  
      if (req.query.new) {
        company = await companyModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
        } else if (req.query.status) {
          const qCategory = req.query.status;
          company = await companyModel
          .find({
            ...query,
            status: {
              $in: [qCategory],
            },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
        } else {
          company = await companyModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
      }
  
      const totalCleints = await companyModel.countDocuments(query);
      const lastPage = Math.ceil(totalCleints / pageSize);
      
      res.status(200).json({ data: company, totalCleints, lastPage });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

exports.createCompany = async (req, res) => {
  try {
    const newCompany = await new companyModel({ ...req.body });
    await newCompany.save();
    res.status(201).send("Created");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCompany = async (req, res) => {
  try {
    await companyModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send("Updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await companyModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

