const orderModel = require("../models/orderModel");
const { format } = require('date-fns')
const PDFDocument = require('pdfkit');
const xlsx = require('xlsx');

exports.getTitles = async (req, res) => {
    try {
      const phone = await orderModel.find({}, 'phone');
      res.status(200).json({ data: phone });
    } catch (error) {
      res.status(500).send(error);
    }
  };

exports.getOrders = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 7;
      const searchTitle = req.query.searchTitle || '';
      const skip = (page - 1) * pageSize;
      const query = {};
  
      if (searchTitle) {
        query.$text = { $search: searchTitle };
      }
  
      let orders;
  
      if (req.query.new) {
        orders = await orderModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
      } else if (req.query.status) {
        const qCategory = req.query.status;
        orders = await orderModel
          .find({
            ...query,
            status: {
              $in: [qCategory],
            },
          }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
      } 
      else if (req.query.paymentStatus) {
        const paymentStatus = req.query.paymentStatus;
        orders = await orderModel
          .find({
            ...query,
            paymentStatus: {
              $in: [paymentStatus],
            },
          }).sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);
      } 
      else {
        orders = await orderModel
          .find(query)
          .skip(skip).sort({ createdAt: -1 })
          .limit(pageSize);
      }
  
      const totalOrders = await orderModel.countDocuments(query);
      const lastPage = Math.ceil(totalOrders / pageSize);
      
      res.status(200).json({ data: orders, totalOrders, lastPage });
    } catch (error) {
      res.status(500).send(error);
    }
  };
  

exports.createOrder = async (req, res) => {
  try {
    const newOrder = await new orderModel({ ...req.body });
    await newOrder.save();
    res.status(201).send("Created");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).send("Updated");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(500).send(error);
  }
};




exports.GetDataPdf = async (req, res) => {
  try {
      const data = await orderModel.find({}, { _id: 0, __v: 0 }).lean();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=exported-data.pdf');
  
      const pdfDoc = new PDFDocument({ bufferPages: true });
      pdfDoc.pipe(res);
  
      
      pdfDoc.fontSize(12)
        .text('ORDER DATA', { align: 'center' })
        .moveDown();
  
      data.forEach(item => {
        pdfDoc.text(`Title: ${item.title}`);
        pdfDoc.text(`Client: ${item.client}`);
        pdfDoc.text(`Status: ${item.status}`);
        pdfDoc.text(`Quantity: ${item.qty}`);
        pdfDoc.text(`Price: ${item.price * item.qty}`);
        pdfDoc.text(`Created: ${format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss')}`);
        pdfDoc.moveDown();
      });
  
      pdfDoc.end();
  
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  exports.ExprotData = async (req, res) => {
    try {
        const data = await orderModel.find({}, { _id: 0, __v: 0 }).lean();
    
        const formattedData = data.map(item => ({
          ...item,
          options: item.options.map((opt) => ` ${opt.product} || ${opt.color} || ${opt.size} || ${opt.qty} || ${opt.price} ,\n`).join(', '),
          createdAt: format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss'),
          updatedAt: format(new Date(item.updatedAt), 'yyyy-MM-dd HH:mm:ss'),
        }));
    
        const ws = xlsx.utils.json_to_sheet(formattedData);
    
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');
    
        const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.set('Content-Disposition', 'attachment; filename=exported-data.xlsx');
        res.status(200).send(buffer);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error });
      }
  }