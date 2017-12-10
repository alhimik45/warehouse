@startuml

title Будни кладовщика - Диаграмма классов

skinparam classAttributeIconSize 0

class Warehouse {
  -int capacity

  -Cell[] cells

  -ResourceDescription[] resources

  -BadFactorDescription[] badFactors
  -_sort: ICellSortStrategy

  -cellRent(cell:Cell)
  -cellPenalty(cell:Cell)
  -processCells()
  -spreadBadFactors()
  -getEmptyIndex()
  -processNewCells()
  +processDay()
  +Cell[] getCells()
  +getСellCost():number
  +getCapacity():number
  +getBusyCells():number
  +getCorruptedCells():number
  +setCapacity(capacity:number):void
  +addCell(cell: Cell)
  +clone();
  +setSort(sort: ICellSortStrategy)
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
  +setBadFactor(BadFactor badFactor):void
  +clone():Cell
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
    +accept(v: Visitor)
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
  +accept(v: Visitor)
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
  +accept(v: Visitor)
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
  +accept(v: Visitor)
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
    -mem:Memento;
    -_protectorLister:ProtectorLister;

    +constructor()
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

class ProtectorLister{
    +getList(): string
}

class GameLogicFacade {
    - {static} instance: GameLogicFacade
    +onCellRent: Observer
    +onNewResource: Observer
    +onBadFactorSpread: Observer
    +onCellResourceDestroyed: Observer
    -_resourceManager: ResourceManager;
    -_badFactorManager: BadFactorManager;
    -_protectorManager: ProtectorManager;
    -_warehouse: Warehouse;
    -_money: number;
    -_days: number;

    -constructor()
    + {static} getInstance():GameLogicFacade
    +startGame(): void
    +nextDay(): void
    +increaseWarehouseCapacity(): boolean
    +applyProtector(cellIdx: number, protectorIdx: number)
    +getNewCellCost(): number
    +isLose(): boolean
    +getCellProtectors(cellIdx: number): Array<ProtectorTemplateData>
    +getInfo(): InformationTemplateData
    +getCells(): Array<Cell>
    +copyCell():void
    +createMemento():Memento
    +resetState(m:Memento)
    +setSort(type: string)
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

interface IteratorCreator {
    createIterator(): AbstractIterator
}

class SortIteratorCreator {
    constructor(objects: Array)
    createIterator(): AbstractIterator
}

class ReversedSortIteratorCreator {
    constructor(objects: Array)
    createIterator(): AbstractIterator
}

class ProtectorBuilder {
  -_name: string;
  -_goodAgainst: Array<BadFactorDescription>;
  -_cost: number;
  -_damage: number;

  +constructor()
  +setName(name: string): ProtectorBuilder
  +setCost(cost: number): ProtectorBuilder
  +setDamage(damage: number): ProtectorBuilder
  +addBadFactor(factor: BadFactorDescription): ProtectorBuilder
  +build(): Protector
}

class ResourcePool {
  - {static} _instance: ResourcePool;
  -_pool: Map<Resource, boolean> = new Map();
  -constructor()
  +{static} getInstance()
  +acquire(): Resource
  +release(res: Resource): void
}

class CellBuilder {
  -_resource: Resource;
  -_storeDays: number;
  -_resists: Array<BadFactorDescription>;

  +setResource(resource: Resource): CellBuilder
  +setStoreDays(days: number): CellBuilder
  +setResists(resists: Array<BadFactorDescription>): CellBuilder
  +makeAntiFire(): CellBuilder
  +makeAntiBug(): CellBuilder
  +build(): Cell
}

abstract class Subject {
    #evs: string => Observer
    +constructor()
    +attach(e: string, o: Observer)
    +detach(e: string, o: Observer)
    +notify(e: string, data: any)
}

abstract class Observer {
    +constructor()
    +update(data: any)
}

class WrapObserver {
    -o: Observer;
    -a: action;

    +constructor(o: Observer, a: action)
    +update(data: any)
}


abstract class OObserver {
    #message: action;

    +constructor(message: action)
}

class Memento {
    -_s: State;

    +setState(s: State):Memento
    +getState(): State
}

class State {
    -days: number;
    -money: number;
    -warehouse: Warehouse;

