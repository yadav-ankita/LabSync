require("dotenv").config();

//const connectDb = require("./db/connect");
const mongoose = require("mongoose");
const Purchase = require("./models/Purchase_model");
const LabResource = require("./models/Labresource");
const generateAssetId = require("./utils/Generateassetid");

async function repairProjectorAssets() {


     await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  
  const purchase = await Purchase.findOne({
    particulars: "Epson EB-E01 Multimedia Projector",
  });

  if (!purchase) {
    throw new Error("Projector purchase not found.");
  }

  const existingAssets = await LabResource.countDocuments({
    purchase: purchase._id,
  });

  if (existingAssets > 0) {
    console.log(
      `Stopped: ${existingAssets} assets already exist for this purchase.`
    );
    return;
  }

  const assets = [];

  for (let i = 0; i < purchase.quantity; i++) {
    const generated =
      await generateAssetId.generateProvisionalAssetId({
        resourceName: purchase.particulars,
        fundType: purchase.fundType,
      });

    assets.push({
      assetId: generated.assetId,
      originalAssetId: null,
      labName: "Not Assigned",
      previousLabName: null,
      labCode: null,
      resourceName: purchase.particulars,
      purchase: purchase._id,
      resourceCode: generated.resourceCode,
      serialNumber: generated.serialNumber,
      status: "Available",
    });
  }

  await LabResource.insertMany(assets, { ordered: true });

  console.log(`Created ${assets.length} assets for the projector purchase.`);
}

repairProjectorAssets()
  .catch(console.error);
