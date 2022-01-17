export const aValidVaccinationCertificate = {
  ver: "1.0.0",
  nam: {
    fn: "Di Caprio",
    fnt: "DI<CAPRIO",
    gn: "Marilù Teresa",
    gnt: "MARILU<TERESA"
  },
  dob: "1977-06-16",
  v: [
    {
      tg: "840539006",
      vp: "1119349007",
      mp: "EU/1/20/1528",
      ma: "ORG-100030215",
      dn: 2,
      sd: 2,
      dt: "2021-04-10",
      co: "IT",
      is: "IT",
      ci: "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
    }
  ]
};

export const aValidAntigenTestCertificate = {
  ver: "1.0.0",
  nam: {
    fn: "Di Caprio",
    fnt: "DI<CAPRIO",
    gn: "Marilù Teresa",
    gnt: "MARILU<TERESA"
  },
  dob: "1977-06-16",
  t: [
    {
      tg: "840539006",
      tt: "LP6464-4",
      nm: "Roche LightCycler qPCR",
      ma: "1232",
      sc: "2021-05-03T10:27:15Z",
      dr: "2021-05-11T12:27:15Z",
      tr: "260415000",
      tc: "Policlinico Umberto I",
      co: "IT",
      is: "IT",
      ci: "01IT053059F7676042D9BEE9F874C4901F9B#3"
    }
  ]
};

export const aValidMolecularTestCertificate = {
  ver: "1.0.0",
  nam: {
    fn: "Di Caprio",
    fnt: "DI<CAPRIO",
    gn: "Marilù Teresa",
    gnt: "MARILU<TERESA"
  },
  dob: "1977-06-16",
  t: [
    {
      tg: "840539006",
      tt: "LP6464-4",
      nm: "Roche LightCycler qPCR",
      ma: "",
      sc: "2021-05-10T10:27:15Z",
      dr: "2021-05-11T12:27:15Z",
      tr: "260415000",
      tc: "Policlinico Umberto I",
      co: "IT",
      is: "IT",
      ci: "01IT0BFC9866D3854EAC82C21654B6F6DE32#1"
    }
  ]
};

export const aValidRecoveryCertificate = {
  ver: "1.0.0",
  nam: {
    fnt: "DI<CAPRIO",
    fn: "Di Caprio",
    gnt: "MARILU<TERESA",
    gn: "Marilù Teresa"
  },
  dob: "1977-06-16",
  r: [
    {
      tg: "840539006",
      du: "2021-05-10T10:27:15Z",
      co: "IT",
      ci: "01ITA65E2BD36C9E4900B0273D2E7C92EEB9#1",
      is: "IT",
      df: "2021-05-10T10:27:15Z",
      fr: "2021-05-10T10:27:15Z"
    }
  ]
};

export const aValidExemptionCertificateWithEndDate = {
  ver: "1.0.0",
  nam: {
    fnt: "DI<CAPRIO",
    fn: "Di Caprio",
    gnt: "MARILU<TERESA",
    gn: "Marilù Teresa"
  },
  dob: "1977-06-16",
  e: [
    {
      fc: "AAABBB12A10H501F",
      du: "2022-01-13",
      co: "IT",
      ci: "01IT1B321FE2B68D42A7AB6A2EC83E8F09F3#7",
      cu: "CUEV-ABCDE12345",
      is: "Ministero della Salute",
      tg: "840539006",
      df: "2021-12-13"
    }
  ]
};

export const aValidExemptionCertificateWithoutEndDate = {
  ver: "1.0.0",
  nam: {
    fnt: "DI<CAPRIO",
    fn: "Di Caprio",
    gnt: "MARILU<TERESA",
    gn: "Marilù Teresa"
  },
  dob: "1977-06-16",
  e: [
    {
      fc: "AAABBB12A10H501F",
      co: "IT",
      ci: "01IT1B321FE2B68D42A7AB6A2EC83E8F09F3#8",
      cu: "CUEV-ABCDE12345",
      is: "Ministero della Salute",
      tg: "840539006",
      df: "2021-12-13"
    }
  ]
};
