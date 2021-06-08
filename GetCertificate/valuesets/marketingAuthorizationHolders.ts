/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sort-keys */

import {
  PreferredLanguage,
  PreferredLanguageEnum
} from "@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage";
import { ITranslatable } from "../../utils/conversions";

export const marketingAuthorizationHolder = new Map<string, ITranslatable>([
  [
    "ORG-100001699",
    {
      id: "ORG-100001699",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "AstraZeneca AB"],
        [PreferredLanguageEnum.en_GB, "AstraZeneca AB"]
      ])
    }
  ],
  [
    "ORG-100030215",
    {
      id: "ORG-100030215",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Biontech Manufacturing GmbH"],
        [PreferredLanguageEnum.en_GB, "Biontech Manufacturing GmbH"]
      ])
    }
  ],
  [
    "ORG-100001417",
    {
      id: "ORG-100001417",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Janssen-Cilag International"],
        [PreferredLanguageEnum.en_GB, "Janssen-Cilag International"]
      ])
    }
  ],
  [
    "ORG-100031184",
    {
      id: "ORG-100031184",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Moderna Biotech Spain S.L."],
        [PreferredLanguageEnum.en_GB, "Moderna Biotech Spain S.L."]
      ])
    }
  ],
  [
    "ORG-100006270",
    {
      id: "ORG-100006270",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Curevac AG"],
        [PreferredLanguageEnum.en_GB, "Curevac AG"]
      ])
    }
  ],
  [
    "ORG-100013793",
    {
      id: "ORG-100013793",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "CanSino Biologics"],
        [PreferredLanguageEnum.en_GB, "CanSino Biologics"]
      ])
    }
  ],
  [
    "ORG-100020693",
    {
      id: "ORG-100020693",
      displays: new Map<PreferredLanguage, string>([
        [
          PreferredLanguageEnum.it_IT,
          "China Sinopharm International Corp. - Beijing location"
        ],
        [
          PreferredLanguageEnum.en_GB,
          "China Sinopharm International Corp. - Beijing location"
        ]
      ])
    }
  ],
  [
    "ORG-100010771",
    {
      id: "ORG-100010771",
      displays: new Map<PreferredLanguage, string>([
        [
          PreferredLanguageEnum.it_IT,
          "Sinopharm Weiqida Europe Pharmaceutical s.r.o. - Prague location"
        ],
        [
          PreferredLanguageEnum.en_GB,
          "Sinopharm Weiqida Europe Pharmaceutical s.r.o. - Prague location"
        ]
      ])
    }
  ],
  [
    "ORG-100024420",
    {
      id: "ORG-100024420",
      displays: new Map<PreferredLanguage, string>([
        [
          PreferredLanguageEnum.it_IT,
          "Sinopharm Zhijun (Shenzhen) Pharmaceutical Co. Ltd. - Shenzhen location"
        ],
        [
          PreferredLanguageEnum.en_GB,
          "Sinopharm Zhijun (Shenzhen) Pharmaceutical Co. Ltd. - Shenzhen location"
        ]
      ])
    }
  ],
  [
    "ORG-100032020",
    {
      id: "ORG-100032020",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Novavax CZ AS"],
        [PreferredLanguageEnum.en_GB, "Novavax CZ AS"]
      ])
    }
  ],
  [
    "Gamaleya-Research-Institute",
    {
      id: "Gamaleya-Research-Institute",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Gamaleya Research Institute"],
        [PreferredLanguageEnum.en_GB, "Gamaleya Research Institute"]
      ])
    }
  ],
  [
    "Vector-Institute",
    {
      id: "Vector-Institute",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Vector Institute"],
        [PreferredLanguageEnum.en_GB, "Vector Institute"]
      ])
    }
  ],
  [
    "Sinovac-Biotech",
    {
      id: "Sinovac-Biotech",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Sinovac Biotech"],
        [PreferredLanguageEnum.en_GB, "Sinovac Biotech"]
      ])
    }
  ],
  [
    "Bharat-Biotech",
    {
      id: "Bharat-Biotech",
      displays: new Map<PreferredLanguage, string>([
        [PreferredLanguageEnum.it_IT, "Bharat Biotech"],
        [PreferredLanguageEnum.en_GB, "Bharat Biotech"]
      ])
    }
  ]
]);
