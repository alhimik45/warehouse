import {Cell} from "./Cell";
import {GameLogicFacade} from "./GameLogicFacade";

//Класс, отвечающий за игровой интерфейс
export class GameManager {
    //элемент, содержащий начальный экран игры
    private _startScreen: JQuery;
    //элемент, содержащий экран игры с созданием плохих факторов, средств защиты и ресурсов
    private _entityScreen: JQuery;
    //элемент, содержащий экран с основным интерфейсом игры
    private _gameScreen: JQuery;
    //элемент, содержащий текущий активный экран игры
    private _activeScreen: JQuery;
    //Окно с сообщением о проигрыше
    private _loseModal: JQuery;
    //Окно со списком защитных средств
    private _protectorsModal: JQuery;
    //шаблон сообщений
    private _messagesTemplate: HandlebarsTemplateDelegate;
    //шаблон игоровой информации
    private _infoTemplate: HandlebarsTemplateDelegate;
    //шаблон информации об одном месте склада
    private _cellTemplate: HandlebarsTemplateDelegate;
    //шаблон списка защитных средств
    private _protectorTemplate: HandlebarsTemplateDelegate;
    //сообщения для пользователя
    private _messages: Array<string>;
    //место, в котором использовать защитное средство
    private _cellIdx: number = -1;
    //Игровая логика
    private _logic: GameLogicFacade;

    constructor(logic: GameLogicFacade) {
        this._logic = logic;
        this._startScreen = $('#start-screen');
        this._entityScreen = $('#entity-screen');
        this._gameScreen = $('#game-screen');
        this._activeScreen = this._startScreen;

        this._entityScreen.hide();
        this._gameScreen.hide();

        this._messagesTemplate = Handlebars.compile($('#messages-template').html());
        this._infoTemplate = Handlebars.compile($('#info-template').html());
        this._cellTemplate = Handlebars.compile($('#cell-template').html());
        this._protectorTemplate = Handlebars.compile($('#protectors-template').html());

        this._protectorsModal = $('#protector-window').dialog({
            autoOpen: false,
            width: 400,
            height: 600,
            modal: true,
            position: {my: "top top", at: "top top", of: window},
            buttons: {}
        });

        this._loseModal = $('#lose-window').dialog({
            autoOpen: false,
            width: 350,
            height: 200,
            modal: true,
            buttons: {
                'Попробовать ещё раз': () => {
                    this._loseModal.dialog('close');
                }
            },
            close: () => {
                this.startGame();
            }
        });

        $('#start-game').click(() => {
            this.openScreen(this._entityScreen);
        });
        $('#run-game').click(() => {
            this.openScreen(this._gameScreen);
            this.startGame();
            setTimeout(() => {
                $('.scrollable-no').each((i, e) => {
                    let top = Math.round($(e).offset().top);
                    $(e).css('max-height', `calc(100vh - ${top}px)`);
                });
            }, 100);

        });
        $('#next-day').click(() => {
            this._logic.nextDay();
            this.update();
        });
        $('#increase-capacity').click(() => {
            if (this._logic.increaseWarehouseCapacity()) {
                this.update();
            } else {
                alert('Нехватает денег');
            }
        });

        let self = this;
        $(document).on('click', '.use-protector', function () {
            self._cellIdx = +$(this).attr('data-id');
            self.showProtectorSelector();
        });
        $(document).on('click', '.protector-select', function () {
            let protectorIdx = +$(this).attr('data-id');
            self._logic.applyProtector(self._cellIdx, protectorIdx);
            self.hideProtectorSelector();
        });
    };

    //открытие определённого экрана игры
    private openScreen(screen: JQuery): void {
        this._activeScreen.fadeOut(100, () => {
            screen.fadeIn(100);
        });
        this._activeScreen = screen;
    }

    //обновить всё визуальное состояние
    private update(): void {
        let $messages = $('#messages');
        $messages.html(this._messagesTemplate({message: this._messages}));
        $messages.scrollTop($messages[0].scrollHeight);
        $('#cell-cost').text(this._logic.getNewCellCost());
        this.updateInfo();
        this.updateCells();
        this.checkLose();
    }

    //проверить условие проигрыша
    private checkLose(): void {
        if (this._logic.isLose()) {
            this._loseModal.dialog('open');
        }
    }

    //показать окно выбора средств защиты
    private showProtectorSelector(): void {
        let tplProtectors = this._logic.getCellProtectors(this._cellIdx);
        if (tplProtectors != null) {
            $('#protectors').html(this._protectorTemplate({
                protectors: tplProtectors
            }));
            this._protectorsModal.dialog('open');
        } else {
            alert('Здесь нет плохих факторов');
        }
    }

    //закрыть окно выбора средств защиты
    private hideProtectorSelector(): void {
        this._protectorsModal.dialog('close');
        this.update();
    }

    //обновить информацию для пользователя
    private updateInfo(): void {
        $('#top-info').html(this._infoTemplate(this._logic.getInfo()));
    }

    //обновить ячейки
    private updateCells(): void {
        $('#cells').html(this._cellTemplate({
            cells: this._logic.getCells()
        }));
    }

    //отправить пользователю сообщение
    private message(msg: string): void {
        this._messages.push(msg);
        this.update();
    }

    //начать слушать события склада
    private attachEventHandlers(): void {
        this._logic.onCellRent = (cell: Cell, rent: number) => {
            let cellQuality = Math.round(cell.resource.quality / cell.resource.description.quality * 100);
            this.message(`Вы получили <b>${rent}руб.</b> за хранение
            <i>${cell.resource.description.name}</i> с качеством <b>${cellQuality}%</b>`);
        };
        this._logic.onNewResource = (cell: Cell) => {
            this.message(`Завезли новый товар <b>${cell.resource.description.name}</b>
            на срок <b>${cell.storeDays}дн.</b>`);
        };
        this._logic.onBadFactorSpread = (cell: Cell, i: number) => {
            this.message(`<font color="#a52a2a">
            На месте <b>№${i}</b> появилось <b>${cell.badFactor.description.name}</b>
            </font>`);
        };
        this._logic.onCellResourceDestroyed = (cell: Cell, penalty: number, i: number) => {
            this.message(`<font color="#a52a2a">
            Товар на месте <b>№${i}</b> был уничтожен из-за <b>${cell.badFactor.description.name}</b>.<br/>
            Было потеряно <b>${penalty}руб.</b>
            </font>`);
        };
    }

    //начать игру: инициальзировать нужные переменные
    private startGame() {
        this._messages = [];
        this._logic.startGame();
        this.attachEventHandlers();
        this.update();
    }
}
