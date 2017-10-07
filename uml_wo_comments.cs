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
}

class BadFactor  {
  -BadFactorDescription description

  -int hitPoints

  +BadFactorDescription getDescription()
  +bool canAffectTo(Resource resource)
  +void affect(Resource resource)
  +BadFactorDescription getDescription()
  +int getHitPoints()
  +void setHitPoints(int hitPoints)
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
  +bool сanProtectFrom(BadFactor badFactor)
  +void protect(cell badFactor) 
}


abstract class UserValuesManager {

    #_modal:JQuery
        
    #_form:JQuery

    #_listTemplate:HandlebarsTemplateDelegate

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
    #getTemplateId():string
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

    -_resourceManager:ResourceManager;

    -_badFactorManager:BadFactorManager;

    -_protectorManager:ProtectorManager;

    -_warehouse:Warehouse;

    -_messages:Array<string>;

    -_money:number;

    -_days:number;

    -_messagesTemplate:HandlebarsTemplateDelegate;

    -_infoTemplate:HandlebarsTemplateDelegate;

    -_cellTemplate:HandlebarsTemplateDelegate;

    -_protectorTemplate:HandlebarsTemplateDelegate;

    -_cellIdx:number = -1;

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


BadFactor o-- BadFactorDescription

BadFactorDescription ..> Resource

BadFactorManager --|> UserValuesManager

Cell o-- BadFactor
Cell o-- Resource

GameManager *-- ResourceManager
GameManager *-- ProtectorManager
GameManager *-- BadFactorManager
GameManager *-- Warehouse

Protector ..> BadFactor

ProtectorManager --|> UserValuesManager

Resource o-- ResourceDescription

ResourceManager --|> UserValuesManager

Warehouse *-- Cell
Warehouse *-- BadFactor




@enduml