import {IProtector} from "./IProtector";

export interface Visitor {
    visitProtector(element: IProtector): string;
    visitResourceProtector(element: IProtector): string;
    visitProtectorLimiter(element: IProtector): string;
}

export class CostVisitor implements Visitor {
    visitProtector(element: IProtector): string {
        return `${element.cost}`;
    }

    visitResourceProtector(element: IProtector): string {
        return `Бесплатно, но теряете ресурс`;
    }

    visitProtectorLimiter(element: IProtector): string {
        return `${element.cost} (ограниенное использование)`;
    }
}

export class DamageVisitor implements Visitor {
    visitProtector(element: IProtector): string {
        return `${element.damage}`;
    }

    visitResourceProtector(element: IProtector): string {
        return `${element.damage} (половина прочности ресурса)`;
    }

    visitProtectorLimiter(element: IProtector): string {
        return `${element.damage} (ограниенное использование)`;
    }
}