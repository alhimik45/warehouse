import {selectIndexes} from "./util";
import {BadFactorDescription} from "./BadFactorDescription";
import {UserValuesManager} from "./UserValuesManager";
import {Protector} from "./Protector";
import {BrickSaver, FullHpDestroyer, IProtector, LowHper} from "./IProtector";
import {ProtectorLimiter} from "./ProtectorLimiter";
import {ProtectorBuilder} from "./ProtectorBuilder";


//Управление списком средств защиты
export class ProtectorManager extends UserValuesManager {

    constructor(badFactors: Array<BadFactorDescription>) {
        super(badFactors);

        this._entities.push(new Protector('Отрава', 50, 20,
            selectIndexes(badFactors, [0, 1])
        ));
        this._entities.push(new Protector('Инсектициды', 25, 45,
            selectIndexes(badFactors, [1])
        ));
        this._entities.push(new ProtectorLimiter(new Protector('Вода', 30, 20,
            selectIndexes(badFactors, [0, 2])
        ), 2));
        this._entities.push(new Protector('Огнетушитель', 60, 50,
            selectIndexes(badFactors, [2])
        ));
        this._entities.push(new Protector('Силикагель', 150, 50,
            selectIndexes(badFactors, [0, 1, 3])
        ));
        this._entities.push(new Protector('Влагопоглотитель', 50, 40,
            selectIndexes(badFactors, [3])
        ));
        this._entities.push(new FullHpDestroyer(new BrickSaver(null)));
        this._entities.push(new FullHpDestroyer(new BrickSaver(new LowHper(null))));
        this._entities.push(new BrickSaver(new LowHper(null)));
        this._entities.push(new LowHper(new FullHpDestroyer(null)));

        this.renderList();
    }

    protected getEntityName(): string {
        return 'protector';
    }

    protected getFormWidth(): number {
        return 450;
    }

    protected getFormHeight(): number {
        return 550;
    }

    protected getMultiObjects(protector: Protector): Array<BadFactorDescription> {
        return protector.goodAgainst;
    }

    protected createEntity(formData: any): any {
        let builder = new ProtectorBuilder()
            .setName(formData.name)
            .setDamage(formData.damage)
            .setCost(formData.cost);
        for (let factor of this.getMultiSelectedObjects(formData)) {
            builder.addBadFactor(factor)
        }
        return builder.build();
    }

    protected setFormValues(protector: Protector): void {
        this._form.find('[name="name"]').val(protector.name);
        this._form.find('[name="cost"]').val(protector.cost);
        this._form.find('[name="damage"]').val(protector.damage);
    }

    get protectors(): Array<IProtector> {
        return this._entities;
    }
}
