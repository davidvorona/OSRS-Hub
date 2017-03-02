describe("PlayerController", () => {
    let $controller;
    let PlayerFactory;

    beforeEach(module("rsApp"));

    beforeEach(() => {
        PlayerFactory = jasmine.createSpyObj("PlayerFactory", [
            "getPlayer"
        ]);

        module(($provide) => {
            $provide.value("PlayerFactory", PlayerFactory);
        });
    });

    beforeEach(inject((_$controller_) => {
        $controller = _$controller_("PlayerController");
    }));

    it("should exist and have access to its methods", () => {
        expect($controller).toBeDefined();
        expect($controller.submit).toBeDefined();
        expect($controller.playerSelected).toBeDefined();
    });
});
