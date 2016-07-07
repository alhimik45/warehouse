@startuml

title Будни кладовщика - Диаграмма классов

skinparam classAttributeIconSize 0

class Warehouse <<Склад>>{
  -int capacity
    Максимальное количество мест на складе

  -Cell[] cells
    Занятые места на складе
  -ResourceDescription[] resources
      Список ресурсов, которые могут прийти на склад
  -BadFactorDescription[] badFactors
      Список плохих факторов, которые могут возникнуть

    -cellRent(cell:Cell) //Вычисляет арендную плату за хранение ресурса
    -cellPenalty(cell:Cell) //Вычисляет штраф за полную порчу ресурса
    -processCells() //обработка существующих мест
    -spreadBadFactors() //распространение плохих факторов
    -getEmptyIndex() //получить индекс пустого места
    -processNewCells() //поступление новых ресурсов

    +processDay() //Смоделировать события, прошедшие за один день

  +Cell[] getCells() //Возвращает массив занятых ячеек склада
  +int getСellCost() //Возвращает стоимость увеличения вместимости склада на одно место
  +int getCapacity() //Возвращает максимальное количество мест на складе
  +int getBusyCells() //Возвращает количество занятых мест на складе
  +int getCorruptedCells() ///Возвращает номера занятых мест, в которых есть плохой фактор
  +void setCapacity(int capacity) //Устанавливает максимальное количество мест на складе
}

class Cell <<Одно место на складе>>{
  -BadFactor badFactor
    Нечто плохое, влияющее на находящийся тут ресурс

  -Resource resource
    Ресурс, хранящийся в данном месте склада

  -restStoreDays:number;
    Оставшееся время хранения ресурса
  -storeDays:number;
    Время хранения ресурса

  +Resource getResource() //Возвращает описание ресурса
  +BadFactor getBadFactor() //Возвращает плохой фактор
  +getStoreDays():number //Возвращает оставшееся время хранения ресурса
  +getRestStoreDays():number //Возвращает оставшееся время хранения ресурса
  +setRestStoreDays(value:number) //Устанавливает оставшееся время хранения ресурса
  +void setBadFactor(BadFactor badFactor) //Устанавливает плохой фактор
}

class ResourceDescription <<Описание свойств ресурса>>{
  -string name
    Название ресурса

  -int rent
    Деньги, которые получит кладовщик за хранение ресурса

  -int quality
    Изначальное качество ресурса. Принимается за 100%


  +string getName() //Возращает название ресурса
  +int getQuality() //Возвращает качество ресурса
  +int getRent() //Возвращает количество денег за аренду
}

class Resource <<Конкретный ресурс, который хранится на складе>> {
  -ResourceDescription description
    Свойства данного ресурса

  -int quality
    Качество ресурса. Может ухудшаться от плохих факторов

  +ResourceDescription getDescription() //Возвращает свойства ресурса
  +int getQuality() //Возвращает качество ресурса
  +void setQuality(int quality) //Устанавливает качество ресурса
}

class BadFactorDescription <<Описание плохого фактора>>{
  -string name
    Название фактора
  -int damage
    Насколько портит данный фактор качество ресурса
  -ResourceDescription[] affectedResources
    Ресурсы, на которые может влиять фактор
  -int hitPoints
      Количество очков "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса

  +bool canAffectTo(Resource resource) //Проверка, может ли данный фактор влиять на определённый ресурс
  +void affect(Resource resource) //Повлиять на ресурс
  +string getName() // Возвращает название плохого фактора
  +int getDamage() // Возвращает урон наносимый ресурсам
  +int getHitPoints() // Возвращает количество "жизней" фактора
  +ResourceDescription getAffectedResources() // Возвращает ресурсы, на которые влияет фактор
}

class BadFactor <<Плохой фактор>> {
  -BadFactorDescription description
    Свойства данного фактора
  -int hitPoints
    Текущее количество жизней фактора

  +BadFactorDescription getDescription() //Возвращает свойства фактора
  +bool canAffectTo(Resource resource) //Проверка, может ли данный фактор влиять на определённый ресурс. Делегируется свойствам ресурса
  +void affect(Resource resource) //Повлиять на ресурс. Делегируется свойствам ресурса
  +BadFactorDescription getDescription() //Возвращает свойства фактора
  +int getHitPoints() //Возвращает количество "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса
  +void setHitPoints(int hitPoints) //Устанавливает очки "жизней"
}

class Protector <<Средство защиты от плохого фактора>>{
  -BadFactorDescription[] goodAgainst
    Массив плохих факторов, против которых данное средство будет работать
  -int cost
    Стоимость средства
  -int damage
    Урон, который средство наносит плохому фактору
  -string name
    Название средства

  +int getCost() //Возвращает стоимость средства
  +int getDamage() //Возвращает урон плохому фактору
  +string getName() //Возвращает название средства
  +BadFactorDescription[] getGoodAgainst() //Возвращает плохие факторы, против которых данное средство работет
  +bool сanProtectFrom(BadFactor badFactor) //Проверка, может ли данное средство справиться с определённым фактором
  +void protect(cell badFactor)  //Защита от фактора
}


