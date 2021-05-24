import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as df from "durable-functions";
import { IHttpResponse } from "durable-functions/lib/src/classes";

const httpStart: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<IHttpResponse> => {
  const client = df.getClient(context);
  const instanceId = await client.startNew(
    req.params.functionName,
    undefined,
    req.body
  );

  context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

export default httpStart;
