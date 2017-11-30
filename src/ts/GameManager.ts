import {Cell} from "./Cell";
import {GameLogicFacade} from "./GameLogicFacade";
import {TemplateFactory} from "./TemplateFactory";
import {CellType} from "./CellType";
import {Observer} from "./Subject";

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
            if (GameLogicFacade.getInstance().increaseWarehouseCapacity(CellType.Simple)) {
                this.update();
            } else {
                alert('Нехватает денег');
            }
        });

        $('#increase-capacity-fire').click(() => {
            if (GameLogicFacade.getInstance().increaseWarehouseCapacity(CellType.Antifire)) {
                this.update();
            } else {
                alert('Нехватает денег');
            }
        });

        $('#increase-capacity-bug').click(() => {
            if (GameLogicFacade.getInstance().increaseWarehouseCapacity(CellType.Antibug)) {
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
        $('#cell-cost-fire').text(GameLogicFacade.getInstance().getNewCellCost() * 1.2);
        $('#cell-cost-bug').text(GameLogicFacade.getInstance().getNewCellCost() * 1.3);
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
        GameLogicFacade.getInstance().onCellRent = new RentObserver(this.message.bind(this));
        GameLogicFacade.getInstance().onNewResource = new NewResourceObserver(this.message.bind(this));
        GameLogicFacade.getInstance().onBadFactorSpread = new SpreadObserver(this.message.bind(this));
        GameLogicFacade.getInstance().onCellResourceDestroyed = new ResourceObserver(this.message.bind(this));
    }

    //начать игру: инициализировать нужные переменные
    private startGame() {
        this._messages = [];
        this.attachEventHandlers();
        GameLogicFacade.getInstance().startGame();
        this.update();
    }
}


abstract class OObserver extends Observer{
    protected message: any;

    constructor(message: any) {
        super();
        this.message = message;
    }
}

class ResourceObserver extends OObserver{
    update(data: any) {
        this.message(`<font color="#a52a2a">
            Товар на месте <b>№${data.i}</b> был уничтожен из-за <b>${data.cell.badFactor.description.name}</b>.<br/>
            Было потеряно <b>${data.penalty}руб.</b>
            </font>`);
    }
}

class SpreadObserver extends OObserver{
    update(data: any) {
        this.message(`<font color="#a52a2a">
            На месте <b>№${data.i}</b> появилось <b>${data.cell.badFactor.description.name}</b>
            </font>`);
    }
}

class NewResourceObserver extends OObserver{
    update(data: any) {
        this.message(`Завезли новый товар <b>${data.cell.resource.description.name}</b>
            на срок <b>${data.cell.storeDays}дн.</b>`);
    }
}

class RentObserver extends OObserver{
    update(data: any) {
        let cellQuality = Math.round(data.cell.resource.quality / data.cell.resource.description.quality * 100);
        this.message(`Вы получили <b>${data.rent}руб.</b> за хранение
            <i>${data.cell.resource.description.name}</i> с качеством <b>${cellQuality}%</b>`);
    }
}