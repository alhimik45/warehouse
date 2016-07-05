import {ResourceManager} from "./ResourceManager";
import {BadFactorManager} from "./BadFactorManager";

enum GameState {
    BeforeStart,
    CreatingEntities,
    Playing
}

export class GameManager {
    //TODO
    private _gameState = GameState.BeforeStart;
    //элемент, содержащий начальный экран игры
    private _startScreen:JQuery;
    //элемент, содержащий экран игры с созданием плохих факторов, средств защиты и ресурсов
    private _entityScreen:JQuery;
    //элемент, содержащий экран с основным интерфейсом игры
    private _gameScreen:JQuery;
    //элемент, содержащий текущий активный экран игры
    private _activeScreen:JQuery;
    //объект, управляющий списком ресурсов
    private _resourceManager:ResourceManager;
    //объект, управляющий списком плохих факторов
    private _badFactorManager:BadFactorManager;

    constructor() {
        //инициализация элементов экранов
        this._startScreen = $('#start-screen');
        this._entityScreen = $('#entity-screen');
        this._gameScreen = $('#game-screen');
        this._activeScreen = this._startScreen;

        this._entityScreen.hide();
        this._gameScreen.hide();

        this._resourceManager = new ResourceManager;
        this._badFactorManager = new BadFactorManager(this._resourceManager.resources);


        $('#start-game').click(() => {
            this.openScreen(this._entityScreen);
        });
    };

    //открытие определённого экрана игры
    private openScreen(screen:JQuery):void {
        this._activeScreen.fadeOut(900, () => {
            screen.fadeIn(900);
        });
        this._activeScreen = screen;
    }
}
