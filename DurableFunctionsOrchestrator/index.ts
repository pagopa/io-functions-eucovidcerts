/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

import {
  IOrchestrationFunctionContext,
  Task
} from "durable-functions/lib/src/classes";

import * as df from "durable-functions";
import * as t from "io-ts";

const orchestrator = df.orchestrator(function*(
  context: IOrchestrationFunctionContext
): IterableIterator<Task> {
  return [
    t.string
      .decode(yield context.df.callActivity("ActivityFunction", "Tokyo"))
      .getOrElse(""),
    t.string
      .decode(yield context.df.callActivity("ActivityFunction", "Seattle"))
      .getOrElse(""),
    t.string
      .decode(yield context.df.callActivity("ActivityFunction", "London"))
      .getOrElse("")
  ];
  // eslint-disable-next-line , @typescript-eslint/no-explicit-any
} as any);

export default orchestrator;
