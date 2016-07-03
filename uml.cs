@startuml

title Будни кладовщика - Диаграмма классов


class Warehouse <<Склад>>{
  -int capacity
    Максимальное количество мест на складе

  -Cell[] cells
    Занятые места на складе

  -int cellCost
    Стоимость увеличения вместимости склада на одно место

  +Cell[] getCells() //Возвращает массив занятых ячеек склада
  +int getСellCost() //Возвращает стоимость увеличения вместимости склада на одно место
  +int getCapacity() //Возвращает максимальное количество мест на складе
  +void setCapacity(int capacity) //Устанавливает максимальное количество мест на складе
}

class Cell <<Одно место на складе>>{
  -BadFactor badFactor
    Нечто плохое, влияющее на находящийся тут ресурс

  -Resource resource
    Ресурс, хранящийся в данном месте склада

  +Resource getResource() //Возвращает описание ресурса
  +BadFactor getBadFactor() //Возвращает плохой фактор
  +void setBadFactor(BadFactor badFactor) //Устанавливает плохой фактор
}

class ResourceDescription <<Описание свойств ресурса>>{
  -string name
    Название ресурса
  -bool dry
    Сухой ресурс или нет

  -bool ignitable
    Горючий ли ресурс 

  -bool eatable
    Съедобный ли ресурс 

  -bool natural
    Был ли данный ресурс живым

  +string getName() //Возращает название ресурса
  +bool isDry() //Возращает флаг сухости
  +bool isIgnitable() //Возращает флаг горючести
  +bool isEatable() //Возращает флаг съедобности
  +bool isNatural() //Возращает флаг живости
}

class Resource <<Конкретный ресурс, который хранится на складе>> {
  -ResourceDescription description
    Свойства данного ресурса

  -float quality
    Качество ресурса. Может ухудшаться от плохих факторов

  -int rent
    Деньги, которые получит кладовщик за хранение ресурса

  -int storeDays
    Оставшееся время хранения ресурса

  +ResourceDescription getDescription() //Возвращает свойства ресурса
  +int getRent() //Возвращает количество денег за аренду
  +int getStoreDays() //Возвращает оставшееся время хранения ресурса
  +void setstoreDays(int storeDays) //Устанавливает оставшееся время хранения ресурса
  +float getQuality() //Возвращает качество ресурса
  +void setQuality(float quality) //Устанавливает качество ресурса
}

class BadFactorDescription <<Описание плохого фактора>>{
  -string name
    Название фактора
  -int qualityDamage
    Насколько портит данный фактор качество ресурса
  -ResourceDescription[] affectedResources
    Ресурсы, на которые может влиять фактор

  +string getName() // Возвращает название плохого фактора
  +bool canAffectTo(Resource resource) //Проверка, может ли данный фактор влиять на определённый ресурс
  +void affect(Resource resource) //Повлиять на ресурс
}

class BadFactor <<Плохой фактор>> {
  -BadFactorDescription description
    Свойства данного фактора
  -int hitPoints
    Количество очков "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса

  +BadFactorDescription getDescription() //Возвращает свойства фактора
  +bool canAffectTo(Resource resource) //Проверка, может ли данный фактор влиять на определённый ресурс. Делегируется свойствам ресурса
  +void affect(Resource resource) //Повлиять на ресурс. Делегируется свойствам ресурса
  +int getHitPoints() //Возвращает количество "жизней" фактора, которое нужно уничтожить кладовщику, чтобы избавиться от ресурса
  +void setHitPoints(int hitPoints) //Устанавливает очки "жизней"
}

class Protector <<Средство защиты от плохого фактора>>{
  -BadFactorDescription[] goodAgainst
    Массив плохих факторов, против которых данное средство будет работать
  -int cost
    Стоимость средства

  +int getCost() //Возвращает стоимость средства
  +bool сanProtectFrom(BadFactor badFactor) //Проверка, может ли данное средство справиться с определённым фактором
}


Warehouse o-- Cell
Cell o-- BadFactor
Cell o-- Resource
BadFactor o-- BadFactorDescription
Resource o-- ResourceDescription
BadFactorDescription o-- ResourceDescription

BadFactorDescription ..> Resource
Protector ..>BadFactor


@enduml