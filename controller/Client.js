const clientModel = require("../models/clientModel");

exports.getName = async (req, res) => {
    try {
      const name = await clientModel.find({}, 'name');
      res.status(200).json({ data: name });
    } catch (error) {
      res.status(500).send(error);
    }
  };

exports.getClients = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 8;
      const searchTitle = req.query.searchTitle || '';
      const skip = (page - 1) * pageSize;
      const query = {};
  
      if (searchTitle) {
        query.$text = { $search: searchTitle };
      }
      let client;
  
      if (req.query.new) {
        client = await clientModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
      } else if (req.query.status) {
        const qCategory = req.query.status;
        client = await clientModel
          .find({
            ...query,
            status: {
              $in: [qCategory],
            },
          })
          .skip(skip)
          .limit(pageSize);
      } else {
        client = await clientModel
          .find(query)
          .skip(skip)
          .limit(pageSize);
      }
  
      const totalCleints = await clientModel.countDocuments(query);
      const lastPage = Math.ceil(totalCleints / pageSize);
      
      res.status(200).json({ data: client, totalCleints, lastPage });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

exports.createClient = async (req, res) => {
  try {
    const newCleint = await new clientModel({ ...req.body });
    await newCleint.save();
    res.status(201).send("Created");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateClient = async (req, res) => {
  try {
    await clientModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send("Updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteClient = async (req, res) => {
  try {
    await clientModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};

