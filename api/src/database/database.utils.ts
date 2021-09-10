import AutoIncrementFactory from 'mongoose-sequence';
import { Logger } from "@nestjs/common";
import { Connection, Model } from "mongoose";

export const initialData = (model: Model<any>, values: any [], collectionName: string, logger: Logger) => {
  logger.log(`> initialData - Checking ${collectionName} collection`);

  model.where().countDocuments((err, count) => {
    if (err) throw new Error(err);

    if (count === 0) {
      logger.log(`No items were found. Inserting default value for ${collectionName}`);
      values.forEach((value) => {
        model
          .create(value)
          .then(() =>
            logger.log(`Added ${JSON.stringify(value)} to ${collectionName} collection`),
          )
          .catch((err) =>
            logger.error(
              `Error adding ${JSON.stringify(value)}  to ${collectionName} collection`,
              err,
            ),
          );
      });
    }
  });

  logger.log(`< initialData - Collection ${collectionName} checked`);
}

export const autoIncrementFactory = (schema, inc_field, start_seq = 1) => async (connection: Connection) => {
  const AutoIncrement = AutoIncrementFactory(connection);
  schema.plugin(AutoIncrement, { inc_field, start_seq });
  return schema;
}