    constructor(days: number, money: number, warehouse: Warehouse)
}

interface Visitor {
    +visitProtector(element: Protector): string;
    +visitResourceProtector(element: ResourceProtectorAdapter): string;
    +visitProtectorLimiter(element: ProtectorLimiter): string;
    +visitFullHpDestroyer(element: FullHpDestroyer): string;
    +visitBrickSaver(element: BrickSaver): string;
    +visitLowHper(element: LowHper): string;
}

class CostVisitor {
    +visitProtector(element: Protector): string;
    +visitResourceProtector(element: ResourceProtectorAdapter): string;
    +visitProtectorLimiter(element: ProtectorLimiter): string;
    +visitFullHpDestroyer(element: FullHpDestroyer): string;
    +visitBrickSaver(element: BrickSaver): string;
    +visitLowHper(element: LowHper): string;
}

class DamageVisitor {
    +visitProtector(element: Protector): string;
    +visitResourceProtector(element: ResourceProtectorAdapter): string;
    +visitProtectorLimiter(element: ProtectorLimiter): string;
    +visitFullHpDestroyer(element: FullHpDestroyer): string;
    +visitBrickSaver(element: BrickSaver): string;
    +visitLowHper(element: LowHper): string;
}

interface ICellSortStrategy {
    +sort(cells: Array<Cell>): Array<Cell>;
}

class DamagedFirstStrategy {
    +sort(cells: Array<Cell>): Array<Cell>;
}
class GoodFirstStrategy {
    +sort(cells: Array<Cell>): Array<Cell>;
}
class NoSortStrategy {
    +sort(cells: Array<Cell>): Array<Cell>;
}







ChainedProtector --|> IProtector

abstract class ChainedProtector {
    +_next: ChainedProtector;
    +constructor(next: ChainedProtector)
    +accept(v: Visitor): string;
    +get compareCriteria()
    +get cost()
    +get damage()
    +get name()
    +chainedName();
    +get goodAgainst();
    +chainedCost();
    +canApply(cell: Cell): boolean
    +canApplyChainMember(cell: Cell): boolean;
    +apply(cell: Cell): void;
    +applyChainMember(cell: Cell): void;
}

FullHpDestroyer --|> ChainedProtector
BrickSaver --|> ChainedProtector
LowHper --|> ChainedProtector

class FullHpDestroyer {
    +accept(v: Visitor): string
    +chainedName()
    +chainedCost()
    +canApplyChainMember(cell: Cell): boolean
    +applyChainMember(cell: Cell): void
}

class BrickSaver  {
        +accept(v: Visitor): string
        +chainedName()
        +chainedCost()
        +canApplyChainMember(cell: Cell): boolean
        +applyChainMember(cell: Cell): void
}

class LowHper {
        +accept(v: Visitor): string
        +chainedName()
        +chainedCost()
        +canApplyChainMember(cell: Cell): boolean
        +applyChainMember(cell: Cell): void
}









DamagedFirstStrategy --|> ICellSortStrategy
GoodFirstStrategy --|> ICellSortStrategy
NoSortStrategy --|> ICellSortStrategy

DamagedFirstStrategy <.. GameLogicFacade
GoodFirstStrategy <.. GameLogicFacade
NoSortStrategy <.. GameLogicFacade

Warehouse o-- ICellSortStrategy

GameManager *-- ProtectorLister
ProtectorLister ..> GameLogicFacade

GameLogicFacade o-- Memento
Memento o-- State
GameLogicFacade ..> State

CostVisitor --|> Visitor
DamageVisitor --|> Visitor

ProtectorLister ..> CostVisitor
ProtectorLister ..> DamageVisitor

Observer <|-- WrapObserver
Observer <|-- OObserver
OObserver <|-- SpreadObserver
OObserver <|-- ResourceObserver
OObserver <|-- NewResourceObserver
OObserver <|-- RentObserver
GameManager *-- SpreadObserver
GameManager *-- ResourceObserver
GameManager *-- NewResourceObserver
GameManager *-- RentObserver
Warehouse *-- WrapObserver
Subject <|-- Warehouse
Observer --o Subject
Observer --o Warehouse

ResourcePool o-- Resource
Cell ..> ResourcePool
Warehouse ..> ResourcePool
ProtectorManager *-- ProtectorBuilder
Protector <.. ProtectorBuilder

IteratorCreator <|-- SortIteratorCreator
SortIterator <.. SortIteratorCreator
IteratorCreator <|-- ReversedSortIteratorCreator
SortIterator <.. ReversedSortIteratorCreator
InverseIterator <.. ReversedSortIteratorCreator

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

GameManager ..> GameLogicFacade
GameLogicFacade *-- ResourceManager
GameLogicFacade *-- ProtectorManager
GameLogicFacade *-- BadFactorManager
GameLogicFacade *-- Warehouse
GameLogicFacade *-- ResourceProtectorAdapter
GameLogicFacade *-- GameLogicFacade

Protector ..> Cell
ResourceProtectorAdapter ..> Cell
BadFactor ..> Cell
GameLogicFacade ..> IProtector
UserValuesManager ..> IComparable

UserValuesManager ..> SortIteratorCreator
UserValuesManager ..> ReversedSortIteratorCreator
UserValuesManager ..> FilterIterator

IComparable <.. SortIterator
IComparable <.. InverseIterator
IComparable <.. FilterIterator

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

Warehouse *-- CellBuilder
Cell <.. CellBuilder
Warehouse *-- BadFactor

@enduml