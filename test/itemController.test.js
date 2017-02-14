describe("ItemController", () => {
    let $controller;
    let ItemFactory;

    beforeEach(module("rsApp"));

    beforeEach(() => {
        ItemFactory = jasmine.createSpyObj("ItemFactory", [
            "getItem"
        ]);

        module(($provide) => {
            $provide.value("ItemFactory", ItemFactory);
        });
    });

    beforeEach(inject((_$controller_) => {
        $controller = _$controller_("ItemController");
    }));

    it("should exist and have access to its methods", () => {
        expect($controller).toBeDefined();
        expect($controller.submit).toBeDefined();
        expect($controller.delete).toBeDefined();
        expect($controller.nextItem).toBeDefined();
        expect($controller.previousItem).toBeDefined();
    });
});
