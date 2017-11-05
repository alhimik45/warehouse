import {Cell} from "./Cell";
import {GameLogicFacade} from "./GameLogicFacade";
import {TemplateFactory} from "./TemplateFactory";

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
    //сообщения для пользователя
    private _messages: Array<string>;
    //место, в котором использовать защитное средство
    private _cellIdx: number = -1;

    constructor() {
        this._startScreen = $('#start-screen');
        this._entityScreen = $('#entity-screen');
        this._gameScreen = $('#game-screen');
        this._activeScreen = this._startScreen;

        this._entityScreen.hide();
        this._gameScreen.hide();

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
            GameLogicFacade.getInstance().showEntities();
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
            GameLogicFacade.getInstance().nextDay();
            this.update();
        });
        $('#increase-capacity').click(() => {
            if (GameLogicFacade.getInstance().increaseWarehouseCapacity()) {
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
            GameLogicFacade.getInstance().applyProtector(self._cellIdx, protectorIdx);
            self.hideProtectorSelector();
        });
        $(document).on('click', '.copy-cell', function () {
            let cellIdx = +$(this).attr('data-id');
            GameLogicFacade.getInstance().copyCell(cellIdx);
            self.update();
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
        $messages.html(TemplateFactory.getTemplate("messages").getHtml({message: this._messages}));
        $messages.scrollTop($messages[0].scrollHeight);
        $('#cell-cost').text(GameLogicFacade.getInstance().getNewCellCost());
        this.updateInfo();
        this.updateCells();
        this.checkLose();
    }

    //проверить условие проигрыша
    private checkLose(): void {
        if (GameLogicFacade.getInstance().isLose()) {
            this._loseModal.dialog('open');
        }
    }

    //показать окно выбора средств защиты
    private showProtectorSelector(): void {
        let tplProtectors = GameLogicFacade.getInstance().getCellProtectors(this._cellIdx);
        if (tplProtectors != null) {
            $('#protectors').html(TemplateFactory.getTemplate("protector").getHtml({
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
        $('#top-info').html(TemplateFactory.getTemplate("info").getHtml(GameLogicFacade.getInstance().getInfo()));
    }

    //обновить ячейки
    private updateCells(): void {
        $('#cells').html(TemplateFactory.getTemplate("cell").getHtml({
            cells: GameLogicFacade.getInstance().getCells()
        }));
    }

    //отправить пользователю сообщение
    private message(msg: string): void {
        this._messages.push(msg);
        this.update();
    }

    //начать слушать события склада
    private attachEventHandlers(): void {
        GameLogicFacade.getInstance().onCellRent = (cell: Cell, rent: number) => {
            let cellQuality = Math.round(cell.resource.quality / cell.resource.description.quality * 100);
            this.message(`Вы получили <b>${rent}руб.</b> за хранение
            <i>${cell.resource.description.name}</i> с качеством <b>${cellQuality}%</b>`);
        };
        GameLogicFacade.getInstance().onNewResource = (cell: Cell) => {
            this.message(`Завезли новый товар <b>${cell.resource.description.name}</b>
            на срок <b>${cell.storeDays}дн.</b>`);
        };
        GameLogicFacade.getInstance().onBadFactorSpread = (cell: Cell, i: number) => {
            this.message(`<font color="#a52a2a">
            На месте <b>№${i}</b> появилось <b>${cell.badFactor.description.name}</b>
            </font>`);
        };
        GameLogicFacade.getInstance().onCellResourceDestroyed = (cell: Cell, penalty: number, i: number) => {
            this.message(`<font color="#a52a2a">
            Товар на месте <b>№${i}</b> был уничтожен из-за <b>${cell.badFactor.description.name}</b>.<br/>
            Было потеряно <b>${penalty}руб.</b>
            </font>`);
        };
    }

    //начать игру: инициальзировать нужные переменные
    private startGame() {
        this._messages = [];
        GameLogicFacade.getInstance().startGame();
        this.attachEventHandlers();
        this.update();
    }
}
