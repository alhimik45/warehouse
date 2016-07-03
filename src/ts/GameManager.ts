enum GameState {
    BeforeStart,
    CreatingEntities,
    Playing
}

class GameManager {
    private _gameState = GameState.BeforeStart;
    private _:JQuery;

    constructor() {
        let r:number = null;
    }
}