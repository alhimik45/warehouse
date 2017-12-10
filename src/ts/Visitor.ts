import {BrickSaver, FullHpDestroyer, LowHper} from "./IProtector";
import {Protector} from "./Protector";
import {ResourceProtectorAdapter} from "./ResourceProtectorAdapter";
import {ProtectorLimiter} from "./ProtectorLimiter";

export interface Visitor {
    visitProtector(element: Protector): string;
    visitResourceProtector(element: ResourceProtectorAdapter): string;
    visitProtectorLimiter(element: ProtectorLimiter): string;
    visitFullHpDestroyer(element: FullHpDestroyer): string;
    visitBrickSaver(element: BrickSaver): string;
    visitLowHper(element: LowHper): string;
}

export class CostVisitor implements Visitor {
    visitFullHpDestroyer(element: FullHpDestroyer): string {
        return `${element.cost}`;
    }

    visitBrickSaver(element: BrickSaver): string {
        return `${element.cost}`;
    }

    visitLowHper(element: LowHper): string {
        return `${element.cost}`;
    }

    visitProtector(element: Protector): string {
        return `${element.cost}`;
    }

    visitResourceProtector(element: ResourceProtectorAdapter): string {
        return `Бесплатно, но теряете ресурс`;
    }

    visitProtectorLimiter(element: ProtectorLimiter): string {
        return `${element.cost}`;
    }
}

export class DamageVisitor implements Visitor {
    visitFullHpDestroyer(element: FullHpDestroyer): string {
        let s = "Уничтожит всё с полным здоровьем";
        if (element._next){
            element = element._next;
            s += `, ${element.accept(this)}`
        }
        return s;
    }

    visitBrickSaver(element: BrickSaver): string {
        let s = "Уничтожит всё у кирпича";
        if (element._next){
            element = element._next;
            s += `, ${element.accept(this)}`
        }
        return s;
    }

    visitLowHper(element: LowHper): string {
        let s = "Установит ХП плохого фатора в 1";
        if (element._next){
            element = element._next;
            s += `, ${element.accept(this)}`
        }
        return s;
    }
    visitProtector(element: Protector): string {
        return `${element.damage}`;
    }

    visitResourceProtector(element: ResourceProtectorAdapter): string {
        return `${element.damage} (половина прочности ресурса)`;
    }

    visitProtectorLimiter(element: ProtectorLimiter): string {
        return `${element.damage} (ограниченное использование, ${element.limit} осталось)`;
    }
}