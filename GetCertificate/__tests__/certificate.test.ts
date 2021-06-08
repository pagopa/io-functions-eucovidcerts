import { printers, ParsedCertificate, Certificates, VacCertificate, TestCertificate } from '../certificate';
describe("printers", () => {

  it("should decode a vaccine certificate", () => {
    const result = ParsedCertificate.decode({
        "ver" : "1.0.0",
        "nam" : {
          "fn" : "Di Caprio",
          "fnt" : "DI<CAPRIO",
          "gn" : "Marilù Teresa",
          "gnt" : "MARILU<TERESA"
        },
        "dob" : "1977-06-16",
        "v" : [ {
          "tg" : "840539006",
          "vp" : "1119349007",
          "mp" : "EU/1/20/1528",
          "ma" : "ORG-100030215",
          "dn" : 2,
          "sd" : 2,
          "dt" : "2021-04-10",
          "co" : "IT",
          "is" : "IT",
          "ci" : "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
        } ]
      }
    );
    expect(result).toMatchSnapshot();
  })

  it("should decode a vaccine only certificate", () => {
    const result = Certificates.decode({
        "ver" : "1.0.0",
        "nam" : {
          "fn" : "Di Caprio",
          "fnt" : "DI<CAPRIO",
          "gn" : "Marilù Teresa",
          "gnt" : "MARILU<TERESA"
        },
        "dob" : "1977-06-16",
        "v" : [ {
          "tg" : "840539006",
          "vp" : "1119349007",
          "mp" : "EU/1/20/1528",
          "ma" : "ORG-100030215",
          "dn" : 2,
          "sd" : 2,
          "dt" : "2021-04-10",
          "co" : "IT",
          "is" : "IT",
          "ci" : "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
        } ]
      }
    );
    expect(VacCertificate.is(result.value)).toBe(true);
    expect(TestCertificate.is(result.value)).toBe(false);
  })

  it("should decode a test only certificate", () => {
    const result = Certificates.decode({
        "ver" : "1.0.0",
        "nam" : {
          "fn" : "Di Caprio",
          "fnt" : "DI<CAPRIO",
          "gn" : "Marilù Teresa",
          "gnt" : "MARILU<TERESA"
        },
        "dob" : "1977-06-16",
        "t" : [ {
          "tg" : "840539006",
          "vp" : "1119349007",
          "mp" : "EU/1/20/1528",
          "ma" : "ORG-100030215",
          "dn" : 2,
          "sd" : 2,
          "dt" : "2021-04-10",
          "co" : "IT",
          "is" : "IT",
          "ci" : "01ITE7300E1AB2A84C719004F103DCB1F70A#6"
        } ]
      }
    );
    expect(VacCertificate.is(result.value)).toBe(false);
    expect(TestCertificate.is(result.value)).toBe(true);
  })

});