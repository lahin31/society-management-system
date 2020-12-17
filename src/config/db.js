const mongoose = require("mongoose");

exports.makeDb = () => {
  mongoose.set("useCreateIndex", true);
  mongoose.connect(
    `mongodb+srv://lahin:WMOhiutywbZLB1c0@cluster0.fzt7a.mongodb.net/society-management?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  mongoose.set("useFindAndModify", false);
};
