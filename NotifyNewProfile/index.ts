import { AzureFunction, Context } from "@azure/functions";

const index: AzureFunction = async (context: Context, fiscalCode: unknown) => {
  context.log.error(`Not yet implemented: ${fiscalCode}`);
};

export default index;
