export class InformationTemplateData {
    public money: number;
    public busy_cells: number;
    public total_cells: number;
    public days: number;
    public corruptedCells: Array<number>;

    constructor(money: number, busy_cells: number, total_cells: number, days: number, corruptedCells: Array<number>) {
        this.money = money;
        this.busy_cells = busy_cells;
        this.total_cells = total_cells;
        this.days = days;
        this.corruptedCells = corruptedCells;
    }
}
