@startuml

title Будни кладовщика - Диаграмма классов

skinparam classAttributeIconSize 0

class Warehouse {
  -int capacity

  -Cell[] cells

  -ResourceDescription[] resources

  -BadFactorDescription[] badFactors

    -cellRent(cell:Cell)
    -cellPenalty(cell:Cell)
    -processCells()
    -spreadBadFactors()
    -getEmptyIndex()
    -processNewCells()

    +processDay()

  +Cell[] getCells()
  +int getСellCost()
  +int getCapacity()
  +int getBusyCells()
  +int getCorruptedCells()
  +void setCapacity(int capacity)
}

class Cell {
  -BadFactor badFactor

  -Resource resource

  -restStoreDays:number;

  -storeDays:number;

  +Resource getResource()
  +BadFactor getBadFactor()
  +getStoreDays():number
  +getRestStoreDays():number
  +setRestStoreDays(value:number)
  +void setBadFactor(BadFactor badFactor)
}

class ResourceDescription {
  -string name

  -int rent

  -int quality


  +string getName()
  +int getQuality()
  +int getRent()
  +getCompareCriteria(): number
}

class Resource  {
  -ResourceDescription description

  -int quality

  +ResourceDescription getDescription()
  +int getQuality()
  +void setQuality(int quality)
}

class BadFactorDescription {
  -string name

  -int damage

  -ResourceDescription[] affectedResources

  -int hitPoints

  +bool canAffectTo(Resource resource)
  +void affect(Resource resource)
  +string getName()
  +int getDamage()
  +int getHitPoints()
  +ResourceDescription getAffectedResources()
  +getCompareCriteria(): number
}

interface IResourceApplicator {
  +bool сanApply(Cell cell)
  +void apply(Cell cell)
}

interface IProtector {
    +int getCost()
    +int getDamage()
    +string getName()
    +BadFactorDescription[] getGoodAgainst()
}

class BadFactor  {
  -BadFactorDescription description

  -int hitPoints

  +BadFactorDescription getDescription()
  +bool сanApply(Cell cell)
  +void apply(Cell cell)
  +BadFactorDescription getDescription()
  +int getHitPoints()
  +void setHitPoints(int hitPoints)
}

class ProtectorLimiter {
  -IProtector _originalProtector
  +constructor(protector: IProtector, limit: int)
  +int getCost()
  +int getDamage()
  +string getName()
  +BadFactorDescription[] getGoodAgainst()
  +bool сanApply(Cell cell)
  +void apply(Cell cell)
  +getCompareCriteria(): number
}

class ResourceProtectorAdapter {
  -Resource _resource
  +constructor(resource: Resource)
  +int getCost()
  +int getDamage()
  +string getName()
  +BadFactorDescription[] getGoodAgainst()
  +bool сanApply(Cell cell)
  +void apply(Cell cell)
  +getCompareCriteria(): number
}

class Protector {
  -BadFactorDescription[] goodAgainst

  -int cost

  -int damage

  -string name

  +int getCost()
  +int getDamage()
  +string getName()
  +BadFactorDescription[] getGoodAgainst()
  +bool сanApply(Cell cell)
  +void apply(Cell cell)
  +getCompareCriteria(): number
}

interface IComparable {
    +getCompareCriteria(): number
}

abstract class AbstractIterator {
    +current(): T
    +moveNext(): boolean
    +reset(): void
}

class FilterIterator {
    +constructor(comparables: Array<T> | AbstractIterator<T>, filterExpr: string)
    +current(): T
    +moveNext(): boolean
    +reset(): void
}

class SortIterator {
    +constructor(comparables: Array<T> | AbstractIterator<T>)
    +current(): T
    +moveNext(): boolean
    +reset(): void
}

class InverseIterator {
    +constructor(comparables: Array<T> | AbstractIterator<T>)
    +current(): T
    +moveNext(): boolean
    +reset(): void
}

abstract class UserValuesManager {
    #_modal:JQuery
    #_form:JQuery
    #_list:JQuery
    #_updateIndex:number = -1
    #_entities:Array<any> = []
    #_multiSelect:JQuery = null
    #_multiObjects:Array<any> = null

    #getEntityName():string
    #createEntity(formData:any):any
    #setFormValues(entity:any):void
    #getFormWidth():number
    #getFormHeight():number
    #getMultiObjects(entity:any):Array<any>
    #getTemplateName():string
    #getListId():string
    #getFormId():string
    #getCreateBtnId():string
    #getDeleteBtnClass():string
    #getUpdateBtnClass():string
    #getMultiSelectedObjects(formData:any):Array<any>
    #updateResourcesList():void
    #setMultiSelect(entity:any):void
    #openForm():void
    #closeForm():void
    #formData():any
    #saveForm():void
    #deleteEntity(index:number):void
    #updateEntity(index:number):void
    #renderList()
}

