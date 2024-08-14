import { model, Schema,Types } from "mongoose";

const dataSchema = new Schema({
  url: String,
 question: String,
  answer: String
},{
    timestamps:true
});

export const DataModel = model('Data', dataSchema);

