import { ITranslatable, toTWithMap } from '../conversions';
import { PreferredLanguage, PreferredLanguageEnum } from '@pagopa/io-functions-commons/dist/generated/definitions/PreferredLanguage';
import { isRight } from 'fp-ts/lib/Either';
describe("aaa", () => {
    
    it("bbb", () => {
        const map : Map<string, ITranslatable> = new Map([
            ["0001", {
                id: "0001",
                displays: new Map<PreferredLanguage, string>([
                    [PreferredLanguageEnum.it_IT, "test display in it"]
                ])  
            }]
        ]);

        const res = toTWithMap(map).decode("0001");

        expect(isRight(res)).toBe(true);
        expect((res.value as ITranslatable).id).toEqual("0001");

    });
});