abstract class UserValuesManager <<Общий класс для тех вещей которые пользователь добавляет/изменяет/удаляет>>{

    #_modal:JQuery
        окно с формой для добавления/изменения сущности
    #_form:JQuery
        сама форма
    #_listTemplate:HandlebarsTemplateDelegate
        шаблон элемента списка
    #_list:JQuery
        список на страничке
    #_updateIndex:number = -1
        индекс обновляемого элемента
    #_entities:Array<any> = []
        список в памяти
    #_multiSelect:JQuery = null
        элемент мультивыбора
    #_multiObjects:Array<any> = null
        объекты для мультивыбора
    #getEntityName():string//получение имени сущности
    #createEntity(formData:any):any//создание сущности
    #setFormValues(entity:any):void//установить значения формы
    #getFormWidth():number//ширина формы
    #getFormHeight():number//высота формы
    #getMultiObjects(entity:any):Array<any>//получить сущности для множественного выбора
    #getTemplateId():string //получить id шаблона сущности
    #getListId():string //получить id списка сущности
    #getFormId():string//получить id формы сущности
    #getCreateBtnId():string //получить id кнопки создания сущности
    #getDeleteBtnClass():string //получить class кнопки удаления сущности
    #getUpdateBtnClass():string //получить class кнопки обновления сущности
    #getMultiSelectedObjects(formData:any):Array<any> //получить выбранные сущности из формы
    #updateResourcesList():void //обновить список сущностейif (this._multiObjects)
    #setMultiSelect(entity:any):void //установить выбранные сущности на форме
    #openForm():void //показать форму редактирования
    #closeForm():void //закрыть форму редактирования
    #formData():any //получить данные формы редактирования
    #saveForm():void //сохранить форму редактирования в сущность
    #deleteEntity(index:number):void //удалить сущность
    #updateEntity(index:number):void //обновить сущность
    #renderList() //отобразить список сущностей
}

class BadFactorManager<<Управление списком плохих факторов>>{
    +BadFactorDescription[] getBadFactors()
}

class ProtectorManager<<Управление списком средств защиты>>{
    +Protector[] getProtectors()
}

class ResourceManager<<Управление списком ресурсов>>{
    +ResourceDescription[] getResources()
}

class GameManager <<Класс, отвечающий за игровой интерфейс>>{

    -_startScreen:JQuery;
        элемент, содержащий начальный экран игры
    -_entityScreen:JQuery;
        элемент, содержащий экран игры с созданием плохих факторов, средств защиты и ресурсов
    -_gameScreen:JQuery;
        элемент, содержащий экран с основным интерфейсом игры
    -_activeScreen:JQuery;
        элемент, содержащий текущий активный экран игры
    -_loseModal:JQuery;
        Окно с сообщением о проигрыше
    -_protectorsModal:JQuery;
        Окно со списком защитных средств
    -_resourceManager:ResourceManager;
        объект, управляющий списком ресурсов
    -_badFactorManager:BadFactorManager;
        объект, управляющий списком плохих факторов
    -_protectorManager:ProtectorManager;
        объект, управляющий списком средств защиты
    -_warehouse:Warehouse;
        объект склада
    -_messages:Array<string>;
        сообщения для пользователя
    -_money:number;
        деньги кладовщика
    -_days:number;
        сколько дней работает кладовщик
    -_messagesTemplate:HandlebarsTemplateDelegate;
        шаблон сообщений
    -_infoTemplate:HandlebarsTemplateDelegate;
        шаблон игоровой информации
    -_cellTemplate:HandlebarsTemplateDelegate;
        шаблон информации об одном месте склада
    -_protectorTemplate:HandlebarsTemplateDelegate;
        шаблон списка защитных средств
    -_cellIdx:number = -1;
        место, в котором использовать защитное средство

    +constructor()

    -openScreen(screen:JQuery):void  //открытие определённого экрана игры


    -update():void  //обновить всё визуальное состояние


    -checkLose():void  //проверить условие проигрыша


    -showProtectorSelector():void //показать окно выбора средств защиты


    -hideProtectorSelector():void  //закрыть окно выбора средств защиты


    -updateInfo():void  //обновить информацию для пользователя


    -updateCells():void  //обновить ячейки


    -message(msg:string):void //отправить пользователю сообщение


    -attachEventHandlers():void  //начать слушать события склада

    -startGame() //начать игру: инициальзировать нужные переменные

}



ResourceManager <|-- UserValuesManager
ProtectorManager <|-- UserValuesManager
BadFactorManager <|-- UserValuesManager

GameManager *-- ResourceManager
GameManager *-- ProtectorManager
GameManager *-- BadFactorManager
GameManager *-- Warehouse



Warehouse o-- Cell
Cell o-- BadFactor
Cell o-- Resource
BadFactor o-- BadFactorDescription
Resource o-- ResourceDescription
BadFactorDescription o-- ResourceDescription

BadFactorDescription ..> Resource
Protector ..>BadFactor


@enduml