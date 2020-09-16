const mongod = require("./db/setup");
const mongoose = require('mongoose');
const { Schema, ObjectId, model } = mongoose;

(async () => {
  // Edit your test here, Example:

  const ASchema = new Schema({
    a: {
      type: String,
    },
  });

  const BSchema = new Schema({
    b: { type: String },
    aId: { ref: "a", type: ObjectId },
  });

  const A = model("a", ASchema);
  const B = model("b", BSchema);

  const data_a = await A.create({
    a: 'hello',
  });
  const data_b = await B.create([
    {
      b: 'world',
      aId: mongoose.Types.ObjectId("5f623c7cbda21b00c15e4097")
    },
    {
      b: 'otro',
      aId: mongoose.Types.ObjectId("5f623c7cbda21b00c15e4097")
    }
  ]);
  

  const query = B
    .findOneAndUpdate({
      b: "otro",
    }, {
      $set: {
        aId: "5f623c7cbda21b00c15e4098"
      }
    }, {
      'new': true
    })
    .lean();

  const result = await query.exec();
  console.log(result);
})().then(
  async _ => {
    await mongoose.disconnect();
    await mongod.stop();
    process.exit(0);
  },
  async _ => {
    console.log(_);
    await mongoose.disconnect();
    await mongod.stop();
    process.exit(1);
  }
)