class BadFactorManager{
    #getEntityName():string
    #createEntity(formData:any):any
    #setFormValues(entity:any):void
    #getFormWidth():number
    #getFormHeight():number
    #getMultiObjects(entity:any):Array<any>
    +BadFactorDescription[] getBadFactors()
}

class ProtectorManager{
    #getEntityName():string
    #createEntity(formData:any):any
    #setFormValues(entity:any):void
    #getFormWidth():number
    #getFormHeight():number
    #getMultiObjects(entity:any):Array<any>
    +Protector[] getProtectors()
}

class ResourceManager{
    #getEntityName():string
    #createEntity(formData:any):any
    #setFormValues(entity:any):void
    #getFormWidth():number
    #getFormHeight():number
    #getMultiObjects(entity:any):Array<any>
    +ResourceDescription[] getResources()
}

class GameManager {
    -_startScreen:JQuery;
    -_entityScreen:JQuery;
    -_gameScreen:JQuery;
    -_activeScreen:JQuery;
    -_loseModal:JQuery;
    -_protectorsModal:JQuery;
    -_messages:Array<string>;
    -_cellIdx:number = -1;
    -_logic:GameLogicFacade;

    +constructor(logic: GameLogicFacade)
    -openScreen(screen:JQuery):void
    -update():void
    -checkLose():void
    -showProtectorSelector():void
    -hideProtectorSelector():void
    -updateInfo():void
    -updateCells():void
    -message(msg:string):void
    -attachEventHandlers():void
    -startGame()
}

class GameLogicFacade {
    +onCellRent
    +onNewResource
    +onBadFactorSpread
    +onCellResourceDestroyed
    -_resourceManager: ResourceManager;
    -_badFactorManager: BadFactorManager;
    -_protectorManager: ProtectorManager;
    -_warehouse: Warehouse;
    -_money: number;
    -_days: number;

    +constructor()
    +startGame(): void
    +nextDay(): void
    +increaseWarehouseCapacity(): boolean
    +applyProtector(cellIdx: number, protectorIdx: number)
    +getNewCellCost(): number
    +isLose(): boolean
    +getCellProtectors(cellIdx: number): Array<ProtectorTemplateData>
    +getInfo(): InformationTemplateData
    +getCells(): Array<Cell>
    -allProtectors(): Array<IProtector>
}

abstract class Template {
    -_template: HandlebarsTemplateDelegate;
    +constructor(id: string)
    +getHtml(obj: object): string
}

class ListElementTemplate {
}

class CellTemplate {
    +constructor()
}

class InfoTemplate {
    +constructor()
}

class MessagesTemplate {
    +constructor()
}

class ProtectorTemplate {
    +constructor()
}

class TemplateFactory {
    +getTemplate(name: string)
}

TemplateFactory *-- Template
GameManager ..> TemplateFactory
UserValuesManager ..> TemplateFactory
UserValuesManager ..> ListElementTemplate
GameManager ..> CellTemplate
GameManager ..> InfoTemplate
GameManager ..> MessagesTemplate
GameManager ..> ProtectorTemplate

Template <|-- ListElementTemplate
Template <|-- CellTemplate
Template <|-- InfoTemplate
Template <|-- MessagesTemplate
Template <|-- ProtectorTemplate

BadFactor o-- BadFactorDescription

BadFactorDescription ..> Resource

BadFactorManager --|> UserValuesManager

Cell o-- BadFactor
Cell o-- Resource

GameManager o-- GameLogicFacade
GameLogicFacade *-- ResourceManager
GameLogicFacade *-- ProtectorManager
GameLogicFacade *-- BadFactorManager
GameLogicFacade *-- Warehouse
GameLogicFacade *-- ResourceProtectorAdapter

Protector ..> Cell
ResourceProtectorAdapter ..> Cell
BadFactor ..> Cell
GameLogicFacade ..> IProtector
UserValuesManager ..> IComparable

UserValuesManager ..> SortIterator
UserValuesManager ..> InverseIterator
UserValuesManager ..> FilterIterator

IComparable <.. SortIterator
IComparable <.. InverseIterator
IComparable <.. FilterIterator

ProtectorManager *-- Protector
ResourceManager *-- ResourceDescription
BadFactorManager *-- BadFactorDescription

BadFactorDescription --|> IComparable
IProtector --|> IComparable
ResourceDescription --|> IComparable

SortIterator --|> AbstractIterator
InverseIterator --|> AbstractIterator
FilterIterator --|> AbstractIterator


Protector --|> IProtector
ResourceProtectorAdapter --|> IProtector
ProtectorLimiter --|> IProtector
BadFactor --|> IResourceApplicator

ProtectorLimiter o-- Protector
ResourceProtectorAdapter o-- Resource

ProtectorManager --|> UserValuesManager

Resource o-- ResourceDescription

ResourceManager --|> UserValuesManager

IProtector --|> IResourceApplicator

Warehouse *-- Cell
Warehouse *-- BadFactor

@enduml