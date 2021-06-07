import { AzureFunction, Context } from "@azure/functions";
import { readableReport } from "@pagopa/ts-commons/lib/reporters";
import { FiscalCode } from "@pagopa/ts-commons/lib/strings";
import * as t from "io-ts";
import { toSHA256 } from "../utils/conversions";

const Failure = t.interface({
  kind: t.keyof({
    PERMANENT: null,
    TRANSIENT: null
  }),
  reason: t.string
});
type Failure = t.TypeOf<typeof Failure>;

const Success = t.interface({
  kind: t.literal("SUCCESS")
});
type Success = t.TypeOf<typeof Success>;

const permanentDecodeFailure = (errs: t.Errors): Failure =>
  Failure.encode({
    kind: "PERMANENT",
    reason: `Cannot decode input: ${readableReport(errs)}`
  });

const index: AzureFunction = async (
  context: Context,
  inputFiscalCode: unknown
) =>
  FiscalCode.decode(inputFiscalCode)
    .mapLeft(permanentDecodeFailure)
    .bimap(
      _ => {
        context.log.error(`NewProfile|${_.reason}`);
        return _;
      },
      fiscalCode => {
        // eslint-disable-next-line functional/immutable-data
        context.bindings.outputFiscalCode = toSHA256(fiscalCode);
        return { kind: "SUCCESS" } as Success;
      }
    );

export default index;
