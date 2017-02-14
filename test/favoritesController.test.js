describe("FavoritesController", () => {
    let $controller;

    beforeEach(module("rsApp"));

    beforeEach(inject((_$controller_) => {
        $controller = _$controller_("FavoritesController");
    }));

    it("should exist and have access to its methods", () => {
        expect($controller).toBeDefined();
        expect($controller.displayFaves).toBeDefined();
        expect($controller.choice).toBeDefined();
    });

    describe("displayFaves", () => {
        it("should remove the favoritesChoice val from the array", () => {
            localStorage.favoritesChoice = "Vijuhas";
            $controller.displayFaves();
            expect($controller.favorites).not.toContain("favoritesChoice");
        });
    });

    describe("choice", () => {
        it("should add the function parameter to localStorage.favoriesChoice", () => {
            $controller.choice("Vijuhas");
            expect(localStorage.favoritesChoice).toEqual("Vijuhas");
        });
    });
});
