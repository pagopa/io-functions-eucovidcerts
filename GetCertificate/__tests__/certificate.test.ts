import { Certificates, VacCertificate, TestCertificate } from "../certificate";
describe("certificates decoders", () => {
  it("should decode a vaccine only certificate", () => {
    const result = Certificates.decode({
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
    });
    expect(VacCertificate.is(result.value)).toBe(true);
    expect(TestCertificate.is(result.value)).toBe(false);
  });

  it("should decode a test only certificate (antigen)", () => {
    const result = Certificates.decode({
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
    });
    expect(VacCertificate.is(result.value)).toBe(false);
    expect(TestCertificate.is(result.value)).toBe(true);
  });

  it("should decode a test only certificate (molecular)", () => {
    const result = Certificates.decode({
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
    });
    expect(VacCertificate.is(result.value)).toBe(false);
    expect(TestCertificate.is(result.value)).toBe(true);
  });
});